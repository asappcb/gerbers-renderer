import { DrillHole } from '../types/pcb-model';
/**
 * Parsed drill data for a single Excellon file.
 * This will be fed into the geometry pipeline.
 */
export interface ParsedDrillData {
    name: string;
    holes: DrillHole[];
}
/**
 * Excellon drill file parser.
 *
 * Handles:
 * - M48 header block (terminated by %) for unit/format detection
 * - METRIC / INCH unit declarations
 * - FMAT / FS coordinate format (integer + decimal digit counts)
 * - Tool definitions: T01C0.300
 * - Tool selection: T01
 * - Coordinate lines: X1.234Y5.678  or  X012345Y067890 (integer-encoded)
 * - G90 (absolute coords), G05 (drill mode) — accepted, ignored
 * - M30 (end of file)
 */
export declare function parseDrillFile(name: string, content: string): ParsedDrillData;
