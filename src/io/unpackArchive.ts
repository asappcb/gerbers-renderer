// src/io/unpackArchive.ts
import JSZip from "jszip";
import { detectGerberBundle } from "../core/detect";
import { GerberError } from "../core/errors";

type ArchiveInit = { workerUrl?: string };

export type UnpackResult = {
  archiveType: "zip" | "rar";
  files: Record<string, Uint8Array>;
};

function normalizeName(name: string): string {
  let p = name.replace(/\\/g, "/");
  if (p.startsWith("./")) p = p.slice(2);
  if (p.startsWith("/")) p = p.slice(1);
  return p;
}

function ensureUint8(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  try {
    return bytes.slice().buffer;
  } catch {
    const out = new Uint8Array(bytes.byteLength);
    out.set(bytes);
    return out.buffer;
  }
}

async function unzipBytes(bytes: Uint8Array): Promise<Record<string, Uint8Array>> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(toArrayBuffer(bytes));
  } catch (error) {
    throw new GerberError(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      error
    );
  }

  const out: Record<string, Uint8Array> = {};

  const MAX_FILES = 1000;
  const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

  const entries = Object.entries(zip.files).filter(([, f]) => f && !f.dir);
  if (entries.length > MAX_FILES) {
    throw new GerberError(
      "PARSE_ERROR",
      `ZIP contains too many files (${entries.length} > ${MAX_FILES})`
    );
  }

  let totalBytes = 0;
  for (const [rawName, file] of entries) {
    try {
      const name = normalizeName(rawName);
      const ab = await file.async("arraybuffer");
      totalBytes += ab.byteLength;
      if (totalBytes > MAX_TOTAL_BYTES) {
        throw new GerberError(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${MAX_TOTAL_BYTES} bytes)`
        );
      }
      out[name] = new Uint8Array(ab);
    } catch (error) {
      console.warn(`Failed to extract file ${rawName}:`, error);
    }
  }

  if (Object.keys(out).length === 0) {
    throw new GerberError("PARSE_ERROR", "No files extracted from ZIP archive");
  }

  return out;
}

async function unrarBytes(bytes: Uint8Array, init?: ArchiveInit): Promise<Record<string, Uint8Array>> {
  let Archive: any;
  
  try {
    // Dynamic import to avoid loading unless needed
    const mod = await import("libarchive.js");
    Archive = (mod as any).Archive ?? (mod as any).default?.Archive;
  } catch (error) {
    throw new GerberError(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      error
    );
  }

  if (!Archive) {
    throw new GerberError("PARSE_ERROR", "libarchive.js did not export Archive");
  }

  // Consumer must provide workerUrl OR host the worker bundle next to the module.
  if (init?.workerUrl) {
    try {
      Archive.init({ workerUrl: init.workerUrl });
    } catch (error) {
      throw new GerberError(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        error
      );
    }
  }

  let archive: any;
  try {
    const blob = new Blob([toArrayBuffer(bytes)], { type: 'application/octet-stream' });
    archive = await Archive.open(blob);
  } catch (error) {
    throw new GerberError("NOT_AN_ARCHIVE", "Failed to open RAR archive", error);
  }

  let extracted: any;
  try {
    // Set a timeout to prevent hanging on large archives
    extracted = await Promise.race([
      archive.extractFiles(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Extraction timed out')), 30000)
      )
    ]);
  } catch (error) {
    throw new GerberError("PARSE_ERROR", "Failed to extract RAR archive", error);
  }

  const out: Record<string, Uint8Array> = {};
  let fileCount = 0;
  const MAX_FILES = 1000;
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
  let totalSize = 0;

  async function walk(node: any, prefix: string): Promise<void> {
    if (fileCount >= MAX_FILES) {
      throw new GerberError(
        "PARSE_ERROR",
        `Archive contains too many files (max ${MAX_FILES})`
      );
    }

    for (const key of Object.keys(node)) {
      const val = node[key];
      const path = prefix ? `${prefix}/${key}` : key;

      if (val instanceof File || val instanceof Blob) {
        fileCount++;
        try {
          const ab = await val.arrayBuffer();
          totalSize += ab.byteLength;
          
          if (totalSize > MAX_TOTAL_SIZE) {
            throw new GerberError(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${MAX_TOTAL_SIZE} bytes)`
            );
          }
          
          out[normalizeName(path)] = new Uint8Array(ab);
        } catch (error) {
          console.warn(`Failed to extract file ${path}:`, error);
          // Continue with other files
        }
      } else if (val && typeof val === 'object') {
        await walk(val, path);
      }
    }
  }

  try {
    await walk(extracted, '');
  } finally {
    // Clean up resources
    if (archive && typeof archive.close === 'function') {
      try {
        await archive.close();
      } catch (error) {
        console.warn('Failed to close archive:', error);
      }
    }
  }

  if (Object.keys(out).length === 0) {
    throw new GerberError("PARSE_ERROR", "No files extracted from RAR archive");
  }

  return out;
}

export async function unpackGerberArchive(
  input: ArrayBuffer | Uint8Array,
  init?: ArchiveInit
): Promise<UnpackResult> {
  if (!input || (input as ArrayBuffer).byteLength === 0) {
    throw new GerberError("NOT_AN_ARCHIVE", "Input is empty");
  }

  const bytes = ensureUint8(input);
  
  // Validate input size (100MB max)
  const MAX_INPUT_SIZE = 100 * 1024 * 1024; // 100MB
  if (bytes.length > MAX_INPUT_SIZE) {
    throw new GerberError(
      "PARSE_ERROR",
      `Input size (${bytes.length} bytes) exceeds maximum allowed size (${MAX_INPUT_SIZE} bytes)`
    );
  }

  let det;
  try {
    det = await detectGerberBundle(bytes);
  } catch (error) {
    throw new GerberError("PARSE_ERROR", "Failed to detect archive type", error);
  }

  if (!det.isGerber) {
    throw new GerberError(
      "NOT_GERBER",
      det.reasons.join("; ") || "Not a Gerber bundle",
      det
    );
  }

  try {
    if (det.archiveType === 'zip') {
      return { archiveType: 'zip', files: await unzipBytes(bytes) };
    }

    if (det.archiveType === 'rar') {
      return { archiveType: 'rar', files: await unrarBytes(bytes, init) };
    }

    throw new GerberError(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${det.archiveType}`,
      det
    );
  } catch (error) {
    if (error instanceof GerberError) throw error;
    throw new GerberError(
      "PARSE_ERROR",
      error instanceof Error ? error.message : "Unknown error during extraction",
      { error, det }
    );
  }
}
