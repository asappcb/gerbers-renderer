import { RenderCtx } from './core/renderContract';
import { MarkerStore } from './markerStore';
export declare class MarkerRenderer {
    private store;
    constructor(store: MarkerStore);
    draw(rc: RenderCtx, opts?: {
        selectedId?: string | null;
        hoverId?: string | null;
    }): void;
    private applyMarkerStyling;
}
