import { Marker } from './core/renderContract';
import { BoardBounds } from './dfmCoordinateAdapter';
export interface DfmViolation {
    id: string;
    x_mm: number;
    y_mm: number;
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
export declare function convertDfmViolationsToMarkers(violations: DfmViolation[], boardBounds: BoardBounds): Marker[];
/**
 * Utility to add DFM violations to a marker renderer.
 *
 * @param markerRenderer - The marker renderer instance
 * @param violations - Array of DFM violations
 * @param boardBounds - Board bounds in mm
 */
export declare function addDfmViolationsToRenderer(markerRenderer: any, violations: DfmViolation[], boardBounds: BoardBounds): void;
