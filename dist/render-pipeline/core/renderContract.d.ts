import { ViewportTransform, Vec2 } from './viewportTransform';
export type RenderCtx = {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    viewport: {
        width_px: number;
        height_px: number;
    };
    xform: ViewportTransform;
    now_ms: number;
    visibility: VisibilityState;
    boardToScreen: (p: Vec2) => Vec2;
    screenToBoard: (p: Vec2) => Vec2;
};
export type RenderPass = {
    id: string;
    order: number;
    enabled: () => boolean;
    draw: (rc: RenderCtx) => void;
};
export type VisibilityState = {
    gerber: {
        copper: boolean;
        solderMask: boolean;
        silk: boolean;
        outline: boolean;
    };
    overlays: Record<string, boolean>;
    markers: boolean;
};
export declare const RENDER_ORDER: {
    readonly BASE_GERBER_MIN: 0;
    readonly BASE_GERBER_MAX: 99;
    readonly OVERLAYS_MIN: 100;
    readonly OVERLAYS_MAX: 199;
    readonly MARKERS_MIN: 200;
    readonly MARKERS_MAX: 299;
    readonly SELECTION_MIN: 300;
    readonly SELECTION_MAX: 399;
};
