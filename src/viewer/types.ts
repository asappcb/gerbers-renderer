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
