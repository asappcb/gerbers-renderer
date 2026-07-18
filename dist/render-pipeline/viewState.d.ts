export interface ViewState {
    /** Schema version. */
    v: 1;
    side: "top" | "bottom";
    /** Camera: center (mm), zoom (px/mm), rotation (rad). */
    cam: {
        x: number;
        y: number;
        zoom: number;
        rot?: number;
    };
    /** Per-layer visibility overrides, keyed by layer id. */
    visible?: Record<string, boolean>;
    grid?: boolean;
    units?: "mm" | "in";
}
/** Encode a view state to a compact URL-safe string. */
export declare function encodeViewState(state: ViewState): string;
/** Decode a view state string; returns null if malformed. */
export declare function decodeViewState(encoded: string): ViewState | null;
