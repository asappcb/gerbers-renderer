import { describe, it, expect } from "vitest";
import { encodeViewState, decodeViewState, type ViewState } from "./viewState";

const sample: ViewState = {
  v: 1,
  side: "bottom",
  cam: { x: 12.5, y: -3.25, zoom: 8, rot: 0 },
  visible: { "cu.top": true, "cu.in2": true, "cu.bottom": false },
  grid: true,
  units: "mm",
};

describe("view state encode/decode", () => {
  it("round-trips losslessly", () => {
    const decoded = decodeViewState(encodeViewState(sample));
    expect(decoded).toEqual(sample);
  });

  it("produces a URL-safe string (no +, /, or =)", () => {
    const enc = encodeViewState(sample);
    expect(enc).not.toMatch(/[+/=]/);
  });

  it("returns null for malformed input", () => {
    expect(decodeViewState("not-valid-base64!!!")).toBeNull();
    expect(decodeViewState(encodeViewState({ ...sample, v: 2 as unknown as 1 }))).toBeNull();
  });

  it("rejects non-finite camera values (auto-applied from URL)", () => {
    const bad = encodeViewState({ ...sample, cam: { x: NaN, y: 0, zoom: 8 } as unknown as ViewState["cam"] });
    expect(decodeViewState(bad)).toBeNull();
    const empty = encodeViewState({ ...sample, cam: {} as unknown as ViewState["cam"] });
    expect(decodeViewState(empty)).toBeNull();
  });
});
