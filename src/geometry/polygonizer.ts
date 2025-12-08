// src/geometry/polygonizer.ts

import type { Vec2, Polygon } from "../types/pcb-model";
import type {
  GerberPrimitives,
  GerberPrimitiveTrack,
  GerberPrimitiveFlash,
  GerberPrimitiveRegion,
} from "../parse/gerber-parser";

const DEFAULT_TRACE_WIDTH_MM = 0.2;   // fallback if needed
const DEFAULT_FLASH_DIAM_MM = 0.8;    // fallback pad diameter
const DEFAULT_CIRCLE_SEGMENTS = 32;

// Epsilon for joining endpoints (in mm)
const POINT_JOIN_EPS = 1e-3;

// ---------- Public API ----------

export function polygonizePrimitives(prims: GerberPrimitives): Polygon[] {
  const polygons: Polygon[] = [];

  // 1) Traces -> polylines -> stroked polygons
  const polylines = buildPolylines(prims.tracks || []);
  for (const pl of polylines) {
    const poly = strokePolyline(pl.points, pl.width);
    if (poly) polygons.push(poly);
  }

  // 2) Flashes -> circular pads
  for (const flash of prims.flashes || []) {
    const d = flash.diameterMm && flash.diameterMm > 0
      ? flash.diameterMm
      : DEFAULT_FLASH_DIAM_MM;
    const circle = approximateCircle(flash.position, d / 2, DEFAULT_CIRCLE_SEGMENTS);
    polygons.push(circle);
  }

  // 3) Regions -> as-is
  for (const region of prims.regions || []) {
    if (!region.boundary || region.boundary.length < 3) continue;
    const outer = [...region.boundary];
    const holes = (region.holes || []).map(h => [...h]);
    polygons.push({ outer, holes });
  }

  return polygons;
}

// ---------- Polyline building from tracks ----------

interface Polyline {
  points: Vec2[];
  width: number;
}

function buildPolylines(tracks: GerberPrimitiveTrack[]): Polyline[] {
  if (!tracks.length) return [];

  // Quantize point to reduce floating noise
  const keyOf = (p: Vec2) =>
    `${Math.round(p.x * 1000)}:${Math.round(p.y * 1000)}`;

  // Map endpoint -> list of incident track indices + which end
  const nodeMap = new Map<string, { idx: number; end: "start" | "end" }[]>();

  tracks.forEach((t, idx) => {
    const kStart = keyOf(t.start);
    const kEnd = keyOf(t.end);
    if (!nodeMap.has(kStart)) nodeMap.set(kStart, []);
    if (!nodeMap.has(kEnd)) nodeMap.set(kEnd, []);
    nodeMap.get(kStart)!.push({ idx, end: "start" });
    nodeMap.get(kEnd)!.push({ idx, end: "end" });
  });

  const visited = new Array(tracks.length).fill(false);
  const polylines: Polyline[] = [];

  for (let i = 0; i < tracks.length; i++) {
    if (visited[i]) continue;

    const t = tracks[i];
    visited[i] = true;

    let points: Vec2[] = [t.start, t.end];
    let width = t.width || DEFAULT_TRACE_WIDTH_MM;

    // Extend backwards from start
    points = extendPolyline(points, tracks, visited, nodeMap, true, width);
    // Extend forwards from end
    points = extendPolyline(points, tracks, visited, nodeMap, false, width);

    // Compute effective width as max of all segments (we updated width inside extend)
    width = computePolylineWidth(points, tracks, width);

    // Deduplicate near-equal consecutive points
    points = dedupePoints(points);

    // Simplify almost-straight runs to kill micro-kinks
    points = simplifyPolyline(points);

    if (points.length >= 2 && width > 0) {
      polylines.push({ points, width });
    }
  }

  return polylines;
}

function extendPolyline(
  points: Vec2[],
  tracks: GerberPrimitiveTrack[],
  visited: boolean[],
  nodeMap: Map<string, { idx: number; end: "start" | "end" }[]>,
  fromStart: boolean,
  widthRef: number
): Vec2[] {
  const keyOf = (p: Vec2) =>
    `${Math.round(p.x * 1000)}:${Math.round(p.y * 1000)}`;

  let growing = true;

  while (growing) {
    growing = false;
    const pivot = fromStart ? points[0] : points[points.length - 1];
    const pivotKey = keyOf(pivot);
    const incidents = nodeMap.get(pivotKey) || [];

    // Find an unvisited incident track that continues from this pivot
    let nextIdx = -1;
    let nextTrack: GerberPrimitiveTrack | null = null;
    let pivotIsStart = false;

    for (const inc of incidents) {
      if (visited[inc.idx]) continue;
      const candidate = tracks[inc.idx];
      if (isSamePoint(candidate.start, pivot)) {
        nextIdx = inc.idx;
        nextTrack = candidate;
        pivotIsStart = true;
        break;
      }
      if (isSamePoint(candidate.end, pivot)) {
        nextIdx = inc.idx;
        nextTrack = candidate;
        pivotIsStart = false;
        break;
      }
    }

    if (nextIdx === -1 || !nextTrack) break;

    visited[nextIdx] = true;

    // Decide orientation so we always append the "other" endpoint
    const other = pivotIsStart ? nextTrack.end : nextTrack.start;

    if (fromStart) {
      // prepend at the front
      points.unshift(other);
    } else {
      // append at the back
      points.push(other);
    }

    widthRef = Math.max(widthRef, nextTrack.width || DEFAULT_TRACE_WIDTH_MM);
    growing = true;
  }

  return points;
}

function computePolylineWidth(points: Vec2[], tracks: GerberPrimitiveTrack[], baseWidth: number): number {
  // For now just return baseWidth; you could walk tracks near these points
  // and compute a more precise max width if needed.
  return baseWidth || DEFAULT_TRACE_WIDTH_MM;
}

function isSamePoint(a: Vec2, b: Vec2): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy <= POINT_JOIN_EPS * POINT_JOIN_EPS;
}

function dedupePoints(pts: Vec2[]): Vec2[] {
  if (pts.length <= 1) return pts.slice();
  const out: Vec2[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (!isSamePoint(pts[i], out[out.length - 1])) {
      out.push(pts[i]);
    }
  }
  return out;
}

// ---------- Stroke a centerline polyline into a polygon ----------

function strokePolyline(points: Vec2[], width: number): Polygon | null {
  if (points.length < 2 || width <= 0) return null;

  const n = points.length - 1;
  const half = width / 2;

  // Segment directions (normalized)
  const segDirs: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) {
      segDirs.push({ x: 0, y: 0 });
    } else {
      segDirs.push({ x: dx / len, y: dy / len });
    }
  }

  const left: Vec2[] = [];
  const right: Vec2[] = [];

  const leftNormal = (d: Vec2): Vec2 => ({ x: -d.y, y: d.x });

  // Maximum allowed miter extension relative to half-width
  const MITER_LIMIT = 4; // you can tweak; 4 means up to 4x half-width

  for (let i = 0; i <= n; i++) {
    const p = points[i];

    let nLeft: Vec2;

    if (i === 0) {
      // Start cap: just use first segment direction
      const d = segDirs[0];
      const ln = leftNormal(d);
      nLeft = { x: ln.x, y: ln.y };
    } else if (i === n) {
      // End cap: just use last segment direction
      const d = segDirs[n - 1];
      const ln = leftNormal(d);
      nLeft = { x: ln.x, y: ln.y };
    } else {
      // Interior vertex
      const dPrev = segDirs[i - 1];
      const dNext = segDirs[i];

      // If one of these is degenerate, just use the other
      if ((dPrev.x === 0 && dPrev.y === 0) && (dNext.x === 0 && dNext.y === 0)) {
        nLeft = { x: 0, y: 1 }; // arbitrary
      } else if (dPrev.x === 0 && dPrev.y === 0) {
        nLeft = leftNormal(dNext);
      } else if (dNext.x === 0 && dNext.y === 0) {
        nLeft = leftNormal(dPrev);
      } else {
        const nPrev = leftNormal(dPrev);
        const nNext = leftNormal(dNext);

        // Sum normals -> bisector
        let mx = nPrev.x + nNext.x;
        let my = nPrev.y + nNext.y;
        let mLen = Math.hypot(mx, my);

        // If sum is tiny (straight or 180 deg), fallback to simple normal
        if (mLen < 1e-4) {
          nLeft = { x: nPrev.x, y: nPrev.y };
        } else {
          mx /= mLen;
          my /= mLen;

          // Project onto nPrev to compute miter scale
          const dot = mx * nPrev.x + my * nPrev.y;

          // If dot is tiny, angle is very acute - use bevel join
          if (Math.abs(dot) < 1e-3) {
            nLeft = { x: nPrev.x, y: nPrev.y };
          } else {
            let scale = 1 / dot;

            // Clamp miter length so we don't explode on sharp angles
            if (Math.abs(scale) > MITER_LIMIT) {
              // Bevel join fallback
              nLeft = { x: nPrev.x, y: nPrev.y };
            } else {
              nLeft = { x: mx * scale, y: my * scale };
            }
          }
        }
      }
    }

    // Normalize and scale to half-width
    const len = Math.hypot(nLeft.x, nLeft.y) || 1;
    const sx = (nLeft.x / len) * half;
    const sy = (nLeft.y / len) * half;

    left.push({ x: p.x + sx, y: p.y + sy });
    right.push({ x: p.x - sx, y: p.y - sy });
  }

  if (left.length < 2 || right.length < 2) return null;

  const outer: Vec2[] = [...left, ...right.reverse()];
  return { outer, holes: [] };
}

function simplifyPolyline(
  pts: Vec2[],
  angleEpsDeg = 2,      // how "straight" we consider straight
  minSegLen = 1e-4      // minimum segment length in mm
): Vec2[] {
  if (pts.length <= 2) return pts.slice();

  const angleEps = (angleEpsDeg * Math.PI) / 180;

  const out: Vec2[] = [pts[0]];

  let prev = pts[0];

  // Find first non-zero length segment direction
  let prevDir: Vec2 | null = null;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - prev.x;
    const dy = pts[i].y - prev.y;
    const len = Math.hypot(dx, dy);
    if (len >= minSegLen) {
      prevDir = { x: dx / len, y: dy / len };
      prev = pts[i];
      out.push(prev);
      break;
    }
  }

  if (!prevDir) {
    // Everything is basically one point
    return [pts[0], pts[pts.length - 1]];
  }

  for (let i = out.length; i < pts.length; i++) {
    const curr = pts[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const len = Math.hypot(dx, dy);

    if (len < minSegLen) {
      // Too short to matter, just skip
      continue;
    }

    const dir = { x: dx / len, y: dy / len };
    // Angle between prevDir and dir
    const dot = prevDir.x * dir.x + prevDir.y * dir.y;
    const clampedDot = Math.min(1, Math.max(-1, dot));
    const angle = Math.acos(clampedDot);

    if (Math.abs(angle) < angleEps) {
      // Nearly colinear: extend the previous segment instead of adding a kink
      prev = curr;
      out[out.length - 1] = curr;
      // Keep prevDir as-is
    } else {
      // Real corner
      prev = curr;
      prevDir = dir;
      out.push(curr);
    }
  }

  // Guarantee at least two points
  if (out.length < 2) {
    return [pts[0], pts[pts.length - 1]];
  }

  return out;
}


// ---------- Circle / pad approximation ----------

function approximateCircle(
  center: Vec2,
  radiusMm: number,
  segments: number
): Polygon {
  const outer: Vec2[] = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    outer.push({
      x: center.x + Math.cos(theta) * radiusMm,
      y: center.y + Math.sin(theta) * radiusMm,
    });
  }
  return { outer, holes: [] };
}
