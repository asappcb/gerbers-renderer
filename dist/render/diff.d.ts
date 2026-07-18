import { BoardGeom } from '../viewer/types';
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
export declare function computeDiffAlignment(a: MmBounds, b: MmBounds, eps?: number): DiffAlignment;
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
/**
 * Compare two Gerber sets and produce per-side visual diffs. Browser-only
 * (uses canvas). Aligns boards by min-corner; features present only in B are
 * "added", only in A are "removed".
 */
export declare function diffGerbers(inputA: DiffInput, inputB: DiffInput, opts?: DiffOptions): Promise<DiffResult>;
export {};
