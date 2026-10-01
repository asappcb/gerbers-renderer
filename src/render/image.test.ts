import { describe, it, expect } from "vitest";
import { renderGerbersToImage, renderGerbersThumbnail, type SvgRasterizer } from "./headless";

const enc = (s: string) => new TextEncoder().encode(s);

const OUTLINE = [
  "%FSLAX44Y44*%", "%MOMM*%",
  "G36*", "X0Y0D02*", "X400000Y0D01*", "X400000Y300000D01*", "X0Y300000D01*", "X0Y0D01*", "G37*", "M02*",
].join("\n");
const TOP = ["%FSLAX44Y44*%", "%MOMM*%", "%ADD10C,1.5*%", "D10*", "X50000Y50000D03*", "M02*"].join("\n");

const files = () => ({ "top.gtl": enc(TOP), "outline.gko": enc(OUTLINE) });

describe("headless raster paths (injectable rasterizer)", () => {
  it("renderGerbersToImage composes an SVG and hands it to the rasterizer", async () => {
    let capturedSvg = "";
    let capturedSize: { width: number; height: number; scale: number } | null = null;
    const rasterizer: SvgRasterizer = async (svg, size) => {
      capturedSvg = svg;
      capturedSize = size;
      return new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG magic
    };
    const png = await renderGerbersToImage(files(), { side: "top", scale: 2, rasterizer });
    expect(png).toBeInstanceOf(Uint8Array);
    expect(png.length).toBe(4);
    expect(capturedSvg).toContain("<image"); // layers embedded
    expect(capturedSvg.startsWith("<svg")).toBe(true);
    expect(capturedSize!.scale).toBe(2);
    expect(capturedSize!.width).toBeGreaterThan(0);
  });

  it("renderGerbersThumbnail bounds the size and returns a PNG data URI", async () => {
    let capturedScale = 0;
    const rasterizer: SvgRasterizer = async (_svg, size) => {
      capturedScale = size.scale;
      return new Uint8Array([1, 2, 3]);
    };
    const uri = await renderGerbersThumbnail(files(), { maxSize: 64, rasterizer });
    expect(uri.startsWith("data:image/png;base64,")).toBe(true);
    // board is ~1575px wide at render resolution; scaled down to fit 64px
    expect(capturedScale).toBeLessThan(1);
    expect(capturedScale).toBeGreaterThan(0);
  });
});
