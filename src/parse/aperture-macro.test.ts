import { describe, it, expect } from "vitest";
import { parseGerberFile } from "./gerber-parser";
import { evalExpr, evaluateMacro, parseMacroDefinition } from "./aperture-macro";

// Verbatim from a KiCad 10 F_Cu export (droyd-wireless-umi rev D).
const KICAD_ROUNDRECT = [
  "%AMRoundRect*",
  "0 Rectangle with rounded corners*",
  "0 $1 Rounding radius*",
  "0 $2 $3 $4 $5 $6 $7 $8 $9 X,Y pos of 4 corners*",
  "0 Add a 4 corners polygon primitive as box body*",
  "4,1,4,$2,$3,$4,$5,$6,$7,$8,$9,$2,$3,0*",
  "0 Add four circle primitives for the rounded corners*",
  "1,1,$1+$1,$2,$3*",
  "1,1,$1+$1,$4,$5*",
  "1,1,$1+$1,$6,$7*",
  "1,1,$1+$1,$8,$9*",
  "0 Add four rect primitives between the rounded corners*",
  "20,1,$1+$1,$2,$3,$4,$5,0*",
  "20,1,$1+$1,$4,$5,$6,$7,0*",
  "20,1,$1+$1,$6,$7,$8,$9,0*",
  "20,1,$1+$1,$8,$9,$2,$3,0*%",
];

function extents(loops: Array<Array<{ x: number; y: number }>>) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const l of loops) for (const p of l) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

describe("evalExpr", () => {
  it("handles precedence, parentheses, unary minus and variables", () => {
    const vars = new Map([[1, 2], [2, 0.5]]);
    expect(evalExpr("$1+$1", vars)).toBeCloseTo(4);
    expect(evalExpr("1+2x3", vars)).toBeCloseTo(7);
    expect(evalExpr("(1+2)X3", vars)).toBeCloseTo(9);
    expect(evalExpr("-$2/2", vars)).toBeCloseTo(-0.25);
    expect(evalExpr("$9", vars)).toBe(0);
  });
});

describe("evaluateMacro", () => {
  it("supports variable assignment and center-line rotation", () => {
    const def = parseMacroDefinition("AMBar*$3=$1x2*21,1,$3,$2,0,0,90*")!;
    const loops = evaluateMacro(def.statements, [1, 0.5], 1);
    const e = extents(loops);
    // 2 x 0.5 bar rotated 90° becomes 0.5 wide, 2 tall
    expect(e.maxX - e.minX).toBeCloseTo(0.5, 6);
    expect(e.maxY - e.minY).toBeCloseTo(2, 6);
  });

  it("skips exposure-off primitives", () => {
    const def = parseMacroDefinition("AMHole*1,1,2,0,0*1,0,1,0,0*")!;
    expect(evaluateMacro(def.statements, [], 1)).toHaveLength(1);
  });
});

describe("parseGerberFile — aperture macros", () => {
  it("renders a KiCad RoundRect pad at its real size, not as a dot", () => {
    const src = [
      "%FSLAX46Y46*%",
      "%MOMM*%",
      ...KICAD_ROUNDRECT,
      "%ADD17RoundRect,0.135000X-0.135000X-0.185000X0.135000X-0.185000X0.135000X0.185000X-0.135000X0.185000X0*%",
      "D17*",
      "X10000000Y5000000D03*",
      "M02*",
    ].join("\n");

    const prims = parseGerberFile("top.gtl", src, "TopCopper");
    expect(prims.flashes).toHaveLength(1);
    const f = prims.flashes[0];
    expect(f.shape).toBe("RoundRect");
    // corners at ±0.135, ±0.185 plus the 0.135 rounding radius
    expect(f.widthMm).toBeCloseTo(0.54, 6);
    expect(f.heightMm).toBeCloseTo(0.64, 6);

    const e = extents(f.loops!);
    expect(e.minX).toBeCloseTo(10 - 0.27, 3);
    expect(e.maxX).toBeCloseTo(10 + 0.27, 3);
    expect(e.minY).toBeCloseTo(5 - 0.32, 3);
    expect(e.maxY).toBeCloseTo(5 + 0.32, 3);

    const op = prims.ops.find((o) => o.kind === "flash");
    expect(op && op.kind === "flash" && op.loops?.length).toBe(9);
  });

  it("scales macro geometry for inch files", () => {
    const src = [
      "%FSLAX24Y24*%",
      "%MOIN*%",
      "%AMSQ*21,1,$1,$1,0,0,0*%",
      "%ADD10SQ,0.1*%",
      "D10*",
      "X0Y0D03*",
      "M02*",
    ].join("\n");

    const f = parseGerberFile("top.gtl", src, "TopCopper").flashes[0];
    expect(f.widthMm).toBeCloseTo(2.54, 6);
  });

  it("applies %LR load rotation to macro flashes", () => {
    const src = [
      "%FSLAX46Y46*%",
      "%MOMM*%",
      "%AMBAR*21,1,$1,$2,0,0,0*%",
      "%ADD10BAR,2X0.5*%",
      "%LR90*%",
      "D10*",
      "X0Y0D03*",
      "M02*",
    ].join("\n");

    const e = extents(parseGerberFile("top.gtl", src, "TopCopper").flashes[0].loops!);
    expect(e.maxX - e.minX).toBeCloseTo(0.5, 6);
    expect(e.maxY - e.minY).toBeCloseTo(2, 6);
  });

  it("keeps the best-effort size for a macro with no %AM definition", () => {
    const src = [
      "%FSLAX46Y46*%",
      "%MOMM*%",
      "%ADD10RoundRect,0.135000X-0.135000X-0.185000*%",
      "D10*",
      "X0Y0D03*",
      "M02*",
    ].join("\n");

    const f = parseGerberFile("top.gtl", src, "TopCopper").flashes[0];
    expect(f.loops).toBeUndefined();
    expect(f.widthMm).toBeCloseTo(0.135, 6);
  });
});
