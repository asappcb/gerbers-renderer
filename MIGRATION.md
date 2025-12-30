# Migration Guide: From BoardViewer to Integrated Viewer

This guide helps you migrate from the legacy DOM-based BoardViewer to the new canvas-based Integrated Viewer with the modern render pipeline.

## Quick Comparison

| Feature | Legacy BoardViewer | Integrated Viewer |
|---------|------------------|------------------|
| **Rendering** | DOM `<img>` elements + CSS transforms | Canvas with render passes |
| **Performance** | Multiple DOM elements, limited | Single canvas, hardware accelerated |
| **Coordinates** | CSS transform matrix | Mathematical ViewportTransform |
| **Extensibility** | Limited DOM manipulation | Flexible render pass system |
| **Overlays** | Separate canvas for grid | Integrated overlay system |
| **Markers** | Not supported | Built-in marker system |
| **Selection** | Not supported | Built-in selection system |

## Basic Migration

### Before (Legacy)
```typescript
import { createBoardViewer } from "gerbers-renderer";

const viewer = createBoardViewer(container, {
  onDownload: () => console.log("download")
});

viewer.setData({
  boardGeom: result.boardGeom,
  layers: result.layers
});

viewer.setSideMode("top");
viewer.fit();
```

### After (Integrated)
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

// New features available:
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

## API Differences

### Removed Methods
- `dispose()` - Still available, but you should also clean up render resources

### New Methods
- `viewer.viewer` - Access to underlying Viewer instance
- `viewer.visibility` - VisibilityManager instance
- `viewer.overlayRegistry` - OverlayRegistry instance  
- `viewer.markerRenderer` - MarkerRenderer instance
- `setSelection(selection)` - Set selection state
- `addMarker(marker)` - Add a marker
- `removeMarker(id)` - Remove a marker

### Event Handling
The integrated viewer uses the same UI events (wheel, mousedown, etc.) but they now work with the mathematical transform system instead of CSS transforms.

## Performance Benefits

1. **Single Canvas**: One drawing surface instead of multiple DOM elements
2. **Hardware Acceleration**: Canvas rendering uses GPU acceleration
3. **Efficient Updates**: Only redraw when needed via requestAnimationFrame
4. **Coordinate Consistency**: All elements use the same coordinate system
5. **Memory Efficient**: No DOM overhead for layers and overlays

## Backward Compatibility

The legacy `createBoardViewer` is still available and unchanged. You can:
- Keep using the existing viewer
- Migrate gradually by testing the integrated viewer
- Use both viewers in the same application

## Coordinate System

The integrated viewer uses a precise coordinate system:
- **Board space**: millimeters, x right, y down (top-left origin)
- **Screen space**: pixels, x right, y down (canvas default)
- **Transform**: `ViewportTransform` with matrix operations

This differs from the legacy viewer's CSS transform approach but provides:
- Better precision for zoom/pan operations
- Consistent coordinate handling across all features
- Mathematical foundation for extensions

**Note**: Both board and screen coordinates now use top-left origin (y down), which eliminates the need for Y-axis flipping and provides more intuitive coordinate handling.

## Testing the Migration

1. **Basic functionality**: Load your existing Gerber files
2. **Pan/zoom**: Test mouse wheel and drag interactions  
3. **Layer toggling**: Verify side mode switching works
4. **Grid overlay**: Test grid display and units
5. **Performance**: Compare rendering performance with complex boards

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

1. **Test with your data**: Try the integrated viewer with your Gerber files
2. **Explore features**: Experiment with markers, selections, and custom overlays
3. **Customize passes**: Add render passes specific to your use case
4. **Performance tune**: Optimize for your typical board sizes and complexity

The integrated viewer provides a foundation for advanced features while maintaining the familiar interface of the original BoardViewer.
