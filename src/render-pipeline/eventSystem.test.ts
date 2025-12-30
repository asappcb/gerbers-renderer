import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Emitter } from './events';
import { Viewer } from './viewer';
import type { ViewerEvents } from './viewerEvents';

describe('Emitter', () => {
  let emitter: Emitter<{ test: string; count: number }>;

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should register and call handlers', () => {
    const calls: string[] = [];
    emitter.on('test', (payload) => calls.push(payload));
    
    emitter.emit('test', 'hello');
    expect(calls).toEqual(['hello']);
  });

  it('should support unsubscribe', () => {
    const calls: string[] = [];
    const unsub = emitter.on('test', (payload) => calls.push(payload));
    
    emitter.emit('test', 'first');
    unsub();
    emitter.emit('test', 'second');
    
    expect(calls).toEqual(['first']);
  });

  it('should support once', () => {
    const calls: string[] = [];
    emitter.once('test', (payload) => calls.push(payload));
    
    emitter.emit('test', 'first');
    emitter.emit('test', 'second');
    
    expect(calls).toEqual(['first']);
  });

  it('should handle multiple handlers', () => {
    const calls: number[] = [];
    emitter.on('count', (payload) => calls.push(payload));
    emitter.on('count', (payload) => calls.push(payload * 2));
    
    emitter.emit('count', 5);
    expect(calls).toEqual([5, 10]);
  });

  it('should prevent mutation during emit', () => {
    const calls: string[] = [];
    const unsub = emitter.on('test', (payload) => {
      calls.push(payload);
      unsub(); // Unsubscribe during emit
    });
    
    emitter.on('test', (payload) => calls.push(payload + '-second'));
    
    emitter.emit('test', 'hello');
    expect(calls).toEqual(['hello', 'hello-second']);
  });

  it('should clear all handlers', () => {
    const calls: string[] = [];
    emitter.on('test', (payload) => calls.push(payload));
    emitter.on('count', (payload) => calls.push(String(payload)));
    
    emitter.clear();
    emitter.emit('test', 'hello');
    emitter.emit('count', 42);
    
    expect(calls).toEqual([]);
  });
});

describe('Viewer Events', () => {
  let viewer: Viewer;
  let canvas: HTMLCanvasElement;

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
    
    // Setup event listeners
    viewer.setupEventListeners();
  });

  it('should emit hover events on marker hover', () => {
    const calls: any[] = [];
    viewer.on('hover:marker', (e) => calls.push(e));
    
    // Add a marker
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    
    // Simulate mouse move over marker
    const moveEvent = new MouseEvent('mousemove', {
      clientX: 250, // Approximate screen position
      clientY: 250
    });
    canvas.dispatchEvent(moveEvent);
    
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[calls.length - 1].markerId).toBe('test1');
  });

  it('should not emit hover event when id unchanged', () => {
    const calls: any[] = [];
    viewer.on('hover:marker', (e) => calls.push(e));
    
    // Add a marker
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    
    // Call setHoverMarker directly with same ID twice
    viewer['setHoverMarker']('test1');
    viewer['setHoverMarker']('test1');
    
    expect(calls.length).toBe(1);
  });

  it('should emit selection events on marker click', () => {
    const calls: any[] = [];
    viewer.on('select:marker', (e) => calls.push(e));
    
    // Add a marker
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    
    // Simulate click on marker
    const clickEvent = new MouseEvent('click', {
      clientX: 250, // Approximate screen position
      clientY: 250
    });
    canvas.dispatchEvent(clickEvent);
    
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[calls.length - 1].markerId).toBe('test1');
  });

  it('should not emit selection event when id unchanged', () => {
    const calls: any[] = [];
    viewer.on('select:marker', (e) => calls.push(e));
    
    // Add a marker and select it
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    viewer.selectMarker('test1');
    
    // Try to select same marker again
    viewer.selectMarker('test1');
    
    // Should only have one selection event
    expect(calls.filter(c => c.markerId === 'test1')).toHaveLength(1);
  });

  it('should emit board click events when clicking empty space', () => {
    const calls: any[] = [];
    viewer.on('click:board', (e) => calls.push(e));
    
    // Simulate click on empty board space
    const clickEvent = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    canvas.dispatchEvent(clickEvent);
    
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[calls.length - 1]).toHaveProperty('x_mm');
    expect(calls[calls.length - 1]).toHaveProperty('y_mm');
  });

  it('should emit view change events', () => {
    const calls: any[] = [];
    viewer.on('view:change', (e) => calls.push(e));
    
    // Trigger view change by updating camera
    viewer['emitViewChange']();
    
    expect(calls.length).toBe(1);
    expect(calls[0]).toHaveProperty('center_mm');
    expect(calls[0]).toHaveProperty('zoom');
    expect(calls[0]).toHaveProperty('rotation_rad');
  });

  it('should support once listeners', () => {
    const calls: any[] = [];
    viewer.once('hover:marker', (e) => calls.push(e));
    
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    
    // Trigger hover twice
    viewer['setHoverMarker']('test1');
    viewer['setHoverMarker']('test1');
    
    expect(calls).toHaveLength(1);
  });

  it('should support unsubscribe', () => {
    const calls: any[] = [];
    const unsub = viewer.on('hover:marker', (e) => calls.push(e));
    
    viewer.addMarker({ id: 'test1', x_mm: 25, y_mm: 25 });
    
    // Trigger hover, unsubscribe, trigger again
    viewer['setHoverMarker']('test1');
    unsub();
    viewer['setHoverMarker']('test2');
    
    // Should only have the first call
    expect(calls).toHaveLength(1);
    expect(calls[0].markerId).toBe('test1');
  });
});
