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

  // Overlays
  drills: string;
  vias: string;

  // Masks for CSS clip
  top_board_mask: string;
  bottom_board_mask: string;
}>;

export type ViewerSideMode = "top" | "bottom";

export type BoardViewer = {
  setData: (data: { boardGeom: BoardGeom; layers: ViewerLayers }) => void;
  setSideMode: (mode: ViewerSideMode) => void;
  fit: () => void;
  dispose: () => void;
};
