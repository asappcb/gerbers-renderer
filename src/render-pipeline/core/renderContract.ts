import { ViewportTransform, Vec2 } from './viewportTransform';

export type RenderCtx = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewport: { width_px: number; height_px: number };
  xform: ViewportTransform;
  now_ms: number;
  visibility: VisibilityState;
  boardToScreen: (p: Vec2) => Vec2;
  screenToBoard: (p: Vec2) => Vec2;
};

// Coordinate system: Both board and screen use top-left origin
// Board: x right, y down (mm)
// Screen: x right, y down (px)

export type RenderPass = {
  id: string;
  order: number;
  enabled: () => boolean;
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
