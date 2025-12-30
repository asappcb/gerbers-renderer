export declare class RenderScheduler {
    private onFrame;
    private pending;
    private reasons;
    constructor(onFrame: (reasons: string[]) => void);
    requestRender(reason?: string): void;
    isPending(): boolean;
    getPendingReasons(): string[];
}
