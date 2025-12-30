import { describe, it, expect, beforeEach } from 'vitest';
import { UniformGridIndex } from './uniformGridIndex';
import { MarkerStore } from './markerStore';
import { MarkerPicker } from './markerPicker';
import { ViewportTransform } from './core/viewportTransform';
import type { RenderCtx } from './core/renderContract';

describe('UniformGridIndex', () => {
  let index: UniformGridIndex;

  beforeEach(() => {
    index = new UniformGridIndex(5); // 5mm cells
  });

  it('should insert and query markers', () => {
    index.insert('marker1', 10, 10);
    index.insert('marker2', 12, 8);
    index.insert('marker3', 50, 50);

    // Query near first two markers
    const nearby = index.queryRadius(10, 10, 5);
    expect(nearby).toContain('marker1');
    expect(nearby).toContain('marker2');
    expect(nearby).not.toContain('marker3');
  });

  it('should remove markers', () => {
    index.insert('marker1', 10, 10);
    index.insert('marker2', 10, 10);
    
    index.remove('marker1', 10, 10);
    
    const nearby = index.queryRadius(10, 10, 5);
    expect(nearby).not.toContain('marker1');
    expect(nearby).toContain('marker2');
  });

  it('should clear all markers', () => {
    index.insert('marker1', 10, 10);
    index.insert('marker2', 20, 20);
    
    index.clear();
    
    const nearby = index.queryRadius(15, 15, 10);
    expect(nearby).toHaveLength(0);
  });
});

describe('MarkerStore', () => {
  let store: MarkerStore;

  beforeEach(() => {
    store = new MarkerStore();
  });

  it('should add and retrieve markers', () => {
    const marker = { id: 'test1', x_mm: 10, y_mm: 15 };
    store.add(marker);
    
    const retrieved = store.get('test1');
    expect(retrieved).toEqual(marker);
  });

  it('should add multiple markers', () => {
    const markers = [
      { id: 'test1', x_mm: 10, y_mm: 15 },
      { id: 'test2', x_mm: 20, y_mm: 25 },
      { id: 'test3', x_mm: 30, y_mm: 35 }
    ];
    
    store.addMany(markers);
    
    const list = store.list();
    expect(list).toHaveLength(3);
    expect(list.map(m => m.id)).toEqual(['test1', 'test2', 'test3']);
  });

  it('should update markers', () => {
    store.add({ id: 'test1', x_mm: 10, y_mm: 15 });
    
    store.updateMany([{ id: 'test1', x_mm: 20, severity: 'error' }]);
    
    const updated = store.get('test1');
    expect(updated?.x_mm).toBe(20);
    expect(updated?.severity).toBe('error');
  });

  it('should remove markers', () => {
    store.add({ id: 'test1', x_mm: 10, y_mm: 15 });
    store.add({ id: 'test2', x_mm: 20, y_mm: 25 });
    
    store.remove('test1');
    
    expect(store.get('test1')).toBeUndefined();
    expect(store.get('test2')).toBeDefined();
  });

  it('should query nearby markers', () => {
    store.addMany([
      { id: 'near1', x_mm: 10, y_mm: 10 },
      { id: 'near2', x_mm: 12, y_mm: 8 },
      { id: 'far', x_mm: 50, y_mm: 50 }
    ]);
    
    const nearby = store.queryNear(10, 10, 5);
    expect(nearby.map(m => m.id)).toContain('near1');
    expect(nearby.map(m => m.id)).toContain('near2');
    expect(nearby.map(m => m.id)).not.toContain('far');
  });

  it('should clear all markers', () => {
    store.addMany([
      { id: 'test1', x_mm: 10, y_mm: 15 },
      { id: 'test2', x_mm: 20, y_mm: 25 }
    ]);
    
    store.clear();
    
    expect(store.list()).toHaveLength(0);
  });
});

describe('MarkerPicker', () => {
  let picker: MarkerPicker;
  let store: MarkerStore;
  let mockRenderCtx: RenderCtx;

  beforeEach(() => {
    store = new MarkerStore();
    picker = new MarkerPicker(store);
    
    // Create mock render context with viewport transform
    const xform = new ViewportTransform(
      { center_mm: { x: 25, y: 25 }, zoom: 10 }, // 10px per mm
      { width_px: 500, height_px: 500 }
    );
    
    mockRenderCtx = {
      canvas: document.createElement('canvas'),
      ctx: document.createElement('canvas').getContext('2d')!,
      viewport: { width_px: 500, height_px: 500 },
      xform,
      now_ms: 0,
      visibility: { gerber: { copper: true, solderMask: true, silk: true, outline: true }, overlays: {}, markers: true },
      boardToScreen: (p) => xform.boardToScreen({ x: p.x, y: p.y }),
      screenToBoard: (p) => xform.screenToBoard({ x: p.x, y: p.y }),
    };
  });

  it('should pick nearest marker', () => {
    // Add markers at different positions
    store.addMany([
      { id: 'marker1', x_mm: 20, y_mm: 20 }, // Screen: (200, 200)
      { id: 'marker2', x_mm: 30, y_mm: 30 }, // Screen: (300, 300)
    ]);
    
    // Click near marker1
    const hit = picker.pick(mockRenderCtx, 210, 210, 20);
    
    expect(hit).toBeDefined();
    expect(hit?.id).toBe('marker1');
    expect(hit?.distance_px).toBeLessThan(20);
  });

  it('should return null when no markers nearby', () => {
    store.add({ id: 'marker1', x_mm: 20, y_mm: 20 });
    
    // Click far from marker
    const hit = picker.pick(mockRenderCtx, 400, 400, 10);
    
    expect(hit).toBeNull();
  });

  it('should choose closest marker when multiple are in range', () => {
    store.addMany([
      { id: 'marker1', x_mm: 20, y_mm: 20 }, // Screen: (200, 200)
      { id: 'marker2', x_mm: 22, y_mm: 22 }, // Screen: (220, 220)
    ]);
    
    // Click at (215, 215) - closer to marker2
    const hit = picker.pick(mockRenderCtx, 215, 215, 20);
    
    expect(hit?.id).toBe('marker2');
  });

  it('should respect pick radius', () => {
    store.add({ id: 'marker1', x_mm: 20, y_mm: 20 }); // Screen: (200, 200)
    
    // Click just outside radius
    const hit = picker.pick(mockRenderCtx, 250, 250, 10); // Distance ~70px
    
    expect(hit).toBeNull();
  });
});
