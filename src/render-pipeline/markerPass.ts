import { RenderPass, RenderCtx, RENDER_ORDER } from './core/renderContract';
import { MarkerStore } from './markerStore';
import { MarkerRenderer } from './markerRenderer';

export function createMarkerPass(
  markerStore: MarkerStore, 
  getMarkerState: () => { selectedId?: string | null; hoverId?: string | null }
): RenderPass {
  const renderer = new MarkerRenderer(markerStore);

  return {
    id: "markers",
    order: RENDER_ORDER.MARKERS_MIN,
    enabled: () => true, // Visibility is handled in the draw function
    draw: (rc: RenderCtx) => {
      if (!rc.visibility.markers) return; // Early exit if markers are disabled
      
      const state = getMarkerState();
      
      renderer.draw(rc, {
        selectedId: state.selectedId,
        hoverId: state.hoverId,
        boardBounds: rc.boardBounds,
      });
    },
  };
}
