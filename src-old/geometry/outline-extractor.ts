// src/geometry/outline-extractor.ts

import type { Polygon } from "../types/pcb-model";
import type { ParsedGerberLayer } from "../core/pipeline";

/**
 * Try to derive the board outline from parsed Gerber layers by
 * computing the bounding box of all primitives.
 */
export function deriveOutlineFromLayers(
  layers: ParsedGerberLayer[]
): Polygon | null {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let hasAny = false;

  for (const layer of layers) {
    const p = layer.primitives;

    // Tracks
    for (const t of p.tracks) {
      updateBounds(t.start.x, t.start.y);
      updateBounds(t.end.x, t.end.y);
    }

    // Arcs
    for (const a of p.arcs) {
      updateBounds(a.start.x, a.start.y);
      updateBounds(a.end.x, a.end.y);
      updateBounds(a.center.x, a.center.y);
    }

    // Flashes
    for (const f of p.flashes) {
      updateBounds(f.position.x, f.position.y);
    }

    // Regions
    for (const r of p.regions) {
      for (const pt of r.boundary) {
        updateBounds(pt.x, pt.y);
      }
      for (const hole of r.holes) {
        for (const pt of hole) {
          updateBounds(pt.x, pt.y);
        }
      }
    }
  }

  function updateBounds(x: number, y: number) {
    hasAny = true;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  if (!hasAny || !isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
    return null;
  }

  // Simple rectangular outline from bounding box
  return {
    outer: [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ],
    holes: [],
  };
}

/**
 * Helper to build a rectangle polygon, used only for fallback cases.
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
