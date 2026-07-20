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
- First-class multilayer stackup (arbitrary copper count; KiCad/Altium/generic naming), only-current-side view with reveal-on-demand inner layers
- Solder paste / stencil layers

**File format support**
- RS-274X (Gerber) parser with polarity (LPD/LPC), regions, aperture macros
- Excellon drill parser: M48 header, METRIC/INCH, format strings, integer-encoded coords, routing mode
- Multi-file drill exports (e.g. Altium `PCB-RoundHoles.TXT` + `PCB-SlotHoles.TXT`)
- Layer auto-detection for KiCad, Altium, Eagle, generic exports

**Viewer**
- Single-canvas 2D render pipeline (layers composited via `drawImage`) with a crisp vector-copper overlay when zoomed in
- Optional **3D board view** (extruded FR4 + textured copper; requires `three` as an optional peer dep)
- Smooth pan / zoom with mouse-centered zoom, top / bottom side switching
- Per-layer visibility dropdown; **board-finish themes** (green/blue/red/black/white/purple)
- Grid overlay with mm / in units; cursor coordinate readout
- **Feature inspect** (hover pads/traces/holes), **measurement tool** (snap-to-feature), **connectivity net-highlight** (click a trace → light up its net)
- **Board stats** panel (size, layer count, pads, holes, drill sizes, min trace)
- Marker system (spatial-indexed, with hover/select events) + overlay system for custom visualizations
- Image / SVG export, revision diff overlay, shareable deep-links, configurable download button

**Headless / CI**
- DOM-free render to a self-contained SVG (`renderGerbersToSvg`)
- Render to PNG via a pluggable rasterizer (`renderGerbersToImage`), **thumbnails** (`renderGerbersThumbnail`)
- Off-main-thread rendering (`renderGerbersInWorker`)
- Revision diff (`diffGerbers`) + per-layer geometry diff (`diffGeometry`)
- **`gerbers-render` CLI** (SVG dependency-free; PNG via optional `@resvg/resvg-js`)

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

// Export
viewer.exportPng("board");   // "view" | "board"
viewer.exportSvg();

// Shareable view state
const url = await viewer.copyShareLink();   // also writes #gv=… to the URL
const state = viewer.getViewState();
viewer.setViewState(state);
```

`createBoardViewer` is a backward-compatible alias for `createIntegratedViewer`.

## Multilayer stackup

`renderGerbers*` return a first-class ordered `stackup` alongside the legacy flat `layers`:

```typescript
const { boardGeom, layers, stackup } = await renderGerbers(buffer);
// stackup.copper: ordered top→bottom CopperLayer[] (role, name, url, color)
// stackup.top / stackup.bottom: { mask?, silk?, paste? }
viewer.setData({ boardGeom, layers, stackup });
```

Inner copper is detected across KiCad (`In1_Cu`…), Altium (`.g2`…), and generic
naming, ordered numerically. The viewer shows only the current side by default;
inner/opposite layers are revealed on demand from the layer menu.

## Headless / CI render

DOM-free — runs in Node, workers, or CI. Accepts a zip/rar/single-file buffer or a files map.

```typescript
import { renderGerbersToSvg, renderGerbersToImage } from "gerbers-renderer";

// Self-contained SVG (no DOM, no external refs)
const svg = await renderGerbersToSvg(buffer, { side: "top" });

// PNG bytes — browser canvas by default; pass a rasterizer (e.g. resvg-js) in Node
const png = await renderGerbersToImage(buffer, { side: "top", scale: 2, rasterizer });
```

## Revision diff

```typescript
import { diffGerbers } from "gerbers-renderer";

const diff = await diffGerbers(revA, revB);
// diff.summary: { boardSizeChanged, addedArea_mm2, removedArea_mm2 }
// diff.top / diff.bottom: { url, addedArea_mm2, removedArea_mm2, … }  (green added / red removed)

viewer.showDiff(diff);   // overlay on the board
viewer.hideDiff();
diff.revoke();           // release diff image URLs when done
```

## Bundle detection

```typescript
import { detectGerberBundle } from "gerbers-renderer";

const result = await detectGerberBundle(buffer);
if (!result.isGerber) console.log("Not a Gerber bundle:", result.reasons);

// result: { isGerber, archiveType, confidence, reasons, files? }
```

## Inspection, themes & 3D

```typescript
viewer.setBoardTheme("blue");          // green | blue | red | black | white | purple
viewer.getStats();                     // { widthMm, holeCount, drillSizesMm, minTraceWidthMm, … }
viewer.pickFeatureAt(clientX, clientY);// nearest pad/trace/hole under the cursor
await viewer.toggle3D();               // 3D board view (needs `three` installed)

// Marker interaction
viewer.on("select:marker", ({ markerId }) => { /* … */ });
viewer.on("click:board", ({ x_mm, y_mm }) => { /* … */ });
```

The parsed geometry is also returned from the render for your own tooling:

```typescript
const { geometry } = await renderGerbers(buffer);
// geometry.features: pads / traces / holes (world coords) · geometry.stats
```

## Off-thread render, thumbnails & CLI

```typescript
import { renderGerbersInWorker, renderGerbersThumbnail } from "gerbers-renderer";

const result = await renderGerbersInWorker(buffer);          // parse off the main thread
const thumb = await renderGerbersThumbnail(buffer, { maxSize: 256 }); // PNG data URI
```

```bash
# CLI — SVG is dependency-free; PNG needs `npm i @resvg/resvg-js`
npx gerbers-render board.zip --side top --out top.svg
npx gerbers-render board.zip --side bottom --format png --scale 2 -o bottom.png
```

## Geometry diff

```typescript
import { diffGeometry } from "gerbers-renderer";

const a = (await renderGerbers(revA)).geometry;
const b = (await renderGerbers(revB)).geometry;
const d = diffGeometry(a, b);
// d.summary: { addedCount, removedCount, unchangedCount }
// d.perLayer["cu.top"]: { added: [...], removed: [...], unchanged }
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
- Aperture macros (`%AM`) and step-and-repeat (`%SR`)
- X2/X3 attribute-driven layer classification

## What this is not

- ❌ Not a CAM tool
- ❌ Not a DRC / DFM engine
- ❌ Not a backend renderer

This library is intentionally focused on fast, accurate browser-side visualization.

## License

MIT
