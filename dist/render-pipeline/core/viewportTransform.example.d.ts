import { CameraState, Vec2 } from './viewportTransform';
/**
 * Example showing how to integrate ViewportTransform with canvas rendering
 */
export declare class CanvasRenderer {
    private canvas;
    private ctx;
    private transform;
    constructor(canvas: HTMLCanvasElement, initialCamera: CameraState);
    private updateViewport;
    setCamera(camera: Partial<CameraState>): void;
    getCamera(): Required<CameraState>;
    /**
     * Convert screen coordinates to board coordinates
     * Useful for mouse interactions, picking, etc.
     */
    screenToBoard(screenX: number, screenY: number): Vec2;
    /**
     * Convert board coordinates to screen coordinates
     * Useful for overlays, tooltips, etc.
     */
    boardToScreen(boardX: number, boardY: number): Vec2;
    /**
     * Main render method - applies the transform and draws content
     */
    render(): void;
    private drawGrid;
    private drawSampleGeometry;
    private drawOverlays;
    /**
     * Handle mouse wheel for zooming
     */
    handleWheel(event: WheelEvent): void;
    /**
     * Handle mouse drag for panning
     */
    private isDragging;
    private lastScreenPos;
    handleMouseDown(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
    handleMouseUp(): void;
}
/**
 * Example usage:
 *
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement;
 * const renderer = new CanvasRenderer(canvas, {
 *   center_mm: { x: 0, y: 0 },
 *   zoom: 10,
 *   rotation_rad: 0
 * });
 *
 * // Add event listeners
 * canvas.addEventListener('wheel', (e) => renderer.handleWheel(e));
 * canvas.addEventListener('mousedown', (e) => renderer.handleMouseDown(e));
 * canvas.addEventListener('mousemove', (e) => renderer.handleMouseMove(e));
 * canvas.addEventListener('mouseup', () => renderer.handleMouseUp());
 *
 * // Programmatic camera updates
 * renderer.setCamera({
 *   center_mm: { x: 50, y: 25 },
 *   zoom: 20,
 *   rotation_rad: Math.PI / 4
 * });
 */
