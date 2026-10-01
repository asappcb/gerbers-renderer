// src/parse/aperture-macro.ts
//
// Aperture macros (%AM ... %) — Gerber spec §4.5.
//
// A macro is a list of statements: comments ("0 ..."), variable assignments
// ("$4=$1x2") and primitives ("<code>,<expr>,<expr>,..."). An %AD that names a
// macro supplies $1..$n. We evaluate the macro to polygons in aperture-local mm
// coordinates; the parser then rotates/translates them per flash.
//
// KiCad 6+ emits every rounded-rect pad through the "RoundRect" macro
// (outline + 4 circles + 4 vector lines), so without this most KiCad SMD pads
// collapse to a dot.
//
// Not supported: exposure-off primitives (they would need to cut only the
// macro's own shape, not the layer beneath it), and moiré (6).

import type { Vec2 } from "../types/pcb-model";

export type MacroStatement =
  | { kind: "assign"; varIndex: number; expr: string }
  | { kind: "primitive"; code: number; args: string[] };

const CIRCLE_SEGMENTS = 32;

/**
 * Parse the body of an %AM block, e.g.
 * "AMRoundRect*0 comment*4,1,4,$2,$3,...*1,1,$1+$1,$2,$3*"
 * Returns the macro name and its statements.
 */
export function parseMacroDefinition(body: string): { name: string; statements: MacroStatement[] } | null {
  const blocks = body.split("*").map((s) => s.trim()).filter(Boolean);
  if (!blocks.length || !blocks[0].startsWith("AM")) return null;

  const name = blocks[0].slice(2).trim();
  if (!name) return null;

  const statements: MacroStatement[] = [];
  for (const raw of blocks.slice(1)) {
    const assign = /^\$(\d+)\s*=\s*(.+)$/.exec(raw);
    if (assign) {
      statements.push({ kind: "assign", varIndex: parseInt(assign[1], 10), expr: assign[2] });
      continue;
    }

    const parts = raw.split(",").map((s) => s.trim());
    const code = parseInt(parts[0], 10);
    if (!Number.isFinite(code) || code === 0) continue; // 0 = comment
    statements.push({ kind: "primitive", code, args: parts.slice(1) });
  }

  return { name, statements };
}

/**
 * Evaluate a macro with the %AD parameters. Returns polygons (closed loops) in
 * aperture-local mm, one per exposed primitive.
 */
export function evaluateMacro(statements: MacroStatement[], params: number[], unitScale: number): Vec2[][] {
  const vars = new Map<number, number>();
  params.forEach((v, i) => vars.set(i + 1, v));

  const loops: Vec2[][] = [];

  for (const st of statements) {
    if (st.kind === "assign") {
      vars.set(st.varIndex, evalExpr(st.expr, vars));
      continue;
    }

    const a = st.args.map((e) => evalExpr(e, vars));
    const u = unitScale;

    switch (st.code) {
      case 1: {
        // Circle: exposure, diameter, cx, cy, [rotation]
        if (!a[0]) break;
        const r = (a[1] * u) / 2;
        const c = { x: a[2] * u, y: a[3] * u };
        loops.push(rotateLoop(circleLoop(c, r), a[4] ?? 0));
        break;
      }
      case 2:
      case 20: {
        // Vector line: exposure, width, sx, sy, ex, ey, rotation (2 is the deprecated alias)
        if (!a[0]) break;
        const w = a[1] * u;
        const s = { x: a[2] * u, y: a[3] * u };
        const e = { x: a[4] * u, y: a[5] * u };
        loops.push(rotateLoop(vectorLineLoop(s, e, w), a[6] ?? 0));
        break;
      }
      case 21: {
        // Center line: exposure, width, height, cx, cy, rotation
        if (!a[0]) break;
        const hw = (a[1] * u) / 2;
        const hh = (a[2] * u) / 2;
        const cx = a[3] * u;
        const cy = a[4] * u;
        const rect = [
          { x: cx - hw, y: cy - hh },
          { x: cx + hw, y: cy - hh },
          { x: cx + hw, y: cy + hh },
          { x: cx - hw, y: cy + hh },
        ];
        loops.push(rotateLoop(rect, a[5] ?? 0));
        break;
      }
      case 4: {
        // Outline: exposure, n, x0, y0, ..., xn, yn, rotation  (n+1 points, last == first)
        if (!a[0]) break;
        const n = Math.round(a[1]);
        const pts: Vec2[] = [];
        for (let i = 0; i <= n; i++) {
          const x = a[2 + i * 2];
          const y = a[3 + i * 2];
          if (x === undefined || y === undefined) break;
          pts.push({ x: x * u, y: y * u });
        }
        const rot = a[2 + (n + 1) * 2] ?? 0;
        if (pts.length >= 3) loops.push(rotateLoop(pts, rot));
        break;
      }
      case 5: {
        // Polygon: exposure, vertices, cx, cy, diameter, rotation
        if (!a[0]) break;
        const n = Math.max(3, Math.round(a[1]));
        const c = { x: a[2] * u, y: a[3] * u };
        const r = (a[4] * u) / 2;
        const pts: Vec2[] = [];
        for (let i = 0; i < n; i++) {
          const t = (2 * Math.PI * i) / n;
          pts.push({ x: c.x + r * Math.cos(t), y: c.y + r * Math.sin(t) });
        }
        loops.push(rotateLoop(pts, a[5] ?? 0));
        break;
      }
      case 7: {
        // Thermal: cx, cy, outer dia, inner dia, gap, rotation (always exposed)
        const c = { x: a[0] * u, y: a[1] * u };
        const ro = (a[2] * u) / 2;
        const ri = (a[3] * u) / 2;
        const g = (a[4] * u) / 2;
        for (const q of thermalQuadrants(c, ro, ri, g)) loops.push(rotateLoop(q, a[5] ?? 0));
        break;
      }
      default:
        // 6 (moiré) and unknown codes are ignored.
        break;
    }
  }

  return loops;
}

/** Rotate a loop counter-clockwise by `deg` about the origin (Gerber Y-up coordinates). */
export function rotateLoop(loop: Vec2[], deg: number): Vec2[] {
  if (!deg) return loop;
  const t = (deg * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  return loop.map((p) => ({ x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos }));
}

function circleLoop(c: Vec2, r: number): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < CIRCLE_SEGMENTS; i++) {
    const t = (2 * Math.PI * i) / CIRCLE_SEGMENTS;
    pts.push({ x: c.x + r * Math.cos(t), y: c.y + r * Math.sin(t) });
  }
  return pts;
}

function vectorLineLoop(s: Vec2, e: Vec2, w: number): Vec2[] {
  const dx = e.x - s.x;
  const dy = e.y - s.y;
  const len = Math.hypot(dx, dy);
  // Zero-length line: the spec draws nothing, but a square of the width is
  // the least surprising thing to show.
  const nx = len > 0 ? (-dy / len) * (w / 2) : w / 2;
  const ny = len > 0 ? (dx / len) * (w / 2) : 0;
  return [
    { x: s.x + nx, y: s.y + ny },
    { x: e.x + nx, y: e.y + ny },
    { x: e.x - nx, y: e.y - ny },
    { x: s.x - nx, y: s.y - ny },
  ];
}

function thermalQuadrants(c: Vec2, ro: number, ri: number, halfGap: number): Vec2[][] {
  if (ro <= 0 || halfGap >= ro) return [];
  const out: Vec2[][] = [];
  const steps = 8;
  for (let q = 0; q < 4; q++) {
    const base = (q * Math.PI) / 2;
    const ao = Math.asin(Math.min(1, halfGap / ro));
    const pts: Vec2[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = base + ao + ((Math.PI / 2 - 2 * ao) * i) / steps;
      pts.push({ x: c.x + ro * Math.cos(t), y: c.y + ro * Math.sin(t) });
    }
    if (ri > halfGap) {
      const ai = Math.asin(halfGap / ri);
      for (let i = steps; i >= 0; i--) {
        const t = base + ai + ((Math.PI / 2 - 2 * ai) * i) / steps;
        pts.push({ x: c.x + ri * Math.cos(t), y: c.y + ri * Math.sin(t) });
      }
    } else {
      // Inner circle smaller than the gap: the quadrant closes at the gap corner.
      const corner = base + Math.PI / 4;
      const d = halfGap * Math.SQRT2;
      pts.push({ x: c.x + d * Math.cos(corner), y: c.y + d * Math.sin(corner) });
    }
    out.push(pts);
  }
  return out;
}

/**
 * Evaluate a macro arithmetic expression: numbers, $n variables, + - x X /,
 * parentheses and unary signs. Undefined variables evaluate to 0 (spec).
 */
export function evalExpr(src: string, vars: Map<number, number>): number {
  const s = src.replace(/\s+/g, "");
  let i = 0;

  const parseExpr = (): number => {
    let v = parseTerm();
    while (i < s.length && (s[i] === "+" || s[i] === "-")) {
      const op = s[i++];
      const r = parseTerm();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  };

  const parseTerm = (): number => {
    let v = parseFactor();
    while (i < s.length && (s[i] === "x" || s[i] === "X" || s[i] === "/")) {
      const op = s[i++];
      const r = parseFactor();
      v = op === "/" ? v / r : v * r;
    }
    return v;
  };

  const parseFactor = (): number => {
    const ch = s[i];
    if (ch === "+") { i++; return parseFactor(); }
    if (ch === "-") { i++; return -parseFactor(); }
    if (ch === "(") {
      i++;
      const v = parseExpr();
      if (s[i] === ")") i++;
      return v;
    }
    if (ch === "$") {
      i++;
      const m = /^\d+/.exec(s.slice(i));
      if (!m) return 0;
      i += m[0].length;
      return vars.get(parseInt(m[0], 10)) ?? 0;
    }
    const m = /^\d*\.?\d+(?:[eE][+-]?\d+)?|^\d+\./.exec(s.slice(i));
    if (!m) { i = s.length; return 0; }
    i += m[0].length;
    return parseFloat(m[0]);
  };

  const v = parseExpr();
  return Number.isFinite(v) ? v : 0;
}
