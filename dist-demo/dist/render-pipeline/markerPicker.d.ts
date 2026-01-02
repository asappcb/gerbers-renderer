import { RenderCtx, MarkerHit } from './core/renderContract';
import { MarkerStore } from './markerStore';
export declare class MarkerPicker {
    private store;
    constructor(store: MarkerStore);
    pick(rc: RenderCtx, x_px: number, y_px: number, pickRadius_px?: number): MarkerHit | null;
}
