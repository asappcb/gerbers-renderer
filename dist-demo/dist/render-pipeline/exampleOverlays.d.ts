import { Overlay } from './core/renderContract';
export declare function createViolationDotsOverlay(): Overlay;
export declare function createTooltipOverlay(getTooltip: () => {
    text: string;
    x_px: number;
    y_px: number;
} | null): Overlay;
export declare function createGridOverlay(spacingMm?: number): Overlay;
export declare function createPulsingMarkerOverlay(position: {
    x_mm: number;
    y_mm: number;
}): Overlay;
