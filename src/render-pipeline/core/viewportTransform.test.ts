import { describe, it, expect, beforeEach } from "vitest";
import { ViewportTransform, CameraState, Viewport, Vec2 } from "./viewportTransform";

function approx(a: number, b: number, eps = 1e-6) {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(eps);
}

describe("ViewportTransform", () => {
  it("roundtrips board -> screen -> board", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 50, y: 25 }, zoom: 10, rotation_rad: 0.3 },
      { width_px: 800, height_px: 600 }
    );

    const pts = [
      { x: 0, y: 0 },
      { x: 100, y: 50 },
      { x: 12.345, y: 67.89 },
      { x: -10, y: 200 },
    ];

    for (const p of pts) {
      const s = t.boardToScreen({ x: p.x, y: p.y });
      const p2 = t.screenToBoard({ x: s.x, y: s.y });
      approx(p2.x, p.x, 1e-6);
      approx(p2.y, p.y, 1e-6);
    }
  });

  it("maps camera center to viewport center", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 10, y: 20 }, zoom: 5, rotation_rad: 0 },
      { width_px: 300, height_px: 200 }
    );
    const s = t.boardToScreen({ x: 10, y: 20 });
    expect(s.x).toBeCloseTo(150, 6);
    expect(s.y).toBeCloseTo(100, 6);
  });

  it("scales mm to px by zoom", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 20, rotation_rad: 0 },
      { width_px: 400, height_px: 400 }
    );

    const a = t.boardToScreen({ x: 0, y: 0 });
    const b = t.boardToScreen({ x: 1, y: 0 });
    expect(b.x - a.x).toBeCloseTo(20, 6);
  });

  it("handles mirrorX correctly", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 10, rotation_rad: 0, mirrorX: true },
      { width_px: 400, height_px: 400 }
    );

    const a = t.boardToScreen({ x: 0, y: 0 });
    const b = t.boardToScreen({ x: 1, y: 0 });
    expect(b.x - a.x).toBeCloseTo(-10, 6); // Negative because mirrored
  });

  it("handles mirrorY correctly", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 10, rotation_rad: 0, mirrorY: true },
      { width_px: 400, height_px: 400 }
    );

    const a = t.boardToScreen({ x: 0, y: 0 });
    const b = t.boardToScreen({ x: 0, y: 1 });
    expect(b.y - a.y).toBeCloseTo(-10, 6); // Negative because mirrorY flips Y
  });

  it("handles rotation correctly", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 1, rotation_rad: Math.PI / 2 },
      { width_px: 400, height_px: 400 }
    );

    // 90 degree rotation should map (1,0) to approximately (0,1) in screen coords
    // (since both board and screen Y go down, no flip occurs)
    const p = t.boardToScreen({ x: 1, y: 0 });
    const center = t.boardToScreen({ x: 0, y: 0 });
    
    expect(p.x - center.x).toBeCloseTo(0, 6);
    expect(p.y - center.y).toBeCloseTo(1, 6); // Positive because both Y axes go down
  });

  it("updates camera correctly", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 10 },
      { width_px: 400, height_px: 400 }
    );

    t.setCamera({ center_mm: { x: 50, y: 25 } });
    const camera = t.getCamera();
    expect(camera.center_mm.x).toBe(50);
    expect(camera.center_mm.y).toBe(25);
    expect(camera.zoom).toBe(10); // Should remain unchanged
  });

  it("updates viewport correctly", () => {
    const t = new ViewportTransform(
      { center_mm: { x: 0, y: 0 }, zoom: 10 },
      { width_px: 400, height_px: 400 }
    );

    t.setViewport({ width_px: 800, height_px: 600 });
    const viewport = t.getViewport();
    expect(viewport.width_px).toBe(800);
    expect(viewport.height_px).toBe(600);
  });
});
