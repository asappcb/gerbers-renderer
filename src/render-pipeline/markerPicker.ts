import { RenderCtx, MarkerHit } from './core/renderContract';
import { MarkerStore } from './markerStore';

export class MarkerPicker {
  constructor(private store: MarkerStore) {}

  pick(rc: RenderCtx, x_px: number, y_px: number, pickRadius_px = 10): MarkerHit | null {
    const board = rc.screenToBoard({ x: x_px, y: y_px });
    const zoom = rc.xform.getCamera().zoom;
    const radius_mm = pickRadius_px / zoom;

    const candidates = this.store.queryNear(board.x, board.y, radius_mm);

    let best: MarkerHit | null = null;
    for (const m of candidates) {
      const sp = rc.boardToScreen({ x: m.x_mm, y: m.y_mm });
      const dx = sp.x - x_px;
      const dy = sp.y - y_px;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist <= pickRadius_px && (!best || dist < best.distance_px)) {
        best = { id: m.id, marker: m, distance_px: dist };
      }
    }
    return best;
  }
}
