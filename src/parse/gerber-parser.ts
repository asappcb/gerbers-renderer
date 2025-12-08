// src/parse/gerber-parser.ts

import type { Vec2 } from "../types/pcb-model";
import type { LayerRole } from "../io/file-classifier";

/**
 * Basic primitive types that the geometry pipeline will consume.
 * You will later fill these from a real RS274X interpreter.
 */

export interface GerberPrimitiveTrack {
  start: Vec2;
  end: Vec2;
  width: number; // in mm if you normalize units, else "file units"
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
  apertureName: string; // e.g. "D10"
}

export interface GerberPrimitiveRegion {
  boundary: Vec2[];
  holes: Vec2[][];
}

export interface GerberPrimitives {
  tracks: GerberPrimitiveTrack[];
  arcs: GerberPrimitiveArc[];
  flashes: GerberPrimitiveFlash[];
  regions: GerberPrimitiveRegion[];
}

/**
 * Parse a single Gerber layer into primitive drawing entities.
 *
 * This is a minimal stub implementation that returns empty primitives for now.
 * The goal is to have the pipeline fully wired and compiling while you
 * incrementally add real parsing here later.
 *
 * @param name - filename, used for debugging and layer identification
 * @param content - full Gerber file as normalized text
 * @param role - classified layer role (top_copper, bottom_silk, etc)
 */
export function parseGerberFile(
  name: string,
  content: string,
  role: LayerRole | string
): GerberPrimitives {
  // For now, we do not try to interpret RS274X.
  // This is the extension point for a real parser.
  // You can log something helpful during development.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[gerber-parser] parseGerberFile stub called for ${name} (role=${role})`);
  }

  return {
    tracks: [],
    arcs: [],
    flashes: [],
    regions: [],
  };
}
