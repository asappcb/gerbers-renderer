import { RenderScheduler } from './core/renderScheduler';
import { RenderCtx, RenderPass, VisibilityState, RENDER_ORDER } from './core/renderContract';
import { ViewportTransform, CameraState, Viewport } from './core/viewportTransform';

export class Viewer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private xform: ViewportTransform;
  private visibility: VisibilityState;
  private passes: RenderPass[] = [];
  private scheduler: RenderScheduler;
  private visibilityGetter: () => VisibilityState = () => this.visibility; // Default getter

  constructor(canvas: HTMLCanvasElement, initialCamera: CameraState) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context');
    this.ctx = ctx;

    const viewport: Viewport = {
      width_px: canvas.width,
      height_px: canvas.height
    };

    this.xform = new ViewportTransform(initialCamera, viewport);
    
    // Initialize visibility state
    this.visibility = {
      gerber: {
        copper: true,
        solderMask: true,
        silk: true,
        outline: true,
      },
      overlays: {},
      markers: true,
    };

    this.scheduler = new RenderScheduler(() => this.render());

    // Register default passes
    this.registerDefaultPasses();

    // Handle canvas resize
    this.setupResizeHandling();
  }

  // Method to set the visibility getter
  setVisibilityGetter(getVisibility: () => VisibilityState) {
    this.visibilityGetter = getVisibility;
  }

  private setupResizeHandling() {
    const resizeObserver = new ResizeObserver(() => {
      this.requestRender("canvas-resize");
    });
    resizeObserver.observe(this.canvas);
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

    // Ensure viewport matches canvas
    const viewport = { width_px: canvas.width, height_px: canvas.height };

    // Update transform viewport if needed
    this.xform.setViewport(viewport);

    const rc: RenderCtx = {
      canvas,
      ctx,
      viewport,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibilityGetter(), // Use the getter function
      boardToScreen: (p) => this.xform.boardToScreen({ x: p.x, y: p.y }),
      screenToBoard: (p) => this.xform.screenToBoard({ x: p.x, y: p.y }),
    };

    // Clear once, in one place
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Optional: fill background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Execute all passes in order
    for (const pass of this.passes) {
      if (!pass.enabled()) {
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

  // Visibility controls
  setVisibility(visibility: Partial<VisibilityState>) {
    this.visibility = {
      ...this.visibility,
      ...visibility,
      gerber: {
        ...this.visibility.gerber,
        ...(visibility.gerber || {}),
      },
      overlays: {
        ...this.visibility.overlays,
        ...(visibility.overlays || {}),
      },
    };
    this.requestRender("visibility-change");
  }

  getVisibility(): VisibilityState {
    return this.visibility;
  }

  // Utility methods
  screenToBoard(screenX: number, screenY: number) {
    return this.xform.screenToBoard({ x: screenX, y: screenY });
  }

  boardToScreen(boardX: number, boardY: number) {
    return this.xform.boardToScreen({ x: boardX, y: boardY });
  }

  // Debug method to get render pipeline info
  getDebugInfo() {
    return {
      passes: this.passes.map(p => ({
        id: p.id,
        order: p.order,
        enabled: p.enabled(),
      })),
      pendingRender: this.scheduler.isPending(),
      pendingReasons: this.scheduler.getPendingReasons(),
      camera: this.getCamera(),
      visibility: this.getVisibility(),
    };
  }
}
