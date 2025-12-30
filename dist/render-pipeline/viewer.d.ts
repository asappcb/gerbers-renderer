import { RenderPass, VisibilityState, Overlay } from './core/renderContract';
import { CameraState } from './core/viewportTransform';
import { OverlayRegistry } from './overlayRegistry';
export declare class Viewer {
    private canvas;
    private ctx;
    private xform;
    private visibility;
    private passes;
    private scheduler;
    private visibilityGetter;
    private overlays;
    private overlayApi;
    private boardBounds;
    constructor(canvas: HTMLCanvasElement, initialCamera: CameraState);
    setVisibilityGetter(getVisibility: () => VisibilityState): void;
    private setupResizeHandling;
    private registerDefaultPasses;
    addPass(pass: RenderPass): void;
    removePass(id: string): boolean;
    getPass(id: string): RenderPass | undefined;
    requestRender(reason: string): void;
    render(): void;
    setCamera(camera: Partial<CameraState>): void;
    getCamera(): Required<CameraState>;
    setVisibility(visibility: Partial<VisibilityState>): void;
    getVisibility(): VisibilityState;
    screenToBoard(screenX: number, screenY: number): import('..').Vec2;
    boardToScreen(boardX: number, boardY: number): import('..').Vec2;
    setBoardBounds(bounds: {
        minX_mm: number;
        minY_mm: number;
        maxX_mm: number;
        maxY_mm: number;
    }): void;
    addOverlayLayer(overlay: Omit<Overlay, "id"> & {
        id: string;
    }): void;
    removeOverlay(id: string): void;
    setOverlayVisibility(id: string, visible: boolean): void;
    getOverlayRegistry(): OverlayRegistry;
    getDebugInfo(): {
        passes: {
            id: string;
            order: number;
            enabled: boolean;
        }[];
        pendingRender: boolean;
        pendingReasons: string[];
        camera: Required<CameraState>;
        visibility: VisibilityState;
    };
}
