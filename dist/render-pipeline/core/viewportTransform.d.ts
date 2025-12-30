export type Vec2 = {
    x: number;
    y: number;
};
export type CameraState = {
    center_mm: Vec2;
    zoom: number;
    rotation_rad?: number;
    mirrorX?: boolean;
    mirrorY?: boolean;
};
export type Viewport = {
    width_px: number;
    height_px: number;
};
export type Mat3 = [number, number, number, number, number, number, number, number, number];
export declare class ViewportTransform {
    private camera;
    private viewport;
    private worldToScreenMat;
    private screenToWorldMat;
    constructor(camera: CameraState, viewport: Viewport);
    setCamera(camera: Partial<CameraState>): void;
    setViewport(viewport: Viewport): void;
    getCamera(): Required<CameraState>;
    getViewport(): Viewport;
    getWorldToScreenMatrix(): Mat3;
    getScreenToWorldMatrix(): Mat3;
    boardToScreen(p_mm: Vec2): Vec2;
    screenToBoard(p_px: Vec2): Vec2;
    private recompute;
}
