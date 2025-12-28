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
 * Very naive Excellon drill parser.
 *
 * This is intentionally simple and conservative:
 * - It understands basic tool definitions like "T01C0.300"
 * - It understands coordinate lines like "X012345Y067890"
 * - It assumes units are already inches or mm as used in the file, and does
 *   not attempt unit conversion or integer format decoding.
 *
 * For now, you can treat this as a stub and gradually swap in a robust parser
 * if needed. At minimum, it gives you some real hole locations to play with.
 */
export declare function parseDrillFile(name: string, content: string): ParsedDrillData;
