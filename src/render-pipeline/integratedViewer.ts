import "../viewer/viewer.css";
import type { BoardGeom, ViewerLayers, ViewerSideMode, BoardStackup, CopperLayer, BoardGeometry, BoardFeature, TraceFeature } from '../viewer/types';
import type { RenderCtx, OverlayApi, Overlay, Marker as DfmMarker } from './core/renderContract';
import { Viewer } from './viewer';
import { dfmToBoardCoordinates } from './dfmCoordinateAdapter';
import { composeStackToSvg } from '../render/headless';
import type { SvgRenderResult } from '../render/renderGerbersFiles';
import type { DiffResult } from '../render/diff';
import { encodeViewState, decodeViewState, type ViewState } from './viewState';
// Single, indexed marker/overlay system (spatial index + picking).
import { OverlayRegistry } from './overlayRegistry';
import { createOverlayPass } from './overlayPass';
import { MarkerStore } from './markerStore';
import { MarkerPicker } from './markerPicker';
import { UniformGridIndex } from './uniformGridIndex';
import { createMarkerPass } from './markerPass';
import { SelectionRenderer, createSelectionPass, type Selection } from './renderPasses';
import { Emitter } from './events';
import type { ViewerEvents } from './viewerEvents';
import type { Board3DHandle } from './board3d';

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
          <div class="controls" id="controls">
            <div class="control-group">
              <div class="segment" title="Side">
                <input id="side-top" type="radio" name="side" value="top" checked />
                <label for="side-top">Top</label>
                <input id="side-bottom" type="radio" name="side" value="bottom" />
                <label for="side-bottom">Bottom</label>
              </div>

              <div class="layer-step" title="Step through copper layers">
                <button class="btn btn-step" id="layer-prev" type="button" aria-label="Previous layer">◀</button>
                <span id="layer-step-label">All</span>
                <button class="btn btn-step" id="layer-next" type="button" aria-label="Next layer">▶</button>
              </div>

              <div class="layer-dropdown" id="layer-dropdown">
                <button class="btn" id="layer-menu-btn" type="button" title="Layer visibility">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:14px;height:14px"><path d="M1 4h14M3 8h10M5 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  Layers
                </button>
                <div class="layer-panel" id="layer-panel" hidden></div>
              </div>
            </div>

            <div class="control-divider"></div>

            <div class="control-group">
              <button class="btn" id="measure-btn" type="button" title="Measure distance">Measure</button>

              <div class="layer-dropdown" id="info-dropdown">
                <button class="btn" id="info-menu-btn" type="button" title="Board info">Info</button>
                <div class="layer-panel" id="info-panel" hidden></div>
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

              <button class="btn" id="view3d-btn" type="button" title="Toggle 3D view">3D</button>
            </div>

            <div class="control-divider"></div>

            <div class="control-group">
              <div class="layer-dropdown" id="display-dropdown">
                <button class="btn btn-icon" id="display-menu-btn" type="button" title="Display settings" aria-label="Display settings">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:15px;height:15px"><circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8L3.4 3.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                </button>
                <div class="layer-panel" id="display-panel" hidden>
                  <label class="display-row"><span>Grid</span><input type="checkbox" id="grid-toggle" /></label>
                  <label class="display-row"><span>Units</span>
                    <select id="grid-units">
                      <option value="in" selected>in</option>
                      <option value="mm">mm</option>
                    </select>
                  </label>
                  <label class="display-row"><span>Finish</span>
                    <select id="theme-select">
                      <option value="green" selected>Green</option>
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="purple">Purple</option>
                    </select>
                  </label>
                </div>
              </div>

              <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>
              <button class="btn" id="share-btn" type="button" title="Copy shareable link">Share</button>${showDownloadButton ? `
              <button class="btn btn-primary" id="download-btn" type="button" title="Download">
                ${downloadIcon}
                Download
              </button>` : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <div id="board-viewport">
          <button class="header-toggle" id="header-toggle" type="button" title="Hide header" aria-label="Toggle header">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:15px;height:15px"><path d="M4 10l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <canvas id="render-canvas"></canvas>
          <div class="board-viewer-hint">Scroll to zoom, drag to pan.</div>
          <div class="board-info-bar" id="info-bar" hidden></div>
          <div class="board-diff-bar" id="diff-bar" hidden></div>
        </div>
      </div>
    </div>
  `;

  const root = host.firstElementChild as HTMLElement;
  const viewport = mustGet<HTMLDivElement>(root, "#board-viewport");
  const canvas = mustGet<HTMLCanvasElement>(root, "#render-canvas");
  const gridToggle = mustGet<HTMLInputElement>(root, "#grid-toggle");
  const gridUnits = mustGet<HTMLSelectElement>(root, "#grid-units");
  const themeSelect = mustGet<HTMLSelectElement>(root, "#theme-select");
  const fitBtn = mustGet<HTMLButtonElement>(root, "#fit-btn");
  const shareBtn = mustGet<HTMLButtonElement>(root, "#share-btn");
  const view3dBtn = mustGet<HTMLButtonElement>(root, "#view3d-btn");
  const downloadBtn = showDownloadButton ? mustGet<HTMLButtonElement>(root, "#download-btn") : null;
  const radios = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="side"]'));
  const layerMenuBtn = mustGet<HTMLButtonElement>(root, "#layer-menu-btn");
  const layerPanel = mustGet<HTMLDivElement>(root, "#layer-panel");
  const exportMenuBtn = mustGet<HTMLButtonElement>(root, "#export-menu-btn");
  const exportPanel = mustGet<HTMLDivElement>(root, "#export-panel");
  const displayMenuBtn = mustGet<HTMLButtonElement>(root, "#display-menu-btn");
  const displayPanel = mustGet<HTMLDivElement>(root, "#display-panel");
  const headerEl = mustGet<HTMLDivElement>(root, ".viewer-header");
  const headerToggle = mustGet<HTMLButtonElement>(root, "#header-toggle");
  const layerPrevBtn = mustGet<HTMLButtonElement>(root, "#layer-prev");
  const layerNextBtn = mustGet<HTMLButtonElement>(root, "#layer-next");
  const layerStepLabel = mustGet<HTMLSpanElement>(root, "#layer-step-label");
  const measureBtn = mustGet<HTMLButtonElement>(root, "#measure-btn");
  const infoMenuBtn = mustGet<HTMLButtonElement>(root, "#info-menu-btn");
  const infoPanel = mustGet<HTMLDivElement>(root, "#info-panel");
  const infoBar = mustGet<HTMLDivElement>(root, "#info-bar");
  const diffBar = mustGet<HTMLDivElement>(root, "#diff-bar");

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
  // Spatial-indexed marker store + picker (single marker system).
  const markerStore = new MarkerStore();
  const markerPicker = new MarkerPicker(markerStore);
  let selectedMarkerId: string | null = null;
  let hoverMarkerId: string | null = null;
  // Event emitter for marker hover/select and board clicks.
  const events = new Emitter<ViewerEvents>();
  // Give the selection renderer a way to look up a marker's board position so it
  // can highlight the real marker instead of a fixed placeholder rectangle.
  const selectionRenderer = new SelectionRenderer((id) => {
    const m = markerStore.get(id);
    return m ? { x: m.x_mm, y: m.y_mm } : undefined;
  });
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
    drawInWorldSpace: false, // grid is drawn in screen space
    draw: (ctx: CanvasRenderingContext2D, api: OverlayApi) => {
      const zoom = api.getViewState().zoom;
      const units = gridUnits.value;

      // Grid spacing in board coordinates (mm)
      const minorSpacing = units === "mm" ? 1 : 2.54; // 1mm or 0.1in (2.54mm)
      const majorSpacing = units === "mm" ? 10 : 25.4; // 10mm or 1in (25.4mm)

      const minorScreen = minorSpacing * zoom;
      const majorScreen = majorSpacing * zoom;
      if (minorScreen < 2) return;

      // Viewport bounds in board coordinates (canvas is sized in CSS px)
      const topLeft = api.screenToBoard({ x_px: 0, y_px: 0 });
      const bottomRight = api.screenToBoard({ x_px: canvas.width, y_px: canvas.height });

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Minor grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const startX = Math.floor(topLeft.x_mm / minorSpacing) * minorSpacing;
      const startY = Math.floor(topLeft.y_mm / minorSpacing) * minorSpacing;
      for (let x = startX; x <= bottomRight.x_mm; x += minorSpacing) {
        const screenX = api.boardToScreen({ x_mm: x, y_mm: 0 }).x_px;
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
      }
      for (let y = startY; y <= bottomRight.y_mm; y += minorSpacing) {
        const screenY = api.boardToScreen({ x_mm: 0, y_mm: y }).y_px;
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
      }
      ctx.stroke();

      // Major grid
      if (majorScreen >= 8) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const majorStartX = Math.floor(topLeft.x_mm / majorSpacing) * majorSpacing;
        const majorStartY = Math.floor(topLeft.y_mm / majorSpacing) * majorSpacing;
        for (let x = majorStartX; x <= bottomRight.x_mm; x += majorSpacing) {
          const screenX = api.boardToScreen({ x_mm: x, y_mm: 0 }).x_px;
          ctx.moveTo(screenX, 0);
          ctx.lineTo(screenX, canvas.height);
        }
        for (let y = majorStartY; y <= bottomRight.y_mm; y += majorSpacing) {
          const screenY = api.boardToScreen({ x_mm: 0, y_mm: y }).y_px;
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
  viewer.addPass(createMarkerPass(markerStore, () => ({ selectedId: selectedMarkerId, hoverId: hoverMarkerId })));
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
  let geometry: BoardGeometry | null = null;

  // Board finish theme — the substrate/soldermask colour (the visible board colour).
  const BOARD_THEMES: Record<string, string> = {
    green: "#1a5f1a",
    blue: "#0b3d6b",
    red: "#7a1420",
    black: "#151515",
    white: "#d8d8d8",
    purple: "#3b1a5f",
  };
  let substrateColor = BOARD_THEMES.green;
  let sideMode: ViewerSideMode = "top";
  let didInteract = false;
  // Ids of layer passes registered on the last updateRenderPasses() (for teardown).
  let registeredLayerPassIds: string[] = [];
  // When set, isolate a single copper layer (index into stackup.copper) — the
  // layer-stepper "traverse" mode. null = normal current-side view.
  let soloIndex: number | null = null;
  // Whether a shared #gv= view state has been applied (only on first load).
  let hashApplied = false;

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
    
    // Fill the substrate (themed board finish colour) using the clipped path
    ctx.fillStyle = substrateColor;
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

    // Traverse mode: isolate a single copper layer (ignores side/reveal state).
    if (soloIndex !== null && stackup.copper[soloIndex]) {
      const c = stackup.copper[soloIndex];
      register("layer:fr4", 5, undefined, { fr4: true });
      layerVisible[c.id] = true;
      register(c.id, 25, c.url, { meta: { label: `${c.name} copper`, color: c.color } });
      register("layer:drills", 70, stackup.drills);
      updateStepLabel();
      viewer.requestRender("solo-layer");
      setTimeout(() => viewer.requestRender("solo-delayed"), 50);
      rebuildLayerPanel();
      return;
    }
    updateStepLabel();

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
    // Orders 20..59 leave room for up to ~40 inner layers before reaching silk.
    stackup.copper
      .filter((c) => c.role === "inner")
      .forEach((c, idx) => register(c.id, 20 + idx, c.url, { meta: { label: c.name, color: c.color } }));

    if (extras?.silk) register(`${side}:silk`, 60, extras.silk, { meta: { label: `${cap(side)} silkscreen`, color: "#f1f5f9" } });
    if (extras?.paste) register(`${side}:paste`, 62, extras.paste, { meta: { label: `${cap(side)} paste`, color: "#cbd5e1" } });

    register("layer:drills", 70, stackup.drills);
    register("layer:vias", 75, stackup.vias);

    // Force an immediate render and another one shortly after to handle image loading
    viewer.requestRender("side-switch");
    setTimeout(() => viewer.requestRender("side-switch-delayed"), 50);

    rebuildLayerPanel();
  }

  function updateStepLabel() {
    if (soloIndex === null || !stackup) { layerStepLabel.textContent = "All"; return; }
    const c = stackup.copper[soloIndex];
    layerStepLabel.textContent = `${c?.name ?? "?"} ${soloIndex + 1}/${stackup.copper.length}`;
  }

  function resetInnerVisibility() {
    if (!stackup) return;
    for (const c of stackup.copper) if (c.role === "inner") layerVisible[c.id] = false;
  }

  /** Isolate a single copper layer by stack index (0 = top). null exits traverse mode. */
  function soloCopperLayer(index: number | null) {
    if (index === null) { soloIndex = null; resetInnerVisibility(); }
    else if (stackup && index >= 0 && index < stackup.copper.length) soloIndex = index;
    updateRenderPasses();
  }

  /** Step through the copper stack (delta ±1). Stepping past an end exits traverse mode. */
  function stepLayer(delta: number) {
    if (!stackup || !stackup.copper.length) return;
    const n = stackup.copper.length;
    if (soloIndex === null) {
      soloIndex = delta > 0 ? 0 : n - 1;
    } else {
      const next = soloIndex + delta;
      if (next < 0 || next >= n) { soloIndex = null; resetInnerVisibility(); }
      else soloIndex = next;
    }
    updateRenderPasses();
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
  let dragMoved = false;
  let dragStartBoard: { x: number; y: number } | null = null;

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    didInteract = true;

    isDragging = true;
    dragMoved = false;
    const rect = canvas.getBoundingClientRect();
    dragStartBoard = viewer.screenToBoard(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  });

  // Hover: marker hover + cursor/feature info bar + live measurement preview.
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const board = viewer.screenToBoard(event.clientX - rect.left, event.clientY - rect.top);
    if (measureMode && measureStart && !measureEnd) {
      measureCurrent = { x: board.x, y: board.y };
      viewer.requestRender("measure-move");
    }
    if (isDragging) return;
    setHoverMarker(pickAt(event.clientX, event.clientY).hit?.id ?? null);
    updateInfoBar(board.x, board.y);
  });
  canvas.addEventListener("mouseleave", () => {
    infoBar.hidden = true;
    setHoverMarker(null);
  });

  // Click: in measure mode, place measurement points (snapped to features);
  // otherwise select a marker under the cursor, else emit a board click.
  // Suppressed after a drag so panning doesn't alter selection/measurement.
  canvas.addEventListener("click", (event) => {
    if (dragMoved) return;
    const rect = canvas.getBoundingClientRect();
    const board = viewer.screenToBoard(event.clientX - rect.left, event.clientY - rect.top);

    if (measureMode) {
      const snapped = snapPoint(board.x, board.y);
      if (!measureStart || measureEnd) { measureStart = snapped; measureEnd = null; measureCurrent = snapped; }
      else { measureEnd = snapped; }
      viewer.requestRender("measure-click");
      return;
    }

    const { hit } = pickAt(event.clientX, event.clientY);
    if (hit) {
      setSelectedMarker(hit.id);
      netFeatureIds = null;
      viewer.requestRender("net-clear");
      return;
    }

    // Click a copper feature → highlight its net; empty space clears.
    const zoom = viewer.getCamera().zoom || 1;
    const feat = pickFeature(board.x, board.y, 6 / zoom);
    setSelectedMarker(null);
    if (feat && feat.feature.kind !== "hole") {
      netFeatureIds = computeNet(feat.id);
      viewer.requestRender("net-highlight");
    } else {
      netFeatureIds = null;
      events.emit("click:board", { x_mm: board.x, y_mm: board.y });
      viewer.requestRender("net-clear");
    }
  });

  const onMove = (event: MouseEvent) => {
    if (!isDragging || !dragStartBoard) return;
    dragMoved = true;

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

  function setBoardTheme(name: string) {
    if (BOARD_THEMES[name]) {
      substrateColor = BOARD_THEMES[name];
      if (themeSelect.value !== name) themeSelect.value = name;
      viewer.requestRender("board-theme");
    }
  }
  themeSelect.addEventListener("change", () => setBoardTheme(themeSelect.value));

  fitBtn.addEventListener("click", () => fitBoardToViewport(0.08));
  layerPrevBtn.addEventListener("click", () => stepLayer(-1));
  layerNextBtn.addEventListener("click", () => stepLayer(1));

  shareBtn.addEventListener("click", async () => {
    await copyShareLink();
    const prev = shareBtn.textContent;
    shareBtn.textContent = "Copied!";
    setTimeout(() => { shareBtn.textContent = prev; }, 1200);
  });

  // --- 3D view (B3, optional three.js peer dep) ---
  let board3d: Board3DHandle | null = null;
  async function toggle3D() {
    if (board3d) {
      board3d.dispose();
      board3d = null;
      canvas.style.display = "";
      view3dBtn.classList.remove("active");
      return;
    }
    if (!boardGeom || !stackup) return;
    view3dBtn.disabled = true;
    try {
      const { createBoard3D } = await import("./board3d");
      canvas.style.display = "none";
      board3d = await createBoard3D(viewport, { boardGeom, stackup, substrateColor });
      view3dBtn.classList.add("active");
    } catch (err) {
      console.error("3D view unavailable (is `three` installed?):", err);
      canvas.style.display = "";
    } finally {
      view3dBtn.disabled = false;
    }
  }
  view3dBtn.addEventListener("click", () => { toggle3D(); });
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

  measureBtn.addEventListener("click", () => {
    measureMode = !measureMode;
    measureBtn.classList.toggle("active", measureMode);
    canvas.style.cursor = measureMode ? "crosshair" : "";
    if (!measureMode) clearMeasure();
    viewer.requestRender("measure-toggle");
  });

  infoMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = infoPanel.hidden;
    if (willOpen) renderStatsPanel();
    infoPanel.hidden = !willOpen;
    infoMenuBtn.classList.toggle("active", willOpen);
  });

  displayMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !displayPanel.hidden;
    displayPanel.hidden = open;
    displayMenuBtn.classList.toggle("active", !open);
  });
  // Keep the display popover open while interacting with its controls.
  displayPanel.addEventListener("click", (e) => e.stopPropagation());

  // Hide / show the entire header (the floating button stays over the board).
  headerToggle.addEventListener("click", () => {
    const collapsed = headerEl.classList.toggle("collapsed");
    headerToggle.classList.toggle("collapsed", collapsed);
    headerToggle.title = collapsed ? "Show header" : "Hide header";
    resizeCanvas(); // header gone → board fills the freed space
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
    if (!infoPanel.hidden && !infoPanel.contains(t) && e.target !== infoMenuBtn) {
      infoPanel.hidden = true;
      infoMenuBtn.classList.remove("active");
    }
    if (!displayPanel.hidden && !displayPanel.contains(t) && e.target !== displayMenuBtn) {
      displayPanel.hidden = true;
      displayMenuBtn.classList.remove("active");
    }
  };
  document.addEventListener("click", onDocumentClick);

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      sideMode = (radios.find((x) => x.checked)?.value || "top") as ViewerSideMode;
      // Switching side exits traverse mode and restores a clean current-side view.
      if (soloIndex !== null) { soloIndex = null; resetInnerVisibility(); }
      updateRenderPasses();
    });
  });

  const onWindowResize = () => {
    resizeCanvas();
    if (board3d) board3d.resize();
    if (!didInteract) fitBoardToViewport(0.08);
  };
  window.addEventListener("resize", onWindowResize);

  function mustGet<T extends HTMLElement>(root: HTMLElement, selector: string): T {
    const el = root.querySelector(selector);
    if (!el) throw new Error(`Missing required element: ${selector}`);
    return el as T;
  }

  function setData(data: { boardGeom: BoardGeom; layers: ViewerLayers; stackup?: BoardStackup; geometry?: BoardGeometry }) {
    boardGeom = data.boardGeom;
    layers = data.layers;
    geometry = data.geometry ?? null;
    buildFeatureIndex();
    netFeatureIds = null;
    clearMeasure();
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

    // On first load, restore a shared view (#gv=…) if present in the URL.
    if (!hashApplied) {
      hashApplied = true;
      applyStateFromHash();
    }
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

  // Compose options mirroring the current side + layer-panel visibility, so
  // exports match what's on screen.
  function composeOptsFromState() {
    const outer = stackup?.copper.find((c) => c.role === (sideMode === "top" ? "top" : "bottom"));
    return {
      side: sideMode,
      revealed: revealedIds(),
      includeFR4: layerVisible["layer:fr4"] ?? true,
      background: substrateColor,
      outerCopper: outer ? (layerVisible[outer.id] ?? true) : true,
      sideMask: layerVisible[`${sideMode}:mask`] ?? true,
      sideSilk: layerVisible[`${sideMode}:silk`] ?? true,
      sidePaste: layerVisible[`${sideMode}:paste`] ?? true,
      drills: layerVisible["layer:drills"] ?? true,
    };
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
      geometry: geometry ?? { features: [], stats: { widthMm: wMm, heightMm: hMm, copperLayers: stackup.copper.length, padCount: 0, holeCount: 0, drillSizesMm: [] } },
    };
  }

  async function exportSvg() {
    const docs = await reconstructSvgDocs();
    if (!docs) return;
    const svg = composeStackToSvg(docs, composeOptsFromState());
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
    const svg = composeStackToSvg(docs, composeOptsFromState());
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const img = await loadImageEl(url);
      const c = document.createElement("canvas");
      // Clamp the longest side to MAX with a single factor so the aspect ratio holds.
      const MAX = 8000;
      const eff = Math.min(scale, MAX / Math.max(1, docs.wPx), MAX / Math.max(1, docs.hPx));
      c.width = Math.max(1, Math.round(docs.wPx * eff));
      c.height = Math.max(1, Math.round(docs.hPx * eff));
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

  // --- Shareable view state (M5) ---

  function getViewState(): ViewState {
    const cam = viewer.getCamera();
    return {
      v: 1,
      side: sideMode,
      cam: { x: cam.center_mm.x, y: cam.center_mm.y, zoom: cam.zoom, rot: cam.rotation_rad || 0 },
      visible: { ...layerVisible },
      grid: gridToggle.checked,
      units: (gridUnits.value as "mm" | "in"),
    };
  }

  function setViewState(s: ViewState) {
    if (s.units) gridUnits.value = s.units;
    if (typeof s.grid === "boolean") {
      gridToggle.checked = s.grid;
      gridOverlay.visible = s.grid;
      visibility.setOverlayVisibility("grid", s.grid);
    }
    if (s.side) {
      sideMode = s.side;
      const r = radios.find((x) => x.value === s.side);
      if (r) r.checked = true;
    }
    if (s.visible) Object.assign(layerVisible, s.visible);
    updateRenderPasses();
    if (s.cam) {
      viewer.setCamera({ center_mm: { x: s.cam.x, y: s.cam.y }, zoom: s.cam.zoom, rotation_rad: s.cam.rot ?? 0 });
    }
    didInteract = true; // keep auto-fit from overriding a restored view
    viewer.requestRender("view-state");
  }

  /** A shareable URL encoding the current side, camera, visibility, and grid. */
  function getShareUrl(): string {
    const url = new URL(location.href);
    url.hash = `gv=${encodeViewState(getViewState())}`;
    return url.toString();
  }

  async function copyShareLink(): Promise<string> {
    const url = getShareUrl();
    try { location.hash = new URL(url).hash; } catch { /* ignore */ }
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      /* clipboard may be unavailable; the URL is still in the address bar */
    }
    return url;
  }

  /** Apply a `#gv=…` view state from the current URL hash, if present. */
  function applyStateFromHash(): boolean {
    const m = /(?:^|[#&])gv=([^&]+)/.exec(location.hash || "");
    if (!m) return false;
    const s = decodeViewState(m[1]);
    if (!s) return false;
    setViewState(s);
    return true;
  }

  // --- Inspection / measurement (C) ---

  const fmtLen = (mm: number): string => {
    const unit = gridUnits.value;
    return unit === "in" ? `${(mm / 25.4).toFixed(4)} in` : `${mm.toFixed(2)} mm`;
  };

  // World Y → Gerber Y (unflip) for a user-facing coordinate readout.
  function worldToGerberY(wy: number): number {
    const mm = boardGeom?.board?.mm_bounds;
    return mm ? mm.min_y_mm + mm.max_y_mm - wy : wy;
  }

  function featureDesc(f: BoardFeature): string {
    if (f.kind === "pad") return `Pad ${f.shape} ${f.w_mm.toFixed(2)}×${f.h_mm.toFixed(2)}mm`;
    if (f.kind === "hole") return `Hole ⌀${f.diameter_mm.toFixed(2)}mm`;
    return `Trace ${f.width_mm.toFixed(2)}mm (${f.layer})`;
  }

  function updateInfoBar(wx: number, wy: number) {
    const unit = gridUnits.value;
    const conv = unit === "in" ? 1 / 25.4 : 1;
    const gx = (wx * conv).toFixed(unit === "in" ? 4 : 2);
    const gy = (worldToGerberY(wy) * conv).toFixed(unit === "in" ? 4 : 2);
    let text = `X ${gx}  Y ${gy} ${unit}`;
    const zoom = viewer.getCamera().zoom || 1;
    const f = pickFeature(wx, wy, 6 / zoom);
    if (f) text += `  ·  ${featureDesc(f.feature)}`;
    infoBar.textContent = text;
    infoBar.hidden = false;
  }

  function renderStatsPanel() {
    if (!geometry) { infoPanel.innerHTML = `<div class="info-row">No board loaded</div>`; return; }
    const s = geometry.stats;
    const rows: [string, string][] = [
      ["Size", `${s.widthMm.toFixed(1)} × ${s.heightMm.toFixed(1)} mm`],
      ["Copper layers", String(s.copperLayers)],
      ["Pads", String(s.padCount)],
      ["Holes", String(s.holeCount)],
      ["Drill sizes", s.drillSizesMm.length ? s.drillSizesMm.map((d) => d.toFixed(2)).join(", ") + " mm" : "—"],
      ["Min trace", s.minTraceWidthMm ? `${s.minTraceWidthMm.toFixed(3)} mm` : "—"],
    ];
    infoPanel.innerHTML = rows.map(([k, v]) => `<div class="info-row"><span>${k}</span><b>${v}</b></div>`).join("");
  }

  // Snap a board point to the nearest pad/hole centre within tolerance.
  function snapPoint(wx: number, wy: number): { x: number; y: number } {
    const zoom = viewer.getCamera().zoom || 1;
    const f = pickFeature(wx, wy, 8 / zoom);
    if (f && (f.feature.kind === "pad" || f.feature.kind === "hole")) {
      return { x: f.feature.x_mm, y: f.feature.y_mm };
    }
    return { x: wx, y: wy };
  }

  let measureMode = false;
  let measureStart: { x: number; y: number } | null = null;
  let measureEnd: { x: number; y: number } | null = null;
  let measureCurrent: { x: number; y: number } | null = null;

  function clearMeasure() {
    measureStart = null; measureEnd = null; measureCurrent = null;
  }

  const measurePass = {
    id: "measure",
    order: 195,
    enabled: (_rc: RenderCtx) => measureMode && !!measureStart,
    draw: (rc: RenderCtx) => {
      if (!measureStart) return;
      const ctx = rc.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const pa = rc.boardToScreen({ x: measureStart.x, y: measureStart.y });
      const dot = (p: { x: number; y: number }) => { ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); };
      ctx.fillStyle = "#0ea5e9";
      dot(pa);
      const end = measureEnd ?? measureCurrent;
      if (end) {
        const pb = rc.boardToScreen({ x: end.x, y: end.y });
        ctx.strokeStyle = "#0ea5e9"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        ctx.setLineDash([]);
        dot(pb);
        const dist = Math.hypot(end.x - measureStart.x, end.y - measureStart.y);
        const label = fmtLen(dist);
        const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
        ctx.font = "12px system-ui, sans-serif";
        const w = ctx.measureText(label).width + 10;
        ctx.fillStyle = "rgba(15,23,42,0.9)";
        ctx.fillRect(mx - w / 2, my - 20, w, 16);
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, mx, my - 12);
        ctx.textAlign = "left";
      }
    },
  };
  viewer.addPass(measurePass);

  // --- Connectivity net highlight (C3) ---
  // Infers a net by geometric flood-fill: copper features touching within a
  // tolerance are connected; plated holes bridge features across layers.

  let netFeatureIds: Set<string> | null = null;
  const NET_TOL = 0.02; // mm

  function segSegDist(a: { x1_mm: number; y1_mm: number; x2_mm: number; y2_mm: number }, b: { x1_mm: number; y1_mm: number; x2_mm: number; y2_mm: number }): number {
    return Math.min(
      pointSegDist(a.x1_mm, a.y1_mm, b.x1_mm, b.y1_mm, b.x2_mm, b.y2_mm),
      pointSegDist(a.x2_mm, a.y2_mm, b.x1_mm, b.y1_mm, b.x2_mm, b.y2_mm),
      pointSegDist(b.x1_mm, b.y1_mm, a.x1_mm, a.y1_mm, a.x2_mm, a.y2_mm),
      pointSegDist(b.x2_mm, b.y2_mm, a.x1_mm, a.y1_mm, a.x2_mm, a.y2_mm),
    );
  }

  const featRadius = (f: BoardFeature): number =>
    f.kind === "pad" ? Math.max(f.w_mm, f.h_mm) / 2 : f.kind === "hole" ? f.diameter_mm / 2 : f.width_mm / 2;

  // Surface-to-surface distance between two copper features (circle/segment approx).
  function ffDist(a: BoardFeature, b: BoardFeature): number {
    if (a.kind !== "trace" && b.kind !== "trace") {
      return Math.hypot(a.x_mm - b.x_mm, a.y_mm - b.y_mm) - featRadius(a) - featRadius(b);
    }
    if (a.kind === "trace" && b.kind === "trace") {
      return segSegDist(a, b) - a.width_mm / 2 - b.width_mm / 2;
    }
    const seg = (a.kind === "trace" ? a : b) as TraceFeature;
    const pt = (a.kind === "trace" ? b : a) as Exclude<BoardFeature, TraceFeature>;
    return pointSegDist(pt.x_mm, pt.y_mm, seg.x1_mm, seg.y1_mm, seg.x2_mm, seg.y2_mm) - featRadius(pt) - seg.width_mm / 2;
  }

  function ffContains(f: BoardFeature, x: number, y: number): boolean {
    if (f.kind === "pad") return Math.abs(x - f.x_mm) <= f.w_mm / 2 + 0.01 && Math.abs(y - f.y_mm) <= f.h_mm / 2 + 0.01;
    if (f.kind === "trace") return pointSegDist(x, y, f.x1_mm, f.y1_mm, f.x2_mm, f.y2_mm) <= f.width_mm / 2 + 0.01;
    return Math.hypot(x - f.x_mm, y - f.y_mm) <= f.diameter_mm / 2 + 0.01;
  }

  function candidatesAround(f: BoardFeature): Set<string> {
    const pts: [number, number][] = f.kind === "trace"
      ? [[f.x1_mm, f.y1_mm], [f.x2_mm, f.y2_mm], [(f.x1_mm + f.x2_mm) / 2, (f.y1_mm + f.y2_mm) / 2]]
      : [[f.x_mm, f.y_mm]];
    const out = new Set<string>();
    for (const [x, y] of pts) for (const id of featureIndex.queryRadius(x, y, 2)) out.add(id);
    return out;
  }

  function computeNet(startId: string): Set<string> {
    const net = new Set<string>([startId]);
    const stack = [startId];
    const MAX = 20000;
    while (stack.length && net.size < MAX) {
      const f = featureById.get(stack.pop()!);
      if (!f || f.kind === "hole") continue;
      const cands = candidatesAround(f);
      for (const cid of cands) {
        if (net.has(cid)) continue;
        const cf = featureById.get(cid);
        if (!cf || cf.kind === "hole") continue;
        if (ffDist(f, cf) <= NET_TOL) { net.add(cid); stack.push(cid); }
      }
      // Bridge across layers through any plated hole this feature covers.
      for (const cid of cands) {
        const hole = featureById.get(cid);
        if (hole?.kind !== "hole" || !ffContains(f, hole.x_mm, hole.y_mm)) continue;
        for (const oid of featureIndex.queryRadius(hole.x_mm, hole.y_mm, 2)) {
          if (net.has(oid)) continue;
          const of = featureById.get(oid);
          if (!of || of.kind === "hole") continue;
          if (ffContains(of, hole.x_mm, hole.y_mm)) { net.add(oid); stack.push(oid); }
        }
      }
    }
    return net;
  }

  const netPass = {
    id: "net",
    order: 192,
    enabled: (_rc: RenderCtx) => !!netFeatureIds && netFeatureIds.size > 0,
    draw: (rc: RenderCtx) => {
      if (!netFeatureIds) return;
      const active = activeCopperLayerIds();
      const m = rc.xform.getWorldToScreenMatrix();
      const ctx = rc.ctx;
      ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
      // Vivid fuchsia so the net stands out on any copper colour.
      ctx.fillStyle = "rgba(217, 70, 239, 0.75)";
      ctx.strokeStyle = "rgba(217, 70, 239, 0.9)";
      ctx.lineCap = "round";
      for (const id of netFeatureIds) {
        const f = featureById.get(id);
        if (!f || f.kind === "hole" || !active.has(f.layer)) continue;
        if (f.kind === "pad") {
          ctx.fillRect(f.x_mm - f.w_mm / 2, f.y_mm - f.h_mm / 2, f.w_mm, f.h_mm);
        } else {
          ctx.lineWidth = f.width_mm;
          ctx.beginPath();
          ctx.moveTo(f.x1_mm, f.y1_mm);
          ctx.lineTo(f.x2_mm, f.y2_mm);
          ctx.stroke();
        }
      }
    },
  };
  viewer.addPass(netPass);

  // --- Crisp vector copper (B1) ---
  // When zoomed in past the raster resolution, redraw copper pads/traces from the
  // parsed geometry with Path2D so edges stay sharp. Regions/planes stay raster.

  const CRISP_ZOOM = 12; // px/mm; below this the raster is already fine
  function copperColorFor(layerId: string): string {
    return stackup?.copper.find((c) => c.id === layerId)?.color ?? "#fbbf24";
  }
  const vectorCopperPass = {
    id: "vector-copper",
    order: 12, // over the copper raster, under mask/silk/drills
    enabled: (rc: RenderCtx) => !!geometry && rc.xform.getCamera().zoom > CRISP_ZOOM,
    draw: (rc: RenderCtx) => {
      if (!geometry) return;
      const active = activeCopperLayerIds();
      const m = rc.xform.getWorldToScreenMatrix();
      const ctx = rc.ctx;
      ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
      ctx.lineCap = "round";
      let curColor = "";
      for (const f of geometry.features) {
        if (f.kind === "hole" || !active.has(f.layer)) continue;
        const color = copperColorFor(f.layer);
        if (color !== curColor) { ctx.fillStyle = color; ctx.strokeStyle = color; curColor = color; }
        if (f.kind === "pad") {
          if (f.shape === "C") {
            ctx.beginPath();
            ctx.arc(f.x_mm, f.y_mm, Math.max(f.w_mm, f.h_mm) / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (f.shape === "O" && typeof (ctx as any).roundRect === "function") {
            ctx.beginPath();
            (ctx as any).roundRect(f.x_mm - f.w_mm / 2, f.y_mm - f.h_mm / 2, f.w_mm, f.h_mm, Math.min(f.w_mm, f.h_mm) / 2);
            ctx.fill();
          } else {
            ctx.fillRect(f.x_mm - f.w_mm / 2, f.y_mm - f.h_mm / 2, f.w_mm, f.h_mm);
          }
        } else {
          ctx.lineWidth = f.width_mm;
          ctx.beginPath();
          ctx.moveTo(f.x1_mm, f.y1_mm);
          ctx.lineTo(f.x2_mm, f.y2_mm);
          ctx.stroke();
        }
      }
    },
  };
  viewer.addPass(vectorCopperPass);

  // --- Revision diff overlay (M4) ---

  let diffState: { result: DiffResult; topImg?: HTMLImageElement; bottomImg?: HTMLImageElement } | null = null;

  const diffOverlayPass = {
    id: "diff:overlay",
    order: 190, // above board layers, below markers
    enabled: (_rc: RenderCtx) => !!diffState,
    draw: (rc: RenderCtx) => {
      if (!diffState) return;
      const img = sideMode === "top" ? diffState.topImg : diffState.bottomImg;
      if (!img || !img.complete) return;
      const ub = diffState.result.boardGeom.board.mm_bounds;
      const ctx = rc.ctx;
      const m = rc.xform.getWorldToScreenMatrix();
      ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
      ctx.drawImage(img, ub.min_x_mm, ub.min_y_mm, ub.max_x_mm - ub.min_x_mm, ub.max_y_mm - ub.min_y_mm);
    },
  };

  /** Overlay a revision diff (from diffGerbers) on top of the board. */
  function showDiff(result: DiffResult) {
    const mkImg = (url?: string) => {
      if (!url) return undefined;
      const img = new Image();
      img.onload = () => viewer.requestRender("diff-loaded");
      img.onerror = () => console.error("Diff overlay image failed to load:", url);
      img.src = url;
      return img;
    };
    diffState = { result, topImg: mkImg(result.top?.url), bottomImg: mkImg(result.bottom?.url) };
    if (!viewer.getPass("diff:overlay")) viewer.addPass(diffOverlayPass);
    // Summary bar with a legend + clear button.
    const s = result.summary;
    diffBar.innerHTML =
      `<span class="diff-added">+${s.addedArea_mm2.toFixed(1)} mm²</span>` +
      `<span class="diff-removed">−${s.removedArea_mm2.toFixed(1)} mm²</span>` +
      (s.boardSizeChanged ? `<span class="diff-warn">board size changed</span>` : "") +
      `<button class="diff-clear" type="button">Clear</button>`;
    diffBar.hidden = false;
    diffBar.querySelector<HTMLButtonElement>(".diff-clear")?.addEventListener("click", () => hideDiff());
    viewer.requestRender("diff-show");
  }

  function hideDiff() {
    diffState = null;
    diffBar.hidden = true;
    diffBar.innerHTML = "";
    viewer.removePass("diff:overlay");
    viewer.requestRender("diff-hide");
  }

  // Convert an input DFM marker (absolute Gerber coords, Y up) into a store
  // marker (world coords), validating the coordinates. Returns null if invalid.
  function toStoreMarker(marker: DfmMarker): DfmMarker | null {
    if (typeof marker.x_mm !== "number" || typeof marker.y_mm !== "number" ||
        !isFinite(marker.x_mm) || !isFinite(marker.y_mm)) {
      console.warn(`Invalid marker coordinates for ${marker.id}:`, { x_mm: marker.x_mm, y_mm: marker.y_mm });
      return null;
    }
    const world = gerberToWorldPos(marker.x_mm, marker.y_mm);
    return { ...marker, x_mm: world.x, y_mm: world.y };
  }

  function setHoverMarker(id: string | null) {
    if (id === hoverMarkerId) return;
    hoverMarkerId = id;
    events.emit("hover:marker", id ? { markerId: id, marker: markerStore.get(id) } : { markerId: null });
    viewer.requestRender("hover-change");
  }

  function setSelectedMarker(id: string | null) {
    if (id === selectedMarkerId) return;
    selectedMarkerId = id;
    events.emit("select:marker", id ? { markerId: id, marker: markerStore.get(id) } : { markerId: null });
    viewer.requestRender("selection-change");
  }

  // --- Board feature index (pads / holes / traces) for inspect / measure / net (C) ---

  const featureIndex = new UniformGridIndex(5);
  const featureById = new Map<string, BoardFeature>();

  function buildFeatureIndex() {
    featureIndex.clear();
    featureById.clear();
    if (!geometry) return;
    geometry.features.forEach((f, i) => {
      const id = `f${i}`;
      featureById.set(id, f);
      if (f.kind === "pad" || f.kind === "hole") {
        featureIndex.insert(id, f.x_mm, f.y_mm);
      } else {
        // Sample points along the segment (~every 3mm) so mid-segment picks hit,
        // not just picks that land on an endpoint/midpoint.
        const len = Math.hypot(f.x2_mm - f.x1_mm, f.y2_mm - f.y1_mm);
        const n = Math.max(1, Math.ceil(len / 3));
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          featureIndex.insert(id, f.x1_mm + (f.x2_mm - f.x1_mm) * t, f.y1_mm + (f.y2_mm - f.y1_mm) * t);
        }
      }
    });
  }

  // Copper layer ids currently drawn (current side's outer copper + revealed layers).
  function activeCopperLayerIds(): Set<string> {
    const ids = new Set<string>();
    if (!stackup) return ids;
    // In traverse (solo) mode only the isolated layer is shown.
    if (soloIndex !== null && stackup.copper[soloIndex]) {
      ids.add(stackup.copper[soloIndex].id);
      return ids;
    }
    const outer = stackup.copper.find((c) => c.role === (sideMode === "top" ? "top" : "bottom"));
    if (outer && (layerVisible[outer.id] ?? true)) ids.add(outer.id);
    for (const c of stackup.copper) {
      if (c.id !== outer?.id && (layerVisible[c.id] ?? false)) ids.add(c.id);
    }
    return ids;
  }

  function pointSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  // Distance from a board point to a feature's surface (0 if inside).
  function featureDist(f: BoardFeature, x: number, y: number): number {
    if (f.kind === "pad") {
      const dx = Math.abs(x - f.x_mm) - f.w_mm / 2;
      const dy = Math.abs(y - f.y_mm) - f.h_mm / 2;
      return Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
    }
    if (f.kind === "hole") return Math.max(0, Math.hypot(x - f.x_mm, y - f.y_mm) - f.diameter_mm / 2);
    return Math.max(0, pointSegDist(x, y, f.x1_mm, f.y1_mm, f.x2_mm, f.y2_mm) - f.width_mm / 2);
  }

  function pickFeature(x: number, y: number, tol_mm: number): { id: string; feature: BoardFeature; dist: number } | null {
    const active = activeCopperLayerIds();
    const drillsVisible = layerVisible["layer:drills"] ?? true;
    const ids = new Set(featureIndex.queryRadius(x, y, tol_mm + 3));
    let best: { id: string; feature: BoardFeature; dist: number } | null = null;
    for (const id of ids) {
      const f = featureById.get(id);
      if (!f) continue;
      if (f.kind === "hole") { if (!drillsVisible) continue; }
      else if (!active.has(f.layer)) continue;
      const d = featureDist(f, x, y);
      if (d <= tol_mm && (!best || d < best.dist)) best = { id, feature: f, dist: d };
    }
    return best;
  }

  // Minimal render-context shim so MarkerPicker can hit-test against the live camera.
  function pickAt(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const x_px = clientX - rect.left;
    const y_px = clientY - rect.top;
    const rc = {
      screenToBoard: (p: { x: number; y: number }) => viewer.screenToBoard(p.x, p.y),
      boardToScreen: (p: { x: number; y: number }) => viewer.boardToScreen(p.x, p.y),
      xform: { getCamera: () => viewer.getCamera() },
    } as unknown as RenderCtx;
    return { hit: markerPicker.pick(rc, x_px, y_px, 10), x_px, y_px, rc };
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
    board3d?.dispose();
    board3d = null;
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
    // Revision diff overlay
    showDiff,
    hideDiff,
    // Shareable view state
    getViewState,
    setViewState,
    getShareUrl,
    copyShareLink,
    applyStateFromHash,
    // Event subscription (hover:marker, select:marker, click:board)
    on: events.on.bind(events),
    off: events.off.bind(events),
    once: events.once.bind(events),
    // Expose new render pipeline API
    viewer,
    visibility,
    overlayRegistry,
    markerStore,
    markerPicker,
    getGeometry: () => geometry,
    getStats: () => geometry?.stats ?? null,
    setBoardTheme,
    toggle3D,
    // Layer traversal (step through the copper stack, or isolate one layer)
    stepLayer,
    soloCopperLayer,
    pickFeatureAt: (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const b = viewer.screenToBoard(clientX - rect.left, clientY - rect.top);
      const zoom = viewer.getCamera().zoom || 1;
      return pickFeature(b.x, b.y, 6 / zoom)?.feature ?? null;
    },
    setSelection: (selection: Selection | null) => {
      currentSelection = selection;
      viewer.requestRender("selection-change");
    },
    addMarker: (marker: DfmMarker) => {
      const m = toStoreMarker(marker);
      if (!m) return;
      markerStore.add(m);
      viewer.requestRender("marker-added");
    },
    addMarkers: (markers: DfmMarker[]) => {
      const valid = markers.map(toStoreMarker).filter(Boolean) as DfmMarker[];
      markerStore.addMany(valid);
      viewer.requestRender("markers-added");
    },
    removeMarker: (id: string) => {
      markerStore.remove(id);
      if (selectedMarkerId === id) selectedMarkerId = null;
      if (hoverMarkerId === id) hoverMarkerId = null;
      viewer.requestRender("marker-removed");
    },
    /** Programmatically select a marker (highlights it and emits select:marker). */
    selectMarker: (id: string | null) => setSelectedMarker(id),
    clearMarkers: () => {
      markerStore.clear();
      selectedMarkerId = null;
      hoverMarkerId = null;
      viewer.requestRender("markers-cleared");
    },
  };
}
