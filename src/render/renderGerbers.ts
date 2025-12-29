// src/render/renderGerbers.ts

import type { RenderResult as ZipRenderResult } from "./renderGerbersZip";
import { renderGerbersZip } from "./renderGerbersZip";
import { detectGerberBundle } from "../core/detect";
import { GerberError } from "../core/errors";

export async function renderGerbers(
  input: ArrayBuffer | Uint8Array | Record<string, Uint8Array>
) {
  const det = await detectGerberBundle(input);

  if (!det.isGerber) {
    throw new GerberError(
      "NOT_GERBER",
      "Input does not appear to be a Gerber bundle.",
      det
    );
  }

  if (det.archiveType === "zip") {
    if (input instanceof Uint8Array) {
      const ab =
        input.byteOffset === 0 && input.byteLength === input.buffer.byteLength
          ? (input.buffer as ArrayBuffer)
          : (input.slice().buffer as ArrayBuffer);
      return await renderGerbersZip(ab);
    }

    if (input instanceof ArrayBuffer) {
      return await renderGerbersZip(input);
    }

    // Should never happen due to archiveType detection, but guard anyway
    throw new GerberError("NOT_AN_ARCHIVE", "Expected zip bytes.");
  }

  if (det.archiveType === "directory") {
    throw new GerberError(
      "UNSUPPORTED_ARCHIVE",
      "Directory input rendering not implemented yet. Zip is supported.",
      det
    );
  }

  if (det.archiveType === "rar" || det.archiveType === "7z" || det.archiveType === "tar") {
    throw new GerberError(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${det.archiveType}`,
      det
    );
  }

  throw new GerberError("NOT_AN_ARCHIVE", "Unsupported input type.", det);
}
