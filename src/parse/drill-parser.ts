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
 * Very naive Excellon drill parser.
 *
 * This is intentionally simple and conservative:
 * - It understands basic tool definitions like "T01C0.300"
 * - It understands coordinate lines like "X012345Y067890"
 * - It assumes units are already inches or mm as used in the file, and does
 *   not attempt unit conversion or integer format decoding.
 *
 * For now, you can treat this as a stub and gradually swap in a robust parser
 * if needed. At minimum, it gives you some real hole locations to play with.
 */
export function parseDrillFile(name: string, content: string): ParsedDrillData {
  const lines = content.split(/\r?\n/);

  const toolDiameters = new Map<string, number>(); // T code -> diameter (same units as file)
  let currentTool: string | null = null;

  const holes: DrillHole[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Comment or header lines we ignore for now
    if (line.startsWith(";")) continue;

    // Tool definition, examples:
    // T01C0.300
    // T02C0.600
    if (line.startsWith("T") && line.includes("C")) {
      const toolMatch = /^T(\d+)[C]([\d.]+)/i.exec(line);
      if (toolMatch) {
        const toolId = toolMatch[1]; // "01"
        const diameter = parseFloat(toolMatch[2]);
        if (!Number.isNaN(diameter)) {
          toolDiameters.set(toolId, diameter);
        }
      }
      continue;
    }

    // Tool change, like "T01"
    if (line.startsWith("T") && !line.includes("C")) {
      const toolMatch = /^T(\d+)/i.exec(line);
      if (toolMatch) {
        currentTool = toolMatch[1];
      }
      continue;
    }

    // Coordinate line, very naive:
    // X012345Y067890
    // X1.234Y5.678
    if (line[0] === "X" || line.includes("X")) {
      const coordMatch = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(line);
      if (!coordMatch) {
        continue;
      }

      const xRaw = coordMatch[1];
      const yRaw = coordMatch[2];
      const xVal = parseFloat(xRaw);
      const yVal = parseFloat(yRaw);

      if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
        continue;
      }

      const diameter =
        currentTool && toolDiameters.has(currentTool)
          ? toolDiameters.get(currentTool)!
          : 0.6; // default fallback diameter

      holes.push({
        x: xVal,
        y: yVal,
        diameter,
        plated: true, // default, later you can infer from file or layer
      });
      continue;
    }

    // Everything else is ignored for now
  }

  return {
    name,
    holes,
  };
}
