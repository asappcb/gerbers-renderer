import { RenderPass } from './core/renderContract';
import { MarkerStore } from './markerStore';
export declare function createMarkerPass(markerStore: MarkerStore, getMarkerState: () => {
    selectedId?: string | null;
    hoverId?: string | null;
}): RenderPass;
