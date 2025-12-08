// src/geometry/polygonizer.ts

import type { GerberPrimitives } from "../parse/gerber-parser";
import type { Polygon, Vec2 } from "../types/pcb-model";

/**
 * Convert Gerber primitives into a set of polygons.
 *
 * This implementation:
 * - Turns tracks into rectangles with width equal to track width
 * - Approximates arcs with short track segments then strokes those
 * - Turns flashes into small circles (configurable default radius)
 * - Uses regions directly as polygons
 *
 * It does NOT perform any boolean union. The caller can feed the resulting
 * polygons into boolean-ops.ts if needed.
 */

export interface PolygonizeOptions {
  /** Default radius in mm for a flash if no aperture data is available */
  defaultFlashRadiusMm?: number;
  /** Number of segments to approximate circles and arcs */
  circleSegments?: number;
}

const DEFAULT_FLASH_RADIUS_MM = 0.5;
const DEFAULT_CIRCLE_SEGMENTS = 24;

export function polygonizePrimitives(
  primitives: GerberPrimitives,
  options: PolygonizeOptions = {}
): Polygon[] {
  const flashRadius = options.defaultFlashRadiusMm ?? DEFAULT_FLASH_RADIUS_MM;
  const circleSegments = options.circleSegments ?? DEFAULT_CIRCLE_SEGMENTS;

  const polygons: Polygon[] = [];

  // Regions are already polygon shaped
  for (const region of primitives.regions) {
    if (!region.boundary || region.boundary.length < 3) continue;
    const outer = ensureCCW(region.boundary);
    const holes = (region.holes || []).map(h => ensureCW(h));
    polygons.push({ outer, holes });
  }

  // Tracks -> rectangles
  for (const track of primitives.tracks) {
    const rect = strokeSegmentAsRectangle(track.start, track.end, track.width);
    if (rect) polygons.push(rect);
  }

  // Arcs -> approximated by small track segments, then stroked
  for (const arc of primitives.arcs) {
    const arcPolyline = approximateArcCenterline(
      arc.start,
      arc.end,
      arc.center,
      arc.clockwise,
      12
    );
    for (let i = 0; i < arcPolyline.length - 1; i++) {
      const a = arcPolyline[i];
      const b = arcPolyline[i + 1];
      const rect = strokeSegmentAsRectangle(a, b, arc.width);
      if (rect) polygons.push(rect);
    }
  }

  // Flashes -> circles
  for (const flash of primitives.flashes) {
    const circle = approximateCircle(flash.position, flashRadius, circleSegments);
    polygons.push(circle);
  }

  return polygons;
}

/**
 * Stroke a line segment from start to end into a rectangle with the given width.
 */
function strokeSegmentAsRectangle(start: Vec2, end: Vec2, widthMm: number): Polygon | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;

  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular
  const px = -uy;
  const py = ux;

  const hw = widthMm / 2;

  const p1: Vec2 = { x: start.x + px * hw, y: start.y + py * hw };
  const p2: Vec2 = { x: start.x - px * hw, y: start.y - py * hw };
  const p3: Vec2 = { x: end.x - px * hw, y: end.y - py * hw };
  const p4: Vec2 = { x: end.x + px * hw, y: end.y + py * hw };

  const outer = [p1, p2, p3, p4];
  const oriented = ensureCCW(outer);
  return { outer: oriented, holes: [] };
}

/**
 * Approximate an arc defined by start, end, center, and direction
 * as a polyline of points along the centerline.
 */
function approximateArcCenterline(
  start: Vec2,
  end: Vec2,
  center: Vec2,
  clockwise: boolean,
  segments: number
): Vec2[] {
  const sx = start.x - center.x;
  const sy = start.y - center.y;
  const ex = end.x - center.x;
  const ey = end.y - center.y;

  const rStart = Math.sqrt(sx * sx + sy * sy);
  const rEnd = Math.sqrt(ex * ex + ey * ey);
  const r = (rStart + rEnd) / 2 || rStart || rEnd;

  const aStart = Math.atan2(sy, sx);
  const aEnd = Math.atan2(ey, ex);

  let delta = aEnd - aStart;

  if (clockwise) {
    if (delta > 0) delta -= 2 * Math.PI;
  } else {
    if (delta < 0) delta += 2 * Math.PI;
  }

  const points: Vec2[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = aStart + delta * t;
    points.push({
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Approximate a circle as a polygon with given number of segments.
 */
function approximateCircle(
  center: Vec2,
  radius: number,
  segments: number
): Polygon {
  const pts: Vec2[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    pts.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }
  const outer = ensureCCW(pts);
  return { outer, holes: [] };
}

/**
 * Signed area of a polygon (positive -> CCW, negative -> CW)
 */
function signedArea(points: Vec2[]): number {
  let area = 0;
  const n = points.length;
  if (n < 3) return 0;
  for (let i = 0; i < n; i++) {
    const curr = points[i];
    const next = points[(i + 1) % n];
    area += curr.x * next.y - next.x * curr.y;
  }
  return area / 2;
}

/**
 * Ensure polygon is CCW oriented.
 */
function ensureCCW(points: Vec2[]): Vec2[] {
  const area = signedArea(points);
  if (area > 0) return points.slice();
  const reversed = points.slice().reverse();
  return reversed;
}

/**
 * Ensure polygon is CW oriented.
 */
function ensureCW(points: Vec2[]): Vec2[] {
  const area = signedArea(points);
  if (area < 0) return points.slice();
  const reversed = points.slice().reverse();
  return reversed;
}
