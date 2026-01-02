import { RenderCtx, RenderPass, VisibilityState, OverlayApi } from './core/renderContract';
import { ViewportTransform } from './core/viewportTransform';
export declare function createGerberPass(id: string, order: number, layerType: keyof VisibilityState['gerber'], drawLayer: (ctx: CanvasRenderingContext2D) => void): RenderPass;
export interface Overlay {
    id: string;
    visible: boolean;
    zIndex: number;
    draw: (ctx: CanvasRenderingContext2D, helpers: OverlayHelpers) => void;
}
export interface OverlayHelpers {
    boardToScreen: (p: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    screenToBoard: (p: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    xform: ViewportTransform;
    view: ReturnType<ViewportTransform['getCamera']>;
}
export declare class OverlayRegistry {
    private overlays;
    add(overlay: Overlay): void;
    remove(id: string): boolean;
    get(id: string): Overlay | undefined;
    getSortedVisible(): Overlay[];
    setVisible(id: string, visible: boolean): void;
    getAll(): Overlay[];
}
export declare function createOverlayPass(registry: OverlayRegistry, overlayApi: OverlayApi): RenderPass;
export interface Marker {
    id: string;
    position: {
        x: number;
        y: number;
    };
    type: 'via' | 'pad' | 'component' | 'testpoint' | 'custom';
    data?: any;
}
export declare class MarkerRenderer {
    private markers;
    add(marker: Marker): void;
    remove(id: string): boolean;
    get(id: string): Marker | undefined;
    getAll(): Marker[];
    clear(): void;
    draw(rc: RenderCtx): void;
    private drawMarker;
}
export declare function createMarkerPass(renderer: MarkerRenderer): RenderPass;
export interface Selection {
    type: 'marker' | 'geometry' | 'region';
    id?: string;
    bounds?: {
        min: {
            x: number;
            y: number;
        };
        max: {
            x: number;
            y: number;
        };
    };
}
export declare class SelectionRenderer {
    draw(rc: RenderCtx, selection: Selection | null): void;
    private drawMarkerSelection;
    private drawGeometrySelection;
    private drawRegionSelection;
}
export declare function createSelectionPass(renderer: SelectionRenderer, getSelection: () => Selection | null): RenderPass;
