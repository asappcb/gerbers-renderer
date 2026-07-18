import { RenderPass, VisibilityState, OverlayApi, Overlay, Marker } from './core/renderContract';
import { CameraState } from './core/viewportTransform';
import { OverlayRegistry } from './overlayRegistry';
import { ViewerEvents } from './viewerEvents';
import { VisibilityManager } from './visibilityManager';
export declare class Viewer {
    private canvas;
    private ctx;
    private xform;
    private visibility;
    private passes;
    private scheduler;
    private overlays;
    private overlayApi;
    private resizeObserver;
    private boardBounds;
    private markers;
    private markerPicker;
    private selectedMarkerId;
    private hoverMarkerId;
    private events;
    on: <K extends keyof ViewerEvents>(event: K, cb: (payload: ViewerEvents[K]) => void) => import('./events').Unsubscribe;
    once: <K extends keyof ViewerEvents>(event: K, cb: (payload: ViewerEvents[K]) => void) => import('./events').Unsubscribe;
    off: <K extends keyof ViewerEvents>(event: K, cb: (payload: ViewerEvents[K]) => void) => void;
    private emit;
    private setHoverMarker;
    constructor(canvas: HTMLCanvasElement, initialCamera: CameraState);
    private setupResizeHandling;
    /** Tear down observers and cancel any pending frame. Call when removing the viewer. */
    dispose(): void;
    /** The single visibility manager the render passes read from. */
    getVisibilityManager(): VisibilityManager;
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
    setGerberVisibility(layer: keyof VisibilityState['gerber'], visible: boolean): void;
    setOverlayVisibility(id: string, visible: boolean): void;
    setMarkersVisibility(visible: boolean): void;
    toggleGerberLayer(layer: keyof VisibilityState['gerber']): void;
    toggleOverlay(id: string): void;
    toggleMarkers(): void;
    applyVisibilityPreset(preset: 'all' | 'none' | 'copper-only' | 'minimal'): void;
    onVisibilityChange(callback: (state: VisibilityState) => void): () => void;
    getOverlayApi(): OverlayApi;
    screenToBoard(screenX: number, screenY: number): import('..').Vec2;
    boardToScreen(boardX: number, boardY: number): import('..').Vec2;
    private eventToCanvasPx;
    private emitViewChange;
    private createRenderCtx;
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
    getOverlayRegistry(): OverlayRegistry;
    addMarker(marker: Marker): void;
    addMarkers(markers: Marker[]): void;
    removeMarker(id: string): void;
    updateMarker(id: string, updates: Partial<Marker>): void;
    getMarker(id: string): Marker | undefined;
    listMarkers(): Marker[];
    clearMarkers(): void;
    pickMarker(x_px: number, y_px: number, pickRadius_px?: number): import('..').MarkerHit | null;
    selectMarker(id: string | null, opts?: {
        center?: boolean;
        animate?: boolean;
    }): void;
    getSelectedMarker(): Marker | null;
    getMarkerState(): {
        selectedId: string | null;
        hoverId: string | null;
    };
    handleMouseMove(ev: MouseEvent): void;
    handleMouseClick(ev: MouseEvent): void;
    setupEventListeners(): void;
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
