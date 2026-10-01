import { RenderCtx, RenderPass, VisibilityState, RENDER_ORDER } from './core/renderContract';

// NOTE: the marker and overlay systems live in their dedicated modules
// (markerStore/markerRenderer/markerPass/markerPicker and
// overlayRegistry/overlayPass). This file only holds the base Gerber pass and
// the selection pass.

// Base Gerber Passes
export function createGerberPass(
  id: string,
  order: number,
  layerType: keyof VisibilityState['gerber'],
  drawLayer: (ctx: CanvasRenderingContext2D) => void
): RenderPass {
  return {
    id: `gerber:${id}`,
    order,
    enabled: (rc: RenderCtx) => rc.visibility.gerber[layerType],
    draw: (rc) => {
      const ctx = rc.ctx;
      const m = rc.xform.getWorldToScreenMatrix();

      // Set transform to draw in board coordinates (mm)
      ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

      // Draw the layer
      drawLayer(ctx);
    },
  };
}

// Selection System
export interface Selection {
  type: 'marker' | 'geometry' | 'region';
  id?: string;
  bounds?: { min: { x: number; y: number }; max: { x: number; y: number } };
}

export class SelectionRenderer {
  /**
   * @param getMarkerPosition optional lookup returning a marker's board-space
   *   position (mm) by id, so a marker selection can be highlighted where the
   *   marker actually is.
   */
  constructor(private getMarkerPosition?: (id: string) => { x: number; y: number } | undefined) {}

  draw(rc: RenderCtx, selection: Selection | null) {
    if (!selection) return;

    const ctx = rc.ctx;

    switch (selection.type) {
      case 'marker':
        this.drawMarkerSelection(ctx, rc, selection.id);
        break;
      case 'geometry':
        // No geometry registry is wired up; nothing to highlight.
        break;
      case 'region':
        this.drawRegionSelection(ctx, rc, selection.bounds);
        break;
    }
  }

  private drawMarkerSelection(ctx: CanvasRenderingContext2D, rc: RenderCtx, markerId?: string) {
    if (!markerId || !this.getMarkerPosition) return;
    const pos = this.getMarkerPosition(markerId);
    if (!pos) return;

    // Highlight the marker where it actually sits (screen space).
    const screen = rc.boardToScreen(pos);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  private drawRegionSelection(ctx: CanvasRenderingContext2D, rc: RenderCtx, bounds?: { min: { x: number; y: number }; max: { x: number; y: number } }) {
    if (!bounds) return;

    // Draw selection rectangle in board coordinates
    const m = rc.xform.getWorldToScreenMatrix();
    ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

    ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.lineWidth = 0.5; // In board coordinates
    ctx.strokeRect(
      bounds.min.x,
      bounds.min.y,
      bounds.max.x - bounds.min.x,
      bounds.max.y - bounds.min.y
    );
  }
}

export function createSelectionPass(renderer: SelectionRenderer, getSelection: () => Selection | null): RenderPass {
  return {
    id: "selection",
    order: (RENDER_ORDER.SELECTION_MIN + RENDER_ORDER.SELECTION_MAX) / 2,
    enabled: (_rc: RenderCtx) => true, // Selection is always enabled when present
    draw: (rc) => {
      const selection = getSelection();
      if (!selection) return;
      renderer.draw(rc, selection);
    },
  };
}
