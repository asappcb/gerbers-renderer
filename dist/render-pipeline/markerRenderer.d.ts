import { RenderCtx } from './core/renderContract';
import { MarkerStore } from './markerStore';
import { BoardBounds } from './dfmCoordinateAdapter';
export declare class MarkerRenderer {
    private store;
    constructor(store: MarkerStore);
    draw(rc: RenderCtx, opts?: {
        selectedId?: string | null;
        hoverId?: string | null;
        boardBounds?: BoardBounds;
    }): void;
    private applyMarkerStyling;
}
