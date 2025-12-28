// src/types/pcb-model.ts

export type PcbSide = "top" | "bottom";
export type PcbLayerKind = "copper" | "soldermask" | "silkscreen" | "outline";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Polygon {
  outer: Vec2[];
  holes: Vec2[][];
}

export interface LayerGeometry {
  name: string;
  side: PcbSide | null;
  kind: PcbLayerKind;
  polygons: Polygon[];
}

export interface DrillHole {
  x: number;        // mm
  y: number;        // mm
  diameter: number; // mm
  plated: boolean;
}

export interface PcbModelGeometry {
  widthMm: number;
  heightMm: number;
  thicknessMm: number;

  copperLayers: LayerGeometry[];
  maskLayers: LayerGeometry[];
  silkLayers: LayerGeometry[];
  outline: LayerGeometry | null;
  drills: DrillHole[];
}
