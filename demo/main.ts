// demo/main.ts
import { renderGerbersZip } from "../src";

let currentViewer: any = null;


const inputEl = document.getElementById("file-input") as HTMLInputElement;
const canvas = document.getElementById("pcb-canvas") as HTMLCanvasElement;
const statusEl = document.getElementById("status") as HTMLSpanElement;

// let currentViewer: RenderResult["viewer"] | null = null;

inputEl.addEventListener("change", async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (currentViewer) {
    currentViewer.dispose();
    currentViewer = null;
  }

  statusEl.textContent = "Loading gerbers.zip...";

  try {
    const { geometry, viewer } = await renderGerbersZip(file, {
      canvas,
      boardThicknessMm: 1.6,
    });

    currentViewer = viewer || null;

    statusEl.textContent = `Loaded board: ${geometry.widthMm.toFixed(
      1
    )} x ${geometry.heightMm.toFixed(1)} mm, drills: ${
      geometry.drills.length
    }`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error loading gerbers.zip (see console)";
  }
});
