export declare class RenderScheduler {
    private onFrame;
    private pending;
    private reasons;
    private rafId;
    constructor(onFrame: (reasons: string[]) => void);
    requestRender(reason?: string): void;
    isPending(): boolean;
    getPendingReasons(): string[];
    /** Cancel any pending frame. Call on teardown to avoid rendering a disposed viewer. */
    cancel(): void;
}
