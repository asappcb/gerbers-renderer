// src/render/renderGerbersFiles.ts

import type { BoardGeom, ViewerLayers, BoardStackup, CopperLayer, BoardGeometry, BoardFeature } from "../viewer/types";
import { classifyStackup } from "./layerClassify";
import { parseGerberFile } from "../parse/gerber-parser";
import { parseDrillFile, type DrillSlot } from "../parse/drill-parser";
import type { LayerRole } from "../io/file-classifier";
import { GerberError } from "../core/errors";

export type BoundsMm = { minX: number; minY: number; maxX: number; maxY: number };

function boundsSize(b: BoundsMm) {
  return { w: b.maxX - b.minX, h: b.maxY - b.minY };
}

function isSaneBounds(b: BoundsMm) {
  const { w, h } = boundsSize(b);
  return Number.isFinite(w) && Number.isFinite(h) && w > 1 && h > 1 && w < 2000 && h < 2000;
}

function detectScaleFactor(layerW: number, refW: number) {
  if (!Number.isFinite(layerW) || !Number.isFinite(refW) || layerW <= 0 || refW <= 0) return 1;
  const ratio = layerW / refW;
  if (ratio > 20 && ratio < 35) return 1 / 25.4;
  if (ratio > 0.02 && ratio < 0.06) return 25.4;
  return 1;
}

function scaleGerberPrims(prims: ReturnType<typeof parseGerberFile>, s: number) {
  if (s === 1) return prims;

  return {
    ...prims,
    tracks: prims.tracks.map((t) => ({
      ...t,
      start: { x: t.start.x * s, y: t.start.y * s },
      end: { x: t.end.x * s, y: t.end.y * s },
      width: (t.width ?? 0) * s,
    })),
    flashes: prims.flashes.map((f) => ({
      ...f,
      position: { x: f.position.x * s, y: f.position.y * s },
      diameterMm: (f.diameterMm ?? 0) * s,
      widthMm: (f.widthMm ?? 0) * s,
      heightMm: (f.heightMm ?? 0) * s,
    })),
    regions: prims.regions.map((r) => ({
      ...r,
      loops: r.loops.map((loop) => loop.map((p) => ({ x: p.x * s, y: p.y * s }))),
    })),
    // ops drives the polarity-correct copper/mask rendering; it must be scaled
    // in lockstep with tracks/flashes/regions or layers render at the wrong size.
    ops: prims.ops.map((op) => {
      if (op.kind === "track") {
        return {
          ...op,
          start: { x: op.start.x * s, y: op.start.y * s },
          end: { x: op.end.x * s, y: op.end.y * s },
          widthMm: op.widthMm * s,
        };
      }
      if (op.kind === "flash") {
        return {
          ...op,
          position: { x: op.position.x * s, y: op.position.y * s },
          diameterMm: op.diameterMm * s,
          widthMm: op.widthMm !== undefined ? op.widthMm * s : undefined,
          heightMm: op.heightMm !== undefined ? op.heightMm * s : undefined,
          cornerMm: op.cornerMm !== undefined ? op.cornerMm * s : undefined,
        };
      }
      // region
      return {
        ...op,
        loops: op.loops.map((loop) => loop.map((p) => ({ x: p.x * s, y: p.y * s }))),
      };
    }),
  };
}

function scaleDrills(holes: Array<{ x: number; y: number; diameter: number }>, s: number) {
  if (s === 1) return holes;
  return holes.map((h) => ({ x: h.x * s, y: h.y * s, diameter: (h.diameter ?? 0) * s }));
}

function scaleSlots(slots: DrillSlot[], s: number): DrillSlot[] {
  if (s === 1) return slots;
  return slots.map((sl) => ({
    x1: sl.x1 * s, y1: sl.y1 * s,
    x2: sl.x2 * s, y2: sl.y2 * s,
    diameter: (sl.diameter ?? 0) * s,
  }));
}

function svgToBlobUrl(svg: string): string {
  return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
}

function expandBounds(b: BoundsMm, x: number, y: number) {
  b.minX = Math.min(b.minX, x);
  b.minY = Math.min(b.minY, y);
  b.maxX = Math.max(b.maxX, x);
  b.maxY = Math.max(b.maxY, y);
}

function initBounds(): BoundsMm {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

function boundsFromGerber(prims: ReturnType<typeof parseGerberFile>): BoundsMm {
  const b = initBounds();

  for (const t of prims.tracks) {
    expandBounds(b, t.start.x, t.start.y);
    expandBounds(b, t.end.x, t.end.y);
    const r = (t.width ?? 0) / 2;
    expandBounds(b, t.start.x - r, t.start.y - r);
    expandBounds(b, t.start.x + r, t.start.y + r);
    expandBounds(b, t.end.x - r, t.end.y - r);
    expandBounds(b, t.end.x + r, t.end.y + r);
  }

  for (const f of prims.flashes) {
    const w = (f.widthMm ?? f.diameterMm) || 0;
    const h = (f.heightMm ?? f.diameterMm) || 0;
    expandBounds(b, f.position.x - w / 2, f.position.y - h / 2);
    expandBounds(b, f.position.x + w / 2, f.position.y + h / 2);
  }

  for (const r of prims.regions) {
    for (const loop of r.loops) for (const p of loop) expandBounds(b, p.x, p.y);
  }

  return b;
}

function boundsFromDrills(
  holes: Array<{ x: number; y: number; diameter: number }>,
  slots: DrillSlot[] = [],
): BoundsMm {
  const b = initBounds();
  for (const h of holes) {
    const r = (h.diameter || 0) / 2;
    expandBounds(b, h.x - r, h.y - r);
    expandBounds(b, h.x + r, h.y + r);
  }
  for (const s of slots) {
    const r = (s.diameter || 0) / 2;
    expandBounds(b, s.x1 - r, s.y1 - r);
    expandBounds(b, s.x1 + r, s.y1 + r);
    expandBounds(b, s.x2 - r, s.y2 - r);
    expandBounds(b, s.x2 + r, s.y2 + r);
  }
  return b;
}

function mergeBounds(a: BoundsMm, b: BoundsMm): BoundsMm {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

function ensureFiniteBounds(b: BoundsMm): BoundsMm {
  if (!Number.isFinite(b.minX) || !Number.isFinite(b.minY) || !Number.isFinite(b.maxX) || !Number.isFinite(b.maxY)) {
    return { minX: 0, minY: 0, maxX: 80, maxY: 60 };
  }
  if (b.maxX - b.minX < 1e-6) b.maxX = b.minX + 1;
  if (b.maxY - b.minY < 1e-6) b.maxY = b.minY + 1;
  return b;
}

// Viewer expects stage px from inches, with a fixed scale
const SCALE_PX_PER_IN = 1000;

function mmToPx(mm: number): number {
  return (mm / 25.4) * SCALE_PX_PER_IN;
}

function toLocalMm(x: number, y: number, b: BoundsMm) {
  const lx = x - b.minX;
  const ly = b.maxY - y;
  return { x: lx, y: ly };
}

function buildBoardMaskSvg(stageWpx: number, stageHpx: number) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${stageWpx}" height="${stageHpx}" viewBox="0 0 ${stageWpx} ${stageHpx}">
  <rect width="${stageWpx}" height="${stageHpx}" fill="white"/>
</svg>`.trim();
}

type Pt = { x: number; y: number };

// Snap points so track endpoints connect even with tiny floating error
function snapKey(p: Pt, epsMm = 1e-4): string {
  const sx = Math.round(p.x / epsMm) * epsMm;
  const sy = Math.round(p.y / epsMm) * epsMm;
  return `${sx.toFixed(4)},${sy.toFixed(4)}`;
}

function polygonAreaMm2(loop: Pt[]): number {
  // Shoelace
  let a = 0;
  const n = loop.length;
  for (let i = 0; i < n; i++) {
    const p = loop[i];
    const q = loop[(i + 1) % n];
    a += p.x * q.y - q.x * p.y;
  }
  return 0.5 * a;
}

function loopToSvgPath(loop: Pt[], bounds: BoundsMm, pxPerMm: number): string {
  if (!loop.length) return "";
  const toPx = (p: Pt) => ({
    x: (p.x - bounds.minX) * pxPerMm,
    y: (bounds.maxY - p.y) * pxPerMm,
  });

  const p0 = toPx(loop[0]);
  const parts: string[] = [`M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`];
  for (let i = 1; i < loop.length; i++) {
    const pi = toPx(loop[i]);
    parts.push(`L ${pi.x.toFixed(2)} ${pi.y.toFixed(2)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

// Attempt to reconstruct closed loops from outline tracks.
// This assumes the outline is drawn as connected segments (common for Edge.Cuts exports).
function extractLoopsFromTracks(tracks: { start: Pt; end: Pt }[]): Pt[][] {
  const adj = new Map<string, Pt[]>();
  const keyToPt = new Map<string, Pt>();

  const addEdge = (a: Pt, b: Pt) => {
    const ka = snapKey(a);
    const kb = snapKey(b);
    if (!adj.has(ka)) adj.set(ka, []);
    if (!adj.has(kb)) adj.set(kb, []);
    adj.get(ka)!.push(b);
    adj.get(kb)!.push(a);
    if (!keyToPt.has(ka)) keyToPt.set(ka, a);
    if (!keyToPt.has(kb)) keyToPt.set(kb, b);
  };

  for (const t of tracks) addEdge(t.start, t.end);

  const used = new Set<string>(); // edge usage key "ka|kb" sorted
  const edgeKey = (a: Pt, b: Pt) => {
    const ka = snapKey(a);
    const kb = snapKey(b);
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  };

  const loops: Pt[][] = [];

  for (const [kStart, nbrs] of adj.entries()) {
    const startPt = keyToPt.get(kStart)!;
    for (const nbr of nbrs) {
      const ek = edgeKey(startPt, nbr);
      if (used.has(ek)) continue;

      // Walk a loop
      const loop: Pt[] = [startPt];
      let prev = startPt;
      let curr = nbr;

      used.add(ek);

      // guard against infinite walks
      for (let step = 0; step < 100000; step++) {
        loop.push(curr);

        const kCurr = snapKey(curr);
        const neighbors = adj.get(kCurr) ?? [];
        if (neighbors.length === 0) break;

        // choose the next neighbor that is not the previous point, prefer unused edge
        let next: Pt | null = null;

        for (const cand of neighbors) {
          // skip going back if possible
          if (snapKey(cand) === snapKey(prev) && neighbors.length > 1) continue;
          const ek2 = edgeKey(curr, cand);
          if (!used.has(ek2)) {
            next = cand;
            used.add(ek2);
            break;
          }
        }

        // if all edges used, just pick a neighbor to close if possible
        if (!next) {
          next = neighbors[0];
        }

        prev = curr;
        curr = next;

        // close loop if we returned to start
        if (snapKey(curr) === snapKey(startPt)) {
          // do not duplicate the start point again
          break;
        }
      }

      // accept only decent loops
      if (loop.length >= 3) loops.push(loop);
    }
  }

  // De-duplicate loops that are the same cycle
  // Keep it simple: sort by absolute area and keep largest unique ones
  loops.sort((a, b) => Math.abs(polygonAreaMm2(b)) - Math.abs(polygonAreaMm2(a)));
  const out: Pt[][] = [];
  const seen = new Set<string>();
  for (const lp of loops) {
    const sig = lp.map((p) => snapKey(p)).join(";");
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push(lp);
  }
  return out;
}

function buildBoardMaskFromOutline(
  outline: ReturnType<typeof parseGerberFile>,
  bounds: BoundsMm
): string {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.max(1, Math.round(mmToPx(wMm)));
  const hPx = Math.max(1, Math.round(mmToPx(hMm)));
  const pxPerMm = mmToPx(1);

  const paths: string[] = [];

  // Prefer regions if present (best case)
  for (const r of outline.regions) {
    for (const loop of r.loops) {
      paths.push(loopToSvgPath(loop, bounds, pxPerMm));
    }
  }

  // Fallback: reconstruct loops from tracks
  if (paths.length === 0 && outline.tracks.length) {
    const loops = extractLoopsFromTracks(outline.tracks);
    // Keep only the largest loop as outer boundary if we have many garbage loops
    if (loops.length) {
      const largest = loops[0];
      paths.push(loopToSvgPath(largest, bounds, pxPerMm));
      // Optional: include other loops too (could be internal cutouts)
      for (let i = 1; i < loops.length; i++) {
        paths.push(loopToSvgPath(loops[i], bounds, pxPerMm));
      }
    }
  }

  // If still nothing, fall back to rectangular mask (avoid breaking rendering)
  if (paths.length === 0) {
    return buildBoardMaskSvg(wPx, hPx);
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  <rect x="0" y="0" width="${wPx}" height="${hPx}" fill="black"/>
  <path d="${paths.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}

// Helper function to calculate bounding box of a region
function bboxOfRegion(region: { loops: { x: number; y: number }[][] }): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  for (const loop of region.loops) {
    for (const point of loop) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }
  
  return { minX, minY, maxX, maxY };
}

// Detect negative plane layers - polarity-aware and conservative
function isNegativePlaneLayer(prims: ReturnType<typeof parseGerberFile>, bounds: BoundsMm): boolean {
  const boardArea = (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);

  let largestDarkRegionBbox = 0;
  let largestClearRegionBbox = 0;

  for (const r of prims.regions) {
    const bb = bboxOfRegion(r);
    const area = (bb.maxX - bb.minX) * (bb.maxY - bb.minY);
    if (r.polarity === "clear") largestClearRegionBbox = Math.max(largestClearRegionBbox, area);
    else largestDarkRegionBbox = Math.max(largestDarkRegionBbox, area);
  }

  const darkCount =
    prims.tracks.filter((t) => t.polarity !== "clear").length +
    prims.flashes.filter((f) => f.polarity !== "clear").length +
    prims.regions.filter((r) => r.polarity !== "clear").length;

  const clearCount =
    prims.tracks.filter((t) => t.polarity === "clear").length +
    prims.flashes.filter((f) => f.polarity === "clear").length +
    prims.regions.filter((r) => r.polarity === "clear").length;

  const hasHugeClear = largestClearRegionBbox > boardArea * 0.85;
  const hasHugeDark = largestDarkRegionBbox > boardArea * 0.85;

  // If there is a huge DARK region, do not invert
  if (hasHugeDark) return false;

  // Only invert when there is very strong evidence
  if (!hasHugeClear) return false;

  // Clear must strongly dominate, otherwise do not invert
  if (!(clearCount > darkCount * 2)) return false;

  return true;
}

// Drop-in TS helper: buildLayerSvgWithPolarityMask(...)
function buildLayerSvgWithPolarityMask(
  prims: ReturnType<typeof parseGerberFile>,
  bounds: BoundsMm,
  fillColor: string,
  opacity: number
): string {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.max(1, Math.round(mmToPx(wMm)));
  const hPx = Math.max(1, Math.round(mmToPx(hMm)));
  const pxPerMm = mmToPx(1);

  // Detect if this is a negative plane layer
  const negative = isNegativePlaneLayer(prims, bounds);
  const baselineFill = negative ? "white" : "black";

  const toPx = (x: number, y: number) => {
    const lx = x - bounds.minX;
    const ly = bounds.maxY - y; // global Y flip (Gerber up -> SVG down)
    return { x: lx * pxPerMm, y: ly * pxPerMm };
  };

  // Helper to render individual operations
  const renderOp = (op: any, paintColor: string): string => {
    if (op.kind === "track") {
      const a = toPx(op.start.x, op.start.y);
      const b = toPx(op.end.x, op.end.y);
      const wMm = Number.isFinite(op.widthMm) ? op.widthMm : 0.2;
      const sw = Math.max(1, wMm * pxPerMm);
      return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${paintColor}" stroke="${paintColor}" fill-opacity="1" stroke-opacity="1" />`;
    }
    
    if (op.kind === "flash") {
      const p = toPx(op.position.x, op.position.y);
      const fwMm = (op.widthMm ?? op.diameterMm ?? 0.8);
      const fhMm = (op.heightMm ?? op.diameterMm ?? 0.8);
      const w = Math.max(0.01, Number.isFinite(fwMm) ? fwMm : 0.8) * pxPerMm;
      const h = Math.max(0.01, Number.isFinite(fhMm) ? fhMm : 0.8) * pxPerMm;

      const x = p.x - w / 2;
      const y = p.y - h / 2;

      // Rotation: Gerber Y-axis is flipped in SVG, so negate the angle
      const rotDeg = op.rotationDeg;
      const rotAttr = (rotDeg && Math.abs(rotDeg) > 0.01)
        ? ` transform="rotate(${(-rotDeg).toFixed(2)},${p.x.toFixed(2)},${p.y.toFixed(2)})"`
        : "";

      // Standard rect / obround
      if (op.shape === "R" || op.shape === "O") {
        // Fix obround: true obround has radius = min(w,h)/2
        const rx = op.shape === "O" ? Math.min(w, h) * 0.5 : 0;
        return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${rx.toFixed(2)}" fill="${paintColor}" fill-opacity="1"${rotAttr} />`;
      }

      // Macro-ish rounded rect support: if cornerMm exists, draw rounded rect
      if (Number.isFinite(op.cornerMm) && (op.cornerMm ?? 0) > 0) {
        const rx = Math.max(0, (op.cornerMm as number) * pxPerMm);
        return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${rx.toFixed(2)}" fill="${paintColor}" fill-opacity="1"${rotAttr} />`;
      }

      // Fallback circle (rotation irrelevant for circles)
      const r = Math.max(1, Math.max(w, h) / 2);
      return `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r.toFixed(2)}" fill="${paintColor}" fill-opacity="1" />`;
    }
    
    if (op.kind === "region") {
      const d = op.loops
        .map((loop: any) => {
          if (!loop.length) return "";
          const p0 = toPx(loop[0].x, loop[0].y);
          const parts = [`M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`];
          for (let i = 1; i < loop.length; i++) {
            const pi = toPx(loop[i].x, loop[i].y);
            parts.push(`L ${pi.x.toFixed(2)} ${pi.y.toFixed(2)}`);
          }
          parts.push("Z");
          return parts.join(" ");
        })
        .join(" ");
      
      if (!d.trim()) return "";
      return `<path d="${d}" fill-rule="evenodd" fill="${paintColor}" fill-opacity="1" />`;
    }
    
    return "";
  };

  // Render// PAINT ARRAY BUILDING - PRESERVES GERBER ORDER
  const paint: string[] = [];

  // 🔴 CRITICAL: Paint color determined by polarity per operation
  for (const op of prims.ops) {
    const paintColor = op.polarity === "clear" ? "black" : "white";
    const rendered = renderOp(op, paintColor);
    if (rendered) paint.push(rendered);
  }

  // Mask composition:
  // - start black (transparent)
  // - dark = white (visible)
  // - clear = black (erase)
  const maskId = `ink_${Math.random().toString(16).slice(2)}`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${wPx}" height="${hPx}" fill="${baselineFill}" fill-opacity="1" />
      ${paint.join("\n      ")}
    </mask>
  </defs>

  <rect x="0" y="0" width="${wPx}" height="${hPx}" fill="${fillColor}" opacity="${opacity}" mask="url(#${maskId})" />
</svg>`.trim();
}

function buildSilkSvg(prims: ReturnType<typeof parseGerberFile>, bounds: BoundsMm) {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.max(1, Math.round(mmToPx(wMm)));
  const hPx = Math.max(1, Math.round(mmToPx(hMm)));
  const pxPerMm = Math.max(1e-6, mmToPx(1));

  const stroke = "rgba(255,255,255,0.95)";
  const fill = "rgba(255,255,255,0.95)";

  const trackEls = prims.tracks.map((t) => {
    const a = toLocalMm(t.start.x, t.start.y, bounds);
    const b2 = toLocalMm(t.end.x, t.end.y, bounds);
    const wMm = Number.isFinite(t.width) ? t.width : 0.15;
    const sw = Math.max(1, wMm * pxPerMm);
    return `<line x1="${(a.x * pxPerMm).toFixed(2)}" y1="${(a.y * pxPerMm).toFixed(2)}" x2="${(b2.x * pxPerMm).toFixed(2)}" y2="${(b2.y * pxPerMm).toFixed(2)}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  });

  const flashEls = prims.flashes.map((f) => {
    const p = toLocalMm(f.position.x, f.position.y, bounds);
    const cx = p.x * pxPerMm;
    const cy = p.y * pxPerMm;

    const w = (f.widthMm ?? f.diameterMm ?? 0.6);
    const h = (f.heightMm ?? f.diameterMm ?? 0.6);

    if (f.shape === "R" || f.shape === "O") {
      const rw = w * pxPerMm;
      const rh = h * pxPerMm;
      const x = cx - rw / 2;
      const y = cy - rh / 2;
      const rx = f.shape === "O" ? Math.min(rw, rh) * 0.35 : 0;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${rw.toFixed(2)}" height="${rh.toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fill}" />`;
    }

    const r = ((f.diameterMm ?? 0.6) * pxPerMm) / 2;
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${Math.max(1, r).toFixed(2)}" fill="${fill}" />`;
  });

  const regionEls = prims.regions.map((r) => {
    const d = r.loops
      .map((loop) => {
        if (!loop.length) return "";
        const p0 = toLocalMm(loop[0].x, loop[0].y, bounds);
        const parts = [`M ${(p0.x * pxPerMm).toFixed(2)} ${(p0.y * pxPerMm).toFixed(2)}`];
        for (let i = 1; i < loop.length; i++) {
          const pi = toLocalMm(loop[i].x, loop[i].y, bounds);
          parts.push(`L ${(pi.x * pxPerMm).toFixed(2)} ${(pi.y * pxPerMm).toFixed(2)}`);
        }
        parts.push("Z");
        return parts.join(" ");
      })
      .join(" ");

    if (!d.trim()) return "";
    return `<path d="${d}" fill="${fill}" fill-rule="evenodd" opacity="0.95" />`;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  ${trackEls.join("\n  ")}
  ${flashEls.join("\n  ")}
  ${regionEls.join("\n  ")}
</svg>`.trim();
}

function buildDrillsSvg(
  holes: Array<{ x: number; y: number; diameter: number }>,
  slots: DrillSlot[],
  bounds: BoundsMm,
) {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.round(mmToPx(wMm));
  const hPx = Math.round(mmToPx(hMm));
  const pxPerMm = mmToPx(1);

  const holeEls = holes.map((h) => {
    const p = toLocalMm(h.x, h.y, bounds);
    const cx = p.x * pxPerMm;
    const cy = p.y * pxPerMm;
    const r = Math.max(1.5, ((h.diameter || 0.6) * pxPerMm) / 2);
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="#111111" />`;
  });

  // Slots rendered as rounded-cap lines (stadium/capsule shape)
  const slotEls = slots.map((s) => {
    const p1 = toLocalMm(s.x1, s.y1, bounds);
    const p2 = toLocalMm(s.x2, s.y2, bounds);
    const x1 = (p1.x * pxPerMm).toFixed(2), y1 = (p1.y * pxPerMm).toFixed(2);
    const x2 = (p2.x * pxPerMm).toFixed(2), y2 = (p2.y * pxPerMm).toFixed(2);
    const sw = Math.max(3, (s.diameter || 0.6) * pxPerMm);
    return (
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c97c2a" stroke-width="${(sw + 4).toFixed(2)}" stroke-linecap="round" />` +
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111111" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" />`
    );
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  ${holeEls.join("\n  ")}
  ${slotEls.join("\n  ")}
</svg>`.trim();
}

export type RenderResult = {
  boardGeom: BoardGeom;
  layers: ViewerLayers;
  /** First-class ordered board stackup (canonical multilayer structure). */
  stackup: BoardStackup;
  /** Parsed geometry + stats (world coords) for inspection/measurement/connectivity. */
  geometry: BoardGeometry;
  revoke: () => void;
};

/** A copper layer reference within the pure (DOM-free) SVG document set. */
export interface SvgCopperRef {
  id: string;
  index: number;
  role: "top" | "inner" | "bottom";
  name: string;
  color: string;
  /** Key into `svgById` for this layer's rendered SVG source. */
  svgId: string;
}

/**
 * DOM-free render output: rendered layer SVGs as source strings (no blob URLs),
 * plus the structural stackup by id. This is the pure core used by both the
 * browser path (which wraps SVGs into blob URLs) and the headless compositor.
 */
export interface SvgRenderResult {
  boardGeom: BoardGeom;
  bounds: BoundsMm;
  wPx: number;
  hPx: number;
  /** Layer id → rendered SVG source. */
  svgById: Record<string, string>;
  boardMaskId?: string;
  /** Ordered top→bottom. */
  copper: SvgCopperRef[];
  top?: { maskId?: string; silkId?: string; pasteId?: string };
  bottom?: { maskId?: string; silkId?: string; pasteId?: string };
  drillsId?: string;
  viasId?: string;
  /** Parsed geometry + stats (world coords). */
  geometry: BoardGeometry;
}

/**
 * Pure, DOM-free core: parse files and produce rendered layer SVGs as strings.
 * Works in Node/workers (no URL.createObjectURL). The browser `renderGerbersFiles`
 * wraps this into blob URLs; the headless compositor stitches the SVG strings.
 */
export async function renderGerberSvgDocs(files: Record<string, Uint8Array>): Promise<SvgRenderResult> {
  const names = Object.keys(files).filter((n) => !!n);
  const stack = classifyStackup(names);

  // Ordered copper refs from the stackup.
  const topRef = stack.copper.find((c) => c.role === "top");
  const botRef = stack.copper.find((c) => c.role === "bottom");
  const innerRefs = stack.copper.filter((c) => c.role === "inner"); // ordered nearest-top first

  // Derive the legacy flat classification so the existing render path is unchanged.
  const classified = {
    top_copper: topRef?.path,
    bottom_copper: botRef?.path,
    inner_copper: innerRefs.length ? innerRefs.map((r) => r.path) : undefined,
    top_mask: stack.top_mask,
    bottom_mask: stack.bottom_mask,
    top_silk: stack.top_silk,
    bottom_silk: stack.bottom_silk,
    outline: stack.outline,
    drills: stack.drills,
  };

  const dec = new TextDecoder("utf-8", { fatal: false });

  const readText = async (path?: string): Promise<string | null> => {
    if (!path) return null;
    const data = files[path];
    if (!data) return null;
    const text = dec.decode(data);
    // Strip a leading UTF-8 BOM so it doesn't corrupt the first parsed command.
    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  };

  const topText = await readText(classified.top_copper);
  const botText = await readText(classified.bottom_copper);
  const outText = await readText(classified.outline);
  // Read all drill files and merge
  const drillTexts = classified.drills?.length
    ? await Promise.all(classified.drills.map((p) => readText(p)))
    : [];
  const topSilkText = await readText(classified.top_silk);
  const botSilkText = await readText(classified.bottom_silk);
  const innerCopperTexts = classified.inner_copper?.length
    ? await Promise.all(classified.inner_copper.map((p) => readText(p)))
    : [];

  const topPrims = topText ? parseGerberFile(classified.top_copper || "top", topText, "TopCopper" as LayerRole) : null;
  const botPrims = botText ? parseGerberFile(classified.bottom_copper || "bot", botText, "BottomCopper" as LayerRole) : null;
  const outPrims = outText ? parseGerberFile(classified.outline || "outline", outText, "Outline" as LayerRole) : null;

  const drillHoles: Array<{ x: number; y: number; diameter: number }> = [];
  const drillSlots: DrillSlot[] = [];
  if (classified.drills) {
    for (let i = 0; i < classified.drills.length; i++) {
      const text = drillTexts[i];
      if (text) {
        const parsed = parseDrillFile(classified.drills[i], text);
        for (const h of parsed.holes) drillHoles.push({ x: h.x, y: h.y, diameter: h.diameter });
        for (const s of parsed.slots) drillSlots.push(s);
      }
    }
  }

  const topMaskText = await readText(classified.top_mask);
  const botMaskText = await readText(classified.bottom_mask);
  const topPasteText = await readText(stack.top_paste);
  const botPasteText = await readText(stack.bottom_paste);

  const topSilkPrims = topSilkText ? parseGerberFile(classified.top_silk || "top_silk", topSilkText, "TopSilkscreen" as any) : null;
  const botSilkPrims = botSilkText ? parseGerberFile(classified.bottom_silk || "bot_silk", botSilkText, "BottomSilkscreen" as any) : null;
  const topMaskPrims = topMaskText ? parseGerberFile(classified.top_mask || "top_mask", topMaskText, "top_mask" as LayerRole) : null;
  const botMaskPrims = botMaskText ? parseGerberFile(classified.bottom_mask || "bot_mask", botMaskText, "bottom_mask" as LayerRole) : null;
  const topPastePrims = topPasteText ? parseGerberFile(stack.top_paste || "top_paste", topPasteText, "top_paste" as LayerRole) : null;
  const botPastePrims = botPasteText ? parseGerberFile(stack.bottom_paste || "bot_paste", botPasteText, "bottom_paste" as LayerRole) : null;
  const innerCopperPrims = innerCopperTexts.map((text, i) =>
    text ? parseGerberFile(classified.inner_copper![i], text, "InnerCopper" as LayerRole) : null
  );

  // Honour the documented error contract: if nothing recognizable was found,
  // fail loudly instead of silently returning a blank default board.
  const hasAnyLayer = !!(
    topPrims || botPrims || outPrims ||
    topSilkPrims || botSilkPrims || topMaskPrims || botMaskPrims ||
    topPastePrims || botPastePrims ||
    drillHoles.length || drillSlots.length ||
    innerCopperPrims.some(Boolean)
  );
  if (!hasAnyLayer) {
    throw new GerberError(
      "MISSING_LAYERS",
      "No recognizable Gerber or drill layers were found in the bundle.",
      { files: names }
    );
  }

  const topB = topPrims ? ensureFiniteBounds(boundsFromGerber(topPrims)) : null;
  const botB = botPrims ? ensureFiniteBounds(boundsFromGerber(botPrims)) : null;
  const outB = outPrims ? ensureFiniteBounds(boundsFromGerber(outPrims)) : null;
  const drlB = (drillHoles.length || drillSlots.length) ? ensureFiniteBounds(boundsFromDrills(drillHoles, drillSlots)) : null;

  const topSilkB = topSilkPrims ? ensureFiniteBounds(boundsFromGerber(topSilkPrims)) : null;
  const botSilkB = botSilkPrims ? ensureFiniteBounds(boundsFromGerber(botSilkPrims)) : null;
  const topMaskB = topMaskPrims ? ensureFiniteBounds(boundsFromGerber(topMaskPrims)) : null;
  const botMaskB = botMaskPrims ? ensureFiniteBounds(boundsFromGerber(botMaskPrims)) : null;
  const topPasteB = topPastePrims ? ensureFiniteBounds(boundsFromGerber(topPastePrims)) : null;
  const botPasteB = botPastePrims ? ensureFiniteBounds(boundsFromGerber(botPastePrims)) : null;

  const refB =
    (outB && isSaneBounds(outB) ? outB : null) ||
    (topB && isSaneBounds(topB) ? topB : null) ||
    (botB && isSaneBounds(botB) ? botB : null) ||
    (drlB && isSaneBounds(drlB) ? drlB : null);

  const refW = refB ? (refB.maxX - refB.minX) : 1;

  const topScale = topB ? detectScaleFactor(topB.maxX - topB.minX, refW) : 1;
  const botScale = botB ? detectScaleFactor(botB.maxX - botB.minX, refW) : 1;
  const outScale = outB ? detectScaleFactor(outB.maxX - outB.minX, refW) : 1;
  const drlScale = drlB ? detectScaleFactor(drlB.maxX - drlB.minX, refW) : 1;
  const topSilkScale = topSilkB ? detectScaleFactor(topSilkB.maxX - topSilkB.minX, refW) : 1;
  const botSilkScale = botSilkB ? detectScaleFactor(botSilkB.maxX - botSilkB.minX, refW) : 1;
  const topMaskScale = topMaskB ? detectScaleFactor(topMaskB.maxX - topMaskB.minX, refW) : 1;
  const botMaskScale = botMaskB ? detectScaleFactor(botMaskB.maxX - botMaskB.minX, refW) : 1;
  const topPasteScale = topPasteB ? detectScaleFactor(topPasteB.maxX - topPasteB.minX, refW) : 1;
  const botPasteScale = botPasteB ? detectScaleFactor(botPasteB.maxX - botPasteB.minX, refW) : 1;

  const innerCopperBounds = innerCopperPrims.map((p) => p ? ensureFiniteBounds(boundsFromGerber(p)) : null);
  const innerCopperScales = innerCopperBounds.map((b) => b ? detectScaleFactor(b.maxX - b.minX, refW) : 1);

  const topPrimsN = topPrims ? scaleGerberPrims(topPrims, topScale) : null;
  const botPrimsN = botPrims ? scaleGerberPrims(botPrims, botScale) : null;
  const outPrimsN = outPrims ? scaleGerberPrims(outPrims, outScale) : null;
  const drillHolesN = drillHoles.length ? scaleDrills(drillHoles, drlScale) : [];
  const drillSlotsN = drillSlots.length ? scaleSlots(drillSlots, drlScale) : [];
  const topSilkPrimsN = topSilkPrims ? scaleGerberPrims(topSilkPrims, topSilkScale) : null;
  const botSilkPrimsN = botSilkPrims ? scaleGerberPrims(botSilkPrims, botSilkScale) : null;
  const topMaskPrimsN = topMaskPrims ? scaleGerberPrims(topMaskPrims, topMaskScale) : null;
  const botMaskPrimsN = botMaskPrims ? scaleGerberPrims(botMaskPrims, botMaskScale) : null;
  const topPastePrimsN = topPastePrims ? scaleGerberPrims(topPastePrims, topPasteScale) : null;
  const botPastePrimsN = botPastePrims ? scaleGerberPrims(botPastePrims, botPasteScale) : null;
  const innerCopperPrimsN = innerCopperPrims.map((p, i) =>
    p ? scaleGerberPrims(p, innerCopperScales[i]) : null
  );

  // Board bounds: outline preferred, else copper. Do not let silk/drills expand size.
  let boardB: BoundsMm | null = null;

  if (outPrimsN) {
    const ob = ensureFiniteBounds(boundsFromGerber(outPrimsN));
    if (isSaneBounds(ob)) boardB = ob;
  }

  if (!boardB) {
    let cb = initBounds();
    if (topPrimsN) cb = mergeBounds(cb, boundsFromGerber(topPrimsN));
    if (botPrimsN) cb = mergeBounds(cb, boundsFromGerber(botPrimsN));
    cb = ensureFiniteBounds(cb);
    boardB = cb;
  }

  const b = ensureFiniteBounds(boardB!);
  const widthMm = b.maxX - b.minX;
  const heightMm = b.maxY - b.minY;

  // Extract actual outline loops for board-shape clipping in the viewer
  let outline_loops_mm: Array<Array<{ x: number; y: number }>> | undefined;
  if (outPrimsN) {
    const loops: Array<Array<{ x: number; y: number }>> = [];
    for (const r of outPrimsN.regions) {
      for (const loop of r.loops) {
        if (loop.length >= 3) loops.push(loop);
      }
    }
    if (loops.length === 0 && outPrimsN.tracks.length) {
      for (const loop of extractLoopsFromTracks(outPrimsN.tracks)) {
        if (loop.length >= 3) loops.push(loop);
      }
    }
    if (loops.length > 0) outline_loops_mm = loops;
  }

  const boardGeom: BoardGeom = {
    board: {
      width_in: widthMm / 25.4,
      height_in: heightMm / 25.4,
      mm_bounds: {
        min_x_mm: b.minX,
        min_y_mm: b.minY,
        max_x_mm: b.maxX,
        max_y_mm: b.maxY,
      },
    },
    outline_loops_mm,
    layer_count: stack.copper.length,
  };

  const wPx = Math.max(1, Math.round(mmToPx(widthMm)));
  const hPx = Math.max(1, Math.round(mmToPx(heightMm)));

  const svgById: Record<string, string> = {};
  const emit = (id: string, svg: string) => { svgById[id] = svg; return id; };

  const boardMaskSvg = outPrimsN ? buildBoardMaskFromOutline(outPrimsN, b) : buildBoardMaskSvg(wPx, hPx);
  const boardMaskId = emit("board_mask", boardMaskSvg);

  const topCopperId = topPrimsN ? emit("cu.top", buildLayerSvgWithPolarityMask(topPrimsN, b, "#fbbf24", 1.0)) : undefined;
  const botCopperId = botPrimsN ? emit("cu.bottom", buildLayerSvgWithPolarityMask(botPrimsN, b, "#38bdf8", 1.0)) : undefined;
  // Soldermask openings rendered as bright copper highlights (pad openings where mask is absent)
  const topMaskId = topMaskPrimsN ? emit("top:mask", buildLayerSvgWithPolarityMask(topMaskPrimsN, b, "#fbbf24", 0.9)) : undefined;
  const botMaskId = botMaskPrimsN ? emit("bottom:mask", buildLayerSvgWithPolarityMask(botMaskPrimsN, b, "#38bdf8", 0.9)) : undefined;
  const drillsId = (drillHolesN.length || drillSlotsN.length) ? emit("drills", buildDrillsSvg(drillHolesN, drillSlotsN, b)) : undefined;

  const INNER_COLORS = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  const innerCopperIds: string[] = [];
  for (let i = 0; i < innerCopperPrimsN.length; i++) {
    const prims = innerCopperPrimsN[i];
    if (prims) {
      // Id by physical ordinal (1-based among inners) — unique and matching the
      // viewer's deriveStackup(); detectedNum is used only for the display label.
      innerCopperIds.push(emit(`cu.in${i + 1}`, buildLayerSvgWithPolarityMask(prims, b, INNER_COLORS[i % INNER_COLORS.length], 1.0)));
    } else {
      innerCopperIds.push("");
    }
  }
  const topSilkId = topSilkPrimsN ? emit("top:silk", buildSilkSvg(topSilkPrimsN, b)) : undefined;
  const botSilkId = botSilkPrimsN ? emit("bottom:silk", buildSilkSvg(botSilkPrimsN, b)) : undefined;
  // Solder paste (stencil) openings, rendered light for the reveal-on-demand control.
  const topPasteId = topPastePrimsN ? emit("top:paste", buildLayerSvgWithPolarityMask(topPastePrimsN, b, "#cbd5e1", 0.85)) : undefined;
  const botPasteId = botPastePrimsN ? emit("bottom:paste", buildLayerSvgWithPolarityMask(botPastePrimsN, b, "#cbd5e1", 0.85)) : undefined;

  // Assemble the ordered copper stack referencing the rendered SVG ids.
  const copper: SvgCopperRef[] = [];
  for (const ref of stack.copper) {
    let svgId: string | undefined;
    let color: string;
    let name: string;
    let id: string;
    if (ref.role === "top") {
      svgId = topCopperId; color = "#fbbf24"; name = "Top"; id = "cu.top";
    } else if (ref.role === "bottom") {
      svgId = botCopperId; color = "#38bdf8"; name = "Bottom"; id = "cu.bottom";
    } else {
      const j = innerRefs.indexOf(ref);
      svgId = innerCopperIds[j] || undefined;
      color = INNER_COLORS[j % INNER_COLORS.length];
      // Label by detected number (e.g. In4 → "Inner 4"); id by ordinal for uniqueness.
      name = `Inner ${ref.detectedNum ?? (j + 1)}`;
      id = `cu.in${j + 1}`;
    }
    if (svgId) copper.push({ id, index: ref.index, role: ref.role, name, color, svgId });
  }

  // Parsed geometry (world coords, Y-flipped to match the viewer/marker frame).
  const worldY = (y: number) => b.minY + b.maxY - y;
  const feats: BoardFeature[] = [];
  let minTraceW = Infinity;
  const addLayerFeatures = (prims: ReturnType<typeof parseGerberFile> | null, layerId: string) => {
    if (!prims) return;
    for (const f of prims.flashes) {
      const w = f.widthMm ?? f.diameterMm ?? 0;
      const h = f.heightMm ?? f.diameterMm ?? 0;
      feats.push({ kind: "pad", layer: layerId, x_mm: f.position.x, y_mm: worldY(f.position.y), w_mm: w, h_mm: h, shape: f.shape });
    }
    for (const t of prims.tracks) {
      feats.push({ kind: "trace", layer: layerId, x1_mm: t.start.x, y1_mm: worldY(t.start.y), x2_mm: t.end.x, y2_mm: worldY(t.end.y), width_mm: t.width });
      if (t.width > 0) minTraceW = Math.min(minTraceW, t.width);
    }
  };
  addLayerFeatures(topPrimsN, "cu.top");
  addLayerFeatures(botPrimsN, "cu.bottom");
  innerCopperPrimsN.forEach((p, j) => addLayerFeatures(p, `cu.in${j + 1}`));
  for (const hole of drillHolesN) feats.push({ kind: "hole", x_mm: hole.x, y_mm: worldY(hole.y), diameter_mm: hole.diameter });

  const drillSizesMm = Array.from(new Set(drillHolesN.map((h) => Math.round(h.diameter * 1000) / 1000))).sort((a, z) => a - z);
  const geometry: BoardGeometry = {
    features: feats,
    stats: {
      widthMm: b.maxX - b.minX,
      heightMm: b.maxY - b.minY,
      copperLayers: copper.length,
      padCount: feats.filter((f) => f.kind === "pad").length,
      holeCount: drillHolesN.length + drillSlotsN.length,
      drillSizesMm,
      minTraceWidthMm: minTraceW === Infinity ? undefined : minTraceW,
    },
  };

  return {
    boardGeom,
    bounds: b,
    wPx,
    hPx,
    svgById,
    geometry,
    boardMaskId,
    copper,
    top: (topMaskId || topSilkId || topPasteId) ? { maskId: topMaskId, silkId: topSilkId, pasteId: topPasteId } : undefined,
    bottom: (botMaskId || botSilkId || botPasteId) ? { maskId: botMaskId, silkId: botSilkId, pasteId: botPasteId } : undefined,
    drillsId,
    viasId: undefined,
  };
}

/**
 * Browser render: produce blob-URL-backed layers + stackup for the viewer.
 * Thin wrapper over the pure `renderGerberSvgDocs` core.
 */
export async function renderGerbersFiles(files: Record<string, Uint8Array>): Promise<RenderResult> {
  const docs = await renderGerberSvgDocs(files);

  const urls: string[] = [];
  const urlById = new Map<string, string>();
  for (const [id, svg] of Object.entries(docs.svgById)) {
    const u = svgToBlobUrl(svg);
    urlById.set(id, u);
    urls.push(u);
  }
  const url = (id?: string) => (id ? urlById.get(id) : undefined);

  const boardMaskUrl = url(docs.boardMaskId);
  const layers: ViewerLayers = {
    top_board_mask: boardMaskUrl,
    bottom_board_mask: boardMaskUrl,
  };

  const topCu = docs.copper.find((c) => c.role === "top");
  const botCu = docs.copper.find((c) => c.role === "bottom");
  const innerCu = docs.copper.filter((c) => c.role === "inner");

  if (topCu) layers.top_copper = url(topCu.svgId);
  if (botCu) layers.bottom_copper = url(botCu.svgId);
  if (innerCu.length) layers.inner_copper = innerCu.map((c) => url(c.svgId)!).filter(Boolean);
  if (docs.top?.maskId) layers.top_mask = url(docs.top.maskId);
  if (docs.bottom?.maskId) layers.bottom_mask = url(docs.bottom.maskId);
  if (docs.top?.silkId) layers.top_silk = url(docs.top.silkId);
  if (docs.bottom?.silkId) layers.bottom_silk = url(docs.bottom.silkId);
  if (docs.top?.pasteId) layers.top_paste = url(docs.top.pasteId);
  if (docs.bottom?.pasteId) layers.bottom_paste = url(docs.bottom.pasteId);
  if (docs.drillsId) layers.drills = url(docs.drillsId);

  const copper: CopperLayer[] = docs.copper.map((c) => ({
    id: c.id, index: c.index, role: c.role, name: c.name, color: c.color, url: url(c.svgId)!,
  }));

  const stackup: BoardStackup = {
    copper,
    top: docs.top ? { mask: url(docs.top.maskId), silk: url(docs.top.silkId), paste: url(docs.top.pasteId) } : undefined,
    bottom: docs.bottom ? { mask: url(docs.bottom.maskId), silk: url(docs.bottom.silkId), paste: url(docs.bottom.pasteId) } : undefined,
    drills: url(docs.drillsId),
    vias: url(docs.viasId),
  };

  return {
    boardGeom: docs.boardGeom,
    layers,
    stackup,
    geometry: docs.geometry,
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  };
}
