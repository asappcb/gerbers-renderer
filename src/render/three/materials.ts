// src/render/three/materials.ts
import * as THREE from "three";

export interface MaterialOptions {
  usePbrMaterials?: boolean;

  boardWidthMm?: number;
  boardHeightMm?: number;

  fr4ColorMap?: string;
  fr4NormalMap?: string;

  fr4TexScaleMm?: number;
}

// -----------------------------------------------------------------------------
// FR4 - brighter, glossier green soldermask look
// -----------------------------------------------------------------------------

export function createFr4Material(opts: MaterialOptions = {}): THREE.Material {
  const {
    boardWidthMm = 100,
    boardHeightMm = 100,
    fr4ColorMap = "/textures/fr4_color.png",
    fr4NormalMap = "/textures/fr4_normal.png",
    fr4TexScaleMm = 10,
  } = opts;

  const texLoader = new THREE.TextureLoader();

  const colorTex = texLoader.load(fr4ColorMap, (t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    // Make sure colors are not washed out
    t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(boardWidthMm / fr4TexScaleMm, boardHeightMm / fr4TexScaleMm);
  });

  const normalTex = texLoader.load(fr4NormalMap, (t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(boardWidthMm / fr4TexScaleMm, boardHeightMm / fr4TexScaleMm);
  });

  const mat = new THREE.MeshStandardMaterial({
    map: colorTex,
    normalMap: normalTex,

    // Slight micro bump, but not overpowering
    normalScale: new THREE.Vector2(0.2, 0.2),

    // Brighter, more saturated PCB green
    color: new THREE.Color(0x0aa64f),

    // Glossier mask
    roughness: 0.35,
    metalness: 0.0,
  });

  mat.side = THREE.DoubleSide;
  // Slightly stronger environment reflection for a glossy feel
  mat.envMapIntensity = 0.6;

  return mat;
}

// -----------------------------------------------------------------------------
// Copper
// -----------------------------------------------------------------------------

export function createCopperMaterial(
  side: "top" | "bottom",
  _opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xd8af3a),
    metalness: 1.0,
    roughness: 0.25,
    reflectivity: 0.9,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,

    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.05);
  }

  return mat;
}

// -----------------------------------------------------------------------------
// Soldermask
// -----------------------------------------------------------------------------

export function createSoldermaskMaterial(
  side: "top" | "bottom",
  _opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x004f1f),
    metalness: 0.0,
    roughness: 0.6,
    transparent: true,
    opacity: 0.9,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.05);
  }

  return mat;
}

// -----------------------------------------------------------------------------
// Silkscreen
// -----------------------------------------------------------------------------

export function createSilkscreenMaterial(
  side: "top" | "bottom",
  _opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    metalness: 0.0,
    roughness: 0.7,
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.05);
  }

  return mat;
}
