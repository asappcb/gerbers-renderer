export type Classified = Partial<{
    top_copper: string;
    bottom_copper: string;
    top_mask: string;
    bottom_mask: string;
    top_silk: string;
    bottom_silk: string;
    /** All drill files found (supports multiple, e.g. Altium PTH + slots) */
    drills: string[];
    outline: string;
    /** Inner copper layers, ordered (inner-1 nearest top, inner-N nearest bottom) */
    inner_copper: string[];
}>;
export declare function classifyLayerNames(names: string[]): Classified;
/** A copper layer file with its resolved physical stack position (0 = top). */
export interface CopperRef {
    path: string;
    role: "top" | "inner" | "bottom";
    /** Physical index, 0 = top … N-1 = bottom. */
    index: number;
    /** Detected inner number for labeling (e.g. In4 → 4); undefined for top/bottom. */
    detectedNum?: number;
}
/** First-class stackup classification: an ordered copper list plus side-scoped extras. */
export interface StackupClassified {
    /** Ordered top→bottom, length ≥ 0. */
    copper: CopperRef[];
    top_mask?: string;
    bottom_mask?: string;
    top_silk?: string;
    bottom_silk?: string;
    top_paste?: string;
    bottom_paste?: string;
    outline?: string;
    drills?: string[];
}
/**
 * Classify a file list into a first-class ordered copper stackup.
 * Copper layers are ordered top→bottom with sequential physical `index`.
 * Reuses the same filename heuristics as classifyLayerNames but generalizes
 * inner copper to an arbitrary, correctly-ordered count.
 */
export declare function classifyStackup(names: string[]): StackupClassified;
