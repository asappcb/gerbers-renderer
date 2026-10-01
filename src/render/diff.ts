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

// Features match when they share kind/layer/shape and every size and
// coordinate agrees within `tol`. Matching is one-to-one, so duplicate
// features are counted, not merged.
function sameFeature(a: BoardFeature, b: BoardFeature, tol: number): boolean {
  const near = (x: number, y: number) => Math.abs(x - y) <= tol;
  if (a.kind === "pad" && b.kind === "pad") {
    return a.layer === b.layer && a.shape === b.shape &&
      near(a.x_mm, b.x_mm) && near(a.y_mm, b.y_mm) && near(a.w_mm, b.w_mm) && near(a.h_mm, b.h_mm);
  }
  if (a.kind === "hole" && b.kind === "hole") {
    return near(a.x_mm, b.x_mm) && near(a.y_mm, b.y_mm) && near(a.diameter_mm, b.diameter_mm);
  }
  if (a.kind === "trace" && b.kind === "trace") {
    if (a.layer !== b.layer || !near(a.width_mm, b.width_mm)) return false;
    // Traces are undirected.
    const fwd = near(a.x1_mm, b.x1_mm) && near(a.y1_mm, b.y1_mm) && near(a.x2_mm, b.x2_mm) && near(a.y2_mm, b.y2_mm);
    const rev = near(a.x1_mm, b.x2_mm) && near(a.y1_mm, b.y2_mm) && near(a.x2_mm, b.x1_mm) && near(a.y2_mm, b.y1_mm);
    return fwd || rev;
  }
  return false;
}

// Spatial anchors for the grid index (a trace is indexed at both ends).
function anchors(f: BoardFeature): Array<[number, number]> {
  if (f.kind === "trace") return [[f.x1_mm, f.y1_mm], [f.x2_mm, f.y2_mm]];
  return [[f.x_mm, f.y_mm]];
}

/**
 * Diff two boards' parsed geometry, per layer. A feature present only in B is
 * "added", only in A is "removed". Coordinates are matched with a tolerance.
 */
export function diffGeometry(a: BoardGeometry, b: BoardGeometry, tol = 0.05): GeometryDiff {
  // Grid cells of size `tol`: any match lies in the same or a neighbouring cell.
  const cell = Math.max(tol, 1e-6);
  const cellKey = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;

  const grid = new Map<string, number[]>();
  b.features.forEach((f, i) => {
    for (const [x, y] of anchors(f)) {
      const k = cellKey(x, y);
      const list = grid.get(k);
      if (list) list.push(i); else grid.set(k, [i]);
    }
  });
  const matchedB = new Uint8Array(b.features.length);

  const perLayer: Record<string, LayerGeometryDiff> = {};
  const layer = (id: string) => (perLayer[id] ??= { added: [], removed: [], unchanged: 0 });

  let addedCount = 0, removedCount = 0, unchangedCount = 0;
  for (const fa of a.features) {
    const [x, y] = anchors(fa)[0];
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    let hit = -1;
    search: for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const i of grid.get(`${cx + dx},${cy + dy}`) ?? []) {
          if (!matchedB[i] && sameFeature(fa, b.features[i], tol)) { hit = i; break search; }
        }
      }
    }
    if (hit >= 0) {
      matchedB[hit] = 1;
      layer(featureLayerKey(fa)).unchanged++;
      unchangedCount++;
    } else {
      layer(featureLayerKey(fa)).removed.push(fa);
      removedCount++;
    }
  }
  b.features.forEach((fb, i) => {
    if (!matchedB[i]) { layer(featureLayerKey(fb)).added.push(fb); addedCount++; }
  });

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
