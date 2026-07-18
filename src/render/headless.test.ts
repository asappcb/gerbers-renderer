import { describe, it, expect } from "vitest";
import { renderGerberSvgDocs } from "./renderGerbersFiles";
import { composeStackToSvg, renderGerbersToSvg } from "./headless";

const enc = (s: string) => new TextEncoder().encode(s);

const OUTLINE = [
  "%FSLAX24Y24*%",
  "%MOMM*%",
  "G36",
  "X0Y0D02",
  "X100000Y0D01",
  "X100000Y80000D01",
  "X0Y80000D01",
  "X0Y0D01",
  "G37",
  "M02",
].join("\n");

const copper = (endX: string) => [
  "%FSLAX24Y24*%",
  "%MOMM*%",
  "%ADD10C,0.500*%",
  "D10",
  "X0Y0D02",
  `X${endX}Y0D01`,
  "M02",
].join("\n");

const files = () => ({
  "top.gtl": enc(copper("100000")),
  "bottom.gbl": enc(copper("80000")),
  "outline.gko": enc(OUTLINE),
});

describe("renderGerberSvgDocs (pure core)", () => {
  it("produces SVG source strings (no blob URLs) and an ordered copper stack", async () => {
    const docs = await renderGerberSvgDocs(files());
    expect(docs.copper.map((c) => c.role)).toEqual(["top", "bottom"]);
    // svgById holds raw <svg> markup, not blob: URLs
    expect(docs.svgById[docs.copper[0].svgId]).toContain("<svg");
    expect(docs.boardMaskId).toBeTruthy();
    expect(docs.wPx).toBeGreaterThan(0);
  });
});

describe("composeStackToSvg / renderGerbersToSvg", () => {
  it("composes a single self-contained SVG with embedded layer images and a board clip", async () => {
    const svg = await renderGerbersToSvg(files(), { side: "top" });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("<image");                 // layers embedded inline
    expect(svg).toContain('mask="url(#__board)"');   // clipped to board outline
    expect(svg).toContain("#1a5f1a");                // FR4 background
    // fully self-contained: no blob: URLs, no external refs
    expect(svg).not.toContain("blob:");
    expect(svg).not.toContain("http://localhost");
  });

  it("can compose the bottom side and omit the FR4 background on request", async () => {
    const svg = await renderGerbersToSvg(files(), { side: "bottom", includeFR4: false });
    expect(svg).toContain("<image");
    expect(svg).not.toContain("#1a5f1a");
  });
});
