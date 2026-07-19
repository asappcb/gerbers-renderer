// src/render/diff.ts
//
// Revision diff: compare two Gerber sets and produce per-side visual diffs
// (added = green, removed = red, unchanged = faint) plus a change summary.
// Registration places both boards in a shared absolute mm frame (their union),
// so features at the same absolute coordinate overlap; `boardSizeChanged` flags
// when the two outlines differ in size.

import { renderGerberSvgDocs } from "./renderGerbersFiles";
import { composeStackToSvg } from "./headless";
import { unpackGerberArchive } from "../io/unpackArchive";
import type { BoardGeom, BoardGeometry, BoardFeature } from "../viewer/types";

export type DiffInput = ArrayBuffer | Uint8Array | Record<string, Uint8Array>;

interface MmBounds {
  min_x_mm: number;
  min_y_mm: number;
  max_x_mm: number;
  max_y_mm: number;
}

export interface DiffAlignment {
  /** Union of both boards' bounds, in mm. */
  union: MmBounds;
  /** True if the two boards differ in size beyond `eps` mm. */
  boardSizeChanged: boolean;
}

/**
 * Pure registration: union bounds + size-change flag for two board bounds,
 * aligned by their min-corner. Exposed for testing.
 */
export function computeDiffAlignment(a: MmBounds, b: MmBounds, eps = 0.01): DiffAlignment {
  const union: MmBounds = {
    min_x_mm: Math.min(a.min_x_mm, b.min_x_mm),
    min_y_mm: Math.min(a.min_y_mm, b.min_y_mm),
    max_x_mm: Math.max(a.max_x_mm, b.max_x_mm),
    max_y_mm: Math.max(a.max_y_mm, b.max_y_mm),
  };
  const wA = a.max_x_mm - a.min_x_mm, hA = a.max_y_mm - a.min_y_mm;
  const wB = b.max_x_mm - b.min_x_mm, hB = b.max_y_mm - b.min_y_mm;
  const boardSizeChanged = Math.abs(wA - wB) > eps || Math.abs(hA - hB) > eps;
  return { union, boardSizeChanged };
}

export interface DiffSide {
  /** Blob URL of the diff image (green added / red removed / faint unchanged). */
  url: string;
  addedPx: number;
  removedPx: number;
  addedArea_mm2: number;
  removedArea_mm2: number;
}

export interface DiffResult {
  top?: DiffSide;
  bottom?: DiffSide;
  /** Union board geometry (use for placing the diff overlay in a viewer). */
  boardGeom: BoardGeom;
  summary: {
    boardSizeChanged: boolean;
    addedArea_mm2: number;
    removedArea_mm2: number;
  };
  revoke: () => void;
}

export interface DiffOptions {
  /** Alpha threshold (0-255) above which a pixel counts as "present". Default 24. */
  alphaThreshold?: number;
}

const K = 1000 / 25.4; // px per mm — matches the render resolution

// ---------------------------------------------------------------------------
// Per-layer geometry diff (D1): compares parsed features (pads/traces/holes)
// between two boards, reporting added/removed features per layer. Pure.
// ---------------------------------------------------------------------------

export interface LayerGeometryDiff {
  added: BoardFeature[];
  removed: BoardFeature[];
  unchanged: number;
}

export interface GeometryDiff {
  /** Keyed by layer id ("cu.top", "cu.in1", …) plus "drills" for holes. */
  perLayer: Record<string, LayerGeometryDiff>;
  summary: { addedCount: number; removedCount: number; unchangedCount: number };
}

function featureLayerKey(f: BoardFeature): string {
  return f.kind === "hole" ? "drills" : f.layer;
}

// Tolerance-quantized identity key so tiny coordinate noise doesn't read as a change.
function featureKey(f: BoardFeature, tol: number): string {
  const q = (n: number) => Math.round(n / tol);
  if (f.kind === "pad") return `pad|${f.layer}|${q(f.x_mm)}|${q(f.y_mm)}|${q(f.w_mm)}|${q(f.h_mm)}|${f.shape}`;
  if (f.kind === "hole") return `hole|${q(f.x_mm)}|${q(f.y_mm)}|${q(f.diameter_mm)}`;
  // Traces are undirected: order endpoints canonically.
  const a: [number, number] = [q(f.x1_mm), q(f.y1_mm)];
  const b: [number, number] = [q(f.x2_mm), q(f.y2_mm)];
  const [p, r] = a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]) ? [a, b] : [b, a];
  return `trace|${f.layer}|${p[0]}|${p[1]}|${r[0]}|${r[1]}|${q(f.width_mm)}`;
}

/**
 * Diff two boards' parsed geometry, per layer. A feature present only in B is
 * "added", only in A is "removed". Coordinates are matched with a tolerance.
 */
export function diffGeometry(a: BoardGeometry, b: BoardGeometry, tol = 0.05): GeometryDiff {
  const aByKey = new Map<string, BoardFeature>();
  for (const f of a.features) aByKey.set(featureKey(f, tol), f);
  const bByKey = new Map<string, BoardFeature>();
  for (const f of b.features) bByKey.set(featureKey(f, tol), f);

  const perLayer: Record<string, LayerGeometryDiff> = {};
  const layer = (id: string) => (perLayer[id] ??= { added: [], removed: [], unchanged: 0 });

  let addedCount = 0, removedCount = 0, unchangedCount = 0;
  for (const [key, f] of bByKey) {
    if (aByKey.has(key)) { layer(featureLayerKey(f)).unchanged++; unchangedCount++; }
    else { layer(featureLayerKey(f)).added.push(f); addedCount++; }
  }
  for (const [key, f] of aByKey) {
    if (!bByKey.has(key)) { layer(featureLayerKey(f)).removed.push(f); removedCount++; }
  }

  return { perLayer, summary: { addedCount, removedCount, unchangedCount } };
}

async function toFiles(input: DiffInput): Promise<Record<string, Uint8Array>> {
  if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
    return (await unpackGerberArchive(input)).files;
  }
  return input;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load composed SVG for diff"));
    img.src = url;
  });
}

/**
 * Compare two Gerber sets and produce per-side visual diffs. Browser-only
 * (uses canvas). Aligns boards by min-corner; features present only in B are
 * "added", only in A are "removed".
 */
export async function diffGerbers(inputA: DiffInput, inputB: DiffInput, opts: DiffOptions = {}): Promise<DiffResult> {
  if (typeof document === "undefined") {
    throw new Error("diffGerbers requires a browser environment (canvas).");
  }
  const alphaThreshold = opts.alphaThreshold ?? 24;

  const [filesA, filesB] = await Promise.all([toFiles(inputA), toFiles(inputB)]);
  const [docsA, docsB] = await Promise.all([renderGerberSvgDocs(filesA), renderGerberSvgDocs(filesB)]);

  const { union, boardSizeChanged } = computeDiffAlignment(
    { min_x_mm: docsA.bounds.minX, min_y_mm: docsA.bounds.minY, max_x_mm: docsA.bounds.maxX, max_y_mm: docsA.bounds.maxY },
    { min_x_mm: docsB.bounds.minX, min_y_mm: docsB.bounds.minY, max_x_mm: docsB.bounds.maxX, max_y_mm: docsB.bounds.maxY },
  );

  const unionWmm = union.max_x_mm - union.min_x_mm;
  const unionHmm = union.max_y_mm - union.min_y_mm;
  const W = Math.max(1, Math.round(unionWmm * K));
  const H = Math.max(1, Math.round(unionHmm * K));

  const urls: string[] = [];

  // Draw a docs' side composite onto a union-sized ImageData, offset by min-corner.
  const rasterize = async (
    docs: Awaited<ReturnType<typeof renderGerberSvgDocs>>,
    side: "top" | "bottom"
  ): Promise<ImageData | null> => {
    if (!docs.copper.some((c) => c.role === (side === "top" ? "top" : "bottom"))) return null;
    const svg = composeStackToSvg(docs, { side, includeFR4: false, clipToBoard: true });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const img = await loadImage(url);
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      // Offset within the union: x from min-x, y flipped (top of union = max Y).
      const offX = Math.round((docs.bounds.minX - union.min_x_mm) * K);
      const offY = Math.round((union.max_y_mm - docs.bounds.maxY) * K);
      ctx.drawImage(img, offX, offY, docs.wPx, docs.hPx);
      return ctx.getImageData(0, 0, W, H);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const buildSide = async (side: "top" | "bottom"): Promise<DiffSide | undefined> => {
    const [ia, ib] = await Promise.all([rasterize(docsA, side), rasterize(docsB, side)]);
    if (!ia && !ib) return undefined;

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return undefined;
    const out = ctx.createImageData(W, H);

    let addedPx = 0, removedPx = 0;
    const A = ia?.data, B = ib?.data;
    for (let i = 0; i < out.data.length; i += 4) {
      const aOn = A ? A[i + 3] > alphaThreshold : false;
      const bOn = B ? B[i + 3] > alphaThreshold : false;
      if (aOn && bOn) {
        out.data[i] = 148; out.data[i + 1] = 163; out.data[i + 2] = 184; out.data[i + 3] = 70; // faint slate
      } else if (bOn) {
        out.data[i] = 34; out.data[i + 1] = 197; out.data[i + 2] = 94; out.data[i + 3] = 235; // added green
        addedPx++;
      } else if (aOn) {
        out.data[i] = 239; out.data[i + 1] = 68; out.data[i + 2] = 68; out.data[i + 3] = 235; // removed red
        removedPx++;
      }
    }
    ctx.putImageData(out, 0, 0);
    const url: string = await new Promise((resolve) =>
      c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : ""), "image/png")
    );
    if (url) urls.push(url);

    const pxToMm2 = 1 / (K * K);
    return {
      url,
      addedPx,
      removedPx,
      addedArea_mm2: addedPx * pxToMm2,
      removedArea_mm2: removedPx * pxToMm2,
    };
  };

  const top = await buildSide("top");
  const bottom = await buildSide("bottom");

  const boardGeom: BoardGeom = {
    board: {
      width_in: unionWmm / 25.4,
      height_in: unionHmm / 25.4,
      mm_bounds: union,
    },
    layer_count: Math.max(docsA.copper.length, docsB.copper.length),
  };

  const addedArea_mm2 = (top?.addedArea_mm2 ?? 0) + (bottom?.addedArea_mm2 ?? 0);
  const removedArea_mm2 = (top?.removedArea_mm2 ?? 0) + (bottom?.removedArea_mm2 ?? 0);

  return {
    top,
    bottom,
    boardGeom,
    summary: { boardSizeChanged, addedArea_mm2, removedArea_mm2 },
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  };
}
