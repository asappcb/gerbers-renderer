import { ViewportTransform, CameraState, Viewport, Vec2 } from './viewportTransform';

/**
 * Example showing how to integrate ViewportTransform with canvas rendering
 */
export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private transform: ViewportTransform;

  constructor(canvas: HTMLCanvasElement, initialCamera: CameraState) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context');
    this.ctx = ctx;

    const viewport: Viewport = {
      width_px: canvas.width,
      height_px: canvas.height
    };

    this.transform = new ViewportTransform(initialCamera, viewport);

    // Handle canvas resize
    const resizeObserver = new ResizeObserver(() => {
      this.updateViewport();
    });
    resizeObserver.observe(canvas);
  }

  private updateViewport() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.transform.setViewport({
      width_px: rect.width,
      height_px: rect.height
    });

    this.render();
  }

  setCamera(camera: Partial<CameraState>) {
    this.transform.setCamera(camera);
    this.render();
  }

  getCamera(): Required<CameraState> {
    return this.transform.getCamera();
  }

  /**
   * Convert screen coordinates to board coordinates
   * Useful for mouse interactions, picking, etc.
   */
  screenToBoard(screenX: number, screenY: number): Vec2 {
    return this.transform.screenToBoard({ x: screenX, y: screenY });
  }

  /**
   * Convert board coordinates to screen coordinates
   * Useful for overlays, tooltips, etc.
   */
  boardToScreen(boardX: number, boardY: number): Vec2 {
    return this.transform.boardToScreen({ x: boardX, y: boardY });
  }

  /**
   * Main render method - applies the transform and draws content
   */
  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply the viewport transform to canvas
    // This allows us to draw directly in board coordinates (mm)
    const matrix = this.transform.getWorldToScreenMatrix();
    ctx.setTransform(
      matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]
    );

    // Draw grid in board coordinates
    this.drawGrid();

    // Draw sample geometry in board coordinates
    this.drawSampleGeometry();

    // Reset transform for screen-space overlays
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Draw screen-space overlays (coordinates in pixels)
    this.drawOverlays();
  }

  private drawGrid() {
    const ctx = this.ctx;
    const gridSize = 5; // 5mm grid

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.1; // Very thin in board coordinates

    // Draw grid lines from -100mm to 100mm
    for (let x = -100; x <= 100; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -100);
      ctx.lineTo(x, 100);
      ctx.stroke();
    }

    for (let y = -100; y <= 100; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-100, y);
      ctx.lineTo(100, y);
      ctx.stroke();
    }
  }

  private drawSampleGeometry() {
    const ctx = this.ctx;

    // Draw a rectangle at origin (board coordinates in mm)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, 20, 10);

    // Draw a circle
    ctx.beginPath();
    ctx.arc(30, 15, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2196F3';
    ctx.fill();

    // Draw a line
    ctx.beginPath();
    ctx.moveTo(-20, -20);
    ctx.lineTo(40, 30);
    ctx.strokeStyle = '#F44336';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  private drawOverlays() {
    const ctx = this.ctx;
    const camera = this.getCamera();

    // Draw camera info in screen coordinates
    ctx.fillStyle = 'black';
    ctx.font = '12px monospace';
    ctx.fillText(`Center: (${camera.center_mm.x.toFixed(2)}, ${camera.center_mm.y.toFixed(2)}) mm`, 10, 20);
    ctx.fillText(`Zoom: ${camera.zoom.toFixed(2)} px/mm`, 10, 35);
    ctx.fillText(`Rotation: ${(camera.rotation_rad * 180 / Math.PI).toFixed(1)}°`, 10, 50);
    if (camera.mirrorX) ctx.fillText('Mirror X: ON', 10, 65);
    if (camera.mirrorY) ctx.fillText('Mirror Y: ON', 10, 80);
  }

  /**
   * Handle mouse wheel for zooming
   */
  handleWheel(event: WheelEvent) {
    event.preventDefault();
    
    const screenPos = { x: event.offsetX, y: event.offsetY };
    const boardPos = this.screenToBoard(screenPos.x, screenPos.y);
    
    // Zoom factor
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(1000, this.getCamera().zoom * zoomFactor));
    
    // Update camera to zoom around mouse position
    this.setCamera({
      zoom: newZoom,
      center_mm: boardPos
    });
  }

  /**
   * Handle mouse drag for panning
   */
  private isDragging = false;
  private lastScreenPos: Vec2 | null = null;

  handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastScreenPos = { x: event.offsetX, y: event.offsetY };
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.lastScreenPos) return;

    const currentScreenPos = { x: event.offsetX, y: event.offsetY };
    const lastBoardPos = this.screenToBoard(this.lastScreenPos.x, this.lastScreenPos.y);
    const currentBoardPos = this.screenToBoard(currentScreenPos.x, currentScreenPos.y);

    // Pan by the difference in board coordinates
    const dx = lastBoardPos.x - currentBoardPos.x;
    const dy = lastBoardPos.y - currentBoardPos.y;

    const currentCenter = this.getCamera().center_mm;
    this.setCamera({
      center_mm: {
        x: currentCenter.x + dx,
        y: currentCenter.y + dy
      }
    });

    this.lastScreenPos = currentScreenPos;
  }

  handleMouseUp() {
    this.isDragging = false;
    this.lastScreenPos = null;
  }
}

/**
 * Example usage:
 * 
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement;
 * const renderer = new CanvasRenderer(canvas, {
 *   center_mm: { x: 0, y: 0 },
 *   zoom: 10,
 *   rotation_rad: 0
 * });
 * 
 * // Add event listeners
 * canvas.addEventListener('wheel', (e) => renderer.handleWheel(e));
 * canvas.addEventListener('mousedown', (e) => renderer.handleMouseDown(e));
 * canvas.addEventListener('mousemove', (e) => renderer.handleMouseMove(e));
 * canvas.addEventListener('mouseup', () => renderer.handleMouseUp());
 * 
 * // Programmatic camera updates
 * renderer.setCamera({
 *   center_mm: { x: 50, y: 25 },
 *   zoom: 20,
 *   rotation_rad: Math.PI / 4
 * });
 */
