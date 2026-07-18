import { SvgRenderResult } from './renderGerbersFiles';
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
/**
 * Stitch a rendered stackup into one composited SVG string. Pure — no DOM.
 * Each layer is embedded as an inline `<image>` with a data-URI href, so the
 * output is fully self-contained and rasterizable anywhere.
 */
export declare function composeStackToSvg(docs: SvgRenderResult, opts?: ComposeOptions): string;
/**
 * Headless render to a single composited SVG string. DOM-free — runs in Node,
 * workers, or CI. Accepts a zip/rar/single-file buffer or a files map.
 */
export declare function renderGerbersToSvg(input: HeadlessInput, opts?: ComposeOptions): Promise<string>;
/** Rasterizes an SVG string to encoded image bytes. Inject one for non-browser environments. */
export interface SvgRasterizer {
    (svg: string, size: {
        width: number;
        height: number;
        scale: number;
    }): Promise<Uint8Array>;
}
export interface ImageOptions extends ComposeOptions {
    format?: "png";
    /** Output scale multiplier over the intrinsic layer resolution. Default 1. */
    scale?: number;
    /** Rasterizer backend. Defaults to a browser (canvas) rasterizer. */
    rasterizer?: SvgRasterizer;
}
/**
 * Headless render to encoded PNG bytes. Uses a browser canvas rasterizer by
 * default; pass `opts.rasterizer` (e.g. an resvg-js wrapper) in Node/CI.
 */
export declare function renderGerbersToImage(input: HeadlessInput, opts?: ImageOptions): Promise<Uint8Array>;
