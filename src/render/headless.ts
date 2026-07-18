// src/render/headless.ts
//
// DOM-free composition of a rendered stackup into a single SVG, plus headless
// SVG/image render entrypoints for CI, workers, and Node. The SVG path is pure
// (no DOM); rasterization uses a pluggable backend (browser default provided).

import { renderGerberSvgDocs, type SvgRenderResult } from "./renderGerbersFiles";
import { unpackGerberArchive } from "../io/unpackArchive";

export type HeadlessInput = ArrayBuffer | Uint8Array | Record<string, Uint8Array>;

export interface ComposeOptions {
  /** Which side to compose. Default "top". */
  side?: "top" | "bottom";
  /** Copper layer ids (e.g. "cu.in2", "cu.bottom") to also include, beyond the side's outer copper. */
  revealed?: string[];
  /** Draw a board-clipped substrate background. Default true. */
  includeFR4?: boolean;
  /** Background/substrate color. Default FR4 green. */
  background?: string;
  /** Clip everything to the real board outline. Default true. */
  clipToBoard?: boolean;
}

const dataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/**
 * Stitch a rendered stackup into one composited SVG string. Pure — no DOM.
 * Each layer is embedded as an inline `<image>` with a data-URI href, so the
 * output is fully self-contained and rasterizable anywhere.
 */
export function composeStackToSvg(docs: SvgRenderResult, opts: ComposeOptions = {}): string {
  const {
    side = "top",
    revealed = [],
    includeFR4 = true,
    background = "#1a5f1a",
    clipToBoard = true,
  } = opts;

  const { wPx, hPx, svgById } = docs;

  const imageEl = (svgId?: string): string => {
    if (!svgId) return "";
    const svg = svgById[svgId];
    if (!svg) return "";
    return `<image xlink:href="${dataUri(svg)}" x="0" y="0" width="${wPx}" height="${hPx}" preserveAspectRatio="none"/>`;
  };

  const parts: string[] = [];
  if (includeFR4) parts.push(`<rect x="0" y="0" width="${wPx}" height="${hPx}" fill="${background}"/>`);

  const outer = docs.copper.find((c) => c.role === (side === "top" ? "top" : "bottom"));
  if (outer) parts.push(imageEl(outer.svgId));

  const extras = side === "top" ? docs.top : docs.bottom;
  if (extras?.maskId) parts.push(imageEl(extras.maskId));

  // Revealed copper (inner or opposite side), drawn above the side copper/mask, in stack order.
  for (const c of docs.copper) {
    if (c.id !== outer?.id && revealed.includes(c.id)) parts.push(imageEl(c.svgId));
  }

  if (extras?.silkId) parts.push(imageEl(extras.silkId));
  if (extras?.pasteId) parts.push(imageEl(extras.pasteId));
  if (docs.drillsId) parts.push(imageEl(docs.drillsId));

  const body = parts.filter(Boolean).join("\n    ");

  let inner = body;
  if (clipToBoard && docs.boardMaskId && svgById[docs.boardMaskId]) {
    const maskUri = dataUri(svgById[docs.boardMaskId]);
    inner =
      `<defs><mask id="__board" maskUnits="userSpaceOnUse" style="mask-type:luminance">` +
      `<image xlink:href="${maskUri}" x="0" y="0" width="${wPx}" height="${hPx}" preserveAspectRatio="none"/>` +
      `</mask></defs>\n    <g mask="url(#__board)">\n    ${body}\n    </g>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `width="${wPx}" height="${hPx}" viewBox="0 0 ${wPx} ${hPx}">\n    ${inner}\n</svg>`
  );
}

async function toFiles(input: HeadlessInput): Promise<Record<string, Uint8Array>> {
  if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
    const { files } = await unpackGerberArchive(input);
    return files;
  }
  return input;
}

/**
 * Headless render to a single composited SVG string. DOM-free — runs in Node,
 * workers, or CI. Accepts a zip/rar/single-file buffer or a files map.
 */
export async function renderGerbersToSvg(input: HeadlessInput, opts: ComposeOptions = {}): Promise<string> {
  const files = await toFiles(input);
  const docs = await renderGerberSvgDocs(files);
  return composeStackToSvg(docs, opts);
}

/** Rasterizes an SVG string to encoded image bytes. Inject one for non-browser environments. */
export interface SvgRasterizer {
  (svg: string, size: { width: number; height: number; scale: number }): Promise<Uint8Array>;
}

export interface ImageOptions extends ComposeOptions {
  format?: "png";
  /** Output scale multiplier over the intrinsic layer resolution. Default 1. */
  scale?: number;
  /** Rasterizer backend. Defaults to a browser (canvas) rasterizer. */
  rasterizer?: SvgRasterizer;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load composed SVG for rasterization"));
    img.src = url;
  });
}

const browserRasterizer: SvgRasterizer = async (svg, { width, height, scale }) => {
  if (typeof document === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) {
    throw new Error(
      "renderGerbersToImage requires a rasterizer backend outside the browser " +
      "(e.g. resvg-js). Pass opts.rasterizer."
    );
  }
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to get 2D context for rasterization");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("canvas.toBlob returned null");
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Headless render to encoded PNG bytes. Uses a browser canvas rasterizer by
 * default; pass `opts.rasterizer` (e.g. an resvg-js wrapper) in Node/CI.
 */
export async function renderGerbersToImage(input: HeadlessInput, opts: ImageOptions = {}): Promise<Uint8Array> {
  const files = await toFiles(input);
  const docs = await renderGerberSvgDocs(files);
  const svg = composeStackToSvg(docs, opts);
  const rasterize = opts.rasterizer ?? browserRasterizer;
  return rasterize(svg, { width: docs.wPx, height: docs.hPx, scale: opts.scale ?? 1 });
}
