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

function score(name: string, tokens: string[]) {
  const s = name.toLowerCase();
  let v = 0;
  for (const t of tokens) if (s.includes(t)) v += 1;
  return v;
}

export function classifyLayerNames(names: string[]): Classified {
  const pick = (candidates: Array<{ key: keyof Classified; tokens: string[] }>) => {
    const out: Partial<Record<keyof Classified, string>> = {};
    for (const c of candidates) {
      let best = "";
      let bestScore = -1;
      for (const n of names) {
        const sc = score(n, c.tokens);
        if (sc > bestScore) {
          bestScore = sc;
          best = n;
        }
      }
      if (bestScore > 0) out[c.key] = best;
    }
    return out;
  };

  return pick([
    { key: "outline", tokens: ["outline", "edge", "edges", "board", "cuts", "gm1"] },
    { key: "top_copper", tokens: ["gtl", "f.cu", "top", "top_cu", "front"] },
    { key: "bottom_copper", tokens: ["gbl", "b.cu", "bottom", "bot", "back"] },
    { key: "top_mask", tokens: ["gts", "f.mask", "topmask", "top_mask"] },
    { key: "bottom_mask", tokens: ["gbs", "b.mask", "bottommask", "bottom_mask"] },
    { key: "top_silk", tokens: ["gto", "f.silk", "topsilk", "top_silk"] },
    { key: "bottom_silk", tokens: ["gbo", "b.silk", "bottomsilk", "bottom_silk"] },
    { key: "drills", tokens: ["drl", "drill", "xln", "txt"] },
  ]) as Classified;
}
