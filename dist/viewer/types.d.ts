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
    top_copper: string;
    bottom_copper: string;
    top_mask: string;
    bottom_mask: string;
    top_silk: string;
    bottom_silk: string;
    drills: string;
    vias: string;
    top_board_mask: string;
    bottom_board_mask: string;
}>;
export type ViewerSideMode = "top" | "bottom";
export type BoardViewer = {
    setData: (data: {
        boardGeom: BoardGeom;
        layers: ViewerLayers;
    }) => void;
    setSideMode: (mode: ViewerSideMode) => void;
    fit: () => void;
    dispose: () => void;
};
