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
- 🎨 2D SVG-based board viewer
- 🧩 Drop-in viewer that mounts into any DOM node
- 🧪 Typed, deterministic render results
- 🧼 No backend, no workers unless needed
- ⚡ Vite, React, vanilla JS friendly
- 🎯 Precise viewport transforms with camera controls
- 📐 Coordinate system: Board (mm) ↔ Screen (px) conversion

## Installation

```bash
npm install gerbers-renderer
```

## Quick start (minimal)

```typescript
import { renderGerbers, createBoardViewer } from "gerbers-renderer";

const viewer = createBoardViewer(document.getElementById("pcb")!);

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
```

Always call `result.revoke()` when replacing a render.

## Live demo

```bash
git clone https://github.com/asappcb/gerbers-renderer
npm install
npm run dev
```

Open:
👉 http://localhost:5173/demo/

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
const viewer = createBoardViewer(container, {
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

- Pan / zoom
- Layer toggling
- Top / bottom switching
- Download hook (original Gerbers)

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
  {
    center_mm: { x: 0, y: 0 },  // Camera center in board coordinates
    zoom: 10,                    // Pixels per mm
    rotation_rad: 0,             // Camera rotation
    mirrorX: false,              // Horizontal flip (for layers)
    mirrorY: false,              // Vertical flip (for layers)
  },
  { width_px: 800, height_px: 600 }
);

// Convert between coordinate systems
const screenPos = transform.boardToScreen({ x: 10, y: 5 });  // mm → px
const boardPos = transform.screenToBoard({ x: 400, y: 300 }); // px → mm
```

**Coordinate Conventions:**
- **Board space**: x right, y up (millimeters)
- **Screen space**: x right, y down (pixels, canvas default)
- **Screen origin**: top left
- **Zoom**: pixels per mm (larger = more zoomed in)

**Matrix Composition:**
```
M = T(screenCenter) * S(zoom*flipX, zoom*flipY) * R(rotation) * T(-center)
```

This enables:
- Precise pan/zoom/rotation controls
- Accurate mouse picking and hit testing
- Consistent layer mirroring (top/bottom)
- Canvas integration with `ctx.setTransform()`

## License

MIT

## Why this exists

Most Gerber viewers:

- require servers
- are untyped
- break in browsers
- silently mis-detect archives

gerbers-renderer is designed from first principles for modern web tooling.