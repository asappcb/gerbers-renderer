import { RenderCtx, RenderPass, VisibilityState, RENDER_ORDER, OverlayApi } from './core/renderContract';
import { ViewportTransform, Vec2 } from './core/viewportTransform';

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

// Overlay System
export interface Overlay {
  id: string;
  visible: boolean;
  zIndex: number;
  draw: (ctx: CanvasRenderingContext2D, helpers: OverlayHelpers) => void;
}

export interface OverlayHelpers {
  boardToScreen: (p: { x: number; y: number }) => { x: number; y: number };
  screenToBoard: (p: { x: number; y: number }) => { x: number; y: number };
  xform: ViewportTransform;
  view: ReturnType<ViewportTransform['getCamera']>;
}

export class OverlayRegistry {
  private overlays = new Map<string, Overlay>();

  add(overlay: Overlay) {
    this.overlays.set(overlay.id, overlay);
  }

  remove(id: string): boolean {
    return this.overlays.delete(id);
  }

  get(id: string): Overlay | undefined {
    return this.overlays.get(id);
  }

  getSortedVisible(): Overlay[] {
    return Array.from(this.overlays.values())
      .filter(overlay => overlay.visible)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  setVisible(id: string, visible: boolean) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.visible = visible;
    }
  }

  getAll(): Overlay[] {
    return Array.from(this.overlays.values());
  }
}

export function createOverlayPass(registry: OverlayRegistry, overlayApi: OverlayApi): RenderPass {
  return {
    id: "overlay:all",
    order: (RENDER_ORDER.OVERLAYS_MIN + RENDER_ORDER.OVERLAYS_MAX) / 2,
    enabled: (rc: RenderCtx) => true,
    draw: (rc) => {
      // Get all overlays and filter by visibility manager state
      const overlays = registry.getAll();
      const visibleOverlays = overlays.filter(overlay => {
        const isVisible = rc.visibility.overlays[overlay.id] ?? overlay.visible;
        return isVisible;
      });
      
      // Sort by zIndex and draw
      visibleOverlays.sort((a, b) => a.zIndex - b.zIndex);
      
      // Create OverlayHelpers for overlays
      const helpers = {
        boardToScreen: rc.boardToScreen,
        screenToBoard: rc.screenToBoard,
        xform: rc.xform,
        view: rc.xform.getCamera(),
      };
      
      for (const overlay of visibleOverlays) {
        rc.ctx.save();
        overlay.draw(rc.ctx, helpers);
        rc.ctx.restore();
      }
    },
  };
}

// Marker System
export interface Marker {
  id: string;
  position: { x: number; y: number }; // Board coordinates (mm)
  type: 'via' | 'pad' | 'component' | 'testpoint' | 'custom';
  data?: any;
}

export class MarkerRenderer {
  private markers = new Map<string, Marker>();

  add(marker: Marker) {
    this.markers.set(marker.id, marker);
  }

  remove(id: string): boolean {
    return this.markers.delete(id);
  }

  get(id: string): Marker | undefined {
    return this.markers.get(id);
  }

  getAll(): Marker[] {
    return Array.from(this.markers.values());
  }

  clear() {
    this.markers.clear();
  }

  draw(rc: RenderCtx) {
    const ctx = rc.ctx;
    const zoom = rc.xform.getCamera().zoom;
    
    // LOD: hide markers when zoomed out too far
    const minZoom = 2; // pixels per mm
    if (zoom < minZoom) return;

    // Set transform for screen-space drawing (markers are screen-space sized)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    for (const marker of this.markers.values()) {
      const screenPos = rc.boardToScreen(marker.position);
      
      // Skip if outside viewport
      if (screenPos.x < -10 || screenPos.x > rc.viewport.width_px + 10 ||
          screenPos.y < -10 || screenPos.y > rc.viewport.height_px + 10) {
        continue;
      }

      this.drawMarker(ctx, screenPos, marker, zoom);
    }
  }

  private drawMarker(ctx: CanvasRenderingContext2D, screenPos: { x: number; y: number }, marker: Marker, zoom: number) {
    const radius = Math.max(3, Math.min(8, zoom / 5)); // Scale with zoom but clamp
    
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
    
    // Color by type
    switch (marker.type) {
      case 'via':
        ctx.fillStyle = 'rgba(0, 100, 200, 0.8)';
        break;
      case 'pad':
        ctx.fillStyle = 'rgba(200, 100, 0, 0.8)';
        break;
      case 'component':
        ctx.fillStyle = 'rgba(0, 200, 100, 0.8)';
        break;
      case 'testpoint':
        ctx.fillStyle = 'rgba(200, 0, 100, 0.8)';
        break;
      default:
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
    }
    
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export function createMarkerPass(renderer: MarkerRenderer): RenderPass {
  return {
    id: "markers",
    order: (RENDER_ORDER.MARKERS_MIN + RENDER_ORDER.MARKERS_MAX) / 2,
    enabled: (rc: RenderCtx) => rc.visibility.markers,
    draw: (rc) => renderer.draw(rc),
  };
}

// Selection System
export interface Selection {
  type: 'marker' | 'geometry' | 'region';
  id?: string;
  bounds?: { min: { x: number; y: number }; max: { x: number; y: number } };
}

export class SelectionRenderer {
  draw(rc: RenderCtx, selection: Selection | null) {
    if (!selection) return;

    const ctx = rc.ctx;
    
    switch (selection.type) {
      case 'marker':
        this.drawMarkerSelection(ctx, rc, selection.id);
        break;
      case 'geometry':
        this.drawGeometrySelection(ctx, rc, selection.id);
        break;
      case 'region':
        this.drawRegionSelection(ctx, rc, selection.bounds);
        break;
    }
  }

  private drawMarkerSelection(ctx: CanvasRenderingContext2D, rc: RenderCtx, markerId?: string) {
    // This would highlight a specific marker
    // For now, draw a generic highlight
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 100, 100);
  }

  private drawGeometrySelection(ctx: CanvasRenderingContext2D, rc: RenderCtx, geometryId?: string) {
    // This would highlight specific geometry
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 10, 100, 100);
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
    enabled: (rc: RenderCtx) => true, // Selection is always enabled when present
    draw: (rc) => {
      const selection = getSelection();
      if (!selection) return;
      renderer.draw(rc, selection);
    },
  };
}
