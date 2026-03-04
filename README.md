# gerbers-renderer

Pure frontend Gerber rendering for the web.
Render PCB Gerber bundles (`.zip`, `.rar`) directly in the browser with zero backend, zero native dependencies.

Designed for web apps, browser extensions, CI previews, manufacturing portals, and DFM tools.

## Features

**Rendering**
- Arc / curve rendering (G02/G03 with I/J offsets, full circles, CW/CCW)
- Pad rotation (`%LR` load-rotation and per-aperture rotation)
- Real board outline clipping — non-rectangular boards are clipped to their actual shape
- Soldermask layers (top and bottom, polarity-correct)
- Drill holes with copper annular ring visualization
- Slot holes (Excellon routing mode M15/M16/G01 and G85 oblong syntax)
- Inner copper layers (>2 layers, KiCad and Altium naming)
- Silkscreen layers

**File format support**
- RS-274X (Gerber) parser with polarity (LPD/LPC), regions, aperture macros
- Excellon drill parser: M48 header, METRIC/INCH, format strings, integer-encoded coords, routing mode
- Multi-file drill exports (e.g. Altium `PCB-RoundHoles.TXT` + `PCB-SlotHoles.TXT`)
- Layer auto-detection for KiCad, Altium, Eagle, generic exports

**Viewer**
- Canvas-based render pipeline with hardware acceleration
- Smooth pan / zoom with mouse-centered zoom
- Top / bottom side switching
- Per-layer visibility dropdown (on by default, toggleable)
- Grid overlay with mm / in units
- Marker system for DFM annotations (error / warning / info)
- Overlay system for custom visualizations
- Configurable download button

**Library**
- Drop-in — mounts into any DOM node
- Zero backend, zero workers (unless loading `.rar`)
- Typed, deterministic render results
- Vite, React, vanilla JS friendly

## Installation

```bash
npm install gerbers-renderer
```

## Quick start

```typescript
import { createIntegratedViewer, renderGerbers } from "gerbers-renderer";

const viewer = createIntegratedViewer(document.getElementById("pcb")!);

const file = input.files[0];
const buffer = await file.arrayBuffer();

const result = await renderGerbers(buffer, {
  archiveWorkerUrl: "/libarchive-worker-bundle.js", // required for .rar only
});

viewer.setData({
  boardGeom: result.boardGeom,
  layers: result.layers,
});
viewer.fit();

// Don't forget to revoke blob URLs when replacing a render
// result.revoke();
```

### DFM markers

```typescript
viewer.addMarkers([
  { id: "via-too-close", x_mm: 12.5, y_mm: 8.3, severity: "error",   data: { issue: "Via too close to trace" } },
  { id: "thin-trace",   x_mm: 25.0, y_mm: 4.1, severity: "warning", data: { issue: "Trace width < 0.1mm" } },
]);

viewer.removeMarker("via-too-close");
```

## Rendering APIs

### `renderGerbers(...)` — recommended

Single high-level entrypoint. Handles archive detection, unpacking, validation, and rendering.

```typescript
renderGerbers(
  input: ArrayBuffer | Uint8Array,
  options?: {
    archiveWorkerUrl?: string; // required for .rar
  }
): Promise<RenderResult>
```

### `renderGerbersZip(...)`

ZIP-only convenience wrapper.

```typescript
renderGerbersZip(input: File | Blob | ArrayBuffer | Uint8Array): Promise<RenderResult>
```

### `renderGerbersFiles(...)`

Lowest-level API — supply files directly.

```typescript
renderGerbersFiles(files: Record<string, Uint8Array>): Promise<RenderResult>
```

### Return value

```typescript
type RenderResult = {
  boardGeom: BoardGeom;
  layers: ViewerLayers;
  revoke: () => void; // revoke blob URLs when done
};
```

## Viewer API

```typescript
const viewer = createIntegratedViewer(container, {
  onDownload?: () => void;        // called when Download is clicked
  showDownloadButton?: boolean;   // default true
});

viewer.setData({ boardGeom, layers });
viewer.setSideMode("top" | "bottom");
viewer.fit();
viewer.dispose();

// Access underlying render pipeline
viewer.viewer.setCamera({ center_mm: { x: 50, y: 25 }, zoom: 10 });
viewer.viewer.addPass({ id, order, enabled, draw });

// Markers
viewer.addMarker({ id, x_mm, y_mm, severity?, layer?, data? });
viewer.addMarkers([...]);
viewer.removeMarker(id);

// Visibility
viewer.visibility.setOverlayVisibility("grid", true);
viewer.visibility.setMarkersVisibility(false);
```

## Bundle detection

```typescript
import { detectGerberBundle } from "gerbers-renderer";

const result = await detectGerberBundle(buffer);
if (!result.isGerber) console.log("Not a Gerber bundle:", result.reasons);

// result: { isGerber, archiveType, confidence, reasons, files? }
```

## Supported input formats

| Format | Supported | Notes |
|---|:---:|---|
| `.zip` | ✅ | Native via JSZip |
| `.rar` | ✅ | Via libarchive.js (WASM worker) |
| `.7z` | ❌ | Detection works, unpacking future |
| `.tar` | ❌ | Detection works, unpacking future |
| Directory | ✅ | Use `renderGerbersFiles` |

## `.rar` support

Copy the libarchive worker to your public directory:

```text
node_modules/libarchive.js/dist/worker-bundle.js
  → public/libarchive-worker-bundle.js
```

Then pass the URL:

```typescript
renderGerbers(buffer, { archiveWorkerUrl: "/libarchive-worker-bundle.js" });
```

ZIP users do not pay this cost.

## Error handling

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

Always inspect `error.code` in UI or CI.

## Local development

```bash
git clone https://github.com/asappcb/gerbers-renderer
npm install
npm run dev      # http://localhost:5173/demo/
npm test         # vitest
npm run build    # library bundle → dist/
```

## Roadmap

- 7z / tar unpacking
- WASM-only core split
- Headless CI validation mode

## What this is not

- ❌ Not a CAM tool
- ❌ Not a DRC / DFM engine
- ❌ Not a backend renderer

This library is intentionally focused on fast, accurate browser-side visualization.

## License

MIT
