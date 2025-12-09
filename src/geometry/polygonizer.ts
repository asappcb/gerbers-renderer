import type { Vec2, Polygon } from "../types/pcb-model";
import type {
  GerberPrimitives,
  GerberPrimitiveTrack,
  GerberPrimitiveArc,
  GerberPrimitiveFlash,
  GerberPrimitiveRegion,
} from "../parse/gerber-parser";

// Reasonable defaults
const DEFAULT_TRACE_WIDTH_MM = 0.2;
const DEFAULT_FLASH_DIAM_MM = 0.8;
const DEFAULT_CIRCLE_SEGMENTS = 32;

// For endpoint matching in polyline building (mm^2)
const POINT_JOIN_EPS = 1e-3;

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export function polygonizePrimitives(prims: GerberPrimitives): Polygon[] {
  const polygons: Polygon[] = [];

  // 1) Tracks -> polylines -> stroked polygons
  if (prims.tracks && prims.tracks.length) {
    const polylines = buildPolylines(prims.tracks);
    for (const pl of polylines) {
      const poly = strokePolyline(pl.points, pl.width);
      if (poly) polygons.push(poly);
    }
  }

  // 2) Arcs (currently ignored - parser does not emit arcs yet)
  // If you start filling prims.arcs, you can approximate each arc by a
  // centerline polyline and call strokePolyline on it as well.

  // 3) Flashes -> circular pads
  if (prims.flashes && prims.flashes.length) {
    for (const flash of prims.flashes) {
      const d =
        flash.diameterMm && flash.diameterMm > 0
          ? flash.diameterMm
          : DEFAULT_FLASH_DIAM_MM;
      const circle = approximateCircle(
        flash.position,
        d / 2,
        DEFAULT_CIRCLE_SEGMENTS
      );
      polygons.push(circle);
    }
  }

  // 4) Regions -> boundary + holes (from fixed parser)
  if (prims.regions && prims.regions.length) {
    for (const region of prims.regions) {
      if (!region.boundary || region.boundary.length < 3) continue;

      // The parser guarantees that boundary is first and holes are
      // subsequent contours separated by D02 inside G36/G37.
      const outer = ensureClockwise(region.boundary.slice());
      const holes = (region.holes || []).map((h) =>
        ensureCounterClockwise(h.slice())
      );

      polygons.push({ outer, holes });
    }
  }

  return polygons;
}

// -----------------------------------------------------------------------------
// Polyline building from tracks
// -----------------------------------------------------------------------------

interface Polyline {
  points: Vec2[];
  width: number;
}

// Quantize helper for node-map key
function keyOf(p: Vec2): string {
  return `${Math.round(p.x * 1000)}:${Math.round(p.y * 1000)}`;
}

function isSamePoint(a: Vec2, b: Vec2): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy <= POINT_JOIN_EPS * POINT_JOIN_EPS;
}

function buildPolylines(tracks: GerberPrimitiveTrack[]): Polyline[] {
  if (!tracks.length) return [];

  // Map endpoint -> list of incident track indices + which end
  const nodeMap = new Map<
    string,
    { idx: number; end: "start" | "end" }[]
  >();

  tracks.forEach((t, idx) => {
    const ks = keyOf(t.start);
    const ke = keyOf(t.end);
    if (!nodeMap.has(ks)) nodeMap.set(ks, []);
    if (!nodeMap.has(ke)) nodeMap.set(ke, []);
    nodeMap.get(ks)!.push({ idx, end: "start" });
    nodeMap.get(ke)!.push({ idx, end: "end" });
  });

  const visited = new Array(tracks.length).fill(false);
  const polylines: Polyline[] = [];

  for (let i = 0; i < tracks.length; i++) {
    if (visited[i]) continue;

    const t0 = tracks[i];
    visited[i] = true;

    let points: Vec2[] = [t0.start, t0.end];
    const width = t0.width || DEFAULT_TRACE_WIDTH_MM;

    // grow backwards from start
    points = extendPolyline(points, tracks, visited, nodeMap, true);
    // grow forwards from end
    points = extendPolyline(points, tracks, visited, nodeMap, false);

    // clean up centerline
    points = dedupePoints(points);
    points = simplifyPolyline(points);

    if (points.length >= 2) {
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
  fromStart: boolean
): Vec2[] {
  let growing = true;

  while (growing) {
    growing = false;

    const pivot = fromStart ? points[0] : points[points.length - 1];
    const pivotKey = keyOf(pivot);
    const incidents = nodeMap.get(pivotKey) || [];

    let nextIdx = -1;
    let nextTrack: GerberPrimitiveTrack | null = null;
    let pivotIsStart = false;

    for (const inc of incidents) {
      if (visited[inc.idx]) continue;
      const cand = tracks[inc.idx];

      if (isSamePoint(cand.start, pivot)) {
        nextIdx = inc.idx;
        nextTrack = cand;
        pivotIsStart = true;
        break;
      }
      if (isSamePoint(cand.end, pivot)) {
        nextIdx = inc.idx;
        nextTrack = cand;
        pivotIsStart = false;
        break;
      }
    }

    if (nextIdx === -1 || !nextTrack) break;

    visited[nextIdx] = true;
    const other = pivotIsStart ? nextTrack.end : nextTrack.start;

    if (fromStart) {
      points.unshift(other);
    } else {
      points.push(other);
    }

    growing = true;
  }

  return points;
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

/**
 * Merge nearly straight runs and drop tiny jitter segments.
 * This keeps the topology but removes CAM noise so the stroker
 * sees a clean polyline.
 */
function simplifyPolyline(
  pts: Vec2[],
  angleEpsDeg = 2,
  minSegLen = 1e-4
): Vec2[] {
  if (pts.length <= 2) return pts.slice();

  const angleEps = (angleEpsDeg * Math.PI) / 180;
  const out: Vec2[] = [pts[0]];

  let prev = pts[0];
  let prevDir: Vec2 | null = null;

  // find first non-degenerate direction
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
    return [pts[0], pts[pts.length - 1]];
  }

  for (let i = out.length; i < pts.length; i++) {
    const curr = pts[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const len = Math.hypot(dx, dy);

    if (len < minSegLen) continue;

    const dir = { x: dx / len, y: dy / len };
    const dot = prevDir.x * dir.x + prevDir.y * dir.y;
    const clampedDot = Math.min(1, Math.max(-1, dot));
    const angle = Math.acos(clampedDot);

    if (Math.abs(angle) < angleEps) {
      // nearly straight: extend
      prev = curr;
      out[out.length - 1] = curr;
    } else {
      // real corner
      prev = curr;
      prevDir = dir;
      out.push(curr);
    }
  }

  if (out.length < 2) {
    return [pts[0], pts[pts.length - 1]];
  }

  return out;
}

// -----------------------------------------------------------------------------
// Stroke a centerline polyline into a polygon (composite shape union)
// -----------------------------------------------------------------------------

function strokePolyline(points: Vec2[], width: number): Polygon | null {
  if (points.length < 2 || width <= 0) return null;

  const n = points.length - 1;
  const half = width / 2;
  const CAP_SEGMENTS = 8;
  const MITER_LIMIT = 4;

  const startPt = points[0];
  const endPt = points[n];

  const leftNormal = (d: Vec2): Vec2 => ({ x: -d.y, y: d.x });
  const rightNormal = (d: Vec2): Vec2 => ({ x: d.y, y: -d.x });

  // 1. Compute segment directions
  const segDirs: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) {
      segDirs.push({ x: 0, y: 0 });
    } else {
      segDirs.push({ x: dx / len, y: dy / len });
    }
  }

  // Helper to compute a single miter point (or max-miter point)
  function computeMiter(dPrev: Vec2, dNext: Vec2, isLeft: boolean): Vec2 {
    const nPrev = isLeft ? leftNormal(dPrev) : rightNormal(dPrev);
    const nNext = isLeft ? leftNormal(dNext) : rightNormal(dNext);

    let mx = nPrev.x + nNext.x;
    let my = nPrev.y + nNext.y;
    let mLen = Math.hypot(mx, my);

    if (mLen < 1e-6) {
        return nPrev;
    }

    mx /= mLen;
    my /= mLen;

    const dot = mx * nPrev.x + my * nPrev.y;

    if (Math.abs(dot) < 1e-3) {
      return nPrev;
    }

    let scaleFactor = 1 / dot;

    if (Math.abs(scaleFactor) > MITER_LIMIT) {
      // Bevel joint: use the miter limit
      return scale({ x: mx, y: my }, Math.sign(scaleFactor) * MITER_LIMIT);
    }

    return scale({ x: mx, y: my }, scaleFactor);
  }


  // --- PART 1: STROKE BODY (Flat Caps) ---
  const leftBody: Vec2[] = [];
  const rightBody: Vec2[] = [];

  // Start point (flat cap vertices)
  const nStart = leftNormal(segDirs[0]);
  leftBody.push(add(startPt, scale(nStart, half)));
  rightBody.push(add(startPt, scale(rightNormal(segDirs[0]), half)));

  // Interior joints
  for (let i = 1; i < n; i++) {
    const p = points[i];
    const dPrev = segDirs[i - 1];
    const dNext = segDirs[i];

    // Left side
    const miterL = computeMiter(dPrev, dNext, true);
    leftBody.push(add(p, scale(miterL, half)));

    // Right side (built in start-to-end order, but stored separately)
    const miterR = computeMiter(dPrev, dNext, false);
    rightBody.push(add(p, scale(miterR, half)));
  }

  // End point (flat cap vertices)
  const nEnd = leftNormal(segDirs[n - 1]);
  leftBody.push(add(endPt, scale(nEnd, half)));
  rightBody.push(add(endPt, scale(rightNormal(segDirs[n - 1]), half)));

  // --- PART 2: START CAP ---
  const startCapOuter: Vec2[] = [];
  const startDir = segDirs[0];
  const startCapCenter = startPt;

  // The start cap connects the leftBody[0] point to the rightBody[0] point.
  // We use the normal of the first segment to define the semicircle.
  const rightStartOffset = rightNormal(startDir);
  const startAngle = Math.atan2(rightStartOffset.y, rightStartOffset.x);

  // Sweep 180 degrees from right side (theta=0) to left side (theta=PI)
  for (let i = 0; i <= CAP_SEGMENTS; i++) {
    const theta = startAngle + (i / CAP_SEGMENTS) * Math.PI;
    startCapOuter.push({
      x: startCapCenter.x + Math.cos(theta) * half,
      y: startCapCenter.y + Math.sin(theta) * half,
    });
  }

  // --- PART 3: END CAP ---
  const endCapOuter: Vec2[] = [];
  const endDir = segDirs[n - 1];
  const endCapCenter = endPt;

  // The end cap connects the leftBody[end] point to the rightBody[end] point.
  // We use the normal of the last segment to define the semicircle.
  const leftEndOffset = leftNormal(endDir);
  const endAngle = Math.atan2(leftEndOffset.y, leftEndOffset.x);

  // Sweep 180 degrees from left side (theta=0) to right side (theta=PI)
  for (let i = 0; i <= CAP_SEGMENTS; i++) {
    const theta = endAngle + (i / CAP_SEGMENTS) * Math.PI;
    endCapOuter.push({
      x: endCapCenter.x + Math.cos(theta) * half,
      y: endCapCenter.y + Math.sin(theta) * half,
    });
  }

  // --- PART 4: COMBINE AND FINALIZE (Guaranteed Clockwise Winding) ---

  // Build the outer boundary:
  // 1. Left side (Start -> End)
  // 2. End Cap (Left side -> Right side)
  // 3. Right side (End -> Start, so must be reversed)
  // 4. Start Cap (Right side -> Left side, so must be reversed)

// --- PART 4: COMBINE AND FINALIZE (Refined Concatenation) ---

  // Build the outer boundary:
  // 1. Left side (Start -> End)
  // 2. End Cap (Left side -> Right side, excluding start/end overlap points)
  // 3. Right side (End -> Start, reversed)
  // 4. Start Cap (Right side -> Left side, reversed, excluding start/end overlap points)

  const finalOuter = [
    // 1. Left Body (Start -> End)
    ...leftBody, 

    // 2. End Cap (Skip first and last point, as they are body points)
    // The cap points are: B, B1, B2, ..., C
    // We want B1, B2, ... 
    ...endCapOuter.slice(1, -1), 

    // 3. Right Body (End -> Start) - REVERSED
    ...rightBody.slice().reverse(), 

    // 4. Start Cap (Skip first and last point, as they are body points)
    // The cap points are: D, D1, D2, ..., A
    // We reverse it, so it's A, ..., D2, D1. We want ..., D2, D1 (excluding A and D)
    ...startCapOuter.slice(1, -1).reverse(),
  ];

  if (finalOuter.length < 3) return null;

  // The final dedupe will handle any residual floating-point duplicates, 
  // but slicing removes the guaranteed-duplicate points first.
  return { outer: ensureClockwise(dedupePoints(finalOuter)), holes: [] };
}

// -----------------------------------------------------------------------------
// Circle / pad approximation
// -----------------------------------------------------------------------------

function approximateCircle(
  center: Vec2,
  radiusMm: number,
  segments: number
): Polygon {
  const outer: Vec2[] = [];
  // clockwise winding
  for (let i = 0; i < segments; i++) {
    const theta = -(i / segments) * Math.PI * 2;
    outer.push({
      x: center.x + Math.cos(theta) * radiusMm,
      y: center.y + Math.sin(theta) * radiusMm,
    });
  }
  return { outer, holes: [] };
}

// -----------------------------------------------------------------------------
// Winding helpers
// -----------------------------------------------------------------------------

function computeSignedArea(points: Vec2[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    sum += (points[j].x - points[i].x) * (points[j].y + points[i].y);
  }
  return sum / 2;
}

function ensureClockwise(points: Vec2[]): Vec2[] {
  if (points.length < 3) return points;
  const area = computeSignedArea(points);
  return area < 0 ? points : points.slice().reverse();
}

function ensureCounterClockwise(points: Vec2[]): Vec2[] {
  if (points.length < 3) return points;
  const area = computeSignedArea(points);
  return area > 0 ? points : points.slice().reverse();
}

// -----------------------------------------------------------------------------
// Vec helpers
// -----------------------------------------------------------------------------

function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

// Rotates vector d by angle (in radians) (currently unused but good helper)
/*
function rotate(d: Vec2, angle: number): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: d.x * cos - d.y * sin,
    y: d.x * sin + d.y * cos,
  };
}
*/