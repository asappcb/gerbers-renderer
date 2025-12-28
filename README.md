# gerbers-renderer

Frontend-only Gerber viewer for the web.
Render PCB Gerbers directly in the browser. No backend. No CAM tools. No DFM.

👉 Upload a gerbers.zip  
👉 View Top / Bottom copper, mask, silkscreen, drills  
👉 Pan, zoom, fit, grid  
👉 Download the original Gerbers ZIP

## ✨ Features

- Fully client-side (runs in the browser)
- Accepts standard gerbers.zip exports
- Automatic layer classification
- Correct board masking and clipping
- Top / Bottom view toggle
- Grid overlay (mm / inch)
- Designed to embed into any website
- No framework dependency (not React/Vue/etc.)

## 🚀 Installation

### Install from npm (recommended)
```bash
npm install gerbers-renderer
```

### 🌐 CDN Usage (No Build Tools)
```html
<script src="https://unpkg.com/gerbers-renderer"></script>
<script>
  const { createBoardViewer, renderGerbersZip } = window.GerbersRenderer;
</script>
```

Pin a version if needed:

```html
<script src="https://unpkg.com/gerbers-renderer@0.1.0"></script>
```

## 🧩 Minimal Usage Example

**HTML**
```html
<input type="file" id="file" accept=".zip" />
<div id="viewer" style="width:100%; height:600px;"></div>
```

**JavaScript / TypeScript**
```typescript
import { renderGerbersZip, createBoardViewer } from "gerbers-renderer";

const input = document.getElementById("file") as HTMLInputElement;
const host = document.getElementById("viewer")!;

const viewer = createBoardViewer(host, {
  onDownload: () => {
    if (!lastZip) return;
    const a = document.createElement("a");
    const url = URL.createObjectURL(lastZip);
    a.href = url;
    a.download = lastZip.name;
    a.click();
    URL.revokeObjectURL(url);
  }
});

let lastRender: any = null;
let lastZip: File | null = null;

input.addEventListener("change", async () => {
  const file = input.files?.[0];
  if (!file) return;

  lastZip = file;
  if (lastRender) lastRender.revoke();

  const out = await renderGerbersZip(file);
  lastRender = out;

  viewer.setData({
    boardGeom: out.boardGeom,
    layers: out.layers
  });
});
```

That's it. No server. No workers. No build assumptions.

## 🧠 Core API

### `renderGerbersZip(file: File)`

Parses and renders a Gerbers ZIP entirely in the browser.

**Returns:**
```typescript
{
  boardGeom: {
    widthMm: number;
    heightMm: number;
  },
  layers: {
    top_copper?: string;
    bottom_copper?: string;
    top_silk?: string;
    bottom_silk?: string;
    top_mask?: string;
    bottom_mask?: string;
    drills?: string;
    top_board_mask?: string;
    bottom_board_mask?: string;
  },
  revoke: () => void
}
```

Layer values are blob URLs containing SVGs.

Call `revoke()` when replacing or discarding a render.

### `createBoardViewer(host, options?)`

Mounts an interactive PCB viewer into a DOM element.

```typescript
createBoardViewer(host, {
  onDownload?: () => void
});
```

The viewer handles:
- pan / zoom / fit
- Top / Bottom switching
- layer visibility
- board clipping mask

The viewer is intentionally stateless with respect to parsing.

## 📦 Download Behavior

The viewer does not decide what "Download" means.

Instead, you supply a handler via `onDownload`.

Typical use:
- download the original gerbers.zip
- export SVG layers
- export screenshots
- pipe into manufacturing workflows

This keeps the viewer reusable across products.

## 🧭 Design Philosophy

- Viewer ≠ parser ≠ renderer
- Frontend-only by design
- No assumptions about backend or manufacturing
- Safe to embed anywhere
- Easy to extend

This project is intentionally not a CAM tool or DFM checker.

## ❌ What This Is Not

- Not a DFM rules engine
- Not a fabrication quote system
- Not a replacement for CAM software

It's a fast, embeddable Gerber viewer.

## 📄 License

MIT

Use it freely in commercial or open-source projects.