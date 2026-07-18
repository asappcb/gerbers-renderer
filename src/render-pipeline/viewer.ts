import { RenderScheduler } from './core/renderScheduler';
import { RenderCtx, RenderPass, VisibilityState, RENDER_ORDER, OverlayApi, Overlay, Marker } from './core/renderContract';
import { ViewportTransform, CameraState, Viewport } from './core/viewportTransform';
import { OverlayRegistry } from './overlayRegistry';
import { MarkerStore } from './markerStore';
import { MarkerPicker } from './markerPicker';
import { Emitter } from './events';
import type { ViewerEvents } from './viewerEvents';
import { VisibilityManager } from './visibilityManager';

export class Viewer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private xform: ViewportTransform;
  private visibility: VisibilityManager;
  private passes: RenderPass[] = [];
  private scheduler: RenderScheduler;
  private overlays = new OverlayRegistry();
  private overlayApi: OverlayApi;
  private resizeObserver: ResizeObserver | null = null;
  private boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }; // Default bounds
  
  // Marker system
  private markers = new MarkerStore();
  private markerPicker = new MarkerPicker(this.markers);
  private selectedMarkerId: string | null = null;
  private hoverMarkerId: string | null = null;

  // Event system
  private events = new Emitter<ViewerEvents>();
  on = this.events.on.bind(this.events);
  once = this.events.once.bind(this.events);
  off = this.events.off.bind(this.events);

  private emit<K extends keyof ViewerEvents>(evt: K, payload: ViewerEvents[K]) {
    this.events.emit(evt, payload);
  }

  private setHoverMarker(nextId: string | null) {
    if (nextId === this.hoverMarkerId) return; // no spam
    this.hoverMarkerId = nextId;

    if (nextId) {
      const marker = this.markers.get(nextId);
      this.emit("hover:marker", { markerId: nextId, marker });
    } else {
      this.emit("hover:marker", { markerId: null });
    }

    this.requestRender("hover-change");
  }

  constructor(canvas: HTMLCanvasElement, initialCamera: CameraState) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context');
    this.ctx = ctx;

    // Viewport is the canvas backing store (sized in CSS px by the host),
    // consistent with render()/createRenderCtx().
    const viewport: Viewport = {
      width_px: canvas.width,
      height_px: canvas.height
    };

    this.xform = new ViewportTransform(initialCamera, viewport);
    
    // Initialize visibility manager
    this.visibility = new VisibilityManager();

    this.scheduler = new RenderScheduler(() => this.render());

    // Create stable overlay API
    this.overlayApi = {
      boardToScreen: ({ x_mm, y_mm }) => {
        const p = this.xform.boardToScreen({ x: x_mm, y: y_mm });
        return { x_px: p.x, y_px: p.y };
      },
      screenToBoard: ({ x_px, y_px }) => {
        const p = this.xform.screenToBoard({ x: x_px, y: y_px });
        return { x_mm: p.x, y_mm: p.y };
      },
      getViewState: () => {
        const cam = this.xform.getCamera();
        return { center_mm: cam.center_mm, zoom: cam.zoom, rotation_rad: cam.rotation_rad };
      },
      getViewport: () => ({ width_px: this.canvas.width, height_px: this.canvas.height }),
      getBoardBounds: () => this.boardBounds,
      requestRender: (reason) => this.requestRender(reason),
    };

    // Register default passes
    this.registerDefaultPasses();

    // Handle canvas resize
    this.setupResizeHandling();
  }

  private setupResizeHandling() {
    this.resizeObserver = new ResizeObserver(() => {
      this.requestRender("canvas-resize");
    });
    this.resizeObserver.observe(this.canvas);
  }

  /** Tear down observers and cancel any pending frame. Call when removing the viewer. */
  dispose() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.scheduler.cancel();
    this.passes = [];
  }

  /** The single visibility manager the render passes read from. */
  getVisibilityManager(): VisibilityManager {
    return this.visibility;
  }

  private registerDefaultPasses() {
    // The integrated viewer will register its own passes
    // This base class starts with no passes
  }

  addPass(pass: RenderPass) {
    this.passes.push(pass);
    this.passes.sort((a, b) => a.order - b.order);
    this.requestRender("addPass");
  }

  removePass(id: string): boolean {
    const index = this.passes.findIndex(p => p.id === id);
    if (index >= 0) {
      this.passes.splice(index, 1);
      this.requestRender("removePass");
      return true;
    }
    return false;
  }

  getPass(id: string): RenderPass | undefined {
    return this.passes.find(p => p.id === id);
  }

  requestRender(reason: string) {
    this.scheduler.requestRender(reason);
  }

  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // The viewport is the canvas backing store, in the same pixel space every
    // pass draws into. Keeping this consistent with createRenderCtx() means
    // picking uses the exact transform rendering did. (The backing store is
    // sized in CSS pixels by the host, so screen px == board-projected px.)
    const viewport = { width_px: canvas.width, height_px: canvas.height };
    this.xform.setViewport(viewport);

    const rc: RenderCtx = {
      canvas,
      ctx,
      viewport,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(), // Use visibility manager
      boardBounds: this.boardBounds,
      boardToScreen: (p) => this.xform.boardToScreen({ x: p.x, y: p.y }),
      screenToBoard: (p) => this.xform.screenToBoard({ x: p.x, y: p.y }),
    };

    // Clear once, in one place
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Execute all passes in order
    for (const pass of this.passes) {
      if (!pass.enabled(rc)) {
        continue;
      }
      
      ctx.save();
      try {
        pass.draw(rc);
      } finally {
        ctx.restore();
      }
    }
  }

  // Camera controls
  setCamera(camera: Partial<CameraState>) {
    this.xform.setCamera(camera);
    this.requestRender("camera-change");
  }

  getCamera() {
    return this.xform.getCamera();
  }

  // Visibility controls - delegate to VisibilityManager
  setVisibility(visibility: Partial<VisibilityState>) {
    this.visibility.setState(visibility);
    this.requestRender("visibility-change");
  }

  getVisibility(): VisibilityState {
    return this.visibility.getState();
  }

  // Convenience methods for specific visibility controls
  setGerberVisibility(layer: keyof VisibilityState['gerber'], visible: boolean) {
    this.visibility.setGerberVisibility(layer, visible);
    this.requestRender("gerber-visibility");
  }

  setOverlayVisibility(id: string, visible: boolean) {
    this.visibility.setOverlayVisibility(id, visible);
    this.requestRender("overlay-visibility");
  }

  setMarkersVisibility(visible: boolean) {
    this.visibility.setMarkersVisibility(visible);
    this.requestRender("markers-visibility");
  }

  // Toggle methods
  toggleGerberLayer(layer: keyof VisibilityState['gerber']) {
    this.visibility.toggleGerberLayer(layer);
    this.requestRender("gerber-toggle");
  }

  toggleOverlay(id: string) {
    this.visibility.toggleOverlay(id);
    this.requestRender("overlay-toggle");
  }

  toggleMarkers() {
    this.visibility.toggleMarkers();
    this.requestRender("markers-toggle");
  }

  // Presets
  applyVisibilityPreset(preset: 'all' | 'none' | 'copper-only' | 'minimal') {
    this.visibility.applyPreset(preset);
    this.requestRender("visibility-preset");
  }

  // Subscription for reactive updates
  onVisibilityChange(callback: (state: VisibilityState) => void) {
    return this.visibility.subscribe(callback);
  }

  // Public access to overlay API for render passes
  getOverlayApi(): OverlayApi {
    return this.overlayApi;
  }

  // Utility methods
  screenToBoard(screenX: number, screenY: number) {
    return this.xform.screenToBoard({ x: screenX, y: screenY });
  }

  boardToScreen(boardX: number, boardY: number) {
    return this.xform.boardToScreen({ x: boardX, y: boardY });
  }

  // Helper to convert canvas events to pixel coordinates
  private eventToCanvasPx(ev: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x_px: ev.clientX - rect.left,
      y_px: ev.clientY - rect.top
    };
  }

  // Emit view change events when camera moves
  private emitViewChange() {
    const camera = this.xform.getCamera();
    this.emit("view:change", {
      center_mm: camera.center_mm,
      zoom: camera.zoom,
      rotation_rad: camera.rotation_rad || 0
    });
  }
  private createRenderCtx() {
    const viewport = { width_px: this.canvas.width, height_px: this.canvas.height };
    this.xform.setViewport(viewport);

    return {
      canvas: this.canvas,
      ctx: this.ctx,
      viewport,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      boardBounds: this.boardBounds,
      boardToScreen: (p: { x: number; y: number }) => this.xform.boardToScreen({ x: p.x, y: p.y }),
      screenToBoard: (p: { x: number; y: number }) => this.xform.screenToBoard({ x: p.x, y: p.y }),
    };
  }

  // Board bounds management
  setBoardBounds(bounds: { minX_mm: number; minY_mm: number; maxX_mm: number; maxY_mm: number }) {
    this.boardBounds = bounds;
  }

  // Overlay management
  addOverlayLayer(overlay: Omit<Overlay, "id"> & { id: string }) {
    this.overlays.add(overlay as Overlay);
    overlay.onAdd?.(this.overlayApi);
    this.requestRender(`overlay:add:${overlay.id}`);
  }

  removeOverlay(id: string) {
    const ov = this.overlays.remove(id);
    if (!ov) return;
    ov.onRemove?.();
    this.requestRender(`overlay:remove:${id}`);
  }

  getOverlayRegistry() {
    return this.overlays;
  }

  // Marker management
  addMarker(marker: Marker) {
    this.markers.add(marker);
    this.requestRender(`marker:add:${marker.id}`);
  }

  addMarkers(markers: Marker[]) {
    this.markers.addMany(markers);
    this.requestRender(`markers:add:${markers.length}`);
  }

  removeMarker(id: string) {
    this.markers.remove(id);
    if (this.selectedMarkerId === id) this.selectedMarkerId = null;
    if (this.hoverMarkerId === id) this.hoverMarkerId = null;
    this.requestRender(`marker:remove:${id}`);
  }

  updateMarker(id: string, updates: Partial<Marker>) {
    this.markers.updateMany([{ id, ...updates }]);
    this.requestRender(`marker:update:${id}`);
  }

  getMarker(id: string): Marker | undefined {
    return this.markers.get(id);
  }

  listMarkers(): Marker[] {
    return this.markers.list();
  }

  clearMarkers() {
    this.markers.clear();
    this.selectedMarkerId = null;
    this.hoverMarkerId = null;
    this.requestRender('markers:clear');
  }

  // Marker picking
  pickMarker(x_px: number, y_px: number, pickRadius_px = 10) {
    const rc = this.createRenderCtx();
    return this.markerPicker.pick(rc, x_px, y_px, pickRadius_px);
  }

  // Marker selection
  selectMarker(id: string | null, opts?: { center?: boolean; animate?: boolean }) {
    if (id === this.selectedMarkerId) return; // no spam
    this.selectedMarkerId = id;

    if (id) {
      const marker = this.markers.get(id);
      this.emit("select:marker", { markerId: id, marker });
      if (opts?.center && marker) {
        // TODO: Implement zoomTo method
        // this.zoomTo({ x_mm: marker.x_mm, y_mm: marker.y_mm, radius_mm: 10, animate: opts.animate ?? true });
      }
    } else {
      this.emit("select:marker", { markerId: null });
    }

    this.requestRender("selection-change");
  }

  getSelectedMarker(): Marker | null {
    return this.selectedMarkerId ? this.markers.get(this.selectedMarkerId) || null : null;
  }

  // Get marker state for render pass
  getMarkerState() {
    return {
      selectedId: this.selectedMarkerId,
      hoverId: this.hoverMarkerId,
    };
  }

  // Mouse event handling for picking and events
  handleMouseMove(ev: MouseEvent) {
    const { x_px, y_px } = this.eventToCanvasPx(ev);
    const rc = this.createRenderCtx();

    const hit = this.markerPicker.pick(rc, x_px, y_px, 10);
    this.setHoverMarker(hit?.id ?? null);
  }

  handleMouseClick(ev: MouseEvent) {
    const { x_px, y_px } = this.eventToCanvasPx(ev);
    const rc = this.createRenderCtx();

    const hit = this.markerPicker.pick(rc, x_px, y_px, 10);
    if (hit) {
      this.selectMarker(hit.id);
      return;
    }

    const b = rc.screenToBoard({ x: x_px, y: y_px });
    this.emit("click:board", { x_mm: b.x, y_mm: b.y });
  }

  // Method to set up event listeners (call after viewer creation)
  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (ev) => this.handleMouseMove(ev));
    this.canvas.addEventListener("click", (ev) => this.handleMouseClick(ev));
  }

  // Debug method to get render pipeline info
  getDebugInfo() {
    const rc = this.createRenderCtx();
    return {
      passes: this.passes.map(p => ({
        id: p.id,
        order: p.order,
        enabled: p.enabled(rc),
      })),
      pendingRender: this.scheduler.isPending(),
      pendingReasons: this.scheduler.getPendingReasons(),
      camera: this.getCamera(),
      visibility: this.getVisibility(),
    };
  }
}
