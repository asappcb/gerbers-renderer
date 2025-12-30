import { describe, it, expect, beforeEach } from 'vitest';
import { OverlayRegistry } from './overlayRegistry';
import { Overlay } from './core/renderContract';

describe('OverlayRegistry', () => {
  let registry: OverlayRegistry;
  let mockOverlay1: Overlay;
  let mockOverlay2: Overlay;
  let mockOverlay3: Overlay;

  beforeEach(() => {
    registry = new OverlayRegistry();
    
    mockOverlay1 = {
      id: 'test1',
      zIndex: 10,
      visible: true,
      draw: () => {},
    };
    
    mockOverlay2 = {
      id: 'test2', 
      zIndex: 20,
      visible: true,
      draw: () => {},
    };
    
    mockOverlay3 = {
      id: 'test3',
      zIndex: 15,
      visible: false,
      draw: () => {},
    };
  });

  it('should add overlays', () => {
    registry.add(mockOverlay1);
    expect(registry.get('test1')).toBe(mockOverlay1);
    expect(registry.list()).toHaveLength(1);
  });

  it('should throw when adding duplicate overlay', () => {
    registry.add(mockOverlay1);
    expect(() => registry.add(mockOverlay1)).toThrow('Overlay already exists: test1');
  });

  it('should remove overlays', () => {
    registry.add(mockOverlay1);
    const removed = registry.remove('test1');
    expect(removed).toBe(mockOverlay1);
    expect(registry.get('test1')).toBeUndefined();
    expect(registry.list()).toHaveLength(0);
  });

  it('should return undefined when removing non-existent overlay', () => {
    const removed = registry.remove('nonexistent');
    expect(removed).toBeUndefined();
  });

  it('should sort overlays by zIndex', () => {
    registry.add(mockOverlay2); // zIndex: 20
    registry.add(mockOverlay1); // zIndex: 10
    registry.add(mockOverlay3); // zIndex: 15, but invisible
    
    const sorted = registry.getSortedVisible();
    // Only visible overlays should be included
    expect(sorted.map(o => o.id)).toEqual(['test1', 'test2']);
  });

  it('should filter invisible overlays', () => {
    registry.add(mockOverlay1); // visible: true
    registry.add(mockOverlay3); // visible: false
    
    const visible = registry.getSortedVisible();
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('test1');
  });

  it('should set visibility', () => {
    registry.add(mockOverlay3);
    expect(registry.get('test3')?.visible).toBe(false);
    
    registry.setVisible('test3', true);
    expect(registry.get('test3')?.visible).toBe(true);
    
    // Setting same visibility should not cause issues
    registry.setVisible('test3', true);
    expect(registry.get('test3')?.visible).toBe(true);
  });

  it('should handle setting visibility on non-existent overlay', () => {
    // Should not throw
    registry.setVisible('nonexistent', true);
  });

  it('should set zIndex', () => {
    registry.add(mockOverlay1);
    expect(registry.get('test1')?.zIndex).toBe(10);
    
    registry.setZIndex('test1', 30);
    expect(registry.get('test1')?.zIndex).toBe(30);
    
    // Setting same zIndex should not cause issues
    registry.setZIndex('test1', 30);
    expect(registry.get('test1')?.zIndex).toBe(30);
  });

  it('should handle setting zIndex on non-existent overlay', () => {
    // Should not throw
    registry.setZIndex('nonexistent', 50);
  });

  it('should resort when zIndex changes', () => {
    registry.add(mockOverlay1); // zIndex: 10
    registry.add(mockOverlay2); // zIndex: 20
    
    // Initial order
    let sorted = registry.getSortedVisible();
    expect(sorted.map(o => o.id)).toEqual(['test1', 'test2']);
    
    // Change zIndex
    registry.setZIndex('test1', 25);
    
    // Should be resorted
    sorted = registry.getSortedVisible();
    expect(sorted.map(o => o.id)).toEqual(['test2', 'test1']);
  });

  it('should not resort when visibility changes', () => {
    registry.add(mockOverlay1); // zIndex: 10
    registry.add(mockOverlay2); // zIndex: 20
    
    // Get initial sorted cache
    const sorted1 = registry.getSortedVisible();
    
    // Change visibility (should not trigger resort)
    registry.setVisible('test1', false);
    
    // Cache should be reused (no resort needed)
    const sorted2 = registry.getSortedVisible();
    expect(sorted2).toEqual(sorted1.filter(o => o.visible));
  });

  it('should handle complex sorting scenario', () => {
    const overlays = [
      { id: 'a', zIndex: 30, visible: true, draw: () => {} },
      { id: 'b', zIndex: 10, visible: true, draw: () => {} },
      { id: 'c', zIndex: 20, visible: false, draw: () => {} },
      { id: 'd', zIndex: 40, visible: true, draw: () => {} },
      { id: 'e', zIndex: 25, visible: true, draw: () => {} },
    ] as Overlay[];

    // Add in random order
    registry.add(overlays[2]);
    registry.add(overlays[4]);
    registry.add(overlays[0]);
    registry.add(overlays[1]);
    registry.add(overlays[3]);

    const sorted = registry.getSortedVisible();
    expect(sorted.map(o => o.id)).toEqual(['b', 'e', 'a', 'd']);
  });
});
