// src/render/three/materials.ts
import * as THREE from "three";

export interface MaterialOptions {
  usePbrMaterials?: boolean;

  // Your addition:
  boardWidthMm?: number;
  boardHeightMm?: number;

  // Optional custom texture paths
  fr4ColorMap?: string;
  fr4NormalMap?: string;

  // Control texture tiling density
  fr4TexScaleMm?: number; // mm per texture tile, default ~8–12mm usually looks good
}

// -----------------------------------------------------------------------------
// FR4 Material with texture + normal map
// -----------------------------------------------------------------------------

export function createFr4Material(opts: MaterialOptions = {}): THREE.Material {
  const {
    boardWidthMm = 100,
    boardHeightMm = 100,
    fr4ColorMap = "/textures/fr4_color.png",
    fr4NormalMap = "/textures/fr4_normal.png",
    fr4TexScaleMm = 20,
  } = opts;

  const texLoader = new THREE.TextureLoader();

  // Color map
  const colorTex = texLoader.load(
    fr4ColorMap,
    (t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.repeat.set(boardWidthMm / fr4TexScaleMm, boardHeightMm / fr4TexScaleMm);
    },
    undefined,
    () => {
      console.warn("FR4 color texture failed to load, using fallback color.");
    }
  );

  // Normal map
  const normalTex = texLoader.load(
    fr4NormalMap,
    (t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(boardWidthMm / fr4TexScaleMm, boardHeightMm / fr4TexScaleMm);
    },
    undefined,
    () => {
      console.warn("FR4 normal map failed to load.");
    }
  );

  const mat = new THREE.MeshStandardMaterial({
    map: colorTex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.6, 0.6),

    color: new THREE.Color(0x87bb8a), // base tint
    metalness: 0.1,
    roughness: 0.6,
  });

  mat.side = THREE.DoubleSide;

  return mat;
}

// -----------------------------------------------------------------------------
// Copper
// -----------------------------------------------------------------------------

export function createCopperMaterial(
  side: "top" | "bottom",
  opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xd8af3a),
    metalness: 1.0,
    roughness: 0.35,

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
  opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x004000),
    metalness: 0.1,
    roughness: 0.8,
    transparent: true,
    opacity: 0.85,

    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.03);
  }

  return mat;
}

// -----------------------------------------------------------------------------
// Silkscreen
// -----------------------------------------------------------------------------

export function createSilkscreenMaterial(
  side: "top" | "bottom",
  opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    metalness: 0.0,
    roughness: 0.9,
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.05);
  }

  return mat;
}
