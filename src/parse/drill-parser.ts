// src/parse/drill-parser.ts

import type { DrillHole } from "../types/pcb-model";

export interface DrillSlot {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  diameter: number;
}

/**
 * Parsed drill data for a single Excellon file.
 * This will be fed into the geometry pipeline.
 */
export interface ParsedDrillData {
  name: string;
  holes: DrillHole[];
  slots: DrillSlot[];
}

/**
 * Parse a format placeholder like "000.000" (use digit count)
 * or a literal like "2.4" (use integer values).
 */
function parseFormatDigits(intStr: string, decStr: string): { fmtInt: number; fmtDec: number } {
  // All-zero strings like "000" encode digit count (e.g. Altium METRIC,LZ,000.000)
  if (/^0+$/.test(intStr) && /^0+$/.test(decStr)) {
    return { fmtInt: intStr.length, fmtDec: decStr.length };
  }
  return { fmtInt: parseInt(intStr, 10), fmtDec: parseInt(decStr, 10) };
}

/**
 * Excellon drill file parser.
 *
 * Handles:
 * - M48 header block (terminated by %) for unit/format detection
 * - METRIC / INCH unit declarations with inline format (e.g. METRIC,LZ,000.000)
 * - FMAT / FS coordinate format (integer + decimal digit counts)
 * - Tool definitions: T01C0.300
 * - Tool selection: T01
 * - Coordinate lines: X1.234Y5.678  or  X012345Y067890 (integer-encoded)
 * - G90 (absolute coords), G05 (drill mode) — accepted, ignored
 * - G00 (rapid rout move), G01 (linear rout) — routing mode
 * - M15 (plunge / start rout), M16/M17 (retract / end rout)
 * - G85 oblong slot: X...Y...G85X...Y...
 * - M30 (end of file)
 */
export function parseDrillFile(name: string, content: string): ParsedDrillData {
  const lines = content.split(/\r?\n/);

  const toolDiameters = new Map<string, number>(); // T code -> diameter in mm
  let currentTool: string | null = null;
  const holes: DrillHole[] = [];
  const slots: DrillSlot[] = [];

  // Format state — inch defaults (2.4); overridden when METRIC/INCH header seen
  let unitScale = 1.0;
  let fmtInt = 2;
  let fmtDec = 4;
  let inHeader = false;
  let fmtExplicit = false;

  // Routing mode state
  let inRoutMode = false; // true between M15 and M16/M17
  let routX = 0;
  let routY = 0;
  let gMode = 5; // 5=drill, 0=rapid, 1=linear-rout

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

    // Rout mode plunge/retract
    if (line === "M15") { inRoutMode = true; continue; }
    if (line === "M16" || line === "M17") { inRoutMode = false; gMode = 5; continue; }

    if (inHeader) {
      if (line.startsWith("METRIC")) {
        unitScale = 1.0;
        // Altium metric default is 3.3 unless the header specifies otherwise
        if (!fmtExplicit) { fmtInt = 3; fmtDec = 3; }
        // Inline format: METRIC,LZ,000.000
        const mfmt = /(\d+)\.(\d+)/.exec(line);
        if (mfmt) {
          const f = parseFormatDigits(mfmt[1], mfmt[2]);
          fmtInt = f.fmtInt; fmtDec = f.fmtDec; fmtExplicit = true;
        }
      } else if (line.startsWith("INCH")) {
        unitScale = 25.4;
        if (!fmtExplicit) { fmtInt = 2; fmtDec = 4; }
        const mfmt = /(\d+)\.(\d+)/.exec(line);
        if (mfmt) {
          const f = parseFormatDigits(mfmt[1], mfmt[2]);
          fmtInt = f.fmtInt; fmtDec = f.fmtDec; fmtExplicit = true;
        }
      }
      // Standalone format line: FMAT,2.4 or 000.0000
      const fmtMatch = /^FMAT,(\d+)\.(\d+)/.exec(line) || /^(\d+)\.(\d+)$/.exec(line);
      if (fmtMatch) {
        const f = parseFormatDigits(fmtMatch[1], fmtMatch[2]);
        fmtInt = f.fmtInt; fmtDec = f.fmtDec; fmtExplicit = true;
      }
      // Tool definitions can appear in header too — fall through to tool-def parsing below
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

    // Track G-mode changes (G00=rapid, G01=linear rout, G05=drill)
    // Handles both standalone G-code lines and G-code prefixed coordinate lines
    const gModeMatch = /^G0*([015])(?!\d)/.exec(line);
    if (gModeMatch) gMode = parseInt(gModeMatch[1], 10);

    // Skip non-coordinate G/R/M/F lines (but not lines that also contain X)
    if (/^[GRMF]/.test(line) && !/X/i.test(line)) continue;

    const diameter = (currentTool && toolDiameters.has(currentTool))
      ? toolDiameters.get(currentTool)!
      : 0.6;

    // G85 oblong slot on a single line: X...Y...G85X...Y...
    const g85 = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(line);
    if (g85) {
      const x1 = decodeCoord(g85[1]), y1 = decodeCoord(g85[2]);
      const x2 = decodeCoord(g85[3]), y2 = decodeCoord(g85[4]);
      if (Number.isFinite(x1) && Number.isFinite(y1)) {
        slots.push({ x1, y1, x2, y2, diameter });
        routX = x2; routY = y2;
      }
      continue;
    }

    // Regular coordinate line: X...Y...
    const coord = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(line);
    if (coord) {
      const xVal = decodeCoord(coord[1]);
      const yVal = decodeCoord(coord[2]);
      if (Number.isFinite(xVal) && Number.isFinite(yVal)) {
        if (gMode === 0) {
          // Rapid move — update position only, no hole/slot
        } else if (inRoutMode && gMode === 1) {
          // Linear rout — slot from previous position to current
          slots.push({ x1: routX, y1: routY, x2: xVal, y2: yVal, diameter });
        } else {
          // Drill mode — create hole
          holes.push({ x: xVal, y: yVal, diameter, plated: true });
        }
        routX = xVal;
        routY = yVal;
      }
    }
  }

  return { name, holes, slots };
}
