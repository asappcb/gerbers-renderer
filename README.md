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
- 📍 Built-in marker and selection systems
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

// New features: markers, selections, custom overlays
viewer.addMarker({
  id: "test-point",
  position: { x: 10, y: 5 }, // mm coordinates
  type: "testpoint"
});

viewer.setSelection({
  type: "region",
  bounds: { min: { x: 0, y: 0 }, max: { x: 20, y: 10 } }
});
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