import { describe, it, expect } from "vitest";
import { classifyStackup } from "./layerClassify";

const roles = (s: ReturnType<typeof classifyStackup>) => s.copper.map((c) => c.role);
const nums = (s: ReturnType<typeof classifyStackup>) =>
  s.copper.filter((c) => c.role === "inner").map((c) => c.detectedNum);

describe("classifyStackup", () => {
  it("classifies a standard 2-layer KiCad board top→bottom", () => {
    const s = classifyStackup([
      "proj-F_Cu.gbr",
      "proj-B_Cu.gbr",
      "proj-F_Mask.gbr",
      "proj-Edge_Cuts.gbr",
      "proj.drl",
    ]);
    expect(roles(s)).toEqual(["top", "bottom"]);
    expect(s.copper.map((c) => c.index)).toEqual([0, 1]);
    expect(s.top_mask).toBeTruthy();
    expect(s.outline).toBeTruthy();
    expect(s.drills?.length).toBe(1);
  });

  it("orders a 6-layer KiCad stack correctly", () => {
    const s = classifyStackup([
      "b-F_Cu.gbr", "b-In1_Cu.gbr", "b-In2_Cu.gbr",
      "b-In3_Cu.gbr", "b-In4_Cu.gbr", "b-B_Cu.gbr",
    ]);
    expect(roles(s)).toEqual(["top", "inner", "inner", "inner", "inner", "bottom"]);
    expect(nums(s)).toEqual([1, 2, 3, 4]);
    expect(s.copper.map((c) => c.index)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("orders inner layers numerically, not alphabetically (In2 before In10)", () => {
    const s = classifyStackup([
      "b-F_Cu.gbr", "b-In10_Cu.gbr", "b-In2_Cu.gbr", "b-In1_Cu.gbr", "b-B_Cu.gbr",
    ]);
    expect(nums(s)).toEqual([1, 2, 10]);
  });

  it("classifies Altium .g2/.g3 as ordered inner copper", () => {
    const s = classifyStackup([
      "board.gtl", "board.g2", "board.g3", "board.gbl",
    ]);
    expect(roles(s)).toEqual(["top", "inner", "inner", "bottom"]);
    expect(nums(s)).toEqual([2, 3]);
  });

  it("handles a single-sided board (one copper layer)", () => {
    const s = classifyStackup(["board.gtl", "board.gko"]);
    expect(roles(s)).toEqual(["top"]);
    expect(s.copper[0].index).toBe(0);
  });

  it("detects solder paste layers", () => {
    const s = classifyStackup([
      "proj-F_Cu.gbr", "proj-B_Cu.gbr", "proj-F_Paste.gbr", "proj-B_Paste.gbr",
    ]);
    expect(s.top_paste).toBeTruthy();
    expect(s.bottom_paste).toBeTruthy();
  });

  // --- Vendor-export fixtures (H2) ---

  it("classifies an Eagle CAM export (.cmp/.sol/.stc/.plc)", () => {
    const s = classifyStackup([
      "board.cmp", "board.sol", "board.stc", "board.sts",
      "board.plc", "board.pls", "board.oln", "board.drd",
    ]);
    expect(s.copper.map((c) => c.role)).toEqual(["top", "bottom"]);
    expect(s.top_mask).toBe("board.stc");
    expect(s.top_silk).toBe("board.plc");
    expect(s.outline).toBe("board.oln");
  });

  it("classifies a JLCPCB-style export (Gerber_TopLayer.GTL etc.)", () => {
    const s = classifyStackup([
      "Gerber_TopLayer.GTL", "Gerber_BottomLayer.GBL",
      "Gerber_TopSolderMaskLayer.GTS", "Gerber_BottomSolderMaskLayer.GBS",
      "Gerber_TopSilkscreenLayer.GTO", "Gerber_BoardOutlineLayer.GKO",
      "Drill_PTH_Through.DRL",
    ]);
    expect(s.copper.map((c) => c.role)).toEqual(["top", "bottom"]);
    expect(s.top_mask).toBe("Gerber_TopSolderMaskLayer.GTS");
    expect(s.top_silk).toBe("Gerber_TopSilkscreenLayer.GTO");
    expect(s.outline).toBe("Gerber_BoardOutlineLayer.GKO");
    expect(s.drills?.length).toBe(1);
  });

  it("classifies a full KiCad export with paste + inner + multiple drills", () => {
    const s = classifyStackup([
      "brd-F_Cu.gbr", "brd-In1_Cu.gbr", "brd-In2_Cu.gbr", "brd-B_Cu.gbr",
      "brd-F_Mask.gbr", "brd-B_Mask.gbr", "brd-F_Paste.gbr",
      "brd-F_Silkscreen.gbr", "brd-Edge_Cuts.gbr",
      "brd-PTH.drl", "brd-NPTH.drl",
    ]);
    expect(s.copper.map((c) => c.role)).toEqual(["top", "inner", "inner", "bottom"]);
    expect(s.top_paste).toBeTruthy();
    expect(s.drills?.length).toBe(2);
  });
});
