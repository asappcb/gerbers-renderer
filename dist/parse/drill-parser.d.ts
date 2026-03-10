import { DrillHole } from '../types/pcb-model';
export interface DrillSlot {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    diameter: number;
}
/**
 * Parsed drill data for a single Excellon file.
 * This will be fed into the geometry pipeline.
 */
export interface ParsedDrillData {
    name: string;
    holes: DrillHole[];
    slots: DrillSlot[];
}
/**
 * Excellon drill file parser.
 *
 * Handles:
 * - M48 header block (terminated by %) for unit/format detection
 * - METRIC / INCH unit declarations with inline format (e.g. METRIC,LZ,000.000)
 * - FMAT / FS coordinate format (integer + decimal digit counts)
 * - Tool definitions: T01C0.300
 * - Tool selection: T01
 * - Coordinate lines: X1.234Y5.678  or  X012345Y067890 (integer-encoded)
 * - G90 (absolute coords), G05 (drill mode) — accepted, ignored
 * - G00 (rapid rout move), G01 (linear rout) — routing mode
 * - M15 (plunge / start rout), M16/M17 (retract / end rout)
 * - G85 oblong slot: X...Y...G85X...Y...
 * - M30 (end of file)
 */
export declare function parseDrillFile(name: string, content: string): ParsedDrillData;
