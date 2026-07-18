export { renderGerbersZip } from "./render/renderGerbersZip";
export { renderGerbers } from "./render/renderGerbers";
export { renderGerbersFiles, renderGerberSvgDocs, svgDocsToRenderResult } from "./render/renderGerbersFiles";
export type { SvgRenderResult, SvgCopperRef } from "./render/renderGerbersFiles";
export { renderGerbersInWorker, disposeRenderWorker } from "./render/renderGerbersWorker";
export type { BoardStackup, CopperLayer } from "./viewer/types";

// Headless / CI render + SVG compositor
export {
  composeStackToSvg,
  renderGerbersToSvg,
  renderGerbersToImage,
} from "./render/headless";
export type {
  ComposeOptions,
  ImageOptions,
  SvgRasterizer,
  HeadlessInput,
} from "./render/headless";

// Revision diff
export { diffGerbers, computeDiffAlignment } from "./render/diff";
export type { DiffResult, DiffSide, DiffOptions, DiffInput, DiffAlignment } from "./render/diff";

// Shareable view state
export { encodeViewState, decodeViewState } from "./render-pipeline/viewState";
export type { ViewState } from "./render-pipeline/viewState";

export { detectGerberBundle } from "./core/detect";

export type { RenderResult } from "./render/renderGerbersFiles";
export type { BoardGeom, ViewerLayers, ViewerSideMode } from "./viewer/types";
export type {
  BoardGeometry, BoardFeature, BoardStats, PadFeature, HoleFeature, TraceFeature,
} from "./viewer/types";
export { GerberError } from "./core/errors";

// New render pipeline system
export { ViewportTransform } from "./render-pipeline/core/viewportTransform";
export { Viewer } from "./render-pipeline/viewer";
export { RenderScheduler } from "./render-pipeline/core/renderScheduler";
export { VisibilityManager } from "./render-pipeline/visibilityManager";
export {
  createIntegratedViewer,
  // Backward-compatible alias: the pre-1.0 public API (and existing consumers
  // such as gerber-preview-extension) import this name.
  createIntegratedViewer as createBoardViewer,
  type IntegratedViewerOptions,
} from "./render-pipeline/integratedViewer";

// Overlay system
export { OverlayRegistry } from "./render-pipeline/overlayRegistry";
export { createOverlayPass } from "./render-pipeline/overlayPass";
export { 
  createViolationDotsOverlay,
  createTooltipOverlay,
  createGridOverlay,
  createPulsingMarkerOverlay
} from "./render-pipeline/exampleOverlays";
export type { OverlayApi, Overlay } from "./render-pipeline/core/renderContract";

// Marker system
export { MarkerStore } from "./render-pipeline/markerStore";
export { MarkerRenderer } from "./render-pipeline/markerRenderer";
export { MarkerPicker } from "./render-pipeline/markerPicker";
export { createMarkerPass } from "./render-pipeline/markerPass";
export { UniformGridIndex } from "./render-pipeline/uniformGridIndex";
export type { Marker, MarkerHit } from "./render-pipeline/core/renderContract";

// Event system
export { Emitter } from "./render-pipeline/events";
export type { ViewerEvents } from "./render-pipeline/viewerEvents";

// Render passes
export {
  SelectionRenderer,
  createGerberPass,
  createSelectionPass,
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