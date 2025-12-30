# Integrated Viewer Guide

This guide covers the modern canvas-based Integrated Viewer with the render pipeline system.

## Features Overview

| Feature | Integrated Viewer |
|---------|------------------|
| **Rendering** | Canvas with render passes |
| **Performance** | Single canvas, hardware accelerated |
| **Coordinates** | Mathematical ViewportTransform |
| **Extensibility** | Flexible render pass system |
| **Overlays** | Integrated overlay system |
| **Markers** | Built-in marker system |
| **Selection** | Built-in selection system |

## Basic Usage
```typescript
import { createIntegratedViewer } from "gerbers-renderer";

const viewer = createIntegratedViewer(container, {
  onDownload: () => console.log("download")
});

viewer.setData({
  boardGeom: result.boardGeom,
  layers: result.layers
});

viewer.setSideMode("top");
viewer.fit();

// Additional features:
viewer.addMarker({
  id: "test-point",
  position: { x: 10, y: 5 }, // Board coordinates (mm)
  type: "testpoint"
});

viewer.setSelection({
  type: "region",
  bounds: { min: { x: 0, y: 0 }, max: { x: 20, y: 10 } }
});
```

## Advanced Features

### Custom Overlays
```typescript
// Add a custom overlay
viewer.overlayRegistry.add({
  id: "rulers",
  visible: true,
  zIndex: 20,
  draw: (ctx, helpers) => {
    // Draw rulers using helpers.boardToScreen() and helpers.screenToBoard()
    const center = helpers.boardToScreen({ x: 0, y: 0 });
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(center.x - 10, center.y);
    ctx.lineTo(center.x + 10, center.y);
    ctx.stroke();
  }
});

// Control visibility
viewer.visibility.setOverlayVisibility("rulers", false);
```

### Custom Render Passes
```typescript
// Add a custom render pass (e.g., heatmap)
viewer.viewer.addPass({
  id: "custom:heatmap",
  order: 110, // In overlay range
  enabled: () => viewer.visibility.overlays.heatmap,
  draw: (rc) => {
    const m = rc.xform.getWorldToScreenMatrix();
    rc.ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
    
    // Draw heatmap in board coordinates
    // ... your drawing code here
  }
});
```

### Camera Control
```typescript
// Precise camera control
viewer.viewer.setCamera({
  center_mm: { x: 50, y: 25 },
  zoom: 20,
  rotation_rad: Math.PI / 4,
  mirrorX: false,
  mirrorY: false
});

// Get current camera state
const camera = viewer.viewer.getCamera();
console.log(`Current zoom: ${camera.zoom} px/mm`);
```

### Visibility Management
```typescript
// Use presets
viewer.visibility.applyPreset('copper-only');

// Individual layer control
viewer.visibility.setGerberVisibility('copper', false);
viewer.visibility.setMarkersVisibility(true);

// Reactive updates
viewer.visibility.subscribe((state) => {
  console.log('Visibility changed:', state);
  viewer.viewer.requestRender('visibility-update');
});
```

## API Reference
### Available Methods
- `setData(data)` - Set board geometry and layers
- `setSideMode(mode)` - Switch between top/bottom views
- `fit()` - Fit board to viewport
- `dispose()` - Clean up resources
- `viewer.viewer` - Access to underlying Viewer instance
- `viewer.visibility` - VisibilityManager instance
- `viewer.overlayRegistry` - OverlayRegistry instance  
- `viewer.markerRenderer` - MarkerRenderer instance
- `setSelection(selection)` - Set selection state
- `addMarker(marker)` - Add a marker
- `removeMarker(id)` - Remove a marker

## Event Handling
The viewer handles mouse events for pan/zoom and provides programmatic camera control.

## Performance Benefits

1. **Single Canvas**: One drawing surface instead of multiple DOM elements
2. **Hardware Acceleration**: Canvas rendering uses GPU acceleration
3. **Efficient Updates**: Only redraw when needed via requestAnimationFrame
4. **Coordinate Consistency**: All elements use the same coordinate system
5. **Memory Efficient**: No DOM overhead for layers and overlays

## Coordinate System

The viewer uses a precise coordinate system:
- **Board space**: millimeters, x right, y down (top-left origin)
- **Screen space**: pixels, x right, y down (canvas default)
- **Transform**: `ViewportTransform` with matrix operations

This provides:
- Better precision for zoom/pan operations
- Consistent coordinate handling across all features
- Mathematical foundation for extensions

**Note**: Both board and screen coordinates use top-left origin (y down), which eliminates the need for Y-axis flipping and provides more intuitive coordinate handling.

## Getting Started

1. **Basic functionality**: Load your Gerber files
2. **Pan/zoom**: Test mouse wheel and drag interactions  
3. **Layer toggling**: Verify side mode switching works
4. **Grid overlay**: Test grid display and units
5. **Performance**: Check rendering performance with complex boards

## Troubleshooting

### Images Not Loading
The integrated viewer converts layer images to canvas render passes. Ensure:
- Image URLs are valid and accessible
- Board geometry is set before layers
- Canvas is properly sized

### Coordinate Issues
If coordinates seem wrong:
- Check board geometry units (should be inches)
- Verify zoom level (pixels per mm)
- Use the coordinate helpers for debugging

### Performance Problems
If rendering is slow:
- Reduce overlay complexity
- Use LOD (level of detail) for markers
- Minimize render pass count
- Check for unnecessary render requests

## Next Steps

1. **Load your data**: Try the viewer with your Gerber files
2. **Explore features**: Experiment with markers, selections, and custom overlays
3. **Customize passes**: Add render passes specific to your use case
4. **Performance tune**: Optimize for your typical board sizes and complexity

The integrated viewer provides a modern, high-performance foundation for PCB visualization with extensive customization options.
