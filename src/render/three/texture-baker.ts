// src/render/three/texture-baker.ts
import * as THREE from "three";
import type { PcbModelGeometry, Polygon } from "../../types/pcb-model";

export interface SideTextureSet {
  color: THREE.CanvasTexture;
  normal: THREE.CanvasTexture;
  size: number;  // texture resolution
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function computeBoardBounds(geometry: PcbModelGeometry): Bounds {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  const pushPoly = (poly: Polygon) => {
    if (!poly.outer) return;
    for (const p of poly.outer) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  };

  if (geometry.outline?.polygons?.length) {
    for (const poly of geometry.outline.polygons) pushPoly(poly);
  } else {
    // fall back to copper if outline missing
    for (const layer of geometry.copperLayers) {
      for (const poly of layer.polygons) pushPoly(poly);
    }
  }

  if (!isFinite(minX)) {
    // degenerate fallback
    minX = 0;
    minY = 0;
    maxX = 10;
    maxY = 10;
  }

  return { minX, maxX, minY, maxY };
}

// Map mm coords -> pixel coords (integer) with Y flipped so texture Y+ is up
function mmToPixel(
  xMm: number,
  yMm: number,
  bounds: Bounds,
  texSize: number
): { x: number; y: number } {
  const w = bounds.maxX - bounds.minX;
  const h = bounds.maxY - bounds.minY;
  const u = (xMm - bounds.minX) / w;
  const v = (yMm - bounds.minY) / h;
  const x = Math.round(u * (texSize - 1));
  const y = Math.round((1 - v) * (texSize - 1)); // flip Y
  return { x, y };
}

interface NormalOpts {
  strength?: number; // how "steep" bumps feel
}

function heightToNormalCanvas(
  heightCanvas: HTMLCanvasElement,
  opts: NormalOpts = {}
): HTMLCanvasElement {
  // Softer normals so shading does not spread too far
  const strength = opts.strength ?? 0.3;

  const w = heightCanvas.width;
  const h = heightCanvas.height;

  const srcCtx = heightCanvas.getContext("2d")!;
  const srcData = srcCtx.getImageData(0, 0, w, h);
  const src = srcData.data;

  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = w;
  normalCanvas.height = h;
  const normalCtx = normalCanvas.getContext("2d")!;
  const normalData = normalCtx.createImageData(w, h);
  const dst = normalData.data;

  const getHeight = (x: number, y: number): number => {
    x = Math.max(0, Math.min(w - 1, x));
    y = Math.max(0, Math.min(h - 1, y));
    const idx = (y * w + x) * 4;
    // grayscale, so any channel
    return src[idx] / 255.0;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const hL = getHeight(x - 1, y);
      const hR = getHeight(x + 1, y);
      const hD = getHeight(x, y - 1);
      const hU = getHeight(x, y + 1);

      const dx = (hR - hL) * strength;
      const dy = (hU - hD) * strength;

      // normal = normalize(-dx, -dy, 1)
      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * w + x) * 4;
      dst[idx]     = Math.round((nx * 0.5 + 0.5) * 255);
      dst[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      dst[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      dst[idx + 3] = 255;
    }
  }

  normalCtx.putImageData(normalData, 0, 0);
  return normalCanvas;
}

interface BakeOptions {
  texSize?: number; // default 1024
  side: "top" | "bottom";
}

// Heights encoded in 0-255, deliberately small to keep normals gentle
const HEIGHTS = {
  fr4: 2,    // base
  copper: 50
};

export function bakeSideTexturesFromGeometry(
  geometry: PcbModelGeometry,
  opts: BakeOptions
): SideTextureSet {
  const texSize = opts.texSize ?? 1024;
  const bounds = computeBoardBounds(geometry);

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = texSize;
  colorCanvas.height = texSize;
  const colorCtx = colorCanvas.getContext("2d")!;
  colorCtx.imageSmoothingEnabled = false;

  const heightCanvas = document.createElement("canvas");
  heightCanvas.width = texSize;
  heightCanvas.height = texSize;
  const heightCtx = heightCanvas.getContext("2d")!;
  heightCtx.imageSmoothingEnabled = false;

  // Base FR4: green
  colorCtx.fillStyle = "#00742bb0";
  colorCtx.fillRect(0, 0, texSize, texSize);

  // Base height = FR4 (0)
  heightCtx.fillStyle = `rgb(${HEIGHTS.fr4}, ${HEIGHTS.fr4}, ${HEIGHTS.fr4})`;
  heightCtx.fillRect(0, 0, texSize, texSize);

  const drawPolygon = (poly: Polygon, fillStyleColor: string, heightVal: number) => {
    if (!poly.outer || poly.outer.length < 3) return;

    // Color pass
    colorCtx.beginPath();
    let p0 = mmToPixel(poly.outer[0].x, poly.outer[0].y, bounds, texSize);
    colorCtx.moveTo(p0.x, p0.y);
    for (let i = 1; i < poly.outer.length; i++) {
      const p = mmToPixel(poly.outer[i].x, poly.outer[i].y, bounds, texSize);
      colorCtx.lineTo(p.x, p.y);
    }
    colorCtx.closePath();
    colorCtx.fillStyle = fillStyleColor;
    colorCtx.fill();

    // Height pass
    heightCtx.beginPath();
    p0 = mmToPixel(poly.outer[0].x, poly.outer[0].y, bounds, texSize);
    heightCtx.moveTo(p0.x, p0.y);
    for (let i = 1; i < poly.outer.length; i++) {
      const p = mmToPixel(poly.outer[i].x, poly.outer[i].y, bounds, texSize);
      heightCtx.lineTo(p.x, p.y);
    }
    heightCtx.closePath();
    const h = Math.max(0, Math.min(255, heightVal));
    heightCtx.fillStyle = `rgb(${h}, ${h}, ${h})`;
    heightCtx.fill();
  };

  const sideKey = opts.side === "top" ? "top" : "bottom";

  // Only copper contributes on top of FR4
  for (const layer of geometry.copperLayers) {
    if (layer.side !== sideKey) continue;
    const copperColor = "#c5a345ff";
    for (const poly of layer.polygons) {
      drawPolygon(poly, copperColor, HEIGHTS.copper);
    }
  }

  // Height -> normals
  const normalCanvas = heightToNormalCanvas(heightCanvas, { strength: 1.0 });

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.wrapS = colorTex.wrapT = THREE.ClampToEdgeWrapping;
  colorTex.needsUpdate = true;

  const normalTex = new THREE.CanvasTexture(normalCanvas);
  normalTex.wrapS = normalTex.wrapT = THREE.ClampToEdgeWrapping;
  normalTex.needsUpdate = true;

  return {
    color: colorTex,
    normal: normalTex,
    size: texSize,
  };
}
