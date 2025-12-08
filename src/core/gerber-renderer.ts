// src/core/gerber-renderer.ts

import type { RenderFromZipOptions, LoadFromZipOptions } from "../types/options";
import type { PcbModelGeometry } from "../types/pcb-model";
import { loadPcbGeometryFromZip as loadGeometry } from "./pipeline";
import { Viewer3D } from "../render/three/viewer-3d";

/**
 * Thin wrapper around the pipeline to expose a nice geometry loader.
 *
 * This is what you would call if you just want the parsed geometry:
 *
 *   const geom = await loadPcbGeometryFromZip(file, { boardThicknessMm: 1.6 });
 */
export async function loadPcbGeometryFromZip(
  input: File | Blob | ArrayBuffer,
  options: LoadFromZipOptions = {}
): Promise<PcbModelGeometry> {
  return loadGeometry(input, options);
}

/**
 * Future facing entry point that will also create and manage a 3D viewer.
 *
 * For now, this only loads the geometry and returns it, while ignoring
 * the canvas option. Once the Three.js viewer is implemented, this
 * function will:
 *
 * - Load geometry from the zip
 * - Build a Three.js scene
 * - Attach it to the provided canvas
 * - Return a Viewer instance with methods like:
 *   - setLayerVisible
 *   - resize
 *   - dispose
 */
// export async function renderGerbersZip(
//   input: File | Blob | ArrayBuffer,
//   options: RenderFromZipOptions
// ): Promise<{ geometry: PcbModelGeometry }> {
//   const geometry = await loadGeometry(input, options);

//   // TODO: in the next step, integrate with a Viewer3D class, for example:
//   // const viewer = new Viewer3D(geometry, { canvas: options.canvas, ... });
//   // return { geometry, viewer };

//   return { geometry };
// }


export async function renderGerbersZip(
  input: File | Blob | ArrayBuffer,
  options: RenderFromZipOptions
): Promise<{ geometry: PcbModelGeometry; viewer?: Viewer3D }> {
  const geometry = await loadGeometry(input, options);

  let viewer: Viewer3D | undefined;
  if (options.canvas) {
    viewer = new Viewer3D(geometry, {
      canvas: options.canvas,
      autoResize: true,
      usePbrMaterials: true,
    });
  }

  return { geometry, viewer };
}
