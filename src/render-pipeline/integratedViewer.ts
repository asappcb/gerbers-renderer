import "../viewer/viewer.css";
import type { BoardGeom, ViewerLayers, ViewerSideMode, BoardStackup, CopperLayer } from '../viewer/types';
import type { RenderCtx, OverlayApi, Marker as DfmMarker } from './core/renderContract';
import { Viewer } from './viewer';
import { dfmToBoardCoordinates } from './dfmCoordinateAdapter';
import { composeStackToSvg } from '../render/headless';
import type { SvgRenderResult } from '../render/renderGerbersFiles';
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

            <div class="layer-dropdown" id="export-dropdown">
              <button class="btn" id="export-menu-btn" type="button" title="Export image">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:14px;height:14px"><path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Export
              </button>
              <div class="layer-panel" id="export-panel" hidden>
                <button class="export-item" type="button" data-export="png-view">PNG — current view</button>
                <button class="export-item" type="button" data-export="png-board">PNG — full board</button>
                <button class="export-item" type="button" data-export="svg-board">SVG — full board</button>
              </div>
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
  const exportMenuBtn = mustGet<HTMLButtonElement>(root, "#export-menu-btn");
  const exportPanel = mustGet<HTMLDivElement>(root, "#export-panel");

  // Initialize render pipeline
  const viewer = new Viewer(canvas, {
    center_mm: { x: 50, y: 50 }, // Start with a reasonable center
    zoom: 5, // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: false, // Don't flip Y - board origin is top-left like screen
  });

  // Use the viewer's own visibility manager — the one the render passes read
  // from via rc.visibility — so toggles here actually affect what's drawn.
  const visibility = viewer.getVisibilityManager();

  // Set up visibility change subscription to trigger renders
  visibility.subscribe(() => {
    viewer.requestRender("visibility-change");
  });
  const overlayRegistry = new OverlayRegistry();
  const markerRenderer = new MarkerRenderer();
  // Give the selection renderer a way to look up a marker's board position so it
  // can highlight the real marker instead of a fixed placeholder rectangle.
  const selectionRenderer = new SelectionRenderer((id) => markerRenderer.get(id)?.position);
  let currentSelection: Selection | null = null;

  // Set up canvas size. The backing store is sized in CSS pixels (not scaled by
  // devicePixelRatio) so that the world→screen transform each pass applies fills
  // the whole canvas and picking uses the same coordinate space as rendering.
  function resizeCanvas() {
    const rect = viewport.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
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
      
      // Get viewport bounds in board coordinates (canvas is sized in CSS px)
      const topLeft = helpers.screenToBoard({ x: 0, y: 0 });
      const bottomRight = helpers.screenToBoard({ x: canvas.width, y: canvas.height });
      
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

  // Per-pass visibility (true by default; inner copper defaults to hidden)
  const layerVisible: Record<string, boolean> = {};

  // Layer metadata (label + swatch color), populated dynamically from the stackup.
  const layerMeta: Record<string, { label: string; color: string }> = {
    'layer:fr4':    { label: 'FR4 substrate', color: '#1a5f1a' },
    'layer:drills': { label: 'Drill holes',   color: '#111111' },
    'layer:vias':   { label: 'Vias',          color: '#111111' },
  };
  // Inner layer colors (cycled if >5 inner layers) — used when deriving a
  // stackup from legacy flat layers.
  const INNER_LAYER_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6'];

  // State
  let boardGeom: BoardGeom | null = null;
  let layers: ViewerLayers = {};
  let stackup: BoardStackup | null = null;
  let sideMode: ViewerSideMode = "top";
  let didInteract = false;
  // Ids of layer passes registered on the last updateRenderPasses() (for teardown).
  let registeredLayerPassIds: string[] = [];

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

  const isInnerId = (id: string) => id.startsWith("cu.in");
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  /** Build a stackup from legacy flat layers, for callers using the old setData shape. */
  function deriveStackup(l: ViewerLayers): BoardStackup {
    const copper: CopperLayer[] = [];
    if (l.top_copper) copper.push({ id: "cu.top", index: 0, role: "top", name: "Top", url: l.top_copper, color: "#fbbf24" });
    (l.inner_copper ?? []).forEach((url, i) => {
      copper.push({ id: `cu.in${i + 1}`, index: 0, role: "inner", name: `Inner ${i + 1}`, url, color: INNER_LAYER_COLORS[i % INNER_LAYER_COLORS.length] });
    });
    if (l.bottom_copper) copper.push({ id: "cu.bottom", index: 0, role: "bottom", name: "Bottom", url: l.bottom_copper, color: "#38bdf8" });
    copper.forEach((c, i) => { c.index = i; });
    return {
      copper,
      top: { mask: l.top_mask, silk: l.top_silk, paste: l.top_paste },
      bottom: { mask: l.bottom_mask, silk: l.bottom_silk, paste: l.bottom_paste },
      drills: l.drills,
      vias: l.vias,
    };
  }

  function updateRenderPasses() {
    // Remove the layer passes registered on the previous pass build.
    registeredLayerPassIds.forEach((id) => viewer.removePass(id));
    registeredLayerPassIds = [];

    if (!boardGeom || !stackup) return;

    const register = (
      id: string,
      order: number,
      url: string | undefined,
      opts?: { fr4?: boolean; meta?: { label: string; color: string } }
    ) => {
      const fr4 = !!opts?.fr4;
      if (!fr4 && !url) return;
      if (opts?.meta) layerMeta[id] = opts.meta;
      // Inner copper is hidden by default (reveal on demand); everything else shown.
      if (!(id in layerVisible)) layerVisible[id] = !isInnerId(id);
      const pass = fr4 ? createFR4Pass(id, order) : createImagePass(id, order, url);
      if (pass) { viewer.addPass(pass); registeredLayerPassIds.push(id); }
    };

    register("layer:fr4", 5, undefined, { fr4: true });

    // Only the current side's outer copper + its mask/silk/paste are shown by
    // default; inner and opposite-side copper are revealed on demand.
    const side = sideMode;
    const outer = stackup.copper.find((c) => c.role === (side === "top" ? "top" : "bottom"));
    if (outer) register(outer.id, 10, outer.url, { meta: { label: `${outer.name} copper`, color: outer.color } });

    const extras = side === "top" ? stackup.top : stackup.bottom;
    if (extras?.mask) register(`${side}:mask`, 15, extras.mask, { meta: { label: `${cap(side)} soldermask`, color: side === "top" ? "#fde68a" : "#bae6fd" } });

    // Inner copper — registered but hidden by default; the layer panel reveals them.
    // Drawn above the current-side copper (and mask) but below silk for inspection.
    stackup.copper
      .filter((c) => c.role === "inner")
      .forEach((c, idx) => register(c.id, 20 + idx, c.url, { meta: { label: c.name, color: c.color } }));

    if (extras?.silk) register(`${side}:silk`, 30, extras.silk, { meta: { label: `${cap(side)} silkscreen`, color: "#f1f5f9" } });
    if (extras?.paste) register(`${side}:paste`, 32, extras.paste, { meta: { label: `${cap(side)} paste`, color: "#cbd5e1" } });

    register("layer:drills", 40, stackup.drills);
    register("layer:vias", 45, stackup.vias);

    // Force an immediate render and another one shortly after to handle image loading
    viewer.requestRender("side-switch");
    setTimeout(() => viewer.requestRender("side-switch-delayed"), 50);

    rebuildLayerPanel();
  }

  function rebuildLayerPanel() {
    // Display top-of-stack first (reverse of render order).
    const ids = [...registeredLayerPassIds].reverse();
    layerPanel.innerHTML = ids.map((id) => {
      const meta = layerMeta[id] ?? { label: id, color: '#888' };
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
    
    // Apply new zoom, then read the world position under the mouse at that zoom.
    viewer.setCamera({ zoom: newZoom });
    const worldPosAfter = viewer.screenToBoard(mouseX, mouseY);

    // Adjust camera center to keep the world position under the mouse fixed.
    // Zoom is already set above, so only the center needs updating here.
    const deltaX = worldPosBefore.x - worldPosAfter.x;
    const deltaY = worldPosBefore.y - worldPosAfter.y;

    viewer.setCamera({
      center_mm: {
        x: currentCamera.center_mm.x + deltaX,
        y: currentCamera.center_mm.y + deltaY,
      },
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
  exportMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !exportPanel.hidden;
    exportPanel.hidden = open;
    exportMenuBtn.classList.toggle("active", !open);
  });
  exportPanel.querySelectorAll<HTMLButtonElement>(".export-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      exportPanel.hidden = true;
      exportMenuBtn.classList.remove("active");
      const kind = btn.dataset.export;
      try {
        if (kind === "png-view") await exportPng("view");
        else if (kind === "png-board") await exportPng("board");
        else if (kind === "svg-board") await exportSvg();
      } catch (err) {
        console.error("Export failed:", err);
      }
    });
  });

  const onDocumentClick = (e: MouseEvent) => {
    const t = e.target as Node;
    if (!layerPanel.hidden && !layerPanel.contains(t) && e.target !== layerMenuBtn) {
      layerPanel.hidden = true;
      layerMenuBtn.classList.remove("active");
    }
    if (!exportPanel.hidden && !exportPanel.contains(t) && e.target !== exportMenuBtn) {
      exportPanel.hidden = true;
      exportMenuBtn.classList.remove("active");
    }
  };
  document.addEventListener("click", onDocumentClick);

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      sideMode = (radios.find((x) => x.checked)?.value || "top") as ViewerSideMode;
      updateRenderPasses();
    });
  });

  const onWindowResize = () => {
    resizeCanvas();
    if (!didInteract) fitBoardToViewport(0.08);
  };
  window.addEventListener("resize", onWindowResize);

  function mustGet<T extends HTMLElement>(root: HTMLElement, selector: string): T {
    const el = root.querySelector(selector);
    if (!el) throw new Error(`Missing required element: ${selector}`);
    return el as T;
  }

  function setData(data: { boardGeom: BoardGeom; layers: ViewerLayers; stackup?: BoardStackup }) {
    boardGeom = data.boardGeom;
    layers = data.layers;
    // Prefer the first-class stackup; derive one from legacy flat layers otherwise.
    stackup = data.stackup ?? deriveStackup(data.layers);

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

  // Convert a marker's absolute Gerber coords (Y up) into the renderer's world
  // space (Y flipped), matching how the layer images are placed. Without this,
  // markers land mirrored/offset relative to the board.
  // --- Image / SVG export (M3) ---

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function loadImageEl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load composed SVG for export"));
      img.src = url;
    });
  }

  // Copper layers (besides the current outer) that the user has revealed.
  function revealedIds(): string[] {
    if (!stackup) return [];
    const outer = stackup.copper.find((c) => c.role === (sideMode === "top" ? "top" : "bottom"));
    return stackup.copper
      .filter((c) => c.id !== outer?.id && (layerVisible[c.id] ?? false))
      .map((c) => c.id);
  }

  // Reconstruct the pure SVG document set from the viewer's blob-URL layers so
  // we can reuse the headless composeStackToSvg() for crisp SVG/PNG export.
  async function reconstructSvgDocs(): Promise<SvgRenderResult | null> {
    if (!boardGeom || !stackup) return null;
    const mm = boardGeom.board.mm_bounds;
    const wMm = mm.max_x_mm - mm.min_x_mm;
    const hMm = mm.max_y_mm - mm.min_y_mm;
    const K = 1000 / 25.4; // px per mm, matches the render resolution
    const wPx = Math.max(1, Math.round(wMm * K));
    const hPx = Math.max(1, Math.round(hMm * K));

    const svgById: Record<string, string> = {};
    const jobs: Promise<void>[] = [];
    const load = (id: string, url?: string): string | undefined => {
      if (!url) return undefined;
      jobs.push(fetch(url).then((r) => r.text()).then((t) => { svgById[id] = t; }));
      return id;
    };

    const boardMaskId = load("board_mask", layers.top_board_mask);
    const copper = stackup.copper.map((c) => ({
      id: c.id, index: c.index, role: c.role, name: c.name, color: c.color,
      svgId: load(c.id, c.url)!,
    }));
    const top = stackup.top
      ? { maskId: load("top:mask", stackup.top.mask), silkId: load("top:silk", stackup.top.silk), pasteId: load("top:paste", stackup.top.paste) }
      : undefined;
    const bottom = stackup.bottom
      ? { maskId: load("bottom:mask", stackup.bottom.mask), silkId: load("bottom:silk", stackup.bottom.silk), pasteId: load("bottom:paste", stackup.bottom.paste) }
      : undefined;
    const drillsId = load("drills", stackup.drills);

    await Promise.all(jobs);

    return {
      boardGeom, bounds: { minX: mm.min_x_mm, minY: mm.min_y_mm, maxX: mm.max_x_mm, maxY: mm.max_y_mm },
      wPx, hPx, svgById, boardMaskId, copper, top, bottom, drillsId, viasId: undefined,
    };
  }

  async function exportSvg() {
    const docs = await reconstructSvgDocs();
    if (!docs) return;
    const svg = composeStackToSvg(docs, { side: sideMode, revealed: revealedIds() });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `board-${sideMode}.svg`);
  }

  async function exportPng(mode: "view" | "board" = "view", scale = 2) {
    if (mode === "view") {
      await new Promise<void>((resolve) => {
        canvas.toBlob((b) => { if (b) downloadBlob(b, `board-${sideMode}-view.png`); resolve(); }, "image/png");
      });
      return;
    }
    const docs = await reconstructSvgDocs();
    if (!docs) return;
    const svg = composeStackToSvg(docs, { side: sideMode, revealed: revealedIds() });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const img = await loadImageEl(url);
      const c = document.createElement("canvas");
      const MAX = 8000;
      c.width = Math.min(MAX, Math.max(1, Math.round(docs.wPx * scale)));
      c.height = Math.min(MAX, Math.max(1, Math.round(docs.hPx * scale)));
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      await new Promise<void>((resolve) => {
        c.toBlob((b) => { if (b) downloadBlob(b, `board-${sideMode}.png`); resolve(); }, "image/png");
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function gerberToWorldPos(x_mm: number, y_mm: number): { x: number; y: number } {
    const b = boardGeom?.board?.mm_bounds;
    if (!b) return { x: x_mm, y: y_mm };
    const p = dfmToBoardCoordinates(
      { x_mm, y_mm },
      { minX_mm: b.min_x_mm, minY_mm: b.min_y_mm, maxX_mm: b.max_x_mm, maxY_mm: b.max_y_mm }
    );
    return { x: p.x_mm, y: p.y_mm };
  }

  function dispose() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("resize", onWindowResize);
    document.removeEventListener("click", onDocumentClick);
    viewer.dispose();
    host.innerHTML = "";
  }

  // Initialize
  resizeCanvas();

  return {
    setData,
    setSideMode,
    fit: () => fitBoardToViewport(0.08),
    dispose,
    // Image / SVG export
    exportPng,
    exportSvg,
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
        position: gerberToWorldPos(marker.x_mm, marker.y_mm),
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
