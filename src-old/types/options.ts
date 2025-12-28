// src/types/options.ts
import type { LayerHints } from "../io/file-classifier";

export interface LoadFromZipOptions {
  /**
   * Board thickness in millimeters.
   * Used when the geometry pipeline builds the 3D model.
   */
  boardThicknessMm?: number;

  /**
   * Optional hints to override layer role detection based on filenames.
   */
  layerHints?: LayerHints;
}

/**
 * Options used when you eventually hook this into a 3D viewer.
 * For now, only LoadFromZipOptions is used by the pipeline.
 */
export interface RenderFromZipOptions extends LoadFromZipOptions {
  canvas?: HTMLCanvasElement;
}
