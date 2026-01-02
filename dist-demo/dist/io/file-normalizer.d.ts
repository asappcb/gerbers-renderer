/**
 * Normalize generic text file content coming from zip entries:
 * - Strip UTF-8 BOM if present
 * - Normalize line endings to "\n"
 * - Trim leading and trailing blank lines
 */
export declare function normalizeTextContent(raw: string): string;
/**
 * Normalize Gerber specific content if needed.
 * Currently just uses generic normalization, but this is the extension point
 * for future format specific tweaks.
 */
export declare function normalizeGerberText(raw: string): string;
/**
 * Normalize Excellon drill file content if needed.
 * Currently just uses generic normalization.
 */
export declare function normalizeDrillText(raw: string): string;
