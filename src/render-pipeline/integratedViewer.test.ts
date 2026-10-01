import { describe, it, expect, beforeAll, vi } from "vitest";
import { createIntegratedViewer } from "./integratedViewer";
import { renderGerbersFiles } from "../render/renderGerbersFiles";

const enc = (s: string) => new TextEncoder().encode(s);

const OUTLINE = [
  "%FSLAX44Y44*%", "%MOMM*%",
  "G36*", "X0Y0D02*", "X500000Y0D01*", "X500000Y400000D01*", "X0Y400000D01*", "X0Y0D01*", "G37*", "M02*",
].join("\n");
const copper = (y: string) => [
  "%FSLAX44Y44*%", "%MOMM*%", "%ADD10C,1.2*%",
  "D10*", `X50000Y${y}D02*`, `X450000Y${y}D01*`, "M02*",
].join("\n");

const fourLayer = () => ({
  "b-F_Cu.gbr": enc(copper("350000")),
  "b-In1_Cu.gbr": enc(copper("250000")),
  "b-In2_Cu.gbr": enc(copper("150000")),
  "b-B_Cu.gbr": enc(copper("50000")),
  "b-Edge_Cuts.gbr": enc(OUTLINE),
});
const twoLayer = () => ({
  "c-F_Cu.gbr": enc(copper("350000")),
  "c-B_Cu.gbr": enc(copper("50000")),
  "c-Edge_Cuts.gbr": enc(OUTLINE),
});

// Draw calls made on any canvas, with the colour in effect at the time.
let drawLog: Array<{ op: string; fill: string; stroke: string }> = [];

beforeAll(() => {
  // jsdom has no canvas or blob URLs; a recording no-op 2D context is enough here.
  const state: Record<string | symbol, unknown> = { fillStyle: "", strokeStyle: "" };
  const ctx = new Proxy(state, {
    get: (t, k) => {
      if (k === "fillStyle" || k === "strokeStyle") return t[k];
      if (k === "measureText") return () => ({ width: 10 });
      if (k === "canvas") return document.createElement("canvas");
      return () => {
        if (k === "fillRect" || k === "fill" || k === "stroke") {
          drawLog.push({ op: String(k), fill: String(t.fillStyle), stroke: String(t.strokeStyle) });
        }
        return { addColorStop() {} };
      };
    },
    set: (t, k, val) => { t[k] = val; return true; },
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => ctx as any);
  let n = 0;
  URL.createObjectURL = () => `blob:test/${++n}`;
  URL.revokeObjectURL = () => {};
  // jsdom lays nothing out; give every element a real size so the camera can fit.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ x: 0, y: 0, left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600, toJSON() {} }) as DOMRect,
  );
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 800 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 600 });
  (globalThis as any).Path2D ??= class { constructor() { return new Proxy(this, { get: () => () => {} }); } };
  (globalThis as any).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});

async function load(v: ReturnType<typeof createIntegratedViewer>, files: Record<string, Uint8Array>) {
  const out = await renderGerbersFiles(files);
  v.setData({ boardGeom: out.boardGeom, layers: out.layers, stackup: out.stackup, geometry: out.geometry });
}

describe("integrated viewer", () => {
  it("draws crisp copper directly above each copper raster, including inner and solo layers", async () => {
    const host = document.createElement("div");
    const v = createIntegratedViewer(host);
    await load(v, fourLayer());

    const raster = v.viewer.getPass("cu.in1");
    const crisp = v.viewer.getPass("vector-copper:cu.in1");
    expect(raster && crisp).toBeTruthy();
    expect(crisp!.order).toBeGreaterThan(raster!.order);

    v.soloCopperLayer(2);
    const soloRaster = v.viewer.getPass("cu.in2")!;
    const soloCrisp = v.viewer.getPass("vector-copper:cu.in2")!;
    expect(soloCrisp.order).toBeGreaterThan(soloRaster.order);
    v.dispose();
  });

  it("opens a newly loaded board in the normal view, not on the old stepper layer", async () => {
    const host = document.createElement("div");
    const v = createIntegratedViewer(host);
    await load(v, fourLayer());
    v.stepLayer(1); v.stepLayer(1); v.stepLayer(1); v.stepLayer(1); // 4/4
    expect(host.querySelector("#layer-step-label")!.textContent).toMatch(/4\/4/);

    await load(v, twoLayer());
    expect(host.querySelector("#layer-step-label")!.textContent).toBe("All");
    expect(v.viewer.getPass("cu.top")).toBeTruthy();
    v.dispose();
  });

  it("highlights a pad attached partway along a long trace when the trace is clicked", async () => {
    // 46 mm trace with a pad touching it 11.5 mm from either end and from its
    // midpoint, plus an unconnected pad. The net must be trace + touching pad.
    const top = [
      "%FSLAX44Y44*%", "%MOMM*%", "%ADD10C,0.5*%", "%ADD11C,1.5*%",
      "D10*", "X20000Y200000D02*", "X480000Y200000D01*",
      "D11*", "X135000Y200000D03*",  // touching pad
      "X135000Y300000D03*",          // unconnected pad
      "M02*",
    ].join("\n");
    const host = document.createElement("div");
    const v = createIntegratedViewer(host);
    await load(v, { "n-F_Cu.gbr": enc(top), "n-Edge_Cuts.gbr": enc(OUTLINE) });

    const canvas = host.querySelector("canvas")!;
    const s = v.viewer.boardToScreen(40, 20); // on the trace, far from the pad
    canvas.dispatchEvent(new MouseEvent("click", { clientX: s.x, clientY: s.y, bubbles: true }));

    drawLog = [];
    v.viewer.render();
    const NET = "rgba(217, 70, 239";
    const netPads = drawLog.filter((d) => d.op === "fillRect" && d.fill.startsWith(NET));
    const netTraces = drawLog.filter((d) => d.op === "stroke" && d.stroke.startsWith(NET));
    expect(netTraces).toHaveLength(1);
    expect(netPads).toHaveLength(1); // the touching pad, not the unconnected one
    v.dispose();
  });
});
