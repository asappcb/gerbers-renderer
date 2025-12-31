# gerbers-renderer

Pure frontend Gerber rendering for the web.
Render PCB Gerber bundles (`.zip`, `.rar`) directly in the browser with zero backend, zero native dependencies.

Designed for:

- Web apps
- Browser extensions
- CI previews
- Manufacturing portals
- DFM tools

## Features

- 🧠 Gerber bundle detection (not just “try and fail”)
- 📦 Supports `.zip` and `.rar` archives (browser-side)
- 🎨 Canvas-based board viewer with modern render pipeline
- 🧩 Drop-in viewer that mounts into any DOM node
- 🎯 Overlay system for custom visualizations
- 📍 High-performance marker system with spatial indexing
- 🎯 Built-in selection and interaction systems
- ⚡ Typed event emitter for user interactions
- 👁️ Centralized visibility management system
- 🧪 Typed, deterministic render results
- 🧼 No backend, no workers unless needed
- ⚡ Vite, React, vanilla JS friendly
- 🎯 Precise viewport transforms with camera controls
- 📐 Coordinate system: Board (mm) ↔ Screen (px) conversion

## Installation

```bash
npm install gerbers-renderer
```

## Quick start

### Integrated Viewer (Canvas-based)
```typescript
import { createIntegratedViewer } from "gerbers-renderer";

const viewer = createIntegratedViewer(document.getElementById("pcb")!);

const file = input.files[0];
const buffer = await file.arrayBuffer();

const result = await renderGerbers(buffer, {
  archiveWorkerUrl: "/libarchive-worker-bundle.js", // required for .rar
});

viewer.setData({
  boardGeom: result.boardGeom,
  layers: result.layers,
});
viewer.fit();

viewer.setSelection({
  type: "region",
  bounds: { min: { x: 0, y: 0 }, max: { x: 20, y: 10 } }
});

// Add markers for DFM analysis
viewer.addMarker({
  id: "via-issue",
  x_mm: 12.5,
  y_mm: 8.3,
  severity: "error",
  data: { issue: "Via too close to trace" }
});

viewer.addMarkers([
  { id: "test1", x_mm: 5, y_mm: 5, severity: "info" },
  { id: "test2", x_mm: 15, y_mm: 10, severity: "warning" }
]);
```

**Documentation**: See [MIGRATION.md](./MIGRATION.md) for detailed usage guide.

Always call `result.revoke()` when replacing a render.

## Live demo

```bash
git clone https://github.com/asappcb/gerbers-renderer
npm install
npm run dev
```

Open:
👉 http://localhost:5173/demo/

**The demo now showcases the new integrated viewer** with:
- Canvas-based rendering with hardware acceleration
- Grid overlay with mm/in units
- Precise viewport transforms and smooth pan/zoom
- Mouse-centered zoom (zooms where cursor is positioned)
- Green FR4 board background
- Clean rendering without placeholder text artifacts

## Supported input formats

| Format | Supported | Notes |
|---|---:|---|
| `.zip` | ✅ | Native via JSZip |
| `.rar` | ✅ | Via libarchive.js (WASM) |
| `.7z` | ❌ (future) | Detection works |
| `.tar` | ❌ (future) | Detection works |
| Directory | ✅ | Use `renderGerbersFiles` |

## Gerber bundle detection

Before rendering, you can detect whether an input is actually a Gerber bundle.

```typescript
import { detectGerberBundle } from "gerbers-renderer";

const result = await detectGerberBundle(buffer);

if (!result.isGerber) {
  console.log("Not a Gerber bundle:", result.reasons);
}
```

```typescript
type GerberDetectResult = {
  isGerber: boolean;
  archiveType: "zip" | "rar" | "7z" | "tar" | "directory" | "single-file" | "unknown";
  confidence: number; // 0.0 – 1.0
  reasons: string[];
  files?: string[];
};
```

## Rendering APIs

### `renderGerbers(...)` (recommended)

Single high-level entrypoint.

```typescript
renderGerbers(
  input: ArrayBuffer | Uint8Array,
  options?: {
    archiveWorkerUrl?: string; // required for rar
  }
): Promise<RenderResult>
```

Handles:

- Archive detection
- Unpacking
- Validation
- Rendering

### `renderGerbersZip(...)`

Zip-only convenience wrapper.

```typescript
renderGerbersZip(input: File | Blob | ArrayBuffer | Uint8Array)
```

### `renderGerbersFiles(...)`

Lowest-level API if you already have files.

```typescript
renderGerbersFiles(
  files: Record<string, Uint8Array>
)
```

## Viewer

Create a drop-in board viewer:

```typescript
const viewer = createIntegratedViewer(container, {
  onDownload: () => {
    /* optional */
  },
});

viewer.setData({
  boardGeom,
  layers,
});

viewer.setSideMode("top"); // "top" | "bottom"
viewer.fit();
```

The viewer supports:

- Pan / zoom with mouse-centered zoom
- Layer toggling (top/bottom switching)
- Grid overlay with mm/in units
- Custom overlays and markers
- Selection regions
- Download hook (original Gerbers)
- Hardware-accelerated canvas rendering

## Return value

All render functions return a deterministic object:

```typescript
type RenderResult = {
  boardGeom: BoardGeom;
  layers: ViewerLayers;
  revoke: () => void; // revoke blob URLs
};
```

Always call `revoke()` when replacing a render.

## `.rar` support (important)

To support `.rar` archives, you must host the libarchive worker bundle.

Setup

Copy:

```text
node_modules/libarchive.js/dist/worker-bundle.js
```

To:

```text
public/libarchive-worker-bundle.js
```

Then pass:

```typescript
renderGerbers(buffer, {
  archiveWorkerUrl: "/libarchive-worker-bundle.js",
});
```

ZIP users do not pay this cost.

## Error handling

Errors are typed and structured.

```typescript
class GerberError extends Error {
  code:
    | "NOT_AN_ARCHIVE"
    | "UNSUPPORTED_ARCHIVE"
    | "NOT_GERBER"
    | "MISSING_LAYERS"
    | "PARSE_ERROR";
  details?: any;
}
```

Always catch and inspect `error.code` in UI or CI.

## What this is not

- ❌ Not a CAM tool
- ❌ Not a DRC / DFM engine
- ❌ Not a backend renderer

This library is intentionally focused on fast, accurate visualization.

## Roadmap

- 7z / tar unpacking
- Inner-layer rendering
- Canvas renderer
- WASM-only core split
- Headless CI validation mode

## Architecture

### Viewport Transform System

The renderer uses a precise coordinate transformation system:

```typescript
import { ViewportTransform, CameraState } from "gerbers-renderer";

const transform = new ViewportTransform(
  { center_mm: { x: 50, y: 25 }, zoom: 10 },
  { width_px: 800, height_px: 600 }
);

// Convert between coordinate systems
const screenPos = transform.boardToScreen({ x: 10, y: 5 });  // mm → px
```

This enables:
- Precise coordinate transformations
- Smooth pan/zoom operations
- Mathematical foundation for extensions

## Overlay System

The integrated viewer includes a powerful overlay system for custom visualizations:

### Adding Custom Overlays

```typescript
import { createViolationDotsOverlay, createGridOverlay } from "gerbers-renderer";

// Add DFM violation dots (world space)
viewer.addOverlayLayer({
  id: "dfm:dots",
  zIndex: 50,
  visible: true,
  drawInWorldSpace: true, // Draw in mm coordinates
  draw: (ctx, api) => {
    const violations = [
      { x_mm: 10, y_mm: 12 },
      { x_mm: 40, y_mm: 5 }
    ];
    
    ctx.fillStyle = 'red';
    for (const v of violations) {
      ctx.beginPath();
      ctx.arc(v.x_mm, v.y_mm, 0.25, 0, Math.PI * 2); // 0.25mm radius
      ctx.fill();
    }
  }
});

// Add tooltip overlay (screen space)
viewer.addOverlayLayer({
  id: "ui:tooltip",
  zIndex: 200,
  visible: true,
  drawInWorldSpace: false, // Draw in screen pixels
  draw: (ctx, api) => {
    const hover = getCurrentHover(); // Get hover state
    if (!hover) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(hover.x_px + 12, hover.y_px - 20, 100, 20);
    ctx.fillStyle = 'white';
    ctx.fillText(hover.text, hover.x_px + 15, hover.y_px - 5);
  }
});
```

### Overlay API

Overlays receive a stable API object:

```typescript
type OverlayApi = {
  // Coordinate conversion
  boardToScreen: (p: { x_mm: number; y_mm: number }) => { x_px: number; y_px: number };
  screenToBoard: (p: { x_px: number; y_px: number }) => { x_mm: number; y_mm: number };
  
  // View state
  getViewState: () => { center_mm: { x: number; y: number }; zoom: number; rotation_rad: number };
  getViewport: () => { width_px: number; height_px: number };
  getBoardBounds: () => { minX_mm: number; minY_mm: number; maxX_mm: number; maxY_mm: number };
  
  // Render control
  requestRender: (reason: string) => void;
};
```

### Built-in Overlay Examples

```typescript
// Grid overlay
viewer.addOverlayLayer(createGridOverlay(1)); // 1mm spacing

// Violation dots
viewer.addOverlayLayer(createViolationDotsOverlay());

// Animated marker
viewer.addOverlayLayer(createPulsingMarkerOverlay({ x_mm: 25, y_mm: 30 }));

// Tooltip (provide hover state)
viewer.addOverlayLayer(createTooltipOverlay(() => getCurrentHover()));
```

### Overlay Management

```typescript
// Control visibility
viewer.setOverlayVisibility("dfm:dots", false);

// Remove overlay
viewer.removeOverlay("ui:tooltip");

// Access registry directly
const registry = viewer.getOverlayRegistry();
registry.setZIndex("dfm:dots", 100); // Change render order
```

**Key Features:**
- **Stable API**: Same object reference, current state access
- **Explicit coordinate spaces**: World (mm) vs Screen (px) drawing
- **Efficient rendering**: Sorted by zIndex, filtered by visibility
- **Animation support**: Use `api.requestRender()` for smooth animations
- **Lifecycle hooks**: `onAdd()` and `onRemove()` for setup/cleanup

## Marker System

The integrated viewer includes a high-performance marker system for interactive annotations, test points, and DFM indicators:

### Adding Markers

```typescript
// Add individual markers
viewer.addMarker({
  id: "test-point-1",
  x_mm: 10.5,
  y_mm: 15.2,
  severity: "error", // "error" | "warning" | "info"
  layer: "top",    // "top" | "bottom"
  data: { description: "Via too close to trace" }
});

// Add multiple markers efficiently
viewer.addMarkers([
  { id: "error1", x_mm: 20, y_mm: 25, severity: "error" },
  { id: "warn1", x_mm: 30, y_mm: 35, severity: "warning" },
  { id: "info1", x_mm: 40, y_mm: 45, severity: "info" }
]);
```

### Marker Types

```typescript
type Marker = {
  id: string;
  x_mm: number;
  y_mm: number;
  
  // Optional metadata
  layer?: "top" | "bottom";
  severity?: "error" | "warning" | "info";
  radius_mm?: number; // For future world-space rendering
  data?: Record<string, any>; // Custom data
};
```

### Marker Management

```typescript
// Update marker properties
viewer.updateMarker("test-point-1", { 
  severity: "warning",
  x_mm: 11.0 // Position changes update spatial index automatically
});

// Remove markers
viewer.removeMarker("test-point-1");

// Get marker by ID
const marker = viewer.getMarker("test-point-1");

// List all markers
const allMarkers = viewer.listMarkers();

// Clear all markers
viewer.clearMarkers();
```

### Marker Picking and Selection

```typescript
// Pick marker at screen coordinates
const hit = viewer.pickMarker(mouseX, mouseY, 10); // 10px pick radius

if (hit) {
  console.log(`Hit marker: ${hit.id} at ${hit.distance_px.toFixed(1)}px`);
  viewer.selectMarker(hit.id);
  
  // Access selected marker
  const selected = viewer.getSelectedMarker();
  console.log("Selected:", selected?.data);
}

// Clear selection
viewer.selectMarker(null);
```

### Viewer Navigation

The viewer provides several methods to navigate to specific locations on the board:

**For direct Viewer usage:**
```typescript
// Direct camera control - go to specific board coordinates (in mm)
viewer.setCamera({
  center_mm: { x: 50, y: 75 },  // Board coordinates in millimeters
  zoom: 10                       // Pixels per mm (zoom level)
});

// Get current camera state
const currentCamera = viewer.getCamera();
console.log('Current center:', currentCamera.center_mm);
console.log('Current zoom:', currentCamera.zoom);

// Coordinate conversion utilities
const screenPos = viewer.boardToScreen(50, 75);  // mm → px
const boardPos = viewer.screenToBoard(250, 300);  // px → mm
```

**For Integrated Viewer usage:**
```typescript
// When using createIntegratedViewer(), access the underlying viewer
const integratedViewer = createIntegratedViewer(hostElement);

// Navigate using the underlying viewer property
integratedViewer.viewer.setCamera({
  center_mm: { x: 50, y: 75 },
  zoom: 10
});

// Get current camera state
const currentCamera = integratedViewer.viewer.getCamera();

// Coordinate conversion utilities
const screenPos = integratedViewer.viewer.boardToScreen(50, 75);
const boardPos = integratedViewer.viewer.screenToBoard(250, 300);

// Navigate to a marker location
integratedViewer.addMarker({
  id: 'target-location',
  x_mm: 50,
  y_mm: 75,
  radius_mm: 2,
  color: '#ff0000'
});

// Note: selectMarker is on the integrated viewer, not the base viewer
integratedViewer.viewer.selectMarker('target-location', { 
  center: true, 
  animate: true 
});
```

**Camera State Properties:**
- `center_mm`: Board center point in millimeters
- `zoom`: Pixels per millimeter (zoom level)  
- `rotation_rad`: Rotation in radians (optional)
- `mirrorX/mirrorY`: Flip axes (optional)

### Marker Styling

Markers are automatically styled by severity:
- **Error**: Red circles
- **Warning**: Orange circles  
- **Info**: Blue circles
- **Default**: Gray circles

Selected markers have a blue outline, hovered markers have orange highlighting.

### Performance Features

```typescript
// The marker system uses:
// - O(1) lookup via Map storage
// - Uniform grid spatial index for fast queries
// - Viewport culling to skip off-screen markers
// - Constant pixel radius (4px) for visibility at all zooms
// - Cached list iteration with dirty flag optimization
```

### Advanced Usage

```typescript
// Batch updates for performance
viewer.updateMarkers([
  { id: "marker1", severity: "warning" },
  { id: "marker2", x_mm: 25.0, y_mm: 30.0 }
]);

// Query markers near a point (for custom tools)
const nearby = viewer.markers.queryNear(20, 20, 5); // 5mm radius

// Access underlying systems for advanced integration
const store = viewer.getMarkerStore();
const picker = viewer.getMarkerPicker();
```

**Key Features:**
- **High Performance**: Spatial index with O(1) lookup
- **Zoom-Aware Picking**: Accurate hit detection at any zoom level
- **Automatic Styling**: Severity-based color coding
- **Interactive Selection**: Click to select, hover for feedback
- **Batch Operations**: Efficient bulk updates
- **Custom Data**: Attach any metadata via `data` property

## Event System

The integrated viewer includes a typed event emitter for responding to user interactions and state changes:

### Event Types

```typescript
type ViewerEvents = {
  "hover:marker": { markerId: string | null; marker?: Marker };
  "select:marker": { markerId: string | null; marker?: Marker };
  "click:board": { x_mm: number; y_mm: number };
  "view:change": { center_mm: { x: number; y: number }; zoom: number; rotation_rad: number };
};
```

### Setting Up Event Listeners

```typescript
// Set up mouse event handling (call once after viewer creation)
viewer.setupEventListeners();

// Listen to marker hover events
viewer.on('hover:marker', ({ markerId, marker }) => {
  if (marker) {
    console.log(`Hovering: ${marker.severity} at ${marker.x_mm}, ${marker.y_mm}`);
    // Update tooltip or UI
  } else {
    // Hide tooltip
  }
});

// Listen to marker selection events
viewer.on('select:marker', ({ markerId, marker }) => {
  if (marker) {
    console.log(`Selected: ${marker.data?.description}`);
    // Show details panel or highlight related elements
  }
});

// Listen to board clicks (clicking empty space)
viewer.on('click:board', ({ x_mm, y_mm }) => {
  console.log(`Clicked board at ${x_mm.toFixed(2)}, ${y_mm.toFixed(2)}mm`);
  // Could add a marker at this position or show context menu
});

// Listen to view changes (pan/zoom)
viewer.on('view:change', ({ center_mm, zoom, rotation_rad }) => {
  console.log(`View changed: center=${center_mm.x},${center_mm.y} zoom=${zoom}`);
  // Update coordinates display or save view state
});
```

### Event Listener Options

```typescript
// One-time listener (auto-unsubscribes after first event)
viewer.once('select:marker', ({ marker }) => {
  console.log('First selection:', marker?.id);
});

// Manual unsubscribe
const unsub = viewer.on('hover:marker', onHover);
// Later...
unsub(); // Remove listener
```

### Event Characteristics

- **No Spam**: Events only emit when state actually changes
- **Type Safe**: Full TypeScript typing for all events
- **Performance**: Efficient Set-based handler storage
- **Robust**: Safe unsubscribe even during event emission

### Integration with Markers

The event system integrates seamlessly with the marker system:

```typescript
// Add markers
viewer.addMarkers([
  { id: 'error1', x_mm: 10, y_mm: 15, severity: 'error', data: { issue: 'Via too close' } },
  { id: 'warn1', x_mm: 20, y_mm: 25, severity: 'warning', data: { issue: 'Trace width' } }
]);

// Events will automatically fire for hover/selection
viewer.setupEventListeners();

// Build interactive UI
viewer.on('hover:marker', ({ marker }) => {
  if (marker?.severity === 'error') {
    showTooltip(marker.data?.issue);
  }
});

viewer.on('select:marker', ({ marker }) => {
  if (marker) {
    showDetailsPanel(marker);
    // Optional: center view on selection
    viewer.selectMarker(marker.id, { center: true, animate: true });
  }
});
```

### Advanced Usage

```typescript
// Custom event handling for DFM tools
class DFMTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.setupEvents();
  }

  setupEvents() {
    this.viewer.on('hover:marker', this.onHover.bind(this));
    this.viewer.on('select:marker', this.onSelect.bind(this));
    this.viewer.on('click:board', this.onBoardClick.bind(this));
  }

  onHover({ marker }) {
    if (marker?.severity === 'error') {
      this.showCriticalError(marker);
    }
  }

  onSelect({ marker }) {
    if (marker) {
      this.zoomToIssue(marker);
      this.showRelatedElements(marker);
    }
  }

  onBoardClick({ x_mm, y_mm }) {
    // Add new marker at click position
    this.viewer.addMarker({
      id: `custom-${Date.now()}`,
      x_mm,
      y_mm,
      severity: 'info',
      data: { source: 'user-click' }
    });
  }
}

// Usage
const dfmTool = new DFMTool(viewer);
```

**Key Features:**
- **Typed Events**: Full TypeScript safety with event payloads
- **State Change Detection**: No duplicate events spam
- **Memory Safe**: Automatic cleanup and unsubscribe support
- **Interactive**: Built-in hover and selection handling
- **Extensible**: Easy to add custom event handling logic

## Visibility System

The integrated viewer includes a centralized visibility management system that controls which layers and features are rendered:

### Visibility State Structure

```typescript
type VisibilityState = {
  gerber: {
    copper: boolean;      // Copper traces
    solderMask: boolean;   // Solder mask layers
    silk: boolean;        // Silk screen layers
    outline: boolean;     // Board outline
  };
  overlays: Record<string, boolean>; // Custom overlay visibility
  markers: boolean;      // Marker system visibility
};
```

### Basic Visibility Control

```typescript
// Get current visibility state
const state = viewer.getVisibility();
console.log(state.gerber.copper); // true/false
console.log(state.markers);      // true/false

// Set individual layer visibility
viewer.setGerberVisibility('copper', false);
viewer.setOverlayVisibility('grid', true);
viewer.setMarkersVisibility(true);

// Toggle layers
viewer.toggleGerberLayer('silk');
viewer.toggleOverlay('grid');
viewer.toggleMarkers();
```

### Visibility Presets

```typescript
// Quick visibility presets for common use cases
viewer.applyVisibilityPreset('all');        // Show everything
viewer.applyVisibilityPreset('none');       // Hide everything
viewer.applyVisibilityPreset('copper-only'); // Only copper + outline
viewer.applyVisibilityPreset('minimal');   // Copper + outline + markers
```

### Reactive Updates

The visibility system supports reactive updates through subscriptions:

```typescript
// Subscribe to visibility changes
const unsubscribe = viewer.onVisibilityChange((state) => {
  console.log('Visibility changed:', state);
  // Update UI controls, save state, etc.
});

// Later, when done
unsubscribe();
```

### Integration with Render Pipeline

All render passes receive the current visibility state and can make rendering decisions based on it:

```typescript
// Gerber layers check their specific visibility
enabled: (rc) => rc.visibility.gerber.copper,

// Markers check global marker visibility  
enabled: (rc) => rc.visibility.markers,

// Overlays filter by their individual visibility
const visibleOverlays = overlays.filter(overlay => 
  rc.visibility.overlays[overlay.id] ?? overlay.visible
);
```

### Advanced Usage

```typescript
// Custom visibility management
class CustomUI {
  constructor(viewer) {
    this.viewer = viewer;
    this.setupControls();
  }

  setupControls() {
    // Create custom visibility controls
    this.createLayerToggles();
    this.setupPresets();
    this.setupReactiveUI();
  }

  createLayerToggles() {
    const layers = ['copper', 'solderMask', 'silk', 'outline'];
    
    layers.forEach(layer => {
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = this.viewer.getVisibility().gerber[layer];
      
      toggle.addEventListener('change', () => {
        this.viewer.setGerberVisibility(layer, toggle.checked);
      });
      
      document.body.appendChild(toggle);
    });
  }

  setupPresets() {
    const presetSelect = document.createElement('select');
    
    const presets = [
      { value: 'all', label: 'All Layers' },
      { value: 'none', label: 'None' },
      { value: 'copper-only', label: 'Copper Only' },
      { value: 'minimal', label: 'Minimal' }
    ];
    
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.value;
      option.textContent = preset.label;
      presetSelect.appendChild(option);
    });
    
    presetSelect.addEventListener('change', () => {
      this.viewer.applyVisibilityPreset(presetSelect.value);
    });
    
    document.body.appendChild(presetSelect);
  }

  setupReactiveUI() {
    // Update UI when visibility changes
    this.viewer.onVisibilityChange((state) => {
      // Update checkbox states
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const layer = checkbox.dataset.layer;
        if (layer && state.gerber[layer]) {
          checkbox.checked = true;
        }
      });
      
      // Update status display
      const visibleCount = Object.values(state.gerber).filter(Boolean).length;
      console.log(`Visible layers: ${visibleCount}/4`);
    });
  }
}

// Usage
const customUI = new CustomUI(viewer);
```

### Performance Features

- **Centralized State**: Single source of truth prevents inconsistencies
- **Efficient Updates**: Only re-renders when visibility actually changes
- **Subscription System**: Reactive updates without polling
- **Type Safety**: Full TypeScript support prevents runtime errors
- **Batch Operations**: Presets and bulk updates minimize renders

### Integration Examples

```typescript
// DFM tool with custom visibility controls
class DFMTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.setupDFMPresets();
  }

  setupDFMPresets() {
    // Custom DFM-specific presets
    this.addPreset('dfm-errors', {
      gerber: { copper: true, solderMask: false, silk: false, outline: true },
      markers: true,
      overlays: { 'dfm-highlights': true }
    });

    this.addPreset('manufacturing', {
      gerber: { copper: true, solderMask: true, silk: true, outline: true },
      markers: false,
      overlays: { 'dimensions': true, 'tolerances': true }
    });
  }

  addPreset(name, config) {
    // Add custom preset button
    const button = document.createElement('button');
    button.textContent = name;
    button.addEventListener('click', () => {
      this.viewer.setVisibility(config);
    });
    document.body.appendChild(button);
  }
}
```

**Key Features:**
- **Centralized Management**: Single visibility state prevents inconsistencies
- **Reactive Updates**: Automatic re-renders on state changes
- **Type Safe**: Full TypeScript support throughout
- **Performance Optimized**: Efficient subscription-based updates
- **Extensible**: Easy to add custom controls and presets

### Render Pipeline

```typescript
import { createIntegratedViewer } from "gerbers-renderer";

const viewer = createIntegratedViewer(container);
viewer.setData({ boardGeom, layers });

// Add custom render passes
viewer.viewer.addPass({
  id: "custom-overlay",
  order: 150,
  enabled: () => true,
  draw: (rc) => {
    // Draw in board coordinates
    const m = rc.xform.getWorldToScreenMatrix();
    rc.ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
    // ... your drawing code
  }
});
```

**Render Stages:**
- **Base Gerber** (0-99): Copper traces, masks, silk screen
- **Overlays** (100-199): Grid, rulers, custom drawings  
- **Markers** (200-299): Test points, components, annotations
- **Selection** (300-399): Highlighted regions and elements

**Key Features:**
- Deterministic rendering order
- Efficient render scheduling with requestAnimationFrame
- Centralized visibility management
- Extensible render pass system

**Visibility Control:**
```typescript
// Use presets
viewer.visibility.applyPreset('copper-only');

// Individual control
viewer.visibility.setGerberVisibility('copper', false);
viewer.visibility.setOverlayVisibility('grid', true);
viewer.visibility.setMarkersVisibility(true);
```

**File Organization:**
- `src/render-pipeline/core/`: Core components (transforms, contracts, scheduling)
- `src/render-pipeline/`: Complete render pipeline implementation
- `src/render-pipeline/overlayRegistry.ts`: Overlay management system
- `src/render-pipeline/exampleOverlays.ts`: Built-in overlay examples
- `src/viewer/`: Shared types and styles
- `src/index.ts`: Unified exports

See [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) for detailed organization.

## License

MIT

## Why this exists

Most Gerber viewers:

- require servers
- are untyped
- break in browsers
- silently mis-detect archives

gerbers-renderer is designed from first principles for modern web tooling.