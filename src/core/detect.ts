// src/core/detect.ts

import { unzipGerbersZip } from "../io/unzip";
import type { GerberBundleType, GerberDetectResult } from "./types";

type DirInput = Record<string, Uint8Array>;

function isDirInput(x: unknown): x is DirInput {
  return !!x && typeof x === "object" && !(x instanceof ArrayBuffer) && !(x instanceof Uint8Array);
}

function toU8(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

// Ensure we pass a real ArrayBuffer (not ArrayBufferLike) and not an offset view.
function toExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const ab =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
      ? bytes.buffer
      : bytes.slice().buffer;

  // TypeScript sometimes treats bytes.buffer as ArrayBufferLike; normalize.
  return ab as ArrayBuffer;
}

function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  if (bytes.length < offset + sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (bytes[offset + i] !== sig[i]) return false;
  }
  return true;
}

function detectArchiveTypeFromBytes(bytes: Uint8Array): GerberBundleType {
  // ZIP: PK..
  if (
    startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
    startsWith(bytes, [0x50, 0x4b, 0x07, 0x08])
  ) {
    return "zip";
  }

  // RAR4: 52 61 72 21 1A 07 00
  // RAR5: 52 61 72 21 1A 07 01 00
  if (
    startsWith(bytes, [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00]) ||
    startsWith(bytes, [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00])
  ) {
    return "rar";
  }

  // 7z: 37 7A BC AF 27 1C
  if (startsWith(bytes, [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c])) {
    return "7z";
  }

  // tar: "ustar" at offset 257
  if (bytes.length > 262 && startsWith(bytes, [0x75, 0x73, 0x74, 0x61, 0x72], 257)) {
    return "tar";
  }

  return "unknown";
}

function normalizeName(name: string): string {
  return name.replace(/\\/g, "/").replace(/^\.?\//, "");
}

function scoreGerberLike(files: string[]): { confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  const lower = files.map((f) => normalizeName(f).toLowerCase());

  const has = (pred: (s: string) => boolean) => lower.some(pred);

  const gerberExt = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i;
  const drillExt = /\.(drl|xln)$/i;

  const gerberLikeCount = lower.filter((f) => gerberExt.test(f)).length;
  const drillLikeCount = lower.filter((f) => drillExt.test(f) || f.includes("drill")).length;

  const hasTop = has((f) => (f.includes("top") && f.includes("copper")) || f.endsWith(".gtl"));
  const hasBottom = has((f) => f.includes("bot") || f.includes("bottom") || f.endsWith(".gbl"));
  const hasMask = has((f) => f.includes("mask") || f.includes("solder") || f.endsWith(".gts") || f.endsWith(".gbs"));
  const hasSilk = has((f) => f.includes("silk") || f.includes("legend") || f.endsWith(".gto") || f.endsWith(".gbo"));
  const hasOutline = has((f) => f.includes("outline") || f.includes("profile") || f.includes("edge") || f.endsWith(".gko") || f.endsWith(".gm1") || f.endsWith(".gml"));

  const obviousNonGerber = lower.every((f) =>
    f.endsWith(".pdf") ||
    f.endsWith(".png") ||
    f.endsWith(".jpg") ||
    f.endsWith(".jpeg") ||
    f.endsWith(".svg") ||
    f.endsWith(".txt") ||
    f.endsWith(".md")
  );

  let score = 0;

  if (files.length === 0) {
    reasons.push("No files found.");
    return { confidence: 0, reasons };
  }

  if (obviousNonGerber) {
    reasons.push("Bundle only contains documents/images (no Gerber-like files).");
    return { confidence: 0.05, reasons };
  }

  if (gerberLikeCount > 0) {
    score += 0.35;
    reasons.push(`Found ${gerberLikeCount} Gerber-like file(s) by extension.`);
  } else {
    reasons.push("No common Gerber extensions detected.");
  }

  if (drillLikeCount > 0) {
    score += 0.2;
    reasons.push(`Found ${drillLikeCount} drill-like file(s).`);
  }

  if (hasOutline) {
    score += 0.15;
    reasons.push("Found outline/profile/edge candidate.");
  }

  if (hasTop && hasBottom) {
    score += 0.2;
    reasons.push("Found both top and bottom copper candidates.");
  } else if (hasTop || hasBottom) {
    score += 0.1;
    reasons.push("Found at least one copper candidate.");
  }

  if (hasMask) {
    score += 0.05;
    reasons.push("Found solder mask candidate.");
  }

  if (hasSilk) {
    score += 0.05;
    reasons.push("Found silkscreen/legend candidate.");
  }

  score = Math.max(0, Math.min(1, score));

  if (score < 0.6 && gerberLikeCount >= 2) {
    score = Math.max(score, 0.55);
    reasons.push("Multiple Gerber-like files found, but layer completeness is unclear.");
  }

  return { confidence: score, reasons };
}

export async function detectGerberBundle(
  input: ArrayBuffer | Uint8Array | Record<string, Uint8Array>
): Promise<GerberDetectResult> {
  // Directory-style input
  if (isDirInput(input)) {
    const files = Object.keys(input).map(normalizeName);
    const { confidence, reasons } = scoreGerberLike(files);
    return {
      isGerber: confidence >= 0.6,
      archiveType: "directory",
      confidence,
      reasons,
      files,
    };
  }

  const bytes = toU8(input);
  const archiveType = detectArchiveTypeFromBytes(bytes);

  if (archiveType === "zip") {
    try {
      const ab = toExactArrayBuffer(bytes);
      const entries = await unzipGerbersZip(ab);
      const files = entries.map((e) => e.name);
      const { confidence, reasons } = scoreGerberLike(files);
      return {
        isGerber: confidence >= 0.6,
        archiveType: "zip",
        confidence,
        reasons,
        files,
      };
    } catch (err) {
      return {
        isGerber: false,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(err)],
      };
    }
  }

  if (archiveType === "rar" || archiveType === "7z" || archiveType === "tar") {
    return {
      isGerber: false,
      archiveType,
      confidence: 0.2,
      reasons: [
        `Detected ${archiveType} archive by signature.`,
        "Archive type is not unpacked by default. Use list/detect for UX, or add a decoder to render.",
      ],
    };
  }

  // Could be a single Gerber file or random bytes
  const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 4096));
  const looksGerber =
    head.includes("%FSLAX") ||
    head.includes("%MOIN") ||
    head.includes("%MOMM") ||
    head.includes("G04") ||
    head.includes("%ADD");

  if (looksGerber) {
    return {
      isGerber: true,
      archiveType: "single-file",
      confidence: 0.7,
      reasons: ["Input appears to be a single Gerber file (RS-274X markers detected)."],
    };
  }

  return {
    isGerber: false,
    archiveType: "unknown",
    confidence: 0.0,
    reasons: ["Input does not match known archive signatures and does not resemble a Gerber file."],
  };
}
