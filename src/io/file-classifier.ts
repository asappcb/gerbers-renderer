// src/io/file-classifier.ts
import type { ZipEntry } from "./unzip";
import { normalizeGerberText, normalizeDrillText } from "./file-normalizer";

export type LayerRole =
  | "top_copper"
  | "bottom_copper"
  | "inner_copper"
  | "top_mask"
  | "bottom_mask"
  | "top_silk"
  | "bottom_silk"
  | "outline"
  | "mechanical"
  | "unknown";

export interface LayerHint {
  /** Exact or suffix match for filenames, for example "myboard-F_Cu.gbr" */
  pattern: string;
  role: LayerRole;
}

/**
 * Optional hints that the caller can pass in to override or refine classification.
 */
export interface LayerHints {
  hints: LayerHint[];
}

/**
 * Normalized representation of a Gerber like file from the zip.
 */
export interface ClassifiedGerberFile {
  name: string;
  role: LayerRole;
  rawEntry: ZipEntry;
  /**
   * Lazily read and normalized text content.
   * This calls normalizeGerberText under the hood.
   */
  getText: () => Promise<string>;
}

/**
 * Normalized representation of a drill file from the zip.
 */
export interface ClassifiedDrillFile {
  name: string;
  rawEntry: ZipEntry;
  /**
   * Lazily read and normalized text content.
   * This calls normalizeDrillText under the hood.
   */
  getText: () => Promise<string>;
}

export interface ClassifiedFiles {
  gerbers: ClassifiedGerberFile[];
  drills: ClassifiedDrillFile[];
  ignored: ZipEntry[];
}

/**
 * Classify zip entries into Gerber layers, drill files, and ignored files.
 */
export function classifyFiles(
  entries: ZipEntry[],
  hints?: LayerHints
): ClassifiedFiles {
  const gerbers: ClassifiedGerberFile[] = [];
  const drills: ClassifiedDrillFile[] = [];
  const ignored: ZipEntry[] = [];

  for (const entry of entries) {
    const lowerName = entry.name.toLowerCase();

    if (isDrillFile(lowerName)) {
      drills.push({
        name: entry.name,
        rawEntry: entry,
        getText: async () => {
          const raw = await entry.text();
          return normalizeDrillText(raw);
        },
      });
      continue;
    }

    if (isLikelyGerber(lowerName)) {
      const role = classifyLayerRole(entry.name, hints);
      gerbers.push({
        name: entry.name,
        role,
        rawEntry: entry,
        getText: async () => {
          const raw = await entry.text();
          return normalizeGerberText(raw);
        },
      });
      continue;
    }

    // Ignore other files for now, could be readme, fabrication notes, etc
    ignored.push(entry);
  }

  return { gerbers, drills, ignored };
}

/**
 * Decide if a file looks like a drill file based on extension and usual naming.
 */
function isDrillFile(lowerName: string): boolean {
  if (lowerName.endsWith(".drl")) return true;
  if (lowerName.endsWith(".xlnt")) return true;
  if (lowerName.includes("drill") || lowerName.includes("via")) return true;
  return false;
}

/**
 * Decide if a file looks like a Gerber like layer.
 */
function isLikelyGerber(lowerName: string): boolean {
  if (lowerName.endsWith(".gbr")) return true;
  if (lowerName.endsWith(".gbx")) return true;
  if (lowerName.endsWith(".pho")) return true;
  if (lowerName.endsWith(".art")) return true;
  if (lowerName.endsWith(".cmp")) return true;
  if (lowerName.endsWith(".sol")) return true;
  if (lowerName.endsWith(".stc")) return true;
  if (lowerName.endsWith(".sts")) return true;

  // KiCad specific common ones
  if (lowerName.endsWith(".gtl")) return true; // top copper
  if (lowerName.endsWith(".gbl")) return true; // bottom copper
  if (lowerName.endsWith(".gts")) return true; // top mask
  if (lowerName.endsWith(".gbs")) return true; // bottom mask
  if (lowerName.endsWith(".gto")) return true; // top silk
  if (lowerName.endsWith(".gbo")) return true; // bottom silk
  if (lowerName.endsWith(".gm1")) return true; // outline or mechanical

  return false;
}

/**
 * Classify a Gerber file into a layer role using hints first, then heuristics.
 */
function classifyLayerRole(name: string, hints?: LayerHints): LayerRole {
  const baseName = name.split("/").pop() || name;
  const lower = baseName.toLowerCase();

  // 1. Explicit hints take precedence
  if (hints && hints.hints && hints.hints.length > 0) {
    for (const hint of hints.hints) {
      if (matchesPattern(baseName, hint.pattern)) {
        return hint.role;
      }
    }
  }

  // 2. Heuristics based on common naming schemes

  // Copper
  if (lower.includes("f_cu") || lower.endsWith(".gtl") || lower.includes("top") && lower.includes("cu")) {
    return "top_copper";
  }
  if (lower.includes("b_cu") || lower.endsWith(".gbl") || lower.includes("bot") && lower.includes("cu")) {
    return "bottom_copper";
  }
  if (lower.includes("in") && lower.includes("cu")) {
    return "inner_copper";
  }

  // Soldermask
  if (lower.includes("f_mask") || lower.endsWith(".gts") || lower.includes("top") && lower.includes("mask")) {
    return "top_mask";
  }
  if (lower.includes("b_mask") || lower.endsWith(".gbs") || lower.includes("bot") && lower.includes("mask")) {
    return "bottom_mask";
  }

  // Silkscreen
  if (lower.includes("f_silk") || lower.endsWith(".gto") || lower.includes("top") && lower.includes("silk")) {
    return "top_silk";
  }
  if (lower.includes("b_silk") || lower.endsWith(".gbo") || lower.includes("bot") && lower.includes("silk")) {
    return "bottom_silk";
  }

  // Outline and mechanical
  if (lower.includes("edge_cuts") || lower.includes("outline") || lower.includes("edge") || lower.endsWith(".gm1")) {
    return "outline";
  }

  if (lower.includes("mech") || lower.includes("mechanical")) {
    return "mechanical";
  }

  return "unknown";
}

/**
 * Simple pattern match helper:
 * - If pattern contains "*" treat as wildcard
 * - Else do case sensitive equality
 */
function matchesPattern(name: string, pattern: string): boolean {
  if (pattern.includes("*")) {
    const regexPattern = "^" + pattern.split("*").map(escapeRegex).join(".*") + "$";
    const regex = new RegExp(regexPattern);
    return regex.test(name);
  }
  return name === pattern;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
