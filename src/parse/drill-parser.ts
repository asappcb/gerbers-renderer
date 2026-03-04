// src/parse/drill-parser.ts

import type { DrillHole } from "../types/pcb-model";

/**
 * Parsed drill data for a single Excellon file.
 * This will be fed into the geometry pipeline.
 */
export interface ParsedDrillData {
  name: string;
  holes: DrillHole[];
}

/**
 * Excellon drill file parser.
 *
 * Handles:
 * - M48 header block (terminated by %) for unit/format detection
 * - METRIC / INCH unit declarations
 * - FMAT / FS coordinate format (integer + decimal digit counts)
 * - Tool definitions: T01C0.300
 * - Tool selection: T01
 * - Coordinate lines: X1.234Y5.678  or  X012345Y067890 (integer-encoded)
 * - G90 (absolute coords), G05 (drill mode) — accepted, ignored
 * - M30 (end of file)
 */
export function parseDrillFile(name: string, content: string): ParsedDrillData {
  const lines = content.split(/\r?\n/);

  const toolDiameters = new Map<string, number>(); // T code -> diameter in mm
  let currentTool: string | null = null;
  const holes: DrillHole[] = [];

  // Format state
  let unitScale = 1.0;   // 1 = mm, 25.4 = inch→mm
  let fmtInt = 2;        // integer digits in coordinate
  let fmtDec = 4;        // decimal digits in coordinate
  let inHeader = false;  // inside M48...% block

  const decodeCoord = (raw: string): number => {
    // If the string contains a decimal point, it's explicit — use directly
    if (raw.includes(".")) return parseFloat(raw) * unitScale;
    // Integer-encoded: implied decimal point based on fmtDec
    const sign = raw.startsWith("-") ? -1 : 1;
    const digits = raw.replace(/[+\-]/, "");
    const n = parseInt(digits, 10);
    if (Number.isNaN(n)) return 0;
    return sign * (n / Math.pow(10, fmtDec)) * unitScale;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith(";")) continue; // comment

    // M48: start of header
    if (line === "M48") { inHeader = true; continue; }
    // % alone: end of header block
    if (line === "%" && inHeader) { inHeader = false; continue; }
    // M30: end of program
    if (line === "M30" || line === "M00") break;

    if (inHeader) {
      // Unit mode
      if (line.startsWith("METRIC")) { unitScale = 1.0; }
      else if (line.startsWith("INCH")) { unitScale = 25.4; }
      // Format: FMAT,2 or coordinate format like 000.0000
      const fmtMatch = /^FMAT,(\d+)\.(\d+)/.exec(line) || /^(\d+)\.(\d+)$/.exec(line);
      if (fmtMatch) { fmtInt = parseInt(fmtMatch[1], 10); fmtDec = parseInt(fmtMatch[2], 10); }
      // Tool definitions can appear in header too
    }

    // Tool definition: T01C0.300 (diameter in current units)
    if (/^T\d+C[\d.]+/i.test(line)) {
      const m = /^T(\d+)C([\d.]+)/i.exec(line);
      if (m) {
        const d = parseFloat(m[2]) * unitScale;
        if (!Number.isNaN(d)) toolDiameters.set(m[1], d);
      }
      continue;
    }

    // Tool selection: T01
    if (/^T\d+$/i.test(line)) {
      const m = /^T(\d+)/i.exec(line);
      if (m) currentTool = m[1];
      continue;
    }

    // Skip G-codes and other non-coordinate lines
    if (/^[GRMF]/.test(line) && !/^X/.test(line)) continue;

    // Coordinate line: X...Y...
    const coordMatch = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(line);
    if (coordMatch) {
      const xVal = decodeCoord(coordMatch[1]);
      const yVal = decodeCoord(coordMatch[2]);
      if (!Number.isNaN(xVal) && !Number.isNaN(yVal)) {
        const diameter = (currentTool && toolDiameters.has(currentTool))
          ? toolDiameters.get(currentTool)!
          : 0.6;
        holes.push({ x: xVal, y: yVal, diameter, plated: true });
      }
    }
  }

  return { name, holes };
}
