export { renderGerbersZip } from "./render/renderGerbersZip";
export { renderGerbers } from "./render/renderGerbers";
export { renderGerbersFiles } from "./render/renderGerbersFiles";

export { detectGerberBundle } from "./core/detect";

export type { RenderResult } from "./render/renderGerbersFiles";
export type { BoardGeom, ViewerLayers, ViewerSideMode } from "./viewer/types";
export { GerberError } from "./core/errors";

// New render pipeline system
export { ViewportTransform } from "./render-pipeline/core/viewportTransform";
export { Viewer } from "./render-pipeline/viewer";
export { RenderScheduler } from "./render-pipeline/core/renderScheduler";
export { VisibilityManager } from "./render-pipeline/visibilityManager";
export { createIntegratedViewer, type IntegratedViewerOptions } from "./render-pipeline/integratedViewer";
export { 
  OverlayRegistry, 
  MarkerRenderer, 
  SelectionRenderer,
  createGerberPass,
  createOverlayPass,
  createMarkerPass,
  createSelectionPass,
  type Overlay,
  type OverlayHelpers,
  type Marker,
  type Selection
} from "./render-pipeline/renderPasses";
export type { 
  RenderCtx, 
  RenderPass, 
  VisibilityState
} from "./render-pipeline/core/renderContract";
export type { 
  CameraState,
  Viewport,
  Vec2,
  Mat3
} from "./render-pipeline/core/viewportTransform";