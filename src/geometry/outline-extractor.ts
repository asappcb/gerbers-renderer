// src/geometry/outline-extractor.ts

import type { Polygon } from "../types/pcb-model";
import type { ParsedGerberLayer } from "../core/pipeline";
import { DEFAULT_BOARD_WIDTH_MM, DEFAULT_BOARD_HEIGHT_MM } from "./constants";

/**
 * Try to derive the board outline from parsed Gerber layers.
 *
 * For now this is a stub and simply returns a default rectangle. Later you can:
 * - Look for the outline role layer
 * - Use its primitives to build a polygon
 * - Fallback to copper extents if needed
 */
export function deriveOutlineFromLayers(
  _layers: ParsedGerberLayer[]
): Polygon | null {
  return createRectanglePolygon(DEFAULT_BOARD_WIDTH_MM, DEFAULT_BOARD_HEIGHT_MM);
}

/**
 * Helper to build a simple rectangular polygon with origin at (0,0)
 */
export function createRectanglePolygon(
  widthMm: number,
  heightMm: number
): Polygon {
  return {
    outer: [
      { x: 0, y: 0 },
      { x: widthMm, y: 0 },
      { x: widthMm, y: heightMm },
      { x: 0, y: heightMm },
    ],
    holes: [],
  };
}
