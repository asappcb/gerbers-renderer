import { createBoardViewer, renderGerbersZip } from "../src";

let viewer: ReturnType<typeof createBoardViewer> | null = null;
let lastRevoke: (() => void) | null = null;

const inputEl = document.getElementById("file-input") as HTMLInputElement | null;
const statusEl = document.getElementById("status") as HTMLSpanElement | null;
const host = document.getElementById("pcb-host") as HTMLDivElement | null;

if (!inputEl || !statusEl || !host) {
  throw new Error(
    "Demo page missing required elements (#file-input, #status, #pcb-host). Are you on /demo/index.html?"
  );
}

inputEl.addEventListener("change", async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // cleanup
  if (lastRevoke) lastRevoke();
  lastRevoke = null;

  if (!viewer) {
    viewer = createBoardViewer(host);
  }

  statusEl.textContent = "Loading gerbers.zip...";

  try {
    const out = await renderGerbersZip(file);
    lastRevoke = out.revoke;

    viewer.setData({ boardGeom: out.boardGeom, layers: out.layers });
    viewer.setSideMode("top");
    viewer.fit();

    statusEl.textContent = `Loaded (stub): ${(out.boardGeom.board.width_in * 25.4).toFixed(1)} x ${(out.boardGeom.board.height_in * 25.4).toFixed(1)} mm`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error loading gerbers.zip (see console)";
  }
});
