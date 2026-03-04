// src/render/renderGerbersFiles.ts

import type { BoardGeom, ViewerLayers } from "../viewer/types";
import { classifyLayerNames } from "./layerClassify";
import { parseGerberFile } from "../parse/gerber-parser";
import { parseDrillFile } from "../parse/drill-parser";
import type { LayerRole } from "../io/file-classifier";

type BoundsMm = { minX: number; minY: number; maxX: number; maxY: number };

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
  };
}

function scaleDrills(holes: Array<{ x: number; y: number; diameter: number }>, s: number) {
  if (s === 1) return holes;
  return holes.map((h) => ({ x: h.x * s, y: h.y * s, diameter: (h.diameter ?? 0) * s }));
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

function boundsFromDrills(holes: Array<{ x: number; y: number; diameter: number }>): BoundsMm {
  const b = initBounds();
  for (const h of holes) {
    const r = (h.diameter || 0) / 2;
    expandBounds(b, h.x - r, h.y - r);
    expandBounds(b, h.x + r, h.y + r);
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

  // Debug logging for polarity counts
  console.log("[polarity counts]", {
    tracksClear: prims.tracks.filter(t => t.polarity === "clear").length,
    regionsClear: prims.regions.filter(r => r.polarity === "clear").length,
    negativePlane: negative,
  });

  // Enhanced debug logging for plane detection
  const boardArea = (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
  let largestDarkRegionArea = 0;
  let largestClearRegionArea = 0;
  for (const r of prims.regions) {
    const bb = bboxOfRegion(r);
    const area = (bb.maxX - bb.minX) * (bb.maxY - bb.minY);
    if (r.polarity === "clear") largestClearRegionArea = Math.max(largestClearRegionArea, area);
    else largestDarkRegionArea = Math.max(largestDarkRegionArea, area);
  }
  const darkCount = prims.tracks.filter((t) => t.polarity !== "clear").length +
                    prims.flashes.filter((f) => f.polarity !== "clear").length +
                    prims.regions.filter((r) => r.polarity !== "clear").length;
  const clearCount = prims.tracks.filter((t) => t.polarity === "clear").length +
                    prims.flashes.filter((f) => f.polarity === "clear").length +
                    prims.regions.filter((r) => r.polarity === "clear").length;
  
  console.log("[plane detect]", {
    darkCount,
    clearCount,
    largestDarkRegionArea,
    largestClearRegionArea,
    boardArea,
    negative,
  });

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

function buildDrillsSvg(holes: Array<{ x: number; y: number; diameter: number }>, bounds: BoundsMm) {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.round(mmToPx(wMm));
  const hPx = Math.round(mmToPx(hMm));
  const pxPerMm = mmToPx(1);

  const els = holes.map((h) => {
    const p = toLocalMm(h.x, h.y, bounds);
    const cx = p.x * pxPerMm;
    const cy = p.y * pxPerMm;
    const r = ((h.diameter || 0.6) * pxPerMm) / 2;
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${Math.max(1, r).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  ${els.join("\n  ")}
</svg>`.trim();
}

export type RenderResult = {
  boardGeom: BoardGeom;
  layers: ViewerLayers;
  revoke: () => void;
};

export async function renderGerbersFiles(files: Record<string, Uint8Array>): Promise<RenderResult> {
  const names = Object.keys(files).filter((n) => !!n);
  const classified = classifyLayerNames(names);

  const dec = new TextDecoder("utf-8", { fatal: false });

  const readText = async (path?: string): Promise<string | null> => {
    if (!path) return null;
    const data = files[path];
    if (!data) return null;
    return dec.decode(data);
  };

  const topText = await readText(classified.top_copper);
  const botText = await readText(classified.bottom_copper);
  const outText = await readText(classified.outline);
  const drillText = await readText(classified.drills);
  const topSilkText = await readText(classified.top_silk);
  const botSilkText = await readText(classified.bottom_silk);

  const topPrims = topText ? parseGerberFile(classified.top_copper || "top", topText, "TopCopper" as LayerRole) : null;
  const botPrims = botText ? parseGerberFile(classified.bottom_copper || "bot", botText, "BottomCopper" as LayerRole) : null;
  const outPrims = outText ? parseGerberFile(classified.outline || "outline", outText, "Outline" as LayerRole) : null;

  const drillParsed = drillText ? parseDrillFile(classified.drills || "drills", drillText) : null;
  const drillHoles = drillParsed ? drillParsed.holes.map((h) => ({ x: h.x, y: h.y, diameter: h.diameter })) : [];

  const topSilkPrims = topSilkText ? parseGerberFile(classified.top_silk || "top_silk", topSilkText, "TopSilkscreen" as any) : null;
  const botSilkPrims = botSilkText ? parseGerberFile(classified.bottom_silk || "bot_silk", botSilkText, "BottomSilkscreen" as any) : null;

  const topB = topPrims ? ensureFiniteBounds(boundsFromGerber(topPrims)) : null;
  const botB = botPrims ? ensureFiniteBounds(boundsFromGerber(botPrims)) : null;
  const outB = outPrims ? ensureFiniteBounds(boundsFromGerber(outPrims)) : null;
  const drlB = drillHoles.length ? ensureFiniteBounds(boundsFromDrills(drillHoles)) : null;

  const topSilkB = topSilkPrims ? ensureFiniteBounds(boundsFromGerber(topSilkPrims)) : null;
  const botSilkB = botSilkPrims ? ensureFiniteBounds(boundsFromGerber(botSilkPrims)) : null;

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

  const topPrimsN = topPrims ? scaleGerberPrims(topPrims, topScale) : null;
  const botPrimsN = botPrims ? scaleGerberPrims(botPrims, botScale) : null;
  const outPrimsN = outPrims ? scaleGerberPrims(outPrims, outScale) : null;
  const drillHolesN = drillHoles.length ? scaleDrills(drillHoles, drlScale) : [];
  const topSilkPrimsN = topSilkPrims ? scaleGerberPrims(topSilkPrims, topSilkScale) : null;
  const botSilkPrimsN = botSilkPrims ? scaleGerberPrims(botSilkPrims, botSilkScale) : null;

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
  };

  const wPx = Math.max(1, Math.round(mmToPx(widthMm)));
  const hPx = Math.max(1, Math.round(mmToPx(heightMm)));

  const urls: string[] = [];
  const addSvg = (svg: string) => {
    const u = svgToBlobUrl(svg);
    urls.push(u);
    return u;
  };

  const topMaskSvg = outPrimsN ? buildBoardMaskFromOutline(outPrimsN, b) : buildBoardMaskSvg(wPx, hPx);
  const botMaskSvg = outPrimsN ? buildBoardMaskFromOutline(outPrimsN, b) : buildBoardMaskSvg(wPx, hPx);

  const layers: ViewerLayers = {
    top_board_mask: addSvg(topMaskSvg),
    bottom_board_mask: addSvg(botMaskSvg),
  };

  if (topPrimsN) layers.top_copper = addSvg(buildLayerSvgWithPolarityMask(topPrimsN, b, "#fbbf24", 1.0));
  if (botPrimsN) layers.bottom_copper = addSvg(buildLayerSvgWithPolarityMask(botPrimsN, b, "#38bdf8", 1.0));
  if (drillHolesN.length) layers.drills = addSvg(buildDrillsSvg(drillHolesN, b));
  if (topSilkPrimsN) layers.top_silk = addSvg(buildSilkSvg(topSilkPrimsN, b));
  if (botSilkPrimsN) layers.bottom_silk = addSvg(buildSilkSvg(botSilkPrimsN, b));

  return {
    boardGeom,
    layers,
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  };
}
