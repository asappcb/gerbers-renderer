import { unzipGerbersZip } from "../io/unzip";
import { classifyFiles } from "../io/file-classifier";
import { parseGerberFile } from "../parse/gerber-parser";
import { parseDrillFile } from "../parse/drill-parser";
import { buildPcbGeometry } from "../geometry/stackup-builder";

export async function loadPcbGeometryFromZip(
  file: File | ArrayBuffer,
  opts?: LoadFromZipOptions
): Promise<PcbModelGeometry> {
  const entries = await unzipGerbersZip(file);
  const classified = classifyFiles(entries, opts?.layerHints);

  const gerberLayers = [];
  const drills = [];

  for (const layer of classified.gerbers) {
    const primitives = parseGerberFile(layer.name, layer.content);
    gerberLayers.push({ layerInfo: layer, primitives });
  }

  for (const drill of classified.drills) {
    const drillData = parseDrillFile(drill.name, drill.content);
    drills.push(drillData);
  }

  const geometry = buildPcbGeometry({
    gerberLayers,
    drills,
    boardThicknessMm: opts?.boardThicknessMm ?? 1.6,
  });

  return geometry;
}
