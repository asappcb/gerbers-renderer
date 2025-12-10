// src/render/three/scene-builder.ts
import * as THREE from "three";
import * as polygonClipping from "polygon-clipping";
import type {
  PcbModelGeometry,
  LayerGeometry,
  Polygon,
  DrillHole,
} from "../../types/pcb-model";
import {
  createFr4Material,
  createCopperMaterial,
  createSoldermaskMaterial,
  createSilkscreenMaterial,
} from "./materials";

// Geometry types we control (match polygon-clipping runtime layout)
type PcPoint = [number, number];
type PcRing = PcPoint[];
type PcPolygon = PcRing[];
type PcMultiPolygon = PcPolygon[];

const zEps = 1e-4;

function resolveUnionFn(mod: any): (...args: any[]) => PcMultiPolygon {
  if (!mod) {
    throw new Error("polygon-clipping module is not available");
  }
  if (typeof mod.union === "function") {
    return mod.union as (...args: any[]) => PcMultiPolygon;
  }
  if (mod.default && typeof mod.default.union === "function") {
    return mod.default.union as (...args: any[]) => PcMultiPolygon;
  }
  throw new Error("Could not resolve polygon-clipping union function");
}

const union = resolveUnionFn(polygonClipping);

export interface SceneBuildOptions {
  usePbrMaterials?: boolean;

  fr4TexScaleMm?: number;
  fr4ColorMap?: string;
  fr4NormalMap?: string;

  useBakedLayers?: boolean;
  bakedTextureSize?: number;
}

export interface SceneBuildResult {
  group: THREE.Group;
  layerMeshes: Map<string, THREE.Mesh>;
}

// --------------------------
// Geometry helpers
// --------------------------

function mmToUnits(mm: number): number {
  // 1 mm -> 0.1 world units
  return mm * 0.1;
}

function polyToShape(poly: Polygon): THREE.Shape {
  const shape = new THREE.Shape();
  if (!poly.outer || poly.outer.length === 0) {
    return shape;
  }

  const [first, ...rest] = poly.outer;
  shape.moveTo(mmToUnits(first.x), mmToUnits(first.y));
  for (const pt of rest) {
    shape.lineTo(mmToUnits(pt.x), mmToUnits(pt.y));
  }
  shape.closePath();

  if (poly.holes) {
    for (const hole of poly.holes) {
      if (!hole || hole.length === 0) continue;
      const path = new THREE.Path();
      const [hFirst, ...hRest] = hole;
      path.moveTo(mmToUnits(hFirst.x), mmToUnits(hFirst.y));
      for (const pt of hRest) {
        path.lineTo(mmToUnits(pt.x), mmToUnits(pt.y));
      }
      path.closePath();
      shape.holes.push(path);
    }
  }

  return shape;
}

function extrudeLayerPolygons(
  layer: LayerGeometry,
  _geometry: PcbModelGeometry,
  _mmToUnitsFactor: number,
  offsetZ: number,
  thickness: number
): THREE.BufferGeometry {
  const shapes: THREE.Shape[] = [];
  for (const poly of layer.polygons) {
    shapes.push(polyToShape(poly));
  }

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: false,
  };

  const geom = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
  geom.translate(0, 0, offsetZ);
  return geom;
}

function createDrillHolesGeometry(
  drills: DrillHole[],
  thicknessUnits: number
): THREE.BufferGeometry {
  const geom = new THREE.CylinderGeometry(
    1,
    1,
    thicknessUnits + 2 * zEps,
    16,
    1,
    true
  );
  const merged = new THREE.BufferGeometry();

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  let vertexOffset = 0;

  for (const drill of drills) {
    const radiusUnits = mmToUnits(drill.diameter) / 2;
    const tmpGeom = geom.clone();
    tmpGeom.scale(radiusUnits, 1, radiusUnits);
    tmpGeom.rotateX(Math.PI / 2);
    tmpGeom.translate(mmToUnits(drill.x), mmToUnits(drill.y), 0);

    const posAttr = tmpGeom.getAttribute("position") as THREE.BufferAttribute;
    const normAttr = tmpGeom.getAttribute("normal") as THREE.BufferAttribute;
    const idxAttr = tmpGeom.getIndex();

    for (let i = 0; i < posAttr.count; i++) {
      positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
    }

    if (idxAttr) {
      for (let i = 0; i < idxAttr.count; i++) {
        indices.push(vertexOffset + idxAttr.getX(i));
      }
    } else {
      for (let i = 0; i < posAttr.count; i++) {
        indices.push(vertexOffset + i);
      }
    }

    vertexOffset += posAttr.count;
  }

  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  merged.setIndex(indices);

  return merged;
}

// --------------------------
// Baked texture helpers
// --------------------------

interface BakeSideOptions {
  side: "top" | "bottom";
  texSize?: number;
  fr4ColorMap?: string;
  fr4NormalMap?: string;
}

interface SideTextureSet {
  color: THREE.CanvasTexture;
  normal: THREE.CanvasTexture;
  metal: THREE.CanvasTexture;
  rough: THREE.CanvasTexture;
  size: number;
}

const FR4_COLOR_DEFAULT = "/textures/fr4_color.png";
const FR4_NORMAL_DEFAULT = "/textures/fr4_normal.png";

const fr4ColorImage = new Image();
fr4ColorImage.src = FR4_COLOR_DEFAULT;

const fr4NormalImage = new Image();
fr4NormalImage.src = FR4_NORMAL_DEFAULT;

interface BoardBoundsMm {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function computeBoardBoundsMm(geometry: PcbModelGeometry): BoardBoundsMm {
  if (geometry.outline && geometry.outline.polygons.length > 0) {
    const poly = geometry.outline.polygons[0];
    if (poly.outer && poly.outer.length > 0) {
      let minX = poly.outer[0].x;
      let maxX = poly.outer[0].x;
      let minY = poly.outer[0].y;
      let maxY = poly.outer[0].y;

      for (const pt of poly.outer) {
        minX = Math.min(minX, pt.x);
        maxX = Math.max(maxX, pt.x);
        minY = Math.min(minY, pt.y);
        maxY = Math.max(maxY, pt.y);
      }

      return { minX, maxX, minY, maxY };
    }
  }

  return {
    minX: 0,
    maxX: geometry.widthMm,
    minY: 0,
    maxY: geometry.heightMm,
  };
}

function heightToNormalCanvas(
  heightCanvas: HTMLCanvasElement,
  strength: number
): HTMLCanvasElement {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const srcCtx = heightCanvas.getContext("2d");
  if (!srcCtx) {
    throw new Error("2D context not available for PCB normal height sampling");
  }
  const src = srcCtx.getImageData(0, 0, w, h);
  const srcData = src.data;

  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = w;
  normalCanvas.height = h;
  const normalCtx = normalCanvas.getContext("2d");
  if (!normalCtx) {
    throw new Error("2D context not available for PCB normal baking");
  }
  const normalData = normalCtx.createImageData(w, h);
  const dstData = normalData.data;

  const getHeight = (x: number, y: number): number => {
    if (x < 0) x = 0;
    if (x >= w) x = w - 1;
    if (y < 0) y = 0;
    if (y >= h) y = h - 1;
    const idx = (y * w + x) * 4;
    return srcData[idx] / 255.0;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const hL = getHeight(x - 1, y);
      const hR = getHeight(x + 1, y);
      const hD = getHeight(x, y + 1);
      const hU = getHeight(x, y - 1);

      const dx = (hR - hL) * strength;
      const dy = (hD - hU) * strength;

      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * w + x) * 4;
      dstData[idx + 0] = Math.round((nx * 0.5 + 0.5) * 255);
      dstData[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      dstData[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      dstData[idx + 3] = 255;
    }
  }

  normalCtx.putImageData(normalData, 0, 0);
  return normalCanvas;
}

function bakeSideTexturesFromGeometry(
  geometry: PcbModelGeometry,
  bounds: BoardBoundsMm,
  opts: BakeSideOptions
): SideTextureSet {
  const texSize = opts.texSize ?? 1024;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = texSize;
  colorCanvas.height = texSize;
  const colorCtx = colorCanvas.getContext("2d");
  if (!colorCtx) {
    throw new Error("2D context not available for PCB texture baking");
  }
  colorCtx.imageSmoothingEnabled = false;

  const metalCanvas = document.createElement("canvas");
  metalCanvas.width = texSize;
  metalCanvas.height = texSize;
  const metalCtx = metalCanvas.getContext("2d");
  if (!metalCtx) {
    throw new Error("2D context not available for PCB metalness baking");
  }
  metalCtx.imageSmoothingEnabled = false;

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = texSize;
  roughCanvas.height = texSize;
  const roughCtx = roughCanvas.getContext("2d");
  if (!roughCtx) {
    throw new Error("2D context not available for PCB roughness baking");
  }
  roughCtx.imageSmoothingEnabled = false;

  const heightCanvas = document.createElement("canvas");
  heightCanvas.width = texSize;
  heightCanvas.height = texSize;
  const heightCtx = heightCanvas.getContext("2d");
  if (!heightCtx) {
    throw new Error("2D context not available for PCB height baking");
  }
  heightCtx.imageSmoothingEnabled = false;

  // Base FR4 height at 0
  heightCtx.fillStyle = "rgba(0,0,0,255)";
  heightCtx.fillRect(0, 0, texSize, texSize);

  // Base FR4 color: tile FR4 texture if available
  {
    const img = fr4ColorImage;
    if (img.complete && img.naturalWidth > 0) {
      const pattern = colorCtx.createPattern(img, "repeat");
      if (pattern) {
        colorCtx.fillStyle = pattern;
        colorCtx.fillRect(0, 0, texSize, texSize);
      } else {
        colorCtx.fillStyle = "#00742bb0";
        colorCtx.fillRect(0, 0, texSize, texSize);
      }
    } else {
      colorCtx.fillStyle = "#00742bb0";
      colorCtx.fillRect(0, 0, texSize, texSize);
    }
  }

  // Base metalness: FR4 non metal
  metalCtx.fillStyle = "rgb(0,0,0)";
  metalCtx.fillRect(0, 0, texSize, texSize);

  // Base roughness: FR4 rough
  const fr4RoughByte = Math.round(0.8 * 255);
  roughCtx.fillStyle = `rgb(${fr4RoughByte}, ${fr4RoughByte}, ${fr4RoughByte})`;
  roughCtx.fillRect(0, 0, texSize, texSize);

  const sideKey = opts.side;

  const boardWidthMm = bounds.maxX - bounds.minX || 1;
  const boardHeightMm = bounds.maxY - bounds.minY || 1;
  const pxPerMmX = texSize / boardWidthMm;
  const pxPerMmY = texSize / boardHeightMm;
  const pxPerMmAvg = 0.5 * (pxPerMmX + pxPerMmY);

  const mmToPixel = (xMm: number, yMm: number): { x: number; y: number } => {
    const u = (xMm - bounds.minX) / boardWidthMm;
    const v = (yMm - bounds.minY) / boardHeightMm;
    const x = Math.round(u * (texSize - 1));
    const y = Math.round((1 - v) * (texSize - 1));
    return { x, y };
  };

  const drawPolygon = (
    poly: Polygon,
    color: string | null,
    metalLevel: number | null,
    roughLevel: number | null,
    heightLevel: number | null
  ) => {
    if (!poly.outer || poly.outer.length < 3) return;

    // Color overlay
    if (color !== null) {
      colorCtx.beginPath();
      const first = mmToPixel(poly.outer[0].x, poly.outer[0].y);
      colorCtx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.outer.length; i++) {
        const p = mmToPixel(poly.outer[i].x, poly.outer[i].y);
        colorCtx.lineTo(p.x, p.y);
      }
      colorCtx.closePath();
      colorCtx.fillStyle = color;
      colorCtx.fill();
    }

    // Metalness
    if (metalLevel !== null) {
      const mByte = Math.max(0, Math.min(255, Math.round(metalLevel * 255)));
      metalCtx.beginPath();
      const first = mmToPixel(poly.outer[0].x, poly.outer[0].y);
      metalCtx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.outer.length; i++) {
        const p = mmToPixel(poly.outer[i].x, poly.outer[i].y);
        metalCtx.lineTo(p.x, p.y);
      }
      metalCtx.closePath();
      metalCtx.fillStyle = `rgb(${mByte}, ${mByte}, ${mByte})`;
      metalCtx.fill();
    }

    // Roughness
    if (roughLevel !== null) {
      const rByte = Math.max(0, Math.min(255, Math.round(roughLevel * 255)));
      roughCtx.beginPath();
      const first = mmToPixel(poly.outer[0].x, poly.outer[0].y);
      roughCtx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.outer.length; i++) {
        const p = mmToPixel(poly.outer[i].x, poly.outer[i].y);
        roughCtx.lineTo(p.x, p.y);
      }
      roughCtx.closePath();
      roughCtx.fillStyle = `rgb(${rByte}, ${rByte}, ${rByte})`;
      roughCtx.fill();
    }

    // Height
    if (heightLevel !== null) {
      const hByte = Math.max(0, Math.min(255, Math.round(heightLevel * 255)));
      heightCtx.beginPath();
      const first = mmToPixel(poly.outer[0].x, poly.outer[0].y);
      heightCtx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.outer.length; i++) {
        const p = mmToPixel(poly.outer[i].x, poly.outer[i].y);
        heightCtx.lineTo(p.x, p.y);
      }
      heightCtx.closePath();
      heightCtx.fillStyle = `rgba(${hByte}, ${hByte}, ${hByte}, 255)`;
      heightCtx.fill();
    }
  };

  // Copper polygons
  const copperColor = "#c58b45";
  for (const layer of geometry.copperLayers) {
    if (layer.side !== sideKey) continue;
    for (const poly of layer.polygons) {
      drawPolygon(poly, copperColor, 1.0, 0.15, 1.0);
    }
  }

  // Drill holes punched into all maps
  if (geometry.drills && geometry.drills.length > 0) {
    for (const drill of geometry.drills) {
      const { x, y } = mmToPixel(drill.x, drill.y);
      const radiusPx = (drill.diameter * 0.5) * pxPerMmAvg;

      // Color: punch out alpha
      colorCtx.save();
      colorCtx.globalCompositeOperation = "destination-out";
      colorCtx.beginPath();
      colorCtx.arc(x, y, radiusPx, 0, Math.PI * 2);
      colorCtx.fill();
      colorCtx.restore();

      // Height: reset to flat baseline under hole
      heightCtx.save();
      heightCtx.globalCompositeOperation = "source-over";
      heightCtx.beginPath();
      heightCtx.arc(x, y, radiusPx, 0, Math.PI * 2);
      heightCtx.fillStyle = "rgba(0,0,0,255)";
      heightCtx.fill();
      heightCtx.restore();

      // Metalness: non metal in hole region
      metalCtx.save();
      metalCtx.globalCompositeOperation = "source-over";
      metalCtx.beginPath();
      metalCtx.arc(x, y, radiusPx, 0, Math.PI * 2);
      metalCtx.fillStyle = "rgb(0,0,0)";
      metalCtx.fill();
      metalCtx.restore();

      // Roughness: just reset to FR4 baseline
      roughCtx.save();
      roughCtx.globalCompositeOperation = "source-over";
      roughCtx.beginPath();
      roughCtx.arc(x, y, radiusPx, 0, Math.PI * 2);
      roughCtx.fillStyle = `rgb(${fr4RoughByte}, ${fr4RoughByte}, ${fr4RoughByte})`;
      roughCtx.fill();
      roughCtx.restore();
    }
  }

  // FR4 normal base: tile normal image
  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = texSize;
  normalCanvas.height = texSize;
  const normalCtx = normalCanvas.getContext("2d");
  if (!normalCtx) {
    throw new Error("2D context not available for PCB normal baking");
  }
  normalCtx.imageSmoothingEnabled = false;

  {
    const img = fr4NormalImage;
    if (img.complete && img.naturalWidth > 0) {
      const pattern = normalCtx.createPattern(img, "repeat");
      if (pattern) {
        normalCtx.fillStyle = pattern;
        normalCtx.fillRect(0, 0, texSize, texSize);
      } else {
        normalCtx.fillStyle = "rgb(128,128,255)";
        normalCtx.fillRect(0, 0, texSize, texSize);
      }
    } else {
      normalCtx.fillStyle = "rgb(128,128,255)";
      normalCtx.fillRect(0, 0, texSize, texSize);
    }
  }

  // Overlay geometry normals for copper features
  {
    const geomNormalCanvas = heightToNormalCanvas(heightCanvas, 3.0);
    const geomCtx = geomNormalCanvas.getContext("2d");
    const heightCtxLocal = heightCanvas.getContext("2d");
    if (geomCtx && heightCtxLocal) {
      const heightData = heightCtxLocal.getImageData(0, 0, texSize, texSize);
      const baseData = normalCtx.getImageData(0, 0, texSize, texSize);
      const geomData = geomCtx.getImageData(0, 0, texSize, texSize);

      const hArr = heightData.data;
      const baseArr = baseData.data;
      const gArr = geomData.data;

      for (let idx = 0; idx < baseArr.length; idx += 4) {
        const hByte = hArr[idx];
        if (hByte > 10) {
          baseArr[idx + 0] = gArr[idx + 0];
          baseArr[idx + 1] = gArr[idx + 1];
          baseArr[idx + 2] = gArr[idx + 2];
          baseArr[idx + 3] = 255;
        }
      }

      normalCtx.putImageData(baseData, 0, 0);
    }
  }

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  const normalTex = new THREE.CanvasTexture(normalCanvas);
  const metalTex = new THREE.CanvasTexture(metalCanvas);
  const roughTex = new THREE.CanvasTexture(roughCanvas);

  for (const tex of [colorTex, normalTex, metalTex, roughTex]) {
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  }

  return {
    color: colorTex,
    normal: normalTex,
    metal: metalTex,
    rough: roughTex,
    size: texSize,
  };
}

// --------------------------
// Main scene builder
// --------------------------

export function buildPcbScene(
  geometry: PcbModelGeometry,
  opts: SceneBuildOptions = {}
): SceneBuildResult {
  const group = new THREE.Group();
  const layerMeshes = new Map<string, THREE.Mesh>();

  const thicknessUnits = mmToUnits(geometry.thicknessMm);
  const widthUnits = mmToUnits(geometry.widthMm);
  const heightUnits = mmToUnits(geometry.heightMm);

  // FR4 body
  const fr4Geom = new THREE.BoxGeometry(widthUnits, heightUnits, thicknessUnits);
  const fr4Mat = createFr4Material({
    boardWidthMm: geometry.widthMm,
    boardHeightMm: geometry.heightMm,
    fr4TexScaleMm: opts.fr4TexScaleMm,
    fr4ColorMap: opts.fr4ColorMap,
    fr4NormalMap: opts.fr4NormalMap,
    usePbrMaterials: opts.usePbrMaterials,
  });
  const fr4Mesh = new THREE.Mesh(fr4Geom, fr4Mat);
  fr4Mesh.castShadow = true;
  fr4Mesh.receiveShadow = true;
  group.add(fr4Mesh);

  const copperThick = 0.035 * mmToUnits(1);
  const maskThick = 0.01 * mmToUnits(1);
  const silkThick = 0.01 * mmToUnits(1);

  const topSurfaceZ = thicknessUnits / 2;
  const bottomSurfaceZ = -thicknessUnits / 2;

  const useBakedLayers = opts.useBakedLayers !== undefined ? opts.useBakedLayers : true;

  if (useBakedLayers) {
    const bounds = computeBoardBoundsMm(geometry);

    const topTextures = bakeSideTexturesFromGeometry(geometry, bounds, {
      side: "top",
      texSize: opts.bakedTextureSize ?? 2048,
      fr4ColorMap: opts.fr4ColorMap,
      fr4NormalMap: opts.fr4NormalMap,
    });
    const bottomTextures = bakeSideTexturesFromGeometry(geometry, bounds, {
      side: "bottom",
      texSize: opts.bakedTextureSize ?? 2048,
      fr4ColorMap: opts.fr4ColorMap,
      fr4NormalMap: opts.fr4NormalMap,
    });

    // Top baked surface, with alpha holes
    {
      const geom = new THREE.PlaneGeometry(widthUnits, heightUnits);
      const mat = new THREE.MeshStandardMaterial({
        map: topTextures.color,
        normalMap: topTextures.normal,
        metalnessMap: topTextures.metal,
        roughnessMap: topTextures.rough,
        normalScale: new THREE.Vector2(0.4, 0.4),
        metalness: 1.0,
        roughness: 0.5,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0, 0, topSurfaceZ + zEps);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.renderOrder = 5;

      layerMeshes.set("baked:top", mesh);
      group.add(mesh);
    }

    // Bottom baked surface, with alpha holes
    {
      const geom = new THREE.PlaneGeometry(widthUnits, heightUnits);
      const mat = new THREE.MeshStandardMaterial({
        map: bottomTextures.color,
        normalMap: bottomTextures.normal,
        metalnessMap: bottomTextures.metal,
        roughnessMap: bottomTextures.rough,
        normalScale: new THREE.Vector2(0.4, 0.4),
        metalness: opts.usePbrMaterials ? 0.5 : 0.2,
        roughness: opts.usePbrMaterials ? 0.4 : 0.7,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotateX(Math.PI);
      mesh.position.set(0, 0, bottomSurfaceZ - zEps);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.renderOrder = 5;

      layerMeshes.set("baked:bottom", mesh);
      group.add(mesh);
    }
  } else {
    // Legacy extruded path

    // Copper
    for (const layer of geometry.copperLayers) {
      if (!layer.side) continue;
      const mat = createCopperMaterial(layer.side, opts);
      const parts = extrudeLayerPolygons(
        layer,
        geometry,
        mmToUnits(1),
        layer.side === "top"
          ? topSurfaceZ + zEps
          : bottomSurfaceZ - copperThick - zEps,
        copperThick
      );
      const mesh = new THREE.Mesh(parts, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const key = `copper:${layer.side}:${layer.name ?? ""}`;
      layerMeshes.set(key, mesh);
      group.add(mesh);
    }

    // Soldermask
    for (const layer of geometry.maskLayers) {
      if (!layer.side) continue;
      const mat = createSoldermaskMaterial(layer.side, opts);
      const parts = extrudeLayerPolygons(
        layer,
        geometry,
        mmToUnits(1),
        layer.side === "top"
          ? topSurfaceZ + copperThick + zEps
          : bottomSurfaceZ - copperThick - maskThick - zEps,
        maskThick
      );
      const mesh = new THREE.Mesh(parts, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const key = `mask:${layer.side}:${layer.name ?? ""}`;
      layerMeshes.set(key, mesh);
      group.add(mesh);
    }

    // Silkscreen
    for (const layer of geometry.silkLayers) {
      if (!layer.side) continue;
      const mat = createSilkscreenMaterial(layer.side, opts);
      const parts = extrudeLayerPolygons(
        layer,
        geometry,
        mmToUnits(1),
        layer.side === "top"
          ? topSurfaceZ + copperThick + maskThick + zEps
          : bottomSurfaceZ - copperThick - maskThick - silkThick - zEps,
        silkThick
      );
      const mesh = new THREE.Mesh(parts, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const key = `silk:${layer.side}:${layer.name ?? ""}`;
      layerMeshes.set(key, mesh);
      group.add(mesh);
    }
  }

  // Drill walls
  if (geometry.drills && geometry.drills.length > 0) {
    const drillGeom = createDrillHolesGeometry(geometry.drills, thicknessUnits);
    const drillMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x222222),
      metalness: 0.4,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const drillMesh = new THREE.Mesh(drillGeom, drillMat);
    drillMesh.castShadow = true;
    drillMesh.receiveShadow = true;
    layerMeshes.set("drills", drillMesh);
    group.add(drillMesh);
  }

  return { group, layerMeshes };
}
