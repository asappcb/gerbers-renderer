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
  // The renderer works in absolute Gerber-space mm and flips Y for display
  // (world_y = minY + maxY - gerber_y). X is left unchanged. Markers must use
  // the exact same mapping as the layer images or they land in the wrong place.
  return {
    x_mm: dfmPoint.x_mm,
    y_mm: bounds.minY_mm + bounds.maxY_mm - dfmPoint.y_mm,
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
  // boardPoint is in absolute Gerber-space mm (see dfmToBoardCoordinates), so
  // compare against the absolute bounds, not a 0-based width/height.
  return boardPoint.x_mm < bounds.minX_mm ||
         boardPoint.x_mm > bounds.maxX_mm ||
         boardPoint.y_mm < bounds.minY_mm ||
         boardPoint.y_mm > bounds.maxY_mm;
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
