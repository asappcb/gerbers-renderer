import { BoardGeom, ViewerLayers, BoardStackup } from '../viewer/types';
export type BoundsMm = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
export type RenderResult = {
    boardGeom: BoardGeom;
    layers: ViewerLayers;
    /** First-class ordered board stackup (canonical multilayer structure). */
    stackup: BoardStackup;
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
    top?: {
        maskId?: string;
        silkId?: string;
        pasteId?: string;
    };
    bottom?: {
        maskId?: string;
        silkId?: string;
        pasteId?: string;
    };
    drillsId?: string;
    viasId?: string;
}
/**
 * Pure, DOM-free core: parse files and produce rendered layer SVGs as strings.
 * Works in Node/workers (no URL.createObjectURL). The browser `renderGerbersFiles`
 * wraps this into blob URLs; the headless compositor stitches the SVG strings.
 */
export declare function renderGerberSvgDocs(files: Record<string, Uint8Array>): Promise<SvgRenderResult>;
/**
 * Browser render: produce blob-URL-backed layers + stackup for the viewer.
 * Thin wrapper over the pure `renderGerberSvgDocs` core.
 */
export declare function renderGerbersFiles(files: Record<string, Uint8Array>): Promise<RenderResult>;
