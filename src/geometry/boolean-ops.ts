// src/geometry/boolean-ops.ts

import type { Polygon } from "../types/pcb-model";
import * as martinez from "martinez-polygon-clipping";

/**
 * Martinez uses nested arrays:
 * - Point: [x, y]
 * - Ring: Point[]
 * - Polygon: Ring[]           // [outer, hole1, hole2, ...]
 * - MultiPolygon: Polygon[]   // [polygon1, polygon2, ...]
 */

type Point2D = [number, number];
type Ring = Point2D[];
type PolygonCoords = Ring[];
type MultiPolygonCoords = PolygonCoords[];

/**
 * Convert our Polygon to Martinez PolygonCoords.
 * Returns null if the polygon is too small / invalid.
 */
function polygonToMartinez(poly: Polygon): PolygonCoords | null {
  if (!poly.outer || poly.outer.length < 3) return null;

  const outer: Ring = poly.outer.map(p => [p.x, p.y]);
  if (outer.length < 3) return null;

  const holes: Ring[] = (poly.holes || [])
    .filter(h => h && h.length >= 3)
    .map(hole => hole.map(p => [p.x, p.y]));

  return [outer, ...holes];
}


/**
 * Convert Martinez MultiPolygon or PolygonCoords to our Polygon[].
 * Very defensive: if shape looks weird, we skip it.
 */
function martinezToPolygons(
  result: MultiPolygonCoords | PolygonCoords | null | undefined
): Polygon[] {
  if (!result) return [];

  let multi: MultiPolygonCoords;

  // Heuristic to distinguish PolygonCoords vs MultiPolygonCoords
  // PolygonCoords: ring -> point -> number
  // MultiPolygonCoords: polygon -> ring -> point -> number
  const r: any = result;

  if (
    Array.isArray(r) &&
    Array.isArray(r[0]) &&
    Array.isArray(r[0][0]) &&
    typeof r[0][0][0] === "number"
  ) {
    // PolygonCoords
    multi = [result as PolygonCoords];
  } else if (
    Array.isArray(r) &&
    Array.isArray(r[0]) &&
    Array.isArray(r[0][0]) &&
    Array.isArray(r[0][0][0]) &&
    typeof r[0][0][0][0] === "number"
  ) {
    // MultiPolygonCoords
    multi = result as MultiPolygonCoords;
  } else {
    return [];
  }

  const polys: Polygon[] = [];

  for (const poly of multi) {
    if (!Array.isArray(poly) || poly.length === 0) continue;
    const [outerRing, ...holeRings] = poly;
    if (!Array.isArray(outerRing) || outerRing.length < 3) continue;

    const outer = outerRing.map(([x, y]) => ({ x, y }));
    const holes = holeRings
      .filter((ring: Ring) => Array.isArray(ring) && ring.length >= 3)
      .map((ring: Ring) => ring.map(([x, y]) => ({ x, y })));

    polys.push({ outer, holes });
  }

  return polys;
}

/**
 * Try to run Martinez boolean op, but never throw.
 */
function safeBooleanOp(
  op: "union" | "diff" | "intersection",
  a: PolygonCoords | MultiPolygonCoords,
  b: PolygonCoords | MultiPolygonCoords
): MultiPolygonCoords | PolygonCoords | null {
  try {
    if (op === "union") {
      return martinez.union(a as any, b as any) as any;
    }
    if (op === "diff") {
      return martinez.diff(a as any, b as any) as any;
    }
    if (op === "intersection") {
      return martinez.intersection(a as any, b as any) as any;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[boolean-ops] Martinez error in", op, err);
    return null;
  }
  return null;
}

/**
 * Union of multiple polygons.
 * If anything goes wrong, we just return the original input polygons.
 */
export function unionPolygons(polys: Polygon[]): Polygon[] {
  if (!polys.length) return [];

  // Convert and drop invalid/degenerate polygons
  const polyCoordsList: PolygonCoords[] = [];
  const validPolys: Polygon[] = [];
  for (const p of polys) {
    const coords = polygonToMartinez(p);
    if (coords) {
      polyCoordsList.push(coords);
      validPolys.push(p);
    }
  }
  if (!polyCoordsList.length) return [];

  if (polyCoordsList.length === 1) {
    // Nothing to union
    return validPolys;
  }

  let result: PolygonCoords | MultiPolygonCoords | null = polyCoordsList[0];

  for (let i = 1; i < polyCoordsList.length; i++) {
    const next = polyCoordsList[i];
    const res = safeBooleanOp("union", result as any, next as any);
    if (!res) {
      // Fallback: return original polygons if union fails
      return validPolys;
    }
    result = res;
  }

  const merged = martinezToPolygons(result);
  if (!merged.length) {
    return validPolys;
  }
  return merged;
}

/**
 * Subtract set b from set a.
 * Result = union(a) minus union(b).
 * If boolean fails, returns original a.
 */
export function subtractPolygons(a: Polygon[], b: Polygon[]): Polygon[] {
  if (!a.length) return [];
  if (!b.length) return a.slice();

  const aCoordsList: PolygonCoords[] = [];
  const aValid: Polygon[] = [];
  for (const p of a) {
    const coords = polygonToMartinez(p);
    if (coords) {
      aCoordsList.push(coords);
      aValid.push(p);
    }
  }
  if (!aCoordsList.length) return [];

  const bCoordsList: PolygonCoords[] = [];
  for (const p of b) {
    const coords = polygonToMartinez(p);
    if (coords) {
      bCoordsList.push(coords);
    }
  }
  if (!bCoordsList.length) return aValid;

  let aUnion: PolygonCoords | MultiPolygonCoords | null = aCoordsList[0];
  for (let i = 1; i < aCoordsList.length; i++) {
    const res = safeBooleanOp("union", aUnion as any, aCoordsList[i] as any);
    if (!res) return aValid;
    aUnion = res;
  }

  let bUnion: PolygonCoords | MultiPolygonCoords | null = bCoordsList[0];
  for (let i = 1; i < bCoordsList.length; i++) {
    const res = safeBooleanOp("union", bUnion as any, bCoordsList[i] as any);
    if (!res) return aValid;
    bUnion = res;
  }

  const diffRes = safeBooleanOp("diff", aUnion as any, bUnion as any);
  if (!diffRes) return aValid;

  const result = martinezToPolygons(diffRes);
  return result.length ? result : aValid;
}

/**
 * Intersection of set a and set b.
 * Result = union(a) intersect union(b).
 * If boolean fails, returns [].
 */
export function intersectPolygons(a: Polygon[], b: Polygon[]): Polygon[] {
  if (!a.length || !b.length) return [];

  const aCoordsList: PolygonCoords[] = [];
  for (const p of a) {
    const coords = polygonToMartinez(p);
    if (coords) aCoordsList.push(coords);
  }
  if (!aCoordsList.length) return [];

  const bCoordsList: PolygonCoords[] = [];
  for (const p of b) {
    const coords = polygonToMartinez(p);
    if (coords) bCoordsList.push(coords);
  }
  if (!bCoordsList.length) return [];

  let aUnion: PolygonCoords | MultiPolygonCoords | null = aCoordsList[0];
  for (let i = 1; i < aCoordsList.length; i++) {
    const res = safeBooleanOp("union", aUnion as any, aCoordsList[i] as any);
    if (!res) return [];
    aUnion = res;
  }

  let bUnion: PolygonCoords | MultiPolygonCoords | null = bCoordsList[0];
  for (let i = 1; i < bCoordsList.length; i++) {
    const res = safeBooleanOp("union", bUnion as any, bCoordsList[i] as any);
    if (!res) return [];
    bUnion = res;
  }

  const interRes = safeBooleanOp("intersection", aUnion as any, bUnion as any);
  if (!interRes) return [];

  return martinezToPolygons(interRes);
}
