import { ZipEntry } from './unzip';
export type LayerRole = "top_copper" | "bottom_copper" | "inner_copper" | "top_mask" | "bottom_mask" | "top_silk" | "bottom_silk" | "outline" | "mechanical" | "unknown";
export interface LayerHint {
    /** Exact or suffix match for filenames, for example "myboard-F_Cu.gbr" */
    pattern: string;
    role: LayerRole;
}
/**
 * Optional hints that the caller can pass in to override or refine classification.
 */
export interface LayerHints {
    hints: LayerHint[];
}
/**
 * Normalized representation of a Gerber like file from the zip.
 */
export interface ClassifiedGerberFile {
    name: string;
    role: LayerRole;
    rawEntry: ZipEntry;
    /**
     * Lazily read and normalized text content.
     * This calls normalizeGerberText under the hood.
     */
    getText: () => Promise<string>;
}
/**
 * Normalized representation of a drill file from the zip.
 */
export interface ClassifiedDrillFile {
    name: string;
    rawEntry: ZipEntry;
    /**
     * Lazily read and normalized text content.
     * This calls normalizeDrillText under the hood.
     */
    getText: () => Promise<string>;
}
export interface ClassifiedFiles {
    gerbers: ClassifiedGerberFile[];
    drills: ClassifiedDrillFile[];
    ignored: ZipEntry[];
}
/**
 * Classify zip entries into Gerber layers, drill files, and ignored files.
 */
export declare function classifyFiles(entries: ZipEntry[], hints?: LayerHints): ClassifiedFiles;
