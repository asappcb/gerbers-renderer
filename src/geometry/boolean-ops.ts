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
 * Convert our Polygon to Martinez PolygonCoords
 */
function polygonToMartinez(poly: Polygon): PolygonCoords {
  const outer: Ring = poly.outer.map(p => [p.x, p.y]);
  const holes: Ring[] = (poly.holes || []).map(hole =>
    hole.map(p => [p.x, p.y])
  );
  return [outer, ...holes];
}

/**
 * Convert Martinez MultiPolygon or PolygonCoords to our Polygon[]
 */
function martinezToPolygons(
  result: MultiPolygonCoords | PolygonCoords | null | undefined
): Polygon[] {
  if (!result) return [];

  let multi: MultiPolygonCoords;

  // Distinguish between PolygonCoords and MultiPolygonCoords by checking the nesting depth.
  // PolygonCoords: ring -> point -> coord
  // MultiPolygonCoords: polygon -> ring -> point -> coord
  if (Array.isArray(result[0]) && Array.isArray((result as any)[0][0]) && !Array.isArray((result as any)[0][0][0])) {
    // This is PolygonCoords (result[0][0][0] is number)
    multi = [result as PolygonCoords];
  } else if (Array.isArray(result[0]) && Array.isArray((result as any)[0][0]) && Array.isArray((result as any)[0][0][0])) {
    // This is MultiPolygonCoords
    multi = result as MultiPolygonCoords;
  } else {
    // Fallback: treat as no polygons
    return [];
  }

  const polys: Polygon[] = [];

  for (const poly of multi) {
    if (poly.length === 0) continue;
    const [outerRing, ...holeRings] = poly;

    const outer = outerRing.map(([x, y]) => ({ x, y }));
    const holes = holeRings.map(ring => ring.map(([x, y]) => ({ x, y })));

    polys.push({ outer, holes });
  }

  return polys;
}

/**
 * Union of multiple polygons.
 */
export function unionPolygons(polys: Polygon[]): Polygon[] {
  if (polys.length === 0) return [];

  const polyCoordsList = polys.map(p => polygonToMartinez(p));

  let result: PolygonCoords | MultiPolygonCoords | null = polyCoordsList[0];

  for (let i = 1; i < polyCoordsList.length; i++) {
    result = martinez.union(result as any, polyCoordsList[i]) as any;
    if (!result) break;
  }

  return martinezToPolygons(result);
}

/**
 * Subtract set b from set a.
 * Result = union(a) minus union(b)
 */
export function subtractPolygons(a: Polygon[], b: Polygon[]): Polygon[] {
  if (a.length === 0) return [];
  if (b.length === 0) return a.slice();

  // Union all a polygons
  const aCoordsList = a.map(p => polygonToMartinez(p));
  let aUnion: PolygonCoords | MultiPolygonCoords | null = aCoordsList[0];
  for (let i = 1; i < aCoordsList.length; i++) {
    aUnion = martinez.union(aUnion as any, aCoordsList[i]) as any;
    if (!aUnion) break;
  }
  if (!aUnion) return [];

  // Union all b polygons
  const bCoordsList = b.map(p => polygonToMartinez(p));
  let bUnion: PolygonCoords | MultiPolygonCoords | null = bCoordsList[0];
  for (let i = 1; i < bCoordsList.length; i++) {
    bUnion = martinez.union(bUnion as any, bCoordsList[i]) as any;
    if (!bUnion) break;
  }
  if (!bUnion) return martinezToPolygons(aUnion);

  // Diff: aUnion minus bUnion
  const result = martinez.diff(aUnion as any, bUnion as any) as any;
  return martinezToPolygons(result);
}

/**
 * Intersection of set a and set b.
 * Result = union(a) intersect union(b)
 */
export function intersectPolygons(a: Polygon[], b: Polygon[]): Polygon[] {
  if (a.length === 0 || b.length === 0) return [];

  const aCoordsList = a.map(p => polygonToMartinez(p));
  let aUnion: PolygonCoords | MultiPolygonCoords | null = aCoordsList[0];
  for (let i = 1; i < aCoordsList.length; i++) {
    aUnion = martinez.union(aUnion as any, aCoordsList[i]) as any;
    if (!aUnion) break;
  }
  if (!aUnion) return [];

  const bCoordsList = b.map(p => polygonToMartinez(p));
  let bUnion: PolygonCoords | MultiPolygonCoords | null = bCoordsList[0];
  for (let i = 1; i < bCoordsList.length; i++) {
    bUnion = martinez.union(bUnion as any, bCoordsList[i]) as any;
    if (!bUnion) break;
  }
  if (!bUnion) return [];

  const result = martinez.intersection(aUnion as any, bUnion as any) as any;
  return martinezToPolygons(result);
}
