import { describe, it, expect } from "vitest";
import { parseGerberFile } from "./gerber-parser";
import { parseDrillFile } from "./drill-parser";

describe("parseGerberFile", () => {
  it("decodes FS-format coordinates into mm and builds a track", () => {
    const src = [
      "%FSLAX23Y23*%",
      "%MOMM*%",
      "%ADD10C,0.200*%",
      "D10",
      "X0Y0D02",
      "X1000Y0D01",
      "M02",
    ].join("\n");

    const prims = parseGerberFile("top.gtl", src, "TopCopper");
    expect(prims.tracks).toHaveLength(1);
    const t = prims.tracks[0];
    expect(t.start).toEqual({ x: 0, y: 0 });
    expect(t.end.x).toBeCloseTo(1.0, 6); // 1000 / 10^3 mm
    expect(t.width).toBeCloseTo(0.2, 6);
  });

  it("parses a rectangular flash with width/height", () => {
    const src = [
      "%FSLAX23Y23*%",
      "%MOMM*%",
      "%ADD11R,1.000X2.000*%",
      "D11",
      "X0Y0D03",
      "M02",
    ].join("\n");

    const prims = parseGerberFile("top.gtl", src, "TopCopper");
    expect(prims.flashes).toHaveLength(1);
    const f = prims.flashes[0];
    expect(f.shape).toBe("R");
    expect(f.widthMm).toBeCloseTo(1.0, 6);
    expect(f.heightMm).toBeCloseTo(2.0, 6);
  });

  it("parses a standard polygon aperture (Eagle octagon) as its real outline", () => {
    const src = [
      "%MOMM*%",
      "%FSLAX34Y34*%",
      "%ADD10P,1.429621X8X112.500000*%", // verbatim from an EAGLE 9 export
      "D10*",
      "X100000Y50000D03*",
      "M02*",
    ].join("\n");

    const f = parseGerberFile("top.gtl", src, "TopCopper").flashes[0];
    const loop = f.loops![0];
    expect(loop).toHaveLength(8);
    const r = 1.429621 / 2;
    for (const p of loop) expect(Math.hypot(p.x - 10, p.y - 5)).toBeCloseTo(r, 6);
    const first = (Math.atan2(loop[0].y - 5, loop[0].x - 10) * 180) / Math.PI;
    expect(first).toBeCloseTo(112.5, 4);
    // the vertex count must not leak into the size (it used to become an 8 mm height)
    expect(f.heightMm).toBeLessThan(1.43);
  });

  it("scales polygon apertures in inch files", () => {
    const src = ["%MOIN*%", "%FSLAX24Y24*%", "%ADD10P,0.1X4*%", "D10*", "X0Y0D03*", "M02*"].join("\n");
    const f = parseGerberFile("top.gtl", src, "TopCopper").flashes[0];
    // square with vertices on the axes: 2.54 mm corner to corner
    expect(f.widthMm).toBeCloseTo(2.54, 6);
  });

  it("tracks LPD/LPC polarity in the ordered ops", () => {
    const src = [
      "%FSLAX23Y23*%",
      "%MOMM*%",
      "%ADD10C,0.200*%",
      "D10",
      "%LPD*%",
      "X0Y0D02",
      "X1000Y0D01",
      "%LPC*%",
      "X1000Y1000D03",
      "M02",
    ].join("\n");

    const prims = parseGerberFile("top.gtl", src, "TopCopper");
    const track = prims.ops.find((o) => o.kind === "track");
    const flash = prims.ops.find((o) => o.kind === "flash");
    expect(track?.polarity).toBe("dark");
    expect(flash?.polarity).toBe("clear");
  });

  it("tessellates a full-circle arc (G03 with equal start/end) into many segments", () => {
    const src = [
      "%FSLAX34Y34*%",
      "%MOMM*%",
      "%ADD10C,0.100*%",
      "D10",
      "X0Y0D02",
      "G03X0Y0I5000J0D01",
      "M02",
    ].join("\n");

    const prims = parseGerberFile("top.gtl", src, "TopCopper");
    expect(prims.tracks.length).toBeGreaterThan(10);
  });
});

describe("parseDrillFile", () => {
  it("reads tool diameter and integer-encoded coordinates (TZ default)", () => {
    const src = [
      "M48",
      "METRIC,TZ,3.3",
      "T01C0.500",
      "%",
      "T01",
      "X010000Y010000",
      "M30",
    ].join("\n");

    const { holes } = parseDrillFile("drl", src);
    expect(holes).toHaveLength(1);
    expect(holes[0].x).toBeCloseTo(10.0, 6);
    expect(holes[0].y).toBeCloseTo(10.0, 6);
    expect(holes[0].diameter).toBeCloseTo(0.5, 6);
  });

  it("carries the previous axis forward on modal (X-only) coordinate lines", () => {
    const src = [
      "M48",
      "METRIC,TZ,3.3",
      "T01C0.500",
      "%",
      "T01",
      "X010000Y010000",
      "X020000",
      "M30",
    ].join("\n");

    const { holes } = parseDrillFile("drl", src);
    expect(holes).toHaveLength(2);
    expect(holes[1].x).toBeCloseTo(20.0, 6);
    expect(holes[1].y).toBeCloseTo(10.0, 6); // modal Y from previous line
  });

  it("right-pads integer coordinates under LZ (trailing-zero suppression)", () => {
    const src = [
      "M48",
      "METRIC,LZ,3.3",
      "T01C0.500",
      "%",
      "T01",
      "X10Y10",
      "M30",
    ].join("\n");

    const { holes } = parseDrillFile("drl", src);
    expect(holes).toHaveLength(1);
    // "10" in a 3.3 LZ field means 100.000, not 0.010
    expect(holes[0].x).toBeCloseTo(100.0, 6);
    expect(holes[0].y).toBeCloseTo(100.0, 6);
  });

  it("parses a G85 oblong slot", () => {
    const src = [
      "M48",
      "METRIC,TZ,3.3",
      "T01C0.500",
      "%",
      "T01",
      "X010000Y010000G85X020000Y010000",
      "M30",
    ].join("\n");

    const { slots } = parseDrillFile("drl", src);
    expect(slots).toHaveLength(1);
    expect(slots[0].x1).toBeCloseTo(10.0, 6);
    expect(slots[0].x2).toBeCloseTo(20.0, 6);
    expect(slots[0].diameter).toBeCloseTo(0.5, 6);
  });
});
