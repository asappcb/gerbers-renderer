// src/io/file-normalizer.ts

/**
 * Normalize generic text file content coming from zip entries:
 * - Strip UTF-8 BOM if present
 * - Normalize line endings to "\n"
 * - Trim leading and trailing blank lines
 */
export function normalizeTextContent(raw: string): string {
  let text = stripBom(raw);
  text = normalizeLineEndings(text);
  text = trimEmptyEdges(text);
  return text;
}

/**
 * Normalize Gerber specific content if needed.
 * Currently just uses generic normalization, but this is the extension point
 * for future format specific tweaks.
 */
export function normalizeGerberText(raw: string): string {
  return normalizeTextContent(raw);
}

/**
 * Normalize Excellon drill file content if needed.
 * Currently just uses generic normalization.
 */
export function normalizeDrillText(raw: string): string {
  return normalizeTextContent(raw);
}

/**
 * Remove UTF-8 BOM if present.
 */
function stripBom(text: string): string {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.slice(1);
  }
  return text;
}

/**
 * Convert CRLF and CR line endings to LF.
 */
function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Trim leading and trailing completely empty lines.
 */
function trimEmptyEdges(text: string): string {
  const lines = text.split("\n");

  let start = 0;
  while (start < lines.length && lines[start].trim() === "") {
    start++;
  }

  let end = lines.length - 1;
  while (end >= start && lines[end].trim() === "") {
    end--;
  }

  if (start === 0 && end === lines.length - 1) {
    return text;
  }

  return lines.slice(start, end + 1).join("\n");
}
