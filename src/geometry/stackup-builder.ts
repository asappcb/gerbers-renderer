// src/geometry/stackup-builder.ts

import type {
  PcbModelGeometry,
  LayerGeometry,
  DrillHole,
  PcbSide,
  PcbLayerKind,
  Polygon,
} from "../types/pcb-model";
import type { BuildPcbGeometryParams, ParsedGerberLayer } from "../core/pipeline";

import {
  deriveOutlineFromLayers,
  createRectanglePolygon,
} from "./outline-extractor";
import {
  DEFAULT_BOARD_WIDTH_MM,
  DEFAULT_BOARD_HEIGHT_MM,
} from "./constants";
import { polygonizePrimitives } from "./polygonizer";
// import { unionPolygons } from "./boolean-ops";


/**
 * Build the high level PcbModelGeometry from parsed Gerber and drill data.
 */
export function buildPcbGeometry(params: BuildPcbGeometryParams): PcbModelGeometry {
  const { parsedGerbers, parsedDrills, boardThicknessMm } = params;

  let outlinePoly = deriveOutlineFromLayers(parsedGerbers);

  let widthMm: number;
  let heightMm: number;

  if (outlinePoly && outlinePoly.outer.length >= 2) {
    const bbox = computeBoundingBox(outlinePoly);
    widthMm = bbox.width;
    heightMm = bbox.height;
  } else {
    widthMm = DEFAULT_BOARD_WIDTH_MM;
    heightMm = DEFAULT_BOARD_HEIGHT_MM;
    outlinePoly = createRectanglePolygon(widthMm, heightMm);
  }

  const boardRectPoly = outlinePoly;

  const copperLayers: LayerGeometry[] = [];
  const maskLayers: LayerGeometry[] = [];
  const silkLayers: LayerGeometry[] = [];

  for (const layer of parsedGerbers) {
    const lk = roleToSideAndKind(layer);
    if (!lk.kind || !lk.side) continue;

    // 1) polygonize
    let polys = polygonizePrimitives(layer.primitives);

    // 2) drop junk
    if (polys) {
      polys = polys.filter(p => p.outer && p.outer.length >= 3);
    }

    // // 3) union for copper so rectangles + circles become single islands
    // if (lk.kind === "copper" && polys && polys.length > 1) {
    //   polys = unionPolygons(polys);
    // }

    // After union...
    if (polys) {
      polys = polys.filter(p => p.outer && p.outer.length >= 3);
    }

    // 4) fallback
    if (!polys || polys.length === 0) {
      polys = [boardRectPoly];
    }

    const layerGeom: LayerGeometry = {
      name: layer.name,
      side: lk.side,
      kind: lk.kind,
      polygons: polys,
    };

    if (lk.kind === "copper") {
      copperLayers.push(layerGeom);
    } else if (lk.kind === "soldermask") {
      maskLayers.push(layerGeom);
    } else if (lk.kind === "silkscreen") {
      silkLayers.push(layerGeom);
    }
  }

  // Ensure at least top and bottom copper exist
  if (!copperLayers.some(l => l.side === "top")) {
    copperLayers.push({
      name: "auto_top_copper",
      side: "top",
      kind: "copper",
      polygons: [boardRectPoly],
    });
  }
  if (!copperLayers.some(l => l.side === "bottom")) {
    copperLayers.push({
      name: "auto_bottom_copper",
      side: "bottom",
      kind: "copper",
      polygons: [boardRectPoly],
    });
  }

  const outlineLayer: LayerGeometry = {
    name: "outline",
    side: null,
    kind: "outline",
    polygons: [outlinePoly],
  };

  const drills: DrillHole[] = flattenDrills(parsedDrills);

  const geometry: PcbModelGeometry = {
    widthMm,
    heightMm,
    thicknessMm: boardThicknessMm,
    copperLayers,
    maskLayers,
    silkLayers,
    outline: outlineLayer,
    drills,
  };

  return geometry;
}

function roleToSideAndKind(
  layer: ParsedGerberLayer
): { side: PcbSide | null; kind: PcbLayerKind | null } {
  const role = (layer.role || "").toLowerCase();

  if (role === "top_copper") {
    return { side: "top", kind: "copper" };
  }
  if (role === "bottom_copper") {
    return { side: "bottom", kind: "copper" };
  }
  if (role === "inner_copper") {
    return { side: null, kind: "copper" };
  }

  if (role === "top_mask") {
    return { side: "top", kind: "soldermask" };
  }
  if (role === "bottom_mask") {
    return { side: "bottom", kind: "soldermask" };
  }

  if (role === "top_silk") {
    return { side: "top", kind: "silkscreen" };
  }
  if (role === "bottom_silk") {
    return { side: "bottom", kind: "silkscreen" };
  }

  if (role === "outline") {
    return { side: null, kind: "outline" };
  }

  return { side: null, kind: null };
}

function computeBoundingBox(poly: Polygon): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (!poly.outer.length) {
    return {
      minX: 0,
      minY: 0,
      maxX: DEFAULT_BOARD_WIDTH_MM,
      maxY: DEFAULT_BOARD_HEIGHT_MM,
      width: DEFAULT_BOARD_WIDTH_MM,
      height: DEFAULT_BOARD_HEIGHT_MM,
    };
  }

  let minX = poly.outer[0].x;
  let maxX = poly.outer[0].x;
  let minY = poly.outer[0].y;
  let maxY = poly.outer[0].y;

  for (const pt of poly.outer) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return { minX, minY, maxX, maxY, width, height };
}

function flattenDrills(parsedDrills: { holes: DrillHole[] }[]): DrillHole[] {
  const out: DrillHole[] = [];
  for (const d of parsedDrills) {
    for (const h of d.holes) {
      out.push(h);
    }
  }
  return out;
}
