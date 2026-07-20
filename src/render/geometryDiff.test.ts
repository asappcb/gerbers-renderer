import { describe, it, expect } from "vitest";
import { diffGeometry } from "./diff";
import type { BoardGeometry, BoardFeature } from "../viewer/types";

const geom = (features: BoardFeature[]): BoardGeometry => ({
  features,
  stats: { widthMm: 40, heightMm: 30, copperLayers: 2, padCount: 0, holeCount: 0, drillSizesMm: [] },
});

const pad = (x: number, y: number, layer = "cu.top"): BoardFeature =>
  ({ kind: "pad", layer, x_mm: x, y_mm: y, w_mm: 1.5, h_mm: 1.5, shape: "C" });
const trace = (x1: number, y1: number, x2: number, y2: number, layer = "cu.top"): BoardFeature =>
  ({ kind: "trace", layer, x1_mm: x1, y1_mm: y1, x2_mm: x2, y2_mm: y2, width_mm: 0.25 });

describe("diffGeometry", () => {
  it("reports added and removed features per layer", () => {
    const a = geom([pad(5, 5), pad(10, 10), trace(0, 0, 20, 0)]);
    const b = geom([pad(5, 5), pad(15, 15), trace(0, 0, 20, 0)]); // removed pad(10,10), added pad(15,15)
    const d = diffGeometry(a, b);
    expect(d.summary.addedCount).toBe(1);
    expect(d.summary.removedCount).toBe(1);
    expect(d.summary.unchangedCount).toBe(2); // pad(5,5) + trace
    expect(d.perLayer["cu.top"].added).toHaveLength(1);
    expect(d.perLayer["cu.top"].removed).toHaveLength(1);
  });

  it("treats identical boards as fully unchanged", () => {
    const a = geom([pad(5, 5), trace(0, 0, 20, 0)]);
    const d = diffGeometry(a, geom([pad(5, 5), trace(0, 0, 20, 0)]));
    expect(d.summary.addedCount).toBe(0);
    expect(d.summary.removedCount).toBe(0);
    expect(d.summary.unchangedCount).toBe(2);
  });

  it("matches traces regardless of endpoint order", () => {
    const a = geom([trace(0, 0, 20, 5)]);
    const b = geom([trace(20, 5, 0, 0)]); // reversed
    const d = diffGeometry(a, b);
    expect(d.summary.unchangedCount).toBe(1);
    expect(d.summary.addedCount).toBe(0);
  });

  it("tolerates sub-tolerance coordinate noise", () => {
    const a = geom([pad(5, 5)]);
    const b = geom([pad(5.01, 4.99)]);
    expect(diffGeometry(a, b, 0.05).summary.unchangedCount).toBe(1);
  });
});
