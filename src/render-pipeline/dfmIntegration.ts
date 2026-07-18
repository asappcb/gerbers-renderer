/**
 * DFM Integration Utilities
 * 
 * Helper functions for integrating DFM violations into the gerbers-renderer.
 */

import { Marker } from './core/renderContract';
import { adaptDfmPoint, BoardBounds, DfmPoint } from './dfmCoordinateAdapter';

export interface DfmViolation {
  id: string;
  x_mm: number;  // Absolute Gerber X coordinate
  y_mm: number;  // Absolute Gerber Y coordinate (+Y up)
  severity?: "error" | "warning" | "info";
  message?: string;
  layer?: "top" | "bottom";
  data?: Record<string, any>;
}

/**
 * Converts DFM violations to renderer markers using the coordinate adapter.
 * 
 * @param violations - Array of DFM violations in absolute Gerber coordinates
 * @param boardBounds - Board bounds in mm (true Gerber-space bounds)
 * @returns Array of markers ready for the renderer
 */
export function convertDfmViolationsToMarkers(
  violations: DfmViolation[], 
  boardBounds: BoardBounds
): Marker[] {
  return violations.map(violation => {
    const { boardPoint, isOffBoard } = adaptDfmPoint(
      { x_mm: violation.x_mm, y_mm: violation.y_mm }, 
      boardBounds
    );

    return {
      id: violation.id,
      x_mm: boardPoint.x_mm,
      y_mm: boardPoint.y_mm,
      severity: violation.severity,
      layer: violation.layer,
      data: {
        ...violation.data,
        originalX_mm: violation.x_mm,
        originalY_mm: violation.y_mm,
        isOffBoard,
        message: violation.message,
      },
    };
  });
}

/**
 * Utility to add DFM violations to a marker renderer.
 * 
 * @param markerRenderer - The marker renderer instance
 * @param violations - Array of DFM violations
 * @param boardBounds - Board bounds in mm
 */
export function addDfmViolationsToRenderer(
  markerRenderer: any,
  violations: DfmViolation[],
  boardBounds: BoardBounds
) {
  const markers = convertDfmViolationsToMarkers(violations, boardBounds);

  // The integrated viewer's MarkerRenderer stores markers by board-space
  // `position`, not `{x_mm, y_mm}`. Map to that shape so they actually render.
  markers.forEach(marker => {
    markerRenderer.add({
      id: marker.id,
      position: { x: marker.x_mm, y: marker.y_mm },
      type: 'custom',
      data: marker.data,
    });
  });
}
