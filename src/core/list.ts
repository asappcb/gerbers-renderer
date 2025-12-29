// src/core/list.ts

import { unzipGerbersZip } from "../io/unzip";
import { classifyLayerNames } from "../render/layerClassify";
import type { GerberFileListResult, ListedLayer } from "./types";
import { detectGerberBundle } from "./detect";

type DirInput = Record<string, Uint8Array>;

function isDirInput(x: unknown): x is DirInput {
  return !!x && typeof x === "object" && !(x instanceof ArrayBuffer) && !(x instanceof Uint8Array);
}

function toU8(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

function toExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const ab =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
      ? bytes.buffer
      : bytes.slice().buffer;
  return ab as ArrayBuffer;
}

function normalize(name: string): string {
  return name.replace(/\\/g, "/").replace(/^\.?\//, "");
}

function layerRecord(filename: string): ListedLayer {
  const f = filename.toLowerCase();

  if (f.includes("drill") || f.endsWith(".drl") || f.endsWith(".xln")) {
    return { filename, type: "drill" };
  }

  if (
    f.includes("outline") ||
    f.includes("profile") ||
    f.includes("edge") ||
    f.endsWith(".gko") ||
    f.endsWith(".gm1") ||
    f.endsWith(".gml")
  ) {
    return { filename, type: "outline" };
  }

  if (f.includes("mask") || f.includes("solder") || f.endsWith(".gts") || f.endsWith(".gbs")) {
    return {
      filename,
      type: "mask",
      side: f.includes("bot") || f.includes("bottom") || f.endsWith(".gbs") ? "bottom" : "top",
    };
  }

  if (f.includes("silk") || f.includes("legend") || f.endsWith(".gto") || f.endsWith(".gbo")) {
    return {
      filename,
      type: "silk",
      side: f.includes("bot") || f.includes("bottom") || f.endsWith(".gbo") ? "bottom" : "top",
    };
  }

  if (f.includes("copper") || f.endsWith(".gtl") || f.endsWith(".gbl") || f.includes("layer") || f.includes("l1") || f.includes("l2")) {
    if (f.endsWith(".gtl") || f.includes("top")) return { filename, type: "copper", side: "top" };
    if (f.endsWith(".gbl") || f.includes("bot") || f.includes("bottom")) return { filename, type: "copper", side: "bottom" };
    if (f.includes("inner") || f.includes("in")) return { filename, type: "copper", side: "inner" };
    return { filename, type: "copper" };
  }

  return { filename, type: "unknown" };
}

function sortLayers(a: ListedLayer, b: ListedLayer): number {
  const order = (x: ListedLayer): number => {
    if (x.type === "outline") return 0;
    if (x.type === "drill") return 1;
    if (x.type === "copper" && x.side === "top") return 2;
    if (x.type === "copper" && x.side === "bottom") return 3;
    if (x.type === "mask" && x.side === "top") return 4;
    if (x.type === "mask" && x.side === "bottom") return 5;
    if (x.type === "silk" && x.side === "top") return 6;
    if (x.type === "silk" && x.side === "bottom") return 7;
    if (x.type === "copper" && x.side === "inner") return 8;
    return 9;
  };
  return order(a) - order(b) || a.filename.localeCompare(b.filename);
}

export async function listGerberFiles(
  input: ArrayBuffer | Uint8Array | Record<string, Uint8Array>
): Promise<GerberFileListResult> {
  const det = await detectGerberBundle(input);

  let files: string[] = [];

  if (det.archiveType === "directory") {
    const dir = input as Record<string, Uint8Array>;
    files = Object.keys(dir).map(normalize);
  } else if (det.archiveType === "zip") {
    const bytes = toU8(input as ArrayBuffer | Uint8Array);
    const ab = toExactArrayBuffer(bytes);
    const entries = await unzipGerbersZip(ab);
    files = entries.map((e) => e.name);
  } else if (det.archiveType === "single-file") {
    return {
      layers: [{ filename: "input", type: "unknown" }],
      boardOutlinePresent: false,
      drillPresent: false,
    };
  } else {
    return { layers: [], boardOutlinePresent: false, drillPresent: false };
  }

  const classified = classifyLayerNames(files);

  const layers: ListedLayer[] = files.map((fn) => layerRecord(fn));
  const boardOutlinePresent = !!classified.outline || layers.some((l) => l.type === "outline");
  const drillPresent = !!classified.drills || layers.some((l) => l.type === "drill");

  layers.sort(sortLayers);

  return { layers, boardOutlinePresent, drillPresent };
}
