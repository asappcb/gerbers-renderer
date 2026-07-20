// src/render/gerberWorker.ts
//
// Web-worker entry: runs the DOM-free render core off the main thread and posts
// back the pure SvgRenderResult (SVG strings + geometry + stackup ids). The main
// thread wraps it into blob URLs. Only zip / single-file inputs are supported in
// the worker (rar needs the libarchive worker, which isn't wired here).

import { renderGerberSvgDocs } from "./renderGerbersFiles";
import { unpackGerberArchive } from "../io/unpackArchive";

type Req = {
  id: number;
  input: ArrayBuffer | Record<string, Uint8Array>;
};

self.onmessage = async (e: MessageEvent<Req>) => {
  const { id, input } = e.data;
  try {
    let files: Record<string, Uint8Array>;
    if (input instanceof ArrayBuffer) {
      files = (await unpackGerberArchive(new Uint8Array(input))).files;
    } else {
      files = input;
    }
    const docs = await renderGerberSvgDocs(files);
    (self as unknown as Worker).postMessage({ id, ok: true, docs });
  } catch (err: any) {
    (self as unknown as Worker).postMessage({
      id,
      ok: false,
      error: { message: String(err?.message ?? err), code: err?.code },
    });
  }
};
