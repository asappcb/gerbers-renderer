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

  // State
  let boardGeom: BoardGeom | null = null;
  let layers: ViewerLayers = {};
  let sideMode: ViewerSideMode = "top";
  let didInteract = false;

  // Layer images as render passes
  function createImagePass(id: string, order: number, imageUrl: string | undefined) {
    if (!imageUrl) return null;
    
    const img = new Image();
    img.src = imageUrl;
    
    // Add load event listener to trigger re-render when image is ready
    img.addEventListener('load', () => {
      viewer.requestRender(`image-loaded-${id}`);
    });
    
    return {
      id,
      order,
      enabled: (rc: RenderCtx) => !!boardGeom?.board?.mm_bounds,
      draw: (rc: RenderCtx) => {
        if (!img.complete || !boardGeom?.board?.mm_bounds) return;
        
        const ctx = rc.ctx;
        const m = rc.xform.getWorldToScreenMatrix();
        
        // Set transform to draw in board coordinates
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
        
        // Draw image at true board coordinates using bounds
        const bounds = boardGeom.board.mm_bounds;
        const boardWidth = bounds.max_x_mm - bounds.min_x_mm;
        const boardHeight = bounds.max_y_mm - bounds.min_y_mm;
        
        ctx.drawImage(img, bounds.min_x_mm, bounds.min_y_mm, boardWidth, boardHeight);
      },
    };
  }

  function createFR4Pass(id: string, order: number) {
    return {
      id,
      order,
      enabled: (rc: RenderCtx) => !!boardGeom?.board?.mm_bounds,
      draw: (rc: RenderCtx) => {
        if (!boardGeom?.board?.mm_bounds) return;
        
        const ctx = rc.ctx;
        const m = rc.xform.getWorldToScreenMatrix();
        
        // Set transform to draw in board coordinates
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
        
        // Draw green FR4 background using true bounds
        const bounds = boardGeom.board.mm_bounds;
        const boardWidth = bounds.max_x_mm - bounds.min_x_mm;
        const boardHeight = bounds.max_y_mm - bounds.min_y_mm;
        
        ctx.fillStyle = '#1a5f1a'; // Dark green PCB color
        ctx.fillRect(bounds.min_x_mm, bounds.min_y_mm, boardWidth, boardHeight);
        
        // Add subtle border
        ctx.strokeStyle = '#0d3d0d';
        ctx.lineWidth = 0.1; // mm
        ctx.strokeRect(bounds.min_x_mm, bounds.min_y_mm, boardWidth, boardHeight);
      },
    };
  }

  function updateRenderPasses() {
    // Clear existing layer passes
    const existingPasses = ["layer:fr4", "layer:top-copper", "layer:bottom-copper", 
                           "layer:top-mask", "layer:bottom-mask", "layer:top-silk", 
                           "layer:bottom-silk", "layer:drills", "layer:vias"];
    
    existingPasses.forEach(id => {
      viewer.removePass(id);
    });

    if (!boardGeom) return;

    // Add layer passes in correct order
    const layerConfigs = [
      { id: "layer:fr4", order: 5, useFR4: true },
      { id: "layer:bottom-copper", order: 10, url: sideMode === "bottom" ? layers.bottom_copper : undefined },
      { id: "layer:bottom-mask", order: 15, url: sideMode === "bottom" ? layers.bottom_mask : undefined },
      { id: "layer:bottom-silk", order: 20, url: sideMode === "bottom" ? layers.bottom_silk : undefined },
      { id: "layer:top-copper", order: 25, url: sideMode === "top" ? layers.top_copper : undefined },
      { id: "layer:top-mask", order: 30, url: sideMode === "top" ? layers.top_mask : undefined },
      { id: "layer:top-silk", order: 35, url: sideMode === "top" ? layers.top_silk : undefined },
      { id: "layer:drills", order: 40, url: layers.drills },
      { id: "layer:vias", order: 45, url: layers.vias },
    ];

    layerConfigs.forEach(config => {
      let pass;
      if (config.useFR4) {
        pass = createFR4Pass(config.id, config.order);
      } else if (config.url) {
        pass = createImagePass(config.id, config.order, config.url);
      }
      if (pass) {
        viewer.addPass(pass);
      }
    });

    // Force an immediate render and another one shortly after to handle image loading
    viewer.requestRender("side-switch");
    setTimeout(() => viewer.requestRender("side-switch-delayed"), 50);
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
