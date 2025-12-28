export type Classified = Partial<{
  top_copper: string;
  bottom_copper: string;
  top_mask: string;
  bottom_mask: string;
  top_silk: string;
  bottom_silk: string;
  drills: string;
  outline: string;
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

  const drills =
    // Excellon often .drl or .xln or .txt
    pickByExt(files, [".drl", ".xln"]) ||
    // Some CAD exports use .txt for drills but be careful: only if name hints drill
    pickByContains(files, ["drill"]) ||
    pickByContains(files, ["drills"]) ||
    pickByContains(files, ["npth"]) ||
    pickByContains(files, ["pth"]);

  return {
    top_copper,
    bottom_copper,
    top_mask,
    bottom_mask,
    top_silk,
    bottom_silk,
    outline,
    drills,
  };
}
