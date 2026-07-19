import { describe, it, expect } from "vitest";
import { renderGerberSvgDocs } from "./renderGerbersFiles";

const enc = (s: string) => new TextEncoder().encode(s);

const OUTLINE = [
  "%FSLAX44Y44*%", "%MOMM*%",
  "G36*", "X0Y0D02*", "X500000Y0D01*", "X500000Y400000D01*", "X0Y400000D01*", "X0Y0D01*", "G37*", "M02*",
].join("\n");

// A copper layer with a horizontal trace + two pads at height y (0.0001mm units).
const copperLayer = (y: string) => [
  "%FSLAX44Y44*%", "%MOMM*%",
  "%ADD10C,1.2*%", "%ADD11C,2.0*%",
  "D11*", `X50000Y${y}D03*`, `X450000Y${y}D03*`,
  "D10*", `X50000Y${y}D02*`, `X450000Y${y}D01*`,
  "M02*",
].join("\n");

const DRILL = ["M48", "METRIC,TZ", "T01C0.8", "%", "T01", "X5.0Y35.0", "X45.0Y5.0", "M30"].join("\n");

// A KiCad-style 6-layer export.
const sixLayerFiles = () => ({
  "brd-F_Cu.gbr": enc(copperLayer("350000")),
  "brd-In1_Cu.gbr": enc(copperLayer("300000")),
  "brd-In2_Cu.gbr": enc(copperLayer("250000")),
  "brd-In3_Cu.gbr": enc(copperLayer("150000")),
  "brd-In4_Cu.gbr": enc(copperLayer("100000")),
  "brd-B_Cu.gbr": enc(copperLayer("50000")),
  "brd-Edge_Cuts.gbr": enc(OUTLINE),
  "brd.drl": enc(DRILL),
});

describe("multi-layer board rendering", () => {
  it("renders a 6-layer stack in physical order with unique ids/colours/layers", async () => {
    const docs = await renderGerberSvgDocs(sixLayerFiles());

    // Six copper layers, ordered top → bottom.
    expect(docs.copper).toHaveLength(6);
    expect(docs.copper.map((c) => c.role)).toEqual(["top", "inner", "inner", "inner", "inner", "bottom"]);
    expect(docs.copper.map((c) => c.name)).toEqual(["Top", "Inner 1", "Inner 2", "Inner 3", "Inner 4", "Bottom"]);
    expect(docs.copper.map((c) => c.index)).toEqual([0, 1, 2, 3, 4, 5]);

    // Ids are unique (the traverse/visibility keys).
    const ids = docs.copper.map((c) => c.id);
    expect(new Set(ids).size).toBe(6);
    expect(ids).toEqual(["cu.top", "cu.in1", "cu.in2", "cu.in3", "cu.in4", "cu.bottom"]);

    // Each layer has its own rendered SVG + a distinct colour.
    const svgIds = docs.copper.map((c) => c.svgId);
    expect(new Set(svgIds).size).toBe(6);
    for (const c of docs.copper) expect(docs.svgById[c.svgId]).toContain("<svg");
    expect(new Set(docs.copper.map((c) => c.color)).size).toBeGreaterThan(1);

    // Stats + geometry reflect all six layers.
    expect(docs.boardGeom.layer_count).toBe(6);
    expect(docs.geometry.stats.copperLayers).toBe(6);
    const layersWithFeatures = new Set(
      docs.geometry.features.filter((f) => f.kind !== "hole").map((f) => f.layer)
    );
    expect(layersWithFeatures).toEqual(new Set(ids));
  });

  it("orders inner layers by physical position for a non-KiCad 8-layer Altium stack", async () => {
    const files: Record<string, Uint8Array> = {
      "b.gtl": enc(copperLayer("350000")),
      "b.g2": enc(copperLayer("300000")),
      "b.g3": enc(copperLayer("250000")),
      "b.g4": enc(copperLayer("200000")),
      "b.g5": enc(copperLayer("150000")),
      "b.g6": enc(copperLayer("120000")),
      "b.g7": enc(copperLayer("80000")),
      "b.gbl": enc(copperLayer("50000")),
      "b.gko": enc(OUTLINE),
    };
    const docs = await renderGerberSvgDocs(files);
    expect(docs.copper).toHaveLength(8);
    expect(docs.copper.map((c) => c.role)).toEqual([
      "top", "inner", "inner", "inner", "inner", "inner", "inner", "bottom",
    ]);
    expect(docs.copper.map((c) => c.id)).toEqual([
      "cu.top", "cu.in1", "cu.in2", "cu.in3", "cu.in4", "cu.in5", "cu.in6", "cu.bottom",
    ]);
  });
});
