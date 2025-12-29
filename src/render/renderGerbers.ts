// src/render/renderGerbers.ts
import { unpackGerberArchive } from "../io/unpackArchive";
import { renderGerbersFiles } from "./renderGerbersFiles";

export async function renderGerbers(
  input: ArrayBuffer | Uint8Array,
  options?: { archiveWorkerUrl?: string }
) {
  const { files } = await unpackGerberArchive(input, {
    workerUrl: options?.archiveWorkerUrl,
  });
  return await renderGerbersFiles(files);
}
