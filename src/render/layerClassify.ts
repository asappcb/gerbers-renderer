export type Classified = Partial<{
  top_copper: string;
  bottom_copper: string;
  top_mask: string;
  bottom_mask: string;
  top_silk: string;
  bottom_silk: string;
  /** All drill files found (supports multiple, e.g. Altium PTH + slots) */
  drills: string[];
  outline: string;
  /** Inner copper layers, ordered (inner-1 nearest top, inner-N nearest bottom) */
  inner_copper: string[];
}>;

function norm(s: string) {
  return s.toLowerCase();
}

function pickByExt(names: string[], exts: string[]) {
  const set = new Set(exts.map((e) => e.toLowerCase()));
  // Prefer shortest path (often means "root file" not docs/backup)
  const candidates = names
    .filter((n) => {
      const nl = norm(n);
      const dot = nl.lastIndexOf(".");
      if (dot < 0) return false;
      return set.has(nl.slice(dot));
    })
    .sort((a, b) => a.length - b.length);
  return candidates[0];
}

function pickByContains(names: string[], required: string[]) {
  const req = required.map((x) => x.toLowerCase());
  const candidates = names
    .filter((n) => {
      const nl = norm(n);
      return req.every((r) => nl.includes(r));
    })
    .sort((a, b) => a.length - b.length);
  return candidates[0];
}

/** Collect inner copper layer files (KiCad In1_Cu, Altium .G2/.GL2, etc.), excluding top/bottom. */
function pickAllInnerCopper(names: string[], topCopper?: string, botCopper?: string): string[] {
  const skip = new Set<string>([topCopper, botCopper].filter(Boolean) as string[]);
  const results: string[] = [];

  for (const name of names) {
    if (skip.has(name)) continue;
    const low = norm(name);
    const base = low.split("/").pop() || low;
    const dotIdx = base.lastIndexOf(".");
    const ext = dotIdx >= 0 ? base.slice(dotIdx) : "";

    // KiCad: In1_Cu.gbr, project.In1_Cu.gbr, etc.
    if (/in\d+_cu/.test(base)) { results.push(name); continue; }

    // Altium: .G2, .G3, .GL2, .GL3, .G4, etc. (numbered >= 2 to avoid .G1 top copper)
    // Excludes standard gerber extensions: .gtl, .gbl, .gts, .gbs, .gto, .gbo, .gko, .gm1
    if (/^\.gl?\d+$/.test(ext)) {
      const num = parseInt(ext.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(num) && num >= 2) { results.push(name); continue; }
    }
  }

  results.sort();
  return results;
}

/** Collect ALL files that look like drill files, to handle multi-file drill exports (e.g. Altium). */
function pickAllDrills(names: string[]): string[] {
  const results: string[] = [];
  const nl = (n: string) => norm(n);

  for (const name of names) {
    const low = nl(name);
    const base = low.split("/").pop() || low;
    const ext = base.slice(base.lastIndexOf("."));

    // Standard Excellon extensions
    if (ext === ".drl" || ext === ".xln" || ext === ".exc" || ext === ".ncd") {
      results.push(name);
      continue;
    }

    // .txt files with drill-hinting names (Altium: PCB-RoundHoles.TXT, PCB-SlotHoles.TXT, etc.)
    if (ext === ".txt" && (base.includes("hole") || base.includes("drill") || base.includes("npth") || base.includes("-pth"))) {
      results.push(name);
      continue;
    }

    // Name contains drill keyword with standard extensions
    if ((base.includes("drill") || base.includes("npth") || base.includes("-pth"))
        && (ext === ".gbr" || ext === ".ger" || ext === ".txt" || ext === "")) {
      results.push(name);
      continue;
    }
  }

  return results;
}

export function classifyLayerNames(names: string[]): Classified {
  // Normalize: ignore obvious junk
  const files = names.filter((n) => {
    const nl = norm(n);
    if (nl.endsWith("/")) return false;
    if (nl.includes("__macosx")) return false;
    if (nl.endsWith(".ds_store")) return false;
    return true;
  });

  const top_copper =
    pickByExt(files, [".gtl"]) ||
    pickByContains(files, ["f_cu"]) ||
    pickByContains(files, ["top", "cu"]) ||
    pickByContains(files, ["top", "copper"]);

  const bottom_copper =
    pickByExt(files, [".gbl"]) ||
    pickByContains(files, ["b_cu"]) ||
    pickByContains(files, ["bottom", "cu"]) ||
    pickByContains(files, ["bottom", "copper"]);

  const top_mask =
    pickByExt(files, [".gts"]) ||
    pickByContains(files, ["f_mask"]) ||
    pickByContains(files, ["top", "mask"]);

  const bottom_mask =
    pickByExt(files, [".gbs"]) ||
    pickByContains(files, ["b_mask"]) ||
    pickByContains(files, ["bottom", "mask"]);

  const top_silk =
    pickByExt(files, [".gto"]) ||
    pickByContains(files, ["f_silks"]) ||
    pickByContains(files, ["f_silk"]) ||
    pickByContains(files, ["top", "silk"]);

  const bottom_silk =
    pickByExt(files, [".gbo"]) ||
    pickByContains(files, ["b_silks"]) ||
    pickByContains(files, ["b_silk"]) ||
    pickByContains(files, ["bottom", "silk"]);

  const outline =
    pickByExt(files, [".gko", ".gm1"]) ||
    pickByContains(files, ["edge", "cuts"]) ||
    pickByContains(files, ["outline"]) ||
    pickByContains(files, ["board", "outline"]);

  const drills = pickAllDrills(files);
  const inner_copper = pickAllInnerCopper(files, top_copper, bottom_copper);

  return {
    top_copper,
    bottom_copper,
    top_mask,
    bottom_mask,
    top_silk,
    bottom_silk,
    outline,
    drills: drills.length ? drills : undefined,
    inner_copper: inner_copper.length ? inner_copper : undefined,
  };
}
