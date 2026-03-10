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
    outline_loops_mm?: Array<Array<{
        x: number;
        y: number;
    }>>;
};
export type ViewerLayers = Partial<{
    top_copper: string;
    bottom_copper: string;
    top_mask: string;
    bottom_mask: string;
    top_silk: string;
    bottom_silk: string;
    inner_copper: string[];
    drills: string;
    vias: string;
    top_board_mask: string;
    bottom_board_mask: string;
}>;
export type ViewerSideMode = "top" | "bottom";
