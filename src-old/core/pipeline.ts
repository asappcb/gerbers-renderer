// src/core/pipeline.ts

import { unzipGerbersZip } from "../io/unzip";
import {
  classifyFiles,
  type ClassifiedFiles,
  type LayerHints,
} from "../io/file-classifier";

import type { LoadFromZipOptions } from "../types/options";
import type { PcbModelGeometry } from "../types/pcb-model";

// These types and functions are expected to be implemented later.
import { parseGerberFile, type GerberPrimitives } from "../parse/gerber-parser";
import { parseDrillFile, type ParsedDrillData } from "../parse/drill-parser";
import { buildPcbGeometry } from "../geometry/stackup-builder";

/**
 * Public entry point used by the rest of the library.
 * Takes a gerbers.zip as File, Blob, or ArrayBuffer and returns a
 * PcbModelGeometry object that can be fed into a 3D viewer.
 */
export async function loadPcbGeometryFromZip(
  input: File | Blob | ArrayBuffer,
  options: LoadFromZipOptions = {}
): Promise<PcbModelGeometry> {
  const zipEntries = await unzipGerbersZip(input);

  const hints: LayerHints | undefined = options.layerHints;
  const classified: ClassifiedFiles = classifyFiles(zipEntries, hints);

  const parsedGerbers: ParsedGerberLayer[] = [];
  const parsedDrills: ParsedDrillData[] = [];

  // Parse Gerber layers
  for (const g of classified.gerbers) {
    const text = await g.getText();
    const primitives = parseGerberFile(g.name, text, g.role);
    parsedGerbers.push({
      name: g.name,
      role: g.role,
      primitives,
    });
  }

  // Parse drill files
  for (const d of classified.drills) {
    const text = await d.getText();
    const drillData = parseDrillFile(d.name, text);
    parsedDrills.push(drillData);
  }

  const geometry = buildPcbGeometry({
    parsedGerbers,
    parsedDrills,
    boardThicknessMm: options.boardThicknessMm ?? 1.6,
  });

  return geometry;
}

/**
 * Debug helper to just inspect classification without parsing.
 * You can use this in your examples or tests.
 */
export async function classifyGerberZip(
  input: File | Blob | ArrayBuffer,
  options: LoadFromZipOptions = {}
): Promise<ClassifiedFiles> {
  const zipEntries = await unzipGerbersZip(input);
  const hints: LayerHints | undefined = options.layerHints;
  return classifyFiles(zipEntries, hints);
}

/**
 * Parsed Gerber layer representation passed from the parse step into geometry.
 */
export interface ParsedGerberLayer {
  name: string;
  role: string;
  primitives: GerberPrimitives;
}

/**
 * Parameters for buildPcbGeometry.
 * Defined here so both pipeline and geometry modules agree on shape.
 */
export interface BuildPcbGeometryParams {
  parsedGerbers: ParsedGerberLayer[];
  parsedDrills: ParsedDrillData[];
  boardThicknessMm: number;
}
