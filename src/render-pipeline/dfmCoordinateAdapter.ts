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
  x_mm: number;  // Absolute Gerber X coordinate
  y_mm: number;  // Absolute Gerber Y coordinate (+Y up)
}

export interface BoardPoint {
  x_mm: number;  // Board X coordinate (+Y down)
  y_mm: number;  // Board Y coordinate (+Y down)
}

/**
 * Converts DFM coordinates to board coordinates.
 * 
 * @param dfmPoint - DFM point in absolute Gerber coordinates (+Y up)
 * @param bounds - Board bounds in mm (true Gerber-space bounds)
 * @returns Board point in renderer coordinates (+Y down)
 */
export function dfmToBoardCoordinates(dfmPoint: DfmPoint, bounds: BoardBounds): BoardPoint {
  return {
    x_mm: dfmPoint.x_mm - bounds.minX_mm,
    y_mm: bounds.maxY_mm - dfmPoint.y_mm,
  };
}

/**
 * Checks if a board point is outside the board outline.
 * 
 * @param boardPoint - Board point in renderer coordinates
 * @param bounds - Board bounds in mm
 * @returns true if the point is outside the board outline
 */
export function isPointOffBoard(boardPoint: BoardPoint, bounds: BoardBounds): boolean {
  const boardWidth = bounds.maxX_mm - bounds.minX_mm;
  const boardHeight = bounds.maxY_mm - bounds.minY_mm;
  
  return boardPoint.x_mm < 0 || 
         boardPoint.x_mm > boardWidth || 
         boardPoint.y_mm < 0 || 
         boardPoint.y_mm > boardHeight;
}

/**
 * Converts DFM coordinates to board coordinates and determines if the point is off-board.
 * 
 * @param dfmPoint - DFM point in absolute Gerber coordinates (+Y up)
 * @param bounds - Board bounds in mm
 * @returns Object with board coordinates and off-board flag
 */
export function adaptDfmPoint(dfmPoint: DfmPoint, bounds: BoardBounds): {
  boardPoint: BoardPoint;
  isOffBoard: boolean;
} {
  const boardPoint = dfmToBoardCoordinates(dfmPoint, bounds);
  const isOffBoard = isPointOffBoard(boardPoint, bounds);
  
  return { boardPoint, isOffBoard };
}
