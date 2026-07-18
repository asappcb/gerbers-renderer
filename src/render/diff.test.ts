import { describe, it, expect } from "vitest";
import { computeDiffAlignment } from "./diff";

const B = (min_x_mm: number, min_y_mm: number, max_x_mm: number, max_y_mm: number) =>
  ({ min_x_mm, min_y_mm, max_x_mm, max_y_mm });

describe("computeDiffAlignment", () => {
  it("returns the union of both boards' bounds", () => {
    const { union } = computeDiffAlignment(B(0, 0, 10, 8), B(2, -1, 11, 8));
    expect(union).toEqual({ min_x_mm: 0, min_y_mm: -1, max_x_mm: 11, max_y_mm: 8 });
  });

  it("flags no size change for identically-sized boards at different origins", () => {
    const { boardSizeChanged } = computeDiffAlignment(B(0, 0, 10, 8), B(5, 5, 15, 13));
    expect(boardSizeChanged).toBe(false);
  });

  it("flags a size change when dimensions differ beyond eps", () => {
    const { boardSizeChanged } = computeDiffAlignment(B(0, 0, 10, 8), B(0, 0, 12, 8));
    expect(boardSizeChanged).toBe(true);
  });

  it("treats sub-eps differences as unchanged", () => {
    const { boardSizeChanged } = computeDiffAlignment(B(0, 0, 10, 8), B(0, 0, 10.005, 8));
    expect(boardSizeChanged).toBe(false);
  });
});
