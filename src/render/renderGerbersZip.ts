import JSZip from "jszip";
import type { BoardGeom, ViewerLayers } from "../viewer/types";
import { classifyLayerNames } from "./layerClassify";

// your parsers
import { parseGerberFile } from "../parse/gerber-parser";
import { parseDrillFile } from "../parse/drill-parser";

// Types expected by your parser module
import type { LayerRole } from "../io/file-classifier"; // if you removed this, change to `string`

type BoundsMm = { minX: number; minY: number; maxX: number; maxY: number };

function boundsSize(b: { minX: number; minY: number; maxX: number; maxY: number }) {
  return { w: b.maxX - b.minX, h: b.maxY - b.minY };
}

function isSaneBounds(b: { minX: number; minY: number; maxX: number; maxY: number }) {
  const { w, h } = boundsSize(b);
  return Number.isFinite(w) && Number.isFinite(h) && w > 1 && h > 1 && w < 2000 && h < 2000;
}

// Detect if layer is off by ~25.4x relative to reference.
// Returns scale factor to apply to layer coords to match reference.
function detectScaleFactor(layerW: number, refW: number) {
  if (!Number.isFinite(layerW) || !Number.isFinite(refW) || layerW <= 0 || refW <= 0) return 1;

  const ratio = layerW / refW;

  // If layer is ~25.4x bigger, scale it down
  if (ratio > 20 && ratio < 35) return 1 / 25.4;

  // If layer is ~25.4x smaller, scale it up
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
      boundary: r.boundary.map((p) => ({ x: p.x * s, y: p.y * s })),
      holes: r.holes.map((hole) => hole.map((p) => ({ x: p.x * s, y: p.y * s }))),
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
    // include width
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
    for (const p of r.boundary) expandBounds(b, p.x, p.y);
    for (const hole of r.holes) for (const p of hole) expandBounds(b, p.x, p.y);
  }

  // arcs not implemented in your parser right now, so no need

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
  // guard against degenerate
  if (b.maxX - b.minX < 1e-6) b.maxX = b.minX + 1;
  if (b.maxY - b.minY < 1e-6) b.maxY = b.minY + 1;
  return b;
}

// Viewer expects stage in px computed from inches with SCALE constant (same model as result.html viewer)
const SCALE_PX_PER_IN = 1000;

function mmToPx(mm: number): number {
  return (mm / 25.4) * SCALE_PX_PER_IN;
}

// Convert world-mm -> local-mm (0..W, 0..H) by subtracting min bounds
function toLocalMm(x: number, y: number, b: BoundsMm) {
  return { x: x - b.minX, y: y - b.minY };
}

// SVG builders

function buildBoardMaskSvg(stageWpx: number, stageHpx: number) {
  // white = visible, black = clipped
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${stageWpx}" height="${stageHpx}" viewBox="0 0 ${stageWpx} ${stageHpx}">
  <rect width="${stageWpx}" height="${stageHpx}" fill="white"/>
</svg>`.trim();
}

function buildCopperSvg(
  prims: ReturnType<typeof parseGerberFile>,
  bounds: BoundsMm,
  stroke: string,
  fill: string
) {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.round(mmToPx(wMm));
  const hPx = Math.round(mmToPx(hMm));
  const pxPerMm = mmToPx(1);

  const trackEls = prims.tracks.map((t) => {
    const a = toLocalMm(t.start.x, t.start.y, bounds);
    const b = toLocalMm(t.end.x, t.end.y, bounds);
    const sw = Math.max(1, (t.width || 0.2) * pxPerMm);
    return `<line x1="${(a.x * pxPerMm).toFixed(2)}" y1="${(a.y * pxPerMm).toFixed(2)}" x2="${(b.x * pxPerMm).toFixed(2)}" y2="${(b.y * pxPerMm).toFixed(2)}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  });

  const flashEls = prims.flashes.map((f) => {
    const p = toLocalMm(f.position.x, f.position.y, bounds);
    const cx = p.x * pxPerMm;
    const cy = p.y * pxPerMm;

    const w = (f.widthMm ?? f.diameterMm) || 0.8;
    const h = (f.heightMm ?? f.diameterMm) || 0.8;

    if (f.shape === "R" || f.shape === "O") {
      const rw = w * pxPerMm;
      const rh = h * pxPerMm;
      const x = cx - rw / 2;
      const y = cy - rh / 2;
      // Treat O as rounded rect visually
      const rx = f.shape === "O" ? Math.min(rw, rh) * 0.4 : 0;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${rw.toFixed(2)}" height="${rh.toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fill}" />`;
    }

    // default circle
    const r = ((f.diameterMm || 0.8) * pxPerMm) / 2;
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${Math.max(1, r).toFixed(2)}" fill="${fill}" />`;
  });

  const regionEls = prims.regions.map((r) => {
    const pts = r.boundary
      .map((p) => {
        const q = toLocalMm(p.x, p.y, bounds);
        return `${(q.x * pxPerMm).toFixed(2)},${(q.y * pxPerMm).toFixed(2)}`;
      })
      .join(" ");
    // holes ignored for now in SVG (you can add clipPath later)
    return `<polygon points="${pts}" fill="${fill}" opacity="0.9" />`;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">
  ${trackEls.join("\n  ")}
  ${flashEls.join("\n  ")}
  ${regionEls.join("\n  ")}
</svg>`.trim();
}

function buildSilkSvg(prims: ReturnType<typeof parseGerberFile>, bounds: BoundsMm) {
  const wMm = bounds.maxX - bounds.minX;
  const hMm = bounds.maxY - bounds.minY;
  const wPx = Math.max(1, Math.round(mmToPx(wMm)));
  const hPx = Math.max(1, Math.round(mmToPx(hMm)));
  const pxPerMm = Math.max(1e-6, mmToPx(1));

  // White silk, slightly transparent
  const stroke = "rgba(255,255,255,0.95)";
  const fill = "rgba(255,255,255,0.95)";

  const trackEls = prims.tracks.map((t) => {
    const a = toLocalMm(t.start.x, t.start.y, bounds);
    const b2 = toLocalMm(t.end.x, t.end.y, bounds);
    const sw = Math.max(1, (t.width || 0.15) * pxPerMm); // silk often thin
    return `<line x1="${(a.x * pxPerMm).toFixed(2)}" y1="${(a.y * pxPerMm).toFixed(2)}" x2="${(b2.x * pxPerMm).toFixed(2)}" y2="${(b2.y * pxPerMm).toFixed(2)}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  });

  const flashEls = prims.flashes.map((f) => {
    const p = toLocalMm(f.position.x, f.position.y, bounds);
    const cx = p.x * pxPerMm;
    const cy = p.y * pxPerMm;

    const w = (f.widthMm ?? f.diameterMm) || 0.6;
    const h = (f.heightMm ?? f.diameterMm) || 0.6;

    if (f.shape === "R" || f.shape === "O") {
      const rw = w * pxPerMm;
      const rh = h * pxPerMm;
      const x = cx - rw / 2;
      const y = cy - rh / 2;
      const rx = f.shape === "O" ? Math.min(rw, rh) * 0.35 : 0;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${rw.toFixed(2)}" height="${rh.toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fill}" />`;
    }

    const r = ((f.diameterMm || 0.6) * pxPerMm) / 2;
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${Math.max(1, r).toFixed(2)}" fill="${fill}" />`;
  });

  const regionEls = prims.regions.map((r) => {
    const pts = r.boundary
      .map((p) => {
        const q = toLocalMm(p.x, p.y, bounds);
        return `${(q.x * pxPerMm).toFixed(2)},${(q.y * pxPerMm).toFixed(2)}`;
      })
      .join(" ");
    return `<polygon points="${pts}" fill="${fill}" opacity="0.95" />`;
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
  bounds: BoundsMm
) {
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

export async function renderGerbersZip(file: File): Promise<RenderResult> {
  const zip = await JSZip.loadAsync(file);
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);

  const classified = classifyLayerNames(names);

  // Read files as text
  async function readText(path?: string): Promise<string | null> {
    if (!path) return null;
    const f = zip.file(path);
    if (!f) return null;
    return await f.async("text");
  }

  const topText = await readText(classified.top_copper);
  const botText = await readText(classified.bottom_copper);
  const outText = await readText(classified.outline);
  const drillText = await readText(classified.drills);

  const topSilkText = await readText(classified.top_silk);
  const botSilkText = await readText(classified.bottom_silk);

  const topPrims = topText ? parseGerberFile(classified.top_copper || "top", topText, "TopCopper" as LayerRole) : null;
  const botPrims = botText ? parseGerberFile(classified.bottom_copper || "bot", botText, "BottomCopper" as LayerRole) : null;

  // Outline: treat it as just another gerber for bounds
  const outPrims = outText ? parseGerberFile(classified.outline || "outline", outText, "Outline" as LayerRole) : null;

  const drillParsed = drillText ? parseDrillFile(classified.drills || "drills", drillText) : null;

  const topSilkPrims = topSilkText
    ? parseGerberFile(classified.top_silk || "top_silk", topSilkText, "TopSilkscreen" as any)
    : null;

  const botSilkPrims = botSilkText
    ? parseGerberFile(classified.bottom_silk || "bot_silk", botSilkText, "BottomSilkscreen" as any)
    : null;

  console.log("[silk parsed]", {
    top: topSilkPrims ? { tracks: topSilkPrims.tracks.length, flashes: topSilkPrims.flashes.length, regions: topSilkPrims.regions.length } : null,
    bottom: botSilkPrims ? { tracks: botSilkPrims.tracks.length, flashes: botSilkPrims.flashes.length, regions: botSilkPrims.regions.length } : null,
  });

  // NOTE: your drill parser is naive about units.
  // For now we assume it is already mm. If it's inch, you will see a huge/small board.
  const drillHoles = drillParsed ? drillParsed.holes.map((h) => ({ x: h.x, y: h.y, diameter: h.diameter })) : [];

  const topB = topPrims ? ensureFiniteBounds(boundsFromGerber(topPrims)) : null;
  const botB = botPrims ? ensureFiniteBounds(boundsFromGerber(botPrims)) : null;
  const outB = outPrims ? ensureFiniteBounds(boundsFromGerber(outPrims)) : null;
  const drlB = drillHoles.length ? ensureFiniteBounds(boundsFromDrills(drillHoles)) : null;

  const topSilkB = topSilkPrims ? ensureFiniteBounds(boundsFromGerber(topSilkPrims)) : null;
  const botSilkB = botSilkPrims ? ensureFiniteBounds(boundsFromGerber(botSilkPrims)) : null;

  // Choose reference bounds: outline if sane, else top, else bottom, else drills
  const refB =
    (outB && isSaneBounds(outB) ? outB : null) ||
    (topB && isSaneBounds(topB) ? topB : null) ||
    (botB && isSaneBounds(botB) ? botB : null) ||
    (drlB && isSaneBounds(drlB) ? drlB : null);

  if (!refB) {
    // fallback to your existing ensureFiniteBounds
  }

  const refW = refB ? (refB.maxX - refB.minX) : 1;

  // Detect per-layer scale factors relative to reference width
  const topScale = topB ? detectScaleFactor(topB.maxX - topB.minX, refW) : 1;
  const botScale = botB ? detectScaleFactor(botB.maxX - botB.minX, refW) : 1;
  const outScale = outB ? detectScaleFactor(outB.maxX - outB.minX, refW) : 1;
  const drlScale = drlB ? detectScaleFactor(drlB.maxX - drlB.minX, refW) : 1;

  const topSilkScale = topSilkB ? detectScaleFactor(topSilkB.maxX - topSilkB.minX, refW) : 1;
  const botSilkScale = botSilkB ? detectScaleFactor(botSilkB.maxX - botSilkB.minX, refW) : 1;

  console.log("[scale factors]", { topScale, botScale, outScale, drlScale, topSilkScale, botSilkScale });

  // Apply scaling
  const topPrimsN = topPrims ? scaleGerberPrims(topPrims, topScale) : null;
  const botPrimsN = botPrims ? scaleGerberPrims(botPrims, botScale) : null;
  const outPrimsN = outPrims ? scaleGerberPrims(outPrims, outScale) : null;
  const drillHolesN = drillHoles.length ? scaleDrills(drillHoles, drlScale) : [];

  const topSilkPrimsN = topSilkPrims ? scaleGerberPrims(topSilkPrims, topSilkScale) : null;
  const botSilkPrimsN = botSilkPrims ? scaleGerberPrims(botSilkPrims, botSilkScale) : null;

  // Compute bounds: outline preferred, else union of copper + drills + silk
  let b = initBounds();
  if (outPrimsN) b = mergeBounds(b, boundsFromGerber(outPrimsN));
  if (topPrimsN) b = mergeBounds(b, boundsFromGerber(topPrimsN));
  if (botPrimsN) b = mergeBounds(b, boundsFromGerber(botPrimsN));
  if (topSilkPrimsN) b = mergeBounds(b, boundsFromGerber(topSilkPrimsN));
  if (botSilkPrimsN) b = mergeBounds(b, boundsFromGerber(botSilkPrimsN));

  // For now, only include drills in bounds if they're not crazy
  if (drillHolesN.length) {
    const db = boundsFromDrills(drillHolesN);
    if (isSaneBounds(db)) b = mergeBounds(b, db);
  }

  b = ensureFiniteBounds(b);

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

  const wPx = Math.round(mmToPx(widthMm));
  const hPx = Math.round(mmToPx(heightMm));

  const urls: string[] = [];
  const addSvg = (svg: string) => {
    const u = svgToBlobUrl(svg);
    urls.push(u);
    return u;
  };

  const layers: ViewerLayers = {
    top_board_mask: addSvg(buildBoardMaskSvg(wPx, hPx)),
    bottom_board_mask: addSvg(buildBoardMaskSvg(wPx, hPx)),
  };

  if (topPrimsN) {
    layers.top_copper = addSvg(buildCopperSvg(topPrimsN, b, "#fbbf24", "#fbbf24"));
  }
  if (botPrimsN) {
    layers.bottom_copper = addSvg(buildCopperSvg(botPrimsN, b, "#38bdf8", "#38bdf8"));
  }
  if (drillHolesN.length) {
    layers.drills = addSvg(buildDrillsSvg(drillHolesN, b));
  }
  if (topSilkPrimsN) {
    layers.top_silk = addSvg(buildSilkSvg(topSilkPrimsN, b));
  }
  if (botSilkPrimsN) {
    layers.bottom_silk = addSvg(buildSilkSvg(botSilkPrimsN, b));
  }

  return {
    boardGeom,
    layers,
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  };
}
