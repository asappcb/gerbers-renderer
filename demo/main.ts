// demo/main.ts
import {
  createIntegratedViewer,
  renderGerbers,
  detectGerberBundle,
  GerberError,
} from "../src";

let viewer: ReturnType<typeof createIntegratedViewer> | null = null;
let lastRevoke: (() => void) | null = null;
let lastFile: File | null = null;
let lastArchiveType: "zip" | "rar" | null = null;

// Make viewer globally accessible for debugging
(window as any).viewer = viewer;

const inputEl = document.getElementById("file-input") as HTMLInputElement | null;
const statusEl = document.getElementById("status") as HTMLSpanElement | null;
const host = document.getElementById("pcb-host") as HTMLDivElement | null;
const downloadToggle = document.getElementById("download-toggle") as HTMLInputElement | null;

function setStatus(msg: string) {
  if (statusEl) statusEl.textContent = msg;
}

function cleanupLastRender() {
  if (lastRevoke) {
    try {
      lastRevoke();
    } catch (e) {
      console.warn("revoke() failed", e);
    }
  }
  lastRevoke = null;
}

function ensureViewer() {
  if (viewer) return viewer;

  viewer = createIntegratedViewer(host!, {
    onDownload: () => {
      if (!lastFile) return;

      const a = document.createElement("a");
      const url = URL.createObjectURL(lastFile);

      a.href = url;
      a.download =
        lastFile.name ||
        (lastArchiveType === "rar" ? "gerbers.rar" : "gerbers.zip");
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    },
    showDownloadButton: downloadToggle?.checked ?? true,
  });

  // Update global reference
  (window as any).viewer = viewer;

  return viewer;
}

// Handle download toggle changes
downloadToggle?.addEventListener("change", () => {
  if (viewer) {
    viewer.dispose();
    viewer = null;
  }
});

if (!inputEl || !statusEl || !host) {
  throw new Error(
    "Demo page missing required elements (#file-input, #status, #pcb-host). Are you on /demo/index.html?"
  );
}

inputEl.addEventListener("change", async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  lastFile = file;
  lastArchiveType = null;

  // cleanup previous blobs
  cleanupLastRender();

  const v = ensureViewer();
  if (!v) return;
    
  setStatus("Reading file...");

  try {
    // Optional: run detection first for better UX and early exit.
    const ab = await file.arrayBuffer();
    const det = await detectGerberBundle(ab);

    if (!det.isGerber) {
      setStatus(`Not a Gerber bundle (confidence ${(det.confidence * 100).toFixed(0)}%).`);
      console.warn("detectGerberBundle:", det);
      return;
    }

    if (det.archiveType !== "zip" && det.archiveType !== "rar") {
      setStatus(`Detected ${det.archiveType}, but demo currently supports zip and rar.`);
      console.warn("detectGerberBundle:", det);
      return;
    }

    lastArchiveType = det.archiveType;

    setStatus(`Rendering ${det.archiveType} layers...`);

    // Use the unified renderGerbers function which supports both ZIP and RAR
    const out = await renderGerbers(
      ab,
      det.archiveType === "rar"
        ? { archiveWorkerUrl: "/libarchive-worker-bundle.js" }
        : undefined
    );
    lastRevoke = out.revoke;

    v.setData({ boardGeom: out.boardGeom, layers: out.layers });
    v.setSideMode("top");
    v.fit();

    const wmm = out.boardGeom.board.width_in * 25.4;
    const hmm = out.boardGeom.board.height_in * 25.4;
    setStatus(`Loaded ${det.archiveType}: ${wmm.toFixed(1)} x ${hmm.toFixed(1)} mm (with new render pipeline)`);
  } catch (err) {
    console.error(err);

    // Nice user-facing message if it's our typed error
    if (err instanceof GerberError) {
      setStatus(`${err.code}: ${err.message}`);
      return;
    }

    // Some environments may not preserve instanceof across bundles
    const maybe = err as any;
    if (maybe && typeof maybe === "object" && "code" in maybe && "message" in maybe) {
      setStatus(`${String(maybe.code)}: ${String(maybe.message)}`);
      return;
    }

    setStatus("Error loading gerber file (see console)");
  }
});
