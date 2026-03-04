import "../viewer/viewer.css";
import type { BoardGeom, ViewerLayers, ViewerSideMode } from '../viewer/types';
import type { RenderCtx, OverlayApi, Marker as DfmMarker } from './core/renderContract';
import { Viewer } from './viewer';
import { VisibilityManager } from './visibilityManager';
import { 
  OverlayRegistry, 
  MarkerRenderer, 
  SelectionRenderer,
  createOverlayPass,
  createMarkerPass,
  createSelectionPass,
  type Overlay,
  type OverlayHelpers,
  type Marker as RenderMarker,
  type Selection
} from './renderPasses';

export type IntegratedViewerOptions = {
  onDownload?: () => void;
  showDownloadButton?: boolean;
};

export function createIntegratedViewer(host: HTMLElement, opts: IntegratedViewerOptions = {}) {
  const downloadIcon = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

  const showDownloadButton = opts.showDownloadButton !== false; // Default to true

  host.innerHTML = `
    <div class="board-viewer-root">
      <div class="viewer-header">
        <div class="viewer-header-left">
          <p class="viewer-header-title">Board viewer</p>
          <p class="viewer-header-sub" id="viewer-subtitle">Scroll to zoom, drag to pan</p>
        </div>

        <div class="viewer-header-right">
          <div class="controls">
            <div class="segment" title="Side">
              <input id="side-top" type="radio" name="side" value="top" checked />
              <label for="side-top">Top</label>

              <input id="side-bottom" type="radio" name="side" value="bottom" />
              <label for="side-bottom">Bottom</label>
            </div>

            <label class="toggle" title="Grid">
              <input type="checkbox" id="grid-toggle" />
              Grid
            </label>

            <div class="select" title="Grid units">
              Units
              <select id="grid-units">
                <option value="in" selected>in</option>
                <option value="mm">mm</option>
              </select>
            </div>

            <div class="layer-dropdown" id="layer-dropdown">
              <button class="btn" id="layer-menu-btn" type="button" title="Layer visibility">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:14px;height:14px"><path d="M1 4h14M3 8h10M5 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Layers
              </button>
              <div class="layer-panel" id="layer-panel" hidden></div>
            </div>

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>${showDownloadButton ? `
            <button class="btn btn-primary" id="download-btn" type="button" title="Download">
              ${downloadIcon}
              Download
            </button>` : ''}
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <div id="board-viewport">
          <canvas id="render-canvas"></canvas>
          <div class="board-viewer-hint">Scroll to zoom, drag to pan.</div>
        </div>
      </div>
    </div>
  `;

  const root = host.firstElementChild as HTMLElement;
  const viewport = mustGet<HTMLDivElement>(root, "#board-viewport");
  const canvas = mustGet<HTMLCanvasElement>(root, "#render-canvas");
  const gridToggle = mustGet<HTMLInputElement>(root, "#grid-toggle");
  const gridUnits = mustGet<HTMLSelectElement>(root, "#grid-units");
  const fitBtn = mustGet<HTMLButtonElement>(root, "#fit-btn");
  const downloadBtn = showDownloadButton ? mustGet<HTMLButtonElement>(root, "#download-btn") : null;
  const radios = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="side"]'));
  const layerMenuBtn = mustGet<HTMLButtonElement>(root, "#layer-menu-btn");
  const layerPanel = mustGet<HTMLDivElement>(root, "#layer-panel");

  // Initialize render pipeline
  const viewer = new Viewer(canvas, {
    center_mm: { x: 50, y: 50 }, // Start with a reasonable center
    zoom: 5, // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: false, // Don't flip Y - board origin is top-left like screen
  });

  const visibility = new VisibilityManager();
  
  // Set up visibility change subscription to trigger renders
  visibility.subscribe(() => {
    viewer.requestRender("visibility-change");
  });
  const overlayRegistry = new OverlayRegistry();
  const markerRenderer = new MarkerRenderer();
  const selectionRenderer = new SelectionRenderer();
  let currentSelection: Selection | null = null;

  // Set up canvas size
  function resizeCanvas() {
    const rect = viewport.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    viewer.requestRender("resize");
  }

  // Create grid overlay
  const gridOverlay: Overlay = {
    id: "grid",
    visible: false,
    zIndex: 10,
    draw: (ctx: CanvasRenderingContext2D, helpers: OverlayHelpers) => {
      const view = helpers.view;
      const zoom = view.zoom;
      const units = gridUnits.value;
      
      // Grid spacing in board coordinates (mm)
      const minorSpacing = units === "mm" ? 1 : 2.54; // 1mm or 0.1in (2.54mm)
      const majorSpacing = units === "mm" ? 10 : 25.4; // 10mm or 1in (25.4mm)
      
      // Convert to screen coordinates
      const minorScreen = minorSpacing * zoom;
      const majorScreen = majorSpacing * zoom;
      
      // Lower the density threshold to make grid more visible
      if (minorScreen < 2) return; // Reduced from 6 to 2
      
      // Get viewport bounds in board coordinates
      const cssW = canvas.width / (window.devicePixelRatio || 1);
      const cssH = canvas.height / (window.devicePixelRatio || 1);
      const topLeft = helpers.screenToBoard({ x: 0, y: 0 });
      const bottomRight = helpers.screenToBoard({ x: cssW, y: cssH });
      
      // Draw in screen space for crisp lines
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      // Minor grid - blue, visible but not overwhelming
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"; // Blue, moderate opacity
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      
      const startX = Math.floor(topLeft.x / minorSpacing) * minorSpacing;
      const startY = Math.floor(topLeft.y / minorSpacing) * minorSpacing;
      
      for (let x = startX; x <= bottomRight.x; x += minorSpacing) {
        const screenX = helpers.boardToScreen({ x, y: 0 }).x;
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
      }
      
      for (let y = startY; y <= bottomRight.y; y += minorSpacing) {
        const screenY = helpers.boardToScreen({ x: 0, y }).y;
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
      }
      
      ctx.stroke();
      
      // Major grid - darker blue, more prominent
      if (majorScreen >= 8) { // Reduced from 12 to 8
        ctx.strokeStyle = "rgba(59, 130, 246, 0.7)"; // Darker blue
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        const majorStartX = Math.floor(topLeft.x / majorSpacing) * majorSpacing;
        const majorStartY = Math.floor(topLeft.y / majorSpacing) * majorSpacing;
        
        for (let x = majorStartX; x <= bottomRight.x; x += majorSpacing) {
          const screenX = helpers.boardToScreen({ x, y: 0 }).x;
          ctx.moveTo(screenX, 0);
          ctx.lineTo(screenX, canvas.height);
        }
        
        for (let y = majorStartY; y <= bottomRight.y; y += majorSpacing) {
          const screenY = helpers.boardToScreen({ x: 0, y: y }).y;
          ctx.moveTo(0, screenY);
          ctx.lineTo(canvas.width, screenY);
        }
        
        ctx.stroke();
      }
    },
  };

  // Register overlays and passes
  overlayRegistry.add(gridOverlay);
  visibility.setOverlayVisibility("grid", false);
  
  // Markers are hidden by default
  visibility.setMarkersVisibility(false);

  // Add render passes
  viewer.addPass(createOverlayPass(overlayRegistry, viewer.getOverlayApi()));
  viewer.addPass(createMarkerPass(markerRenderer));
  viewer.addPass(createSelectionPass(selectionRenderer, () => currentSelection));

  // Per-pass visibility (true by default)
  const layerVisible: Record<string, boolean> = {};

  const LAYER_META: Record<string, { label: string; color: string }> = {
    'layer:fr4':            { label: 'FR4 substrate',     color: '#1a5f1a' },
    'layer:top-copper':     { label: 'Top copper',        color: '#fbbf24' },
    'layer:top-mask':       { label: 'Top soldermask',    color: '#fde68a' },
    'layer:top-silk':       { label: 'Top silkscreen',    color: '#f1f5f9' },
    'layer:bottom-copper':  { label: 'Bottom copper',     color: '#38bdf8' },
    'layer:bottom-mask':    { label: 'Bottom soldermask', color: '#bae6fd' },
    'layer:bottom-silk':    { label: 'Bottom silkscreen', color: '#f1f5f9' },
    'layer:drills':         { label: 'Drill holes',       color: '#111111' },
  };
  // Inner layer colors (cycled if >5 inner layers)
  const INNER_LAYER_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6'];

  // State
  let boardGeom: BoardGeom | null = null;
  let layers: ViewerLayers = {};
  let sideMode: ViewerSideMode = "top";
  let didInteract = false;

  // Layer images as render passes with board clipping
  function createImagePass(id: string, order: number, imageUrl: string | undefined) {
    if (!imageUrl) return null;
    if (!(id in layerVisible)) layerVisible[id] = true;

    const img = new Image();
    img.src = imageUrl;

    img.addEventListener('load', () => {
      viewer.requestRender(`image-loaded-${id}`);
    });

    return {
      id,
      order,
      enabled: (_rc: RenderCtx) => !!(layerVisible[id] ?? true) && !!boardGeom?.board?.mm_bounds,
      draw: (rc: RenderCtx) => {
        if (!img.complete || !boardGeom?.board?.mm_bounds) return;
        
        const ctx = rc.ctx;
        const m = rc.xform.getWorldToScreenMatrix();
        
        // Set transform to draw in board coordinates
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
        
        // Build board path for clipping
        let cornerMm: number | undefined;
        if (layers.top_board_mask || layers.bottom_board_mask) {
          // For now, use a reasonable default - could be enhanced to parse from outline
          // TODO: Parse actual corner radius from outline primitives when available
          cornerMm = 0.5; // Default rounded corner
        }
        
        // Draw image with board clipping
        const boardPath = buildBoardPath(ctx, boardGeom, cornerMm);
        drawLayerClipped(ctx, boardPath, (ctx) => {
          // Draw image at true board coordinates using bounds
          if (!boardGeom?.board?.mm_bounds) return;
          const bounds = boardGeom.board.mm_bounds;
          const boardWidth = bounds.max_x_mm - bounds.min_x_mm;
          const boardHeight = bounds.max_y_mm - bounds.min_y_mm;
          
          ctx.drawImage(img, bounds.min_x_mm, bounds.min_y_mm, boardWidth, boardHeight);
        });
      },
    };
  }

  function createFR4Pass(id: string, order: number) {
    if (!(id in layerVisible)) layerVisible[id] = true;
    return {
      id,
      order,
      enabled: (_rc: RenderCtx) => !!(layerVisible[id] ?? true) && !!boardGeom?.board?.mm_bounds,
      draw: (rc: RenderCtx) => {
        if (!boardGeom?.board?.mm_bounds) return;

        const ctx = rc.ctx;
        const m = rc.xform.getWorldToScreenMatrix();
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

        // Use synchronous clipping — never async compositing inside a render pass
        const boardPath = buildBoardPath(ctx, boardGeom, 0.5);
        drawFr4Clipped(ctx, boardPath);
      },
    };
  }

  // Parse actual outline geometry from SVG mask to get real board shape
  function parseOutlineGeometry(maskSvg: string): Path2D | null {
    try {
      // Extract the path data from the SVG mask
      const pathMatch = maskSvg.match(/<path[^>]*d="([^"]*)"/);
      if (pathMatch) {
        const pathData = pathMatch[1];
        const parser = new Path2D();
        // Simple path parsing - this could be enhanced for full SVG parsing
        const commands = pathData.split(/([MmLlHhVvCcSsQqAaZz])/);
        let x = 0, y = 0;
        
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          if (cmd === 'M') {
            // Move to
            const coords = commands[++i]?.split(/[\s,]+/);
            if (coords && coords.length >= 2) {
              x = parseFloat(coords[0]);
              y = parseFloat(coords[1]);
              parser.moveTo(x, y);
            }
          } else if (cmd === 'L') {
            // Line to
            const coords = commands[++i]?.split(/[\s,]+/);
            if (coords && coords.length >= 2) {
              x = parseFloat(coords[0]);
              y = parseFloat(coords[1]);
              parser.lineTo(x, y);
            }
          } else if (cmd === 'Z') {
            parser.closePath();
          }
        }
        return parser;
      }
    } catch (e) {
      console.warn('Failed to parse outline geometry:', e);
      return null;
    }
    return null;
  }

  // Build board silhouette path from actual outline loops (preferred) or bounding box fallback.
  // Gerber uses Y-up; the viewer canvas has Y-down. Transform: viewer_y = max_y_mm + min_y_mm - gerber_y
  function buildBoardPath(_ctx: CanvasRenderingContext2D, boardGeom: BoardGeom | null, cornerMm?: number): Path2D {
    if (!boardGeom?.board?.mm_bounds) return new Path2D();

    const bounds = boardGeom.board.mm_bounds;

    if (boardGeom.outline_loops_mm?.length) {
      const p = new Path2D();
      const flipY = (gy: number) => bounds.max_y_mm + bounds.min_y_mm - gy;
      for (const loop of boardGeom.outline_loops_mm) {
        if (!loop.length) continue;
        p.moveTo(loop[0].x, flipY(loop[0].y));
        for (let i = 1; i < loop.length; i++) {
          p.lineTo(loop[i].x, flipY(loop[i].y));
        }
        p.closePath();
      }
      return p;
    }

    // Fallback: bounding box
    return roundedRectPathMm(
      bounds.min_x_mm, bounds.min_y_mm,
      bounds.max_x_mm - bounds.min_x_mm, bounds.max_y_mm - bounds.min_y_mm,
      cornerMm || 0
    );
  }

  function roundedRectPathMm(x: number, y: number, w: number, h: number, r: number): Path2D {
    const p = new Path2D();
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    
    p.moveTo(x + rr, y);
    p.lineTo(x + w - rr, y);
    p.quadraticCurveTo(x + w, y, x + w, y + rr);
    p.lineTo(x + w, y + h - rr);
    p.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    p.lineTo(x + rr, y + h);
    p.quadraticCurveTo(x, y + h, x, y + h - rr);
    p.lineTo(x, y + rr);
    p.quadraticCurveTo(x, y, x + rr, y);
    p.closePath();
    return p;
  }

  function drawFr4Clipped(ctx: CanvasRenderingContext2D, boardPath: Path2D) {
    ctx.save();
    ctx.clip(boardPath);
    
    // Fill FR4 using the clipped path
    ctx.fillStyle = '#1a5f1a';
    ctx.fill(boardPath);
    
    // Add subtle border
    ctx.strokeStyle = '#0d3d0d';
    ctx.lineWidth = 0.1;
    ctx.stroke(boardPath);
    
    ctx.restore();
  }

  function drawLayerClipped(ctx: CanvasRenderingContext2D, boardPath: Path2D, drawFn: (ctx: CanvasRenderingContext2D) => void) {
    ctx.save();
    ctx.clip(boardPath);
    drawFn(ctx);
    ctx.restore();
  }

  function updateRenderPasses() {
    // Clear existing layer passes (fixed + any previously registered inner layers)
    const existingPasses = [
      "layer:fr4", "layer:top-copper", "layer:bottom-copper",
      "layer:top-mask", "layer:bottom-mask", "layer:top-silk",
      "layer:bottom-silk", "layer:drills", "layer:vias",
      ...Object.keys(layerVisible).filter((id) => id.startsWith("layer:inner-")),
    ];
    existingPasses.forEach((id) => viewer.removePass(id));

    if (!boardGeom) return;

    // Add layer passes in correct order
    const layerConfigs: Array<{ id: string; order: number; url?: string; useFR4?: boolean }> = [
      { id: "layer:fr4",           order:  5, useFR4: true },
      { id: "layer:bottom-copper", order: 10, url: sideMode === "bottom" ? layers.bottom_copper : undefined },
      { id: "layer:bottom-mask",   order: 15, url: sideMode === "bottom" ? layers.bottom_mask   : undefined },
      { id: "layer:bottom-silk",   order: 20, url: sideMode === "bottom" ? layers.bottom_silk   : undefined },
      // Inner layers occupy orders 21..24 (registered dynamically below)
      { id: "layer:top-copper",    order: 25, url: sideMode === "top"    ? layers.top_copper    : undefined },
      { id: "layer:top-mask",      order: 30, url: sideMode === "top"    ? layers.top_mask      : undefined },
      { id: "layer:top-silk",      order: 35, url: sideMode === "top"    ? layers.top_silk      : undefined },
      { id: "layer:drills",        order: 40, url: layers.drills },
      { id: "layer:vias",          order: 45, url: layers.vias },
    ];

    layerConfigs.forEach((config) => {
      let pass;
      if (config.useFR4) {
        pass = createFR4Pass(config.id, config.order);
      } else if (config.url) {
        pass = createImagePass(config.id, config.order, config.url);
      }
      if (pass) viewer.addPass(pass);
    });

    // Inner copper layers (visible on both sides, between bottom and top copper)
    if (layers.inner_copper) {
      layers.inner_copper.forEach((url, idx) => {
        const id = `layer:inner-${idx + 1}`;
        LAYER_META[id] = {
          label: `Inner ${idx + 1}`,
          color: INNER_LAYER_COLORS[idx % INNER_LAYER_COLORS.length],
        };
        const pass = createImagePass(id, 21 + idx, url); // orders 21, 22, 23…
        if (pass) viewer.addPass(pass);
      });
    }

    // Force an immediate render and another one shortly after to handle image loading
    viewer.requestRender("side-switch");
    setTimeout(() => viewer.requestRender("side-switch-delayed"), 50);

    rebuildLayerPanel();
  }

  function rebuildLayerPanel() {
    // Build display order dynamically, inserting inner layers between bottom and top copper
    const innerIds = Object.keys(LAYER_META)
      .filter((id) => id.startsWith("layer:inner-"))
      .sort((a, b) => {
        const na = parseInt(a.split("-").pop() || "0", 10);
        const nb = parseInt(b.split("-").pop() || "0", 10);
        return na - nb;
      });

    const LAYER_DISPLAY_ORDER = [
      "layer:drills",
      "layer:top-silk", "layer:top-mask", "layer:top-copper",
      ...innerIds,
      "layer:bottom-silk", "layer:bottom-mask", "layer:bottom-copper",
      "layer:fr4",
    ];

    const active = LAYER_DISPLAY_ORDER.filter((id) => !!viewer.getPass(id));
    layerPanel.innerHTML = active.map(id => {
      const meta = LAYER_META[id] ?? { label: id, color: '#888' };
      const checked = layerVisible[id] ?? true;
      const border = meta.color === '#f1f5f9' ? ' border:1px solid #cbd5e1;' : '';
      return `<label class="layer-item" data-layer-id="${id}">` +
        `<span class="layer-swatch" style="background:${meta.color};${border}"></span>` +
        `<span>${meta.label}</span>` +
        `<input type="checkbox"${checked ? ' checked' : ''} />` +
        `</label>`;
    }).join('');

    layerPanel.querySelectorAll<HTMLInputElement>('.layer-item input').forEach(cb => {
      cb.addEventListener('change', () => {
        const layerId = (cb.closest<HTMLElement>('[data-layer-id]'))?.dataset.layerId;
        if (layerId) {
          layerVisible[layerId] = cb.checked;
          viewer.requestRender('layer-toggle');
        }
      });
    });
  }

  function fitBoardToViewport(marginFrac = 0.08) {
    if (!boardGeom?.board?.mm_bounds) return;
    
    const rect = viewport.getBoundingClientRect();
    const bounds = boardGeom.board.mm_bounds;
    
    // Calculate actual board dimensions from true bounds
    const boardWidthMm = bounds.max_x_mm - bounds.min_x_mm;
    const boardHeightMm = bounds.max_y_mm - bounds.min_y_mm;
    
    const usableWidth = rect.width * (1 - 2 * marginFrac);
    const usableHeight = rect.height * (1 - 2 * marginFrac);
    
    // Calculate zoom to fit board in viewport (pixels per mm)
    const zoomX = usableWidth / boardWidthMm;
    const zoomY = usableHeight / boardHeightMm;
    const zoom = Math.min(zoomX, zoomY);
    
    // Center the board using the actual bounds center
    const boardCenterX = (bounds.min_x_mm + bounds.max_x_mm) / 2;
    const boardCenterY = (bounds.min_y_mm + bounds.max_y_mm) / 2;
    
    viewer.setCamera({
      center_mm: { x: boardCenterX, y: boardCenterY },
      zoom,
    });
  }

  // Event handlers
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    didInteract = true;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const currentCamera = viewer.getCamera();
    
    // Calculate new zoom
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.2, Math.min(50, currentCamera.zoom * zoomFactor));
    
    // Calculate the world position under the mouse before zoom
    const worldPosBefore = viewer.screenToBoard(mouseX, mouseY);
    
    // Apply new zoom
    viewer.setCamera({ zoom: newZoom });
    
    // Calculate the world position under the mouse after zoom
    const worldPosAfter = viewer.screenToBoard(mouseX, mouseY);
    
    // Adjust camera center to keep the world position under mouse fixed
    const deltaX = worldPosBefore.x - worldPosAfter.x;
    const deltaY = worldPosBefore.y - worldPosAfter.y;
    
    const newCenter = {
      x: currentCamera.center_mm.x + deltaX,
      y: currentCamera.center_mm.y + deltaY,
    };
    
    viewer.setCamera({
      center_mm: newCenter,
      zoom: newZoom,
    });
  }, { passive: false });

  let isDragging = false;
  let dragStartBoard: { x: number; y: number } | null = null;

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    didInteract = true;

    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragStartBoard = viewer.screenToBoard(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  });

  const onMove = (event: MouseEvent) => {
    if (!isDragging || !dragStartBoard) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentBoard = viewer.screenToBoard(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    
    const dx = dragStartBoard.x - currentBoard.x;
    const dy = dragStartBoard.y - currentBoard.y;
    
    const currentCamera = viewer.getCamera();
    viewer.setCamera({
      center_mm: {
        x: currentCamera.center_mm.x + dx,
        y: currentCamera.center_mm.y + dy,
      },
    });
  };

  const onUp = () => {
    isDragging = false;
    dragStartBoard = null;
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  gridToggle.addEventListener("change", () => {
    const v = gridToggle.checked;
    visibility.setOverlayVisibility("grid", v);
    gridOverlay.visible = v;
    viewer.requestRender("grid-toggle");
  });

  gridUnits.addEventListener("change", () => {
    // Only request render if grid is visible
    if (visibility.isOverlayVisible("grid")) {
      viewer.requestRender("grid-units");
    }
  });

  fitBtn.addEventListener("click", () => fitBoardToViewport(0.08));
  downloadBtn?.addEventListener("click", () => opts.onDownload?.());

  layerMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !layerPanel.hidden;
    layerPanel.hidden = open;
    layerMenuBtn.classList.toggle("active", !open);
  });
  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!layerPanel.hidden && !layerPanel.contains(e.target as Node) && e.target !== layerMenuBtn) {
      layerPanel.hidden = true;
      layerMenuBtn.classList.remove("active");
    }
  });

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      sideMode = (radios.find((x) => x.checked)?.value || "top") as ViewerSideMode;
      updateRenderPasses();
    });
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    if (!didInteract) fitBoardToViewport(0.08);
  });

  function mustGet<T extends HTMLElement>(root: HTMLElement, selector: string): T {
    const el = root.querySelector(selector);
    if (!el) throw new Error(`Missing required element: ${selector}`);
    return el as T;
  }

  function setData(data: { boardGeom: BoardGeom; layers: ViewerLayers }) {
    boardGeom = data.boardGeom;
    layers = data.layers;
    
    // Set board bounds for proper coordinate system using true Gerber-space bounds
    if (boardGeom?.board?.mm_bounds) {
      viewer.setBoardBounds({
        minX_mm: boardGeom.board.mm_bounds.min_x_mm,
        minY_mm: boardGeom.board.mm_bounds.min_y_mm,
        maxX_mm: boardGeom.board.mm_bounds.max_x_mm,
        maxY_mm: boardGeom.board.mm_bounds.max_y_mm,
      });
    }
    
    updateRenderPasses();
    resizeCanvas();
    fitBoardToViewport(0.08);
  }

  function setSideMode(mode: ViewerSideMode) {
    sideMode = mode;
    const r = radios.find((x) => x.value === mode);
    if (r) r.checked = true;
    updateRenderPasses();
  }

  function dispose() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    host.innerHTML = "";
  }

  // Initialize
  resizeCanvas();

  return {
    setData,
    setSideMode,
    fit: () => fitBoardToViewport(0.08),
    dispose,
    // Expose new render pipeline API
    viewer,
    visibility,
    overlayRegistry,
    markerRenderer,
    setSelection: (selection: Selection | null) => {
      currentSelection = selection;
      viewer.requestRender("selection-change");
    },
    addMarker: (marker: DfmMarker) => {
      // Validate marker before adding
      if (typeof marker.x_mm !== 'number' || typeof marker.y_mm !== 'number' || 
          !isFinite(marker.x_mm) || !isFinite(marker.y_mm)) {
        console.warn(`Invalid marker coordinates for ${marker.id}:`, { 
          x_mm: marker.x_mm, 
          y_mm: marker.y_mm, 
          marker: marker,
          keys: Object.keys(marker)
        });
        return;
      }
      
      // Convert DFM marker to render marker
      const renderMarker: RenderMarker = {
        id: marker.id,
        position: { x: marker.x_mm, y: marker.y_mm },
        type: 'custom', // Default type for DFM markers
        data: {
          ...marker.data,
          severity: marker.severity,
          layer: marker.layer,
          radius_mm: marker.radius_mm
        }
      };
      
      markerRenderer.add(renderMarker);
      viewer.requestRender("marker-added");
    },
    addMarkers: (markers: DfmMarker[]) => {
      for (const marker of markers) {
        // Validate each marker before adding
        if (typeof marker.x_mm !== 'number' || typeof marker.y_mm !== 'number' || 
            !isFinite(marker.x_mm) || !isFinite(marker.y_mm)) {
          console.warn(`Invalid marker coordinates for ${marker.id}:`, { 
            x_mm: marker.x_mm, 
            y_mm: marker.y_mm, 
            marker: marker,
            keys: Object.keys(marker)
          });
          continue;
        }
        
        // Convert DFM marker to render marker
        const renderMarker: RenderMarker = {
          id: marker.id,
          position: { x: marker.x_mm, y: marker.y_mm },
          type: 'custom', // Default type for DFM markers
          data: {
            ...marker.data,
            severity: marker.severity,
            layer: marker.layer,
            radius_mm: marker.radius_mm
          }
        };
        
        markerRenderer.add(renderMarker);
      }
      viewer.requestRender("markers-added");
    },
    removeMarker: (id: string) => {
      markerRenderer.remove(id);
      viewer.requestRender("marker-removed");
    },
  };
}
