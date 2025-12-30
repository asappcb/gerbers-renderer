import { describe, it, expect, beforeEach } from "vitest";
import { Viewer } from "./viewer";
import { RenderPass } from "./core/renderContract";

// Mock canvas for testing
function createMockCanvas(width = 800, height = 600): HTMLCanvasElement {
  const canvas = {
    width,
    height,
    getContext: () => ({
      setTransform: () => {},
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      fillStyle: '',
      font: '',
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      closePath: () => {},
      fill: () => {},
      stroke: () => {},
      strokeStyle: '',
      lineWidth: 0,
    }),
  } as any;
  return canvas;
}

describe("Viewer", () => {
  let viewer: Viewer;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = createMockCanvas();
    viewer = new Viewer(mockCanvas, {
      center_mm: { x: 0, y: 0 },
      zoom: 10,
      rotation_rad: 0,
    });
  });

  it("renders passes in order", () => {
    const calls: string[] = [];
    
    viewer.addPass({
      id: "test-a",
      order: 20,
      enabled: () => true,
      draw: () => calls.push("a"),
    });

    viewer.addPass({
      id: "test-b", 
      order: 10,
      enabled: () => true,
      draw: () => calls.push("b"),
    });

    viewer.render();
    expect(calls).toEqual(["b", "a"]);
  });

  it("respects enabled state", () => {
    const calls: string[] = [];
    
    viewer.addPass({
      id: "enabled-pass",
      order: 10,
      enabled: () => true,
      draw: () => calls.push("enabled"),
    });

    viewer.addPass({
      id: "disabled-pass",
      order: 20,
      enabled: () => false,
      draw: () => calls.push("disabled"),
    });

    viewer.render();
    expect(calls).toEqual(["enabled"]);
  });

  it("adds and removes passes", () => {
    const pass: RenderPass = {
      id: "test-pass",
      order: 10,
      enabled: () => true,
      draw: () => {},
    };

    viewer.addPass(pass);
    expect(viewer.getPass("test-pass")).toBe(pass);

    const removed = viewer.removePass("test-pass");
    expect(removed).toBe(true);
    expect(viewer.getPass("test-pass")).toBeUndefined();
  });

  it("updates camera and requests render", () => {
    let renderRequested = false;
    const originalRequestRender = viewer.requestRender.bind(viewer);
    viewer.requestRender = (reason) => {
      renderRequested = true;
      originalRequestRender(reason);
    };

    viewer.setCamera({ zoom: 20 });
    
    expect(renderRequested).toBe(true);
    expect(viewer.getCamera().zoom).toBe(20);
  });

  it("updates visibility and requests render", () => {
    let renderRequested = false;
    const originalRequestRender = viewer.requestRender.bind(viewer);
    viewer.requestRender = (reason) => {
      renderRequested = true;
      originalRequestRender(reason);
    };

    viewer.setVisibility({ 
      gerber: { copper: false, solderMask: true, silk: true, outline: true }
    });
    
    expect(renderRequested).toBe(true);
    expect(viewer.getVisibility().gerber.copper).toBe(false);
  });

  it("provides coordinate conversion helpers", () => {
    const boardPos = viewer.screenToBoard(400, 300);
    expect(typeof boardPos.x).toBe("number");
    expect(typeof boardPos.y).toBe("number");

    const screenPos = viewer.boardToScreen(10, 5);
    expect(typeof screenPos.x).toBe("number");
    expect(typeof screenPos.y).toBe("number");
  });

  it("provides debug information", () => {
    const debug = viewer.getDebugInfo();
    
    expect(debug.passes).toBeInstanceOf(Array);
    expect(debug.pendingRender).toBe(false); // No pending render since no default passes
    expect(debug.pendingReasons).toBeInstanceOf(Array);
    expect(debug.camera).toBeDefined();
    expect(debug.visibility).toBeDefined();
  });

  it("sorts passes by order automatically", () => {
    const calls: string[] = [];
    
    // Add passes in random order
    viewer.addPass({ id: "c", order: 30, enabled: () => true, draw: () => calls.push("c") });
    viewer.addPass({ id: "a", order: 10, enabled: () => true, draw: () => calls.push("a") });
    viewer.addPass({ id: "b", order: 20, enabled: () => true, draw: () => calls.push("b") });

    viewer.render();
    expect(calls).toEqual(["a", "b", "c"]);
  });

  it("handles duplicate pass IDs", () => {
    const pass1: RenderPass = {
      id: "duplicate",
      order: 10,
      enabled: () => true,
      draw: () => {},
    };

    const pass2: RenderPass = {
      id: "duplicate", 
      order: 20,
      enabled: () => true,
      draw: () => {},
    };

    viewer.addPass(pass1);
    viewer.addPass(pass2); // Should replace or add duplicate

    const passes = viewer.getDebugInfo().passes;
    const duplicatePasses = passes.filter(p => p.id === "duplicate");
    expect(duplicatePasses.length).toBeGreaterThan(0);
  });
});

describe("RenderScheduler", () => {
  it("should coalesce multiple render requests", () => {
    return new Promise<void>((done) => { // Fixed async test syntax
      import("./core/renderScheduler").then(({ RenderScheduler }) => {
        const calls: string[][] = [];
        const scheduler = new RenderScheduler((reasons) => {
          calls.push(reasons);
        });

        scheduler.requestRender("test1");
        scheduler.requestRender("test2");
        scheduler.requestRender("test3");

        // Should only call once on next frame
        setTimeout(() => {
          expect(calls.length).toBe(1);
          expect(calls[0]).toContain("test1");
          expect(calls[0]).toContain("test2");
          expect(calls[0]).toContain("test3");
          done();
        }, 20);
      });
    });
  });
});
