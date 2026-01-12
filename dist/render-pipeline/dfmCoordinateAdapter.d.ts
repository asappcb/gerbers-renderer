/**
 * DFM Coordinate Adapter
 *
 * Converts DFM points from absolute Gerber coordinates (+Y up, arbitrary origin)
 * to board coordinates (+Y down, top-left origin) used by the renderer.
 */
export interface BoardBounds {
    minX_mm: number;
    minY_mm: number;
    maxX_mm: number;
    maxY_mm: number;
}
export interface DfmPoint {
    x_mm: number;
    y_mm: number;
}
export interface BoardPoint {
    x_mm: number;
    y_mm: number;
}
/**
 * Converts DFM coordinates to board coordinates.
 *
 * @param dfmPoint - DFM point in absolute Gerber coordinates (+Y up)
 * @param bounds - Board bounds in mm (true Gerber-space bounds)
 * @returns Board point in renderer coordinates (+Y down)
 */
export declare function dfmToBoardCoordinates(dfmPoint: DfmPoint, bounds: BoardBounds): BoardPoint;
/**
 * Checks if a board point is outside the board outline.
 *
 * @param boardPoint - Board point in renderer coordinates
 * @param bounds - Board bounds in mm
 * @returns true if the point is outside the board outline
 */
export declare function isPointOffBoard(boardPoint: BoardPoint, bounds: BoardBounds): boolean;
/**
 * Converts DFM coordinates to board coordinates and determines if the point is off-board.
 *
 * @param dfmPoint - DFM point in absolute Gerber coordinates (+Y up)
 * @param bounds - Board bounds in mm
 * @returns Object with board coordinates and off-board flag
 */
export declare function adaptDfmPoint(dfmPoint: DfmPoint, bounds: BoardBounds): {
    boardPoint: BoardPoint;
    isOffBoard: boolean;
};
