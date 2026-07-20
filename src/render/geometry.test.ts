import { describe, it, expect } from "vitest";
import { renderGerberSvgDocs } from "./renderGerbersFiles";

const enc = (s: string) => new TextEncoder().encode(s);

const OUTLINE = [
  "%FSLAX44Y44*%", "%MOMM*%",
  "G36*", "X0Y0D02*", "X400000Y0D01*", "X400000Y300000D01*", "X0Y300000D01*", "X0Y0D01*", "G37*", "M02*",
].join("\n");

// Top copper: two flashes (pads) + one track (trace).
const TOP = [
  "%FSLAX44Y44*%", "%MOMM*%",
  "%ADD10C,1.500*%",
  "D10*",
  "X50000Y50000D03*",     // pad at (5,5)mm
  "X350000Y250000D03*",   // pad at (35,25)mm
  "X50000Y50000D02*", "X350000Y250000D01*",  // trace (5,5)->(35,25)
  "M02*",
].join("\n");

const DRILL = ["M48", "METRIC,TZ", "T01C0.800", "%", "T01", "X5.0Y5.0", "X35.0Y25.0", "M30"].join("\n");

describe("geometry extraction", () => {
  it("produces pads, traces, holes and correct stats (world coords)", async () => {
    const docs = await renderGerberSvgDocs({
      "top.gtl": enc(TOP),
      "outline.gko": enc(OUTLINE),
      "board.drl": enc(DRILL),
    });
    const g = docs.geometry;
    const pads = g.features.filter((f) => f.kind === "pad");
    const traces = g.features.filter((f) => f.kind === "trace");
    const holes = g.features.filter((f) => f.kind === "hole");

    expect(pads.length).toBe(2);
    expect(traces.length).toBe(1);
    expect(holes.length).toBe(2);
    expect(pads.every((p) => p.kind === "pad" && p.layer === "cu.top")).toBe(true);

    // Y is flipped to world space: Gerber (5,5) → world y = 30-5 = 25.
    const p = pads.find((f) => f.kind === "pad" && Math.abs(f.x_mm - 5) < 0.01)!;
    expect(p.kind === "pad" && Math.abs(p.y_mm - 25) < 0.01).toBe(true);

    expect(g.stats.widthMm).toBeCloseTo(40, 3);
    expect(g.stats.heightMm).toBeCloseTo(30, 3);
    expect(g.stats.padCount).toBe(2);
    expect(g.stats.holeCount).toBe(2);
    expect(g.stats.drillSizesMm).toEqual([0.8]);
    expect(g.stats.minTraceWidthMm).toBeCloseTo(1.5, 3);
  });
});
