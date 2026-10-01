export type BoardGeom = {
  board: {
    width_in: number;
    height_in: number;
    mm_bounds: {
      min_x_mm: number;
      min_y_mm: number;
      max_x_mm: number;
      max_y_mm: number;
    };
  };
  /** Actual board outline polygon loops in Gerber mm coordinates (Y-up).
   *  When present, use these for board clipping instead of the bounding box. */
  outline_loops_mm?: Array<Array<{ x: number; y: number }>>;
  /** Number of copper layers detected (1 for single-sided, 2 for standard, N for multilayer). */
  layer_count?: number;
};

/** A single copper layer within the board stackup, ordered top (index 0) to bottom. */
export type CopperLayer = {
  /** Stable id: "cu.top", "cu.in1" … "cu.bottom". */
  id: string;
  /** Physical position: 0 = top … N-1 = bottom. */
  index: number;
  role: "top" | "inner" | "bottom";
  /** Display label, e.g. "Top", "Inner 1", "Bottom". */
  name: string;
  /** Rendered layer blob URL (browser path). */
  url: string;
  color: string;
};

/**
 * First-class ordered board stackup. Copper layers are ordered top→bottom.
 * Non-copper layers (mask/silk/paste) only exist for the two outer sides.
 * This is the canonical multilayer structure; `ViewerLayers` remains for
 * backward compatibility and is derived from / kept in sync with this.
 */
export type BoardStackup = {
  /** Ordered top→bottom, length ≥ 1. */
  copper: CopperLayer[];
  top?: { mask?: string; silk?: string; paste?: string };
  bottom?: { mask?: string; silk?: string; paste?: string };
  /** Through-hole drills (span the whole stack). */
  drills?: string;
  vias?: string;
};

export type ViewerLayers = Partial<{
  // Base + copper
  top_copper: string;       // blob url
  bottom_copper: string;

  // Optional
  top_mask: string;
  bottom_mask: string;
  top_silk: string;
  bottom_silk: string;
  top_paste: string;
  bottom_paste: string;

  // Inner copper (ordered inner-1 nearest top to inner-N nearest bottom)
  inner_copper: string[];

  // Overlays
  drills: string;
  vias: string;

  // Masks for CSS clip
  top_board_mask: string;
  bottom_board_mask: string;
}>;

export type ViewerSideMode = "top" | "bottom";

/** A pickable board feature, in world coordinates (Y-flipped to viewer space). */
export type PadFeature = {
  kind: "pad";
  layer: string;       // copper layer id, e.g. "cu.top"
  x_mm: number;
  y_mm: number;
  w_mm: number;
  h_mm: number;
  shape: string;       // "C" | "R" | "O" | ...
};
export type HoleFeature = {
  kind: "hole";
  x_mm: number;
  y_mm: number;
  diameter_mm: number;
};
export type TraceFeature = {
  kind: "trace";
  layer: string;
  x1_mm: number;
  y1_mm: number;
  x2_mm: number;
  y2_mm: number;
  width_mm: number;
};
export type BoardFeature = PadFeature | HoleFeature | TraceFeature;

export type BoardStats = {
  widthMm: number;
  heightMm: number;
  copperLayers: number;
  padCount: number;
  holeCount: number;
  /** Unique drill diameters (mm), sorted ascending. */
  drillSizesMm: number[];
  /** Smallest trace width seen (mm), if any traces. */
  minTraceWidthMm?: number;
};

/** Parsed geometry + summary stats, for inspection / measurement / connectivity. */
export type BoardGeometry = {
  features: BoardFeature[];
  stats: BoardStats;
};
