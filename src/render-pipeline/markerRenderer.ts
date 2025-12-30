import { RenderCtx } from './core/renderContract';
import { MarkerStore } from './markerStore';

export class MarkerRenderer {
  constructor(private store: MarkerStore) {}

  draw(rc: RenderCtx, opts?: { selectedId?: string | null; hoverId?: string | null }) {
    const markers = this.store.list();

    // draw in screen space
    rc.ctx.setTransform(1, 0, 0, 1, 0, 0);

    const { width_px, height_px } = rc.viewport;

    // constant pixel radius
    const r_px = 4;

    for (const m of markers) {
      const p = rc.boardToScreen({ x: m.x_mm, y: m.y_mm });
      const x = p.x;
      const y = p.y;

      // cheap cull (with padding)
      if (x < -10 || y < -10 || x > width_px + 10 || y > height_px + 10) continue;

      // Set default styling based on severity
      this.applyMarkerStyling(rc.ctx, m, opts?.selectedId === m.id, opts?.hoverId === m.id);

      rc.ctx.beginPath();
      rc.ctx.arc(x, y, r_px, 0, Math.PI * 2);

      // Optional: different fill/stroke for selection/hover
      if (opts?.selectedId === m.id) {
        rc.ctx.lineWidth = 2;
        rc.ctx.stroke();
      } else {
        rc.ctx.fill();
      }
    }
  }

  private applyMarkerStyling(ctx: CanvasRenderingContext2D, marker: any, isSelected: boolean, isHovered: boolean) {
    // Default neutral styling - can be overridden with theme system
    if (isSelected) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; // Blue for selected
      ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
    } else if (isHovered) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.8)'; // Orange for hover
      ctx.strokeStyle = 'rgba(245, 158, 11, 1)';
    } else {
      // Style by severity
      switch (marker.severity) {
        case 'error':
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // Red
          break;
        case 'warning':
          ctx.fillStyle = 'rgba(245, 158, 11, 0.8)'; // Orange
          break;
        case 'info':
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; // Blue
          break;
        default:
          ctx.fillStyle = 'rgba(107, 114, 128, 0.8)'; // Gray
          break;
      }
    }
  }
}
