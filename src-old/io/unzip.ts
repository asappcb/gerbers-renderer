// src/io/unzip.ts
import JSZip from "jszip";

/**
 * A single entry inside the unzipped gerbers.zip
 */
export interface ZipEntry {
  /** Normalized path style name, always forward slashes */
  name: string;
  /** Read entry as UTF-8 text */
  text: () => Promise<string>;
  /** Read entry as ArrayBuffer */
  arrayBuffer: () => Promise<ArrayBuffer>;
}

/**
 * Accepts a File, Blob, or ArrayBuffer and returns a list of ZipEntry helpers.
 */
export async function unzipGerbersZip(
  input: File | Blob | ArrayBuffer
): Promise<ZipEntry[]> {
  const buffer = await toArrayBuffer(input);
  const zip = await JSZip.loadAsync(buffer);

  const entries: ZipEntry[] = [];

  zip.forEach((rawName, file) => {
    if (file.dir) {
      // Ignore directories
      return;
    }

    const normalizedName = normalizeZipPath(rawName);

    entries.push({
      name: normalizedName,
      text: () => file.async("text"),
      arrayBuffer: () => file.async("arraybuffer"),
    });
  });

  return entries;
}

/**
 * Convert various supported inputs into ArrayBuffer
 */
async function toArrayBuffer(input: File | Blob | ArrayBuffer): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) {
    return input;
  }

  if (input instanceof Blob) {
    // File inherits from Blob
    return await input.arrayBuffer();
  }

  // Fallback, should not hit if types are correct
  throw new Error("Unsupported input type for unzipGerbersZip");
}

/**
 * Normalize zip entry paths:
 * - Replace backslashes with forward slashes
 * - Remove leading "./"
 */
function normalizeZipPath(path: string): string {
  let p = path.replace(/\\/g, "/");
  if (p.startsWith("./")) {
    p = p.slice(2);
  }
  // Remove leading slash if any
  if (p.startsWith("/")) {
    p = p.slice(1);
  }
  return p;
}
