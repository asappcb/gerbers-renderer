import { RenderPass, VisibilityState } from './core/renderContract';
import { CameraState } from './core/viewportTransform';
export declare class Viewer {
    private canvas;
    private ctx;
    private xform;
    private visibility;
    private passes;
    private scheduler;
    private visibilityGetter;
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
