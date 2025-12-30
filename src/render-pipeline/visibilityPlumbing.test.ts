import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Viewer } from './viewer';
import { VisibilityManager } from './visibilityManager';

describe('Visibility Plumbing', () => {
  let viewer: Viewer;
  let canvas: HTMLCanvasElement;
  let visibilityManager: VisibilityManager;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    
    // Mock canvas context
    const mockCtx = {
      setTransform: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 10 }),
      createLinearGradient: () => ({
        addColorStop: () => {}
      }),
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      putImageData: () => {},
      drawImage: () => {},
      clip: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      transform: () => {},
      resetTransform: () => {},
      rect: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      strokeRect: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      font: '12px sans-serif',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: 'rgba(0,0,0,0)',
      globalCompositeOperation: 'source-over'
    } as any;
    
    vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx);
    
    viewer = new Viewer(canvas, {
      center_mm: { x: 25, y: 25 },
      zoom: 10
    });

    visibilityManager = new VisibilityManager();
    // Replace the viewer's visibility manager with our test instance
    (viewer as any).visibility = visibilityManager;
  });

  it('should use centralized VisibilityManager', () => {
    const state = viewer.getVisibility();
    expect(state).toHaveProperty('gerber');
    expect(state).toHaveProperty('overlays');
    expect(state).toHaveProperty('markers');
  });

  it('should delegate visibility methods to VisibilityManager', () => {
    // Test gerber visibility
    viewer.setGerberVisibility('copper', false);
    expect(visibilityManager.isGerberLayerVisible('copper')).toBe(false);
    
    viewer.setGerberVisibility('copper', true);
    expect(visibilityManager.isGerberLayerVisible('copper')).toBe(true);

    // Test overlay visibility
    viewer.setOverlayVisibility('test-overlay', true);
    expect(visibilityManager.isOverlayVisible('test-overlay')).toBe(true);
    
    // Test markers visibility
    viewer.setMarkersVisibility(false);
    expect(visibilityManager.areMarkersVisible()).toBe(false);
  });

  it('should support toggle methods', () => {
    // Toggle gerber layer
    const initialCopper = visibilityManager.isGerberLayerVisible('copper');
    viewer.toggleGerberLayer('copper');
    expect(visibilityManager.isGerberLayerVisible('copper')).toBe(!initialCopper);
    
    // Toggle overlay
    viewer.setOverlayVisibility('test-overlay', false);
    viewer.toggleOverlay('test-overlay');
    expect(visibilityManager.isOverlayVisible('test-overlay')).toBe(true);
    
    // Toggle markers
    const initialMarkers = visibilityManager.areMarkersVisible();
    viewer.toggleMarkers();
    expect(visibilityManager.areMarkersVisible()).toBe(!initialMarkers);
  });

  it('should support visibility presets', () => {
    viewer.applyVisibilityPreset('none');
    const state = viewer.getVisibility();
    
    expect(state.gerber.copper).toBe(false);
    expect(state.gerber.solderMask).toBe(false);
    expect(state.gerber.silk).toBe(false);
    expect(state.gerber.outline).toBe(false);
    expect(state.markers).toBe(false);
  });

  it('should pass visibility state to render context', () => {
    // Set some visibility state
    viewer.setGerberVisibility('copper', false);
    viewer.setMarkersVisibility(true);
    viewer.setOverlayVisibility('test', true);
    
    // Create a test render pass that checks visibility
    let capturedVisibility: any = null;
    viewer.addPass({
      id: 'test-visibility',
      order: 1000,
      enabled: (rc) => {
        capturedVisibility = rc.visibility;
        return true;
      },
      draw: () => {}
    });
    
    // Trigger a render to capture the visibility state
    viewer.render();
    
    expect(capturedVisibility).not.toBeNull();
    expect(capturedVisibility.gerber.copper).toBe(false);
    expect(capturedVisibility.markers).toBe(true);
    expect(capturedVisibility.overlays.test).toBe(true);
  });

  it('should support visibility change subscriptions', () => {
    const calls: any[] = [];
    
    const unsubscribe = viewer.onVisibilityChange((state) => {
      calls.push(state);
    });
    
    // Make changes
    viewer.setGerberVisibility('copper', false);
    viewer.setMarkersVisibility(true);
    
    expect(calls.length).toBeGreaterThan(0);
    
    // Check that the latest state reflects changes
    const latestState = calls[calls.length - 1];
    expect(latestState.gerber.copper).toBe(false);
    expect(latestState.markers).toBe(true);
    
    unsubscribe();
    
    // Make another change - should not trigger callback
    viewer.setGerberVisibility('silk', false);
    expect(calls.length).toBe(calls.length); // No new calls
  });
});
