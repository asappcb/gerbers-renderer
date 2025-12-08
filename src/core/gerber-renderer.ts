import { loadPcbGeometryFromZip } from "./pipeline";
import { Viewer3D } from "../render/three/viewer-3d";
import type { RenderFromZipOptions } from "../types/options";
import type { PcbModelGeometry } from "../types/pcb-model";

export async function renderGerbersZip(file: File | ArrayBuffer, opts: RenderFromZipOptions) {
  const geometry = await loadPcbGeometryFromZip(file, opts);
  const viewer = new Viewer3D(geometry, opts);
  return viewer; // exposes .dispose(), .setLayerVisible(), etc
}

export async function loadPcbGeometryFromZip(
  file: File | ArrayBuffer,
  opts?: RenderFromZipOptions
): Promise<PcbModelGeometry> {
  return loadPcbGeometryFromZip(file, opts);
}
