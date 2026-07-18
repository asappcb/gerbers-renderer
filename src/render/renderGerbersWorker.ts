// src/render/renderGerbersWorker.ts
//
// Main-thread API that offloads parsing + SVG generation to a Web Worker,
// keeping the UI responsive on large boards. Falls back to the main thread if
// Workers are unavailable.

import { svgDocsToRenderResult, renderGerbersFiles, type RenderResult, type SvgRenderResult } from "./renderGerbersFiles";
import { GerberError } from "./../core/errors";

type WorkerInput = ArrayBuffer | Uint8Array | Record<string, Uint8Array>;

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (d: SvgRenderResult) => void; reject: (e: unknown) => void }>();

function getWorker(): Worker | null {
  if (typeof Worker === "undefined") return null;
  if (!worker) {
    worker = new Worker(new URL("./gerberWorker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent) => {
      const { id, ok, docs, error } = e.data;
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (ok) p.resolve(docs);
      else p.reject(new GerberError(error?.code ?? "PARSE_ERROR", error?.message ?? "Worker render failed"));
    };
    worker.onerror = (e) => {
      for (const [, p] of pending) p.reject(new GerberError("PARSE_ERROR", `Worker error: ${e.message}`));
      pending.clear();
    };
  }
  return worker;
}

/**
 * Render off the main thread. Accepts a zip / single-file buffer or a files map
 * (rar is not supported in the worker). Returns a blob-URL-backed RenderResult,
 * identical to renderGerbersFiles. Transparently falls back to the main thread
 * when Workers aren't available.
 */
export async function renderGerbersInWorker(input: WorkerInput): Promise<RenderResult> {
  const w = getWorker();
  if (!w) {
    // No worker support — run on the main thread.
    if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
      const { unpackGerberArchive } = await import("../io/unpackArchive");
      const { files } = await unpackGerberArchive(input);
      return renderGerbersFiles(files);
    }
    return renderGerbersFiles(input);
  }

  const id = ++seq;
  // Structured-clone the input (don't transfer) so the caller keeps its buffer.
  const payload = input instanceof Uint8Array ? input.buffer.slice(0) : input;

  const docs = await new Promise<SvgRenderResult>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ id, input: payload });
  });

  return svgDocsToRenderResult(docs);
}

/** Terminate the shared render worker (e.g. on teardown). */
export function disposeRenderWorker() {
  worker?.terminate();
  worker = null;
  pending.clear();
}
