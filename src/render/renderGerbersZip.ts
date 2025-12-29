// src/render/renderGerbersZip.ts
import { unpackGerberArchive } from "../io/unpackArchive";
import { renderGerbersFiles, type RenderResult } from "./renderGerbersFiles";

export async function renderGerbersZip(input: File | Blob | ArrayBuffer | Uint8Array): Promise<RenderResult> {
  const ab =
    input instanceof Uint8Array
      ? (input.byteOffset === 0 && input.byteLength === input.buffer.byteLength
          ? input.buffer
          : input.slice().buffer)
      : input instanceof ArrayBuffer
        ? input
        : await input.arrayBuffer();

  const { files, archiveType } = await unpackGerberArchive(ab as ArrayBuffer, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js",
  });

  if (archiveType !== "zip") {
    throw new Error(`renderGerbersZip expected zip but got ${archiveType}`);
  }

  return await renderGerbersFiles(files);
}

export type { RenderResult };
