import { Vec2 } from '../types/pcb-model';
import { LayerRole } from '../io/file-classifier';
/**
 * Primitive types used by the geometry pipeline. These are what
 * polygonizer.ts consumes.
 */
export type Polarity = "dark" | "clear";
export type Op = {
    kind: "track";
    polarity: Polarity;
    start: Vec2;
    end: Vec2;
    widthMm: number;
} | {
    kind: "flash";
    polarity: Polarity;
    position: Vec2;
    diameterMm: number;
    shape: string;
    widthMm?: number;
    heightMm?: number;
    cornerMm?: number;
} | {
    kind: "region";
    polarity: Polarity;
    loops: Vec2[][];
};
export interface GerberPrimitiveTrack {
    start: Vec2;
    end: Vec2;
    width: number;
    polarity: Polarity;
}
export interface GerberPrimitiveArc {
    start: Vec2;
    end: Vec2;
    center: Vec2;
    clockwise: boolean;
    width: number;
}
export interface GerberPrimitiveFlash {
    position: Vec2;
    diameterMm: number;
    shape: string;
    widthMm?: number;
    heightMm?: number;
    cornerMm?: number;
    polarity: Polarity;
}
export interface GerberPrimitiveRegion {
    loops: Vec2[][];
    polarity: Polarity;
}
export interface GerberPrimitives {
    tracks: GerberPrimitiveTrack[];
    arcs: GerberPrimitiveArc[];
    flashes: GerberPrimitiveFlash[];
    regions: GerberPrimitiveRegion[];
    ops: Op[];
}
export interface GerberPrimitiveFlash {
    position: Vec2;
    diameterMm: number;
    shape: string;
    widthMm?: number;
    heightMm?: number;
}
/**
 * Parse a Gerber file into drawing primitives.
 *
 * This is a practical, not spec complete parser:
 * - Handles %FS, %MO, %AD for simple circular apertures (C)
 * - Handles D01 (draw), D02 (move), D03 (flash)
 * - Handles G36/G37 for filled regions with multiple contours
 * - Ignores arcs (G02/G03) for now
 *
 * It is good enough to visualize traces and pads for many KiCad/JLC style Gerbers.
 */
export declare function parseGerberFile(name: string, content: string, _role: LayerRole | string): GerberPrimitives;
