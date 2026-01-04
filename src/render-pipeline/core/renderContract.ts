import { ViewportTransform, Vec2 } from './viewportTransform';

export type Marker = {
  id: string;
  x_mm: number;
  y_mm: number;

  // Optional metadata
  layer?: "top" | "bottom";
  severity?: "error" | "warning" | "info";
  radius_mm?: number; // optional if you later draw in world units
  data?: Record<string, any>;
};

export type MarkerHit = {
  id: string;
  marker: Marker;
  distance_px: number;
};

export type OverlayApi = {
  // Conversion helpers
  boardToScreen: (p: { x_mm: number; y_mm: number }) => { x_px: number; y_px: number };
  screenToBoard: (p: { x_px: number; y_px: number }) => { x_mm: number; y_mm: number };

  // View / geometry contracts
  getViewState: () => { center_mm: { x: number; y: number }; zoom: number; rotation_rad: number };
  getViewport: () => { width_px: number; height_px: number };
  getBoardBounds: () => { minX_mm: number; minY_mm: number; maxX_mm: number; maxY_mm: number };

  // Optional: request redraw
  requestRender: (reason: string) => void;
};

export type Overlay = {
  id: string;
  zIndex: number;
  visible: boolean;

  // If true, viewer will set ctx transform to world->screen and overlay can draw in mm.
  // If false, overlay draws in screen px with identity transform.
  drawInWorldSpace?: boolean;

  draw: (ctx: CanvasRenderingContext2D, api: OverlayApi) => void;

  // Optional lifecycle
  onAdd?: (api: OverlayApi) => void;
  onRemove?: () => void;
};

export type RenderCtx = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewport: { width_px: number; height_px: number };
  xform: ViewportTransform;
  now_ms: number;
  visibility: VisibilityState;
  boardBounds: { minX_mm: number; minY_mm: number; maxX_mm: number; maxY_mm: number };
  boardToScreen: (p: Vec2) => Vec2;
  screenToBoard: (p: Vec2) => Vec2;
};

// Coordinate system: Both board and screen use top-left origin
// Board: x right, y down (mm)
// Screen: x right, y down (px)

export type RenderPass = {
  id: string;
  order: number;
  enabled: (rc: RenderCtx) => boolean;
  draw: (rc: RenderCtx) => void;
};

export type VisibilityState = {
  gerber: {
    copper: boolean;
    solderMask: boolean;
    silk: boolean;
    outline: boolean;
  };
  overlays: Record<string, boolean>;
  markers: boolean;
};

// Order ranges for conceptual stages
export const RENDER_ORDER = {
  BASE_GERBER_MIN: 0,
  BASE_GERBER_MAX: 99,
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399,
} as const;
