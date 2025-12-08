// src/render/three/materials.ts
import * as THREE from "three";

export interface MaterialOptions {
  usePbrMaterials?: boolean;
}

export function createFr4Material(opts: MaterialOptions = {}): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x2f4030),
    metalness: 0.0,
    roughness: 0.9,
  });
  return mat;
}

export function createCopperMaterial(
  side: "top" | "bottom",
  opts: MaterialOptions = {}
): THREE.Material {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd8af3a),
    metalness: 1.0,
    roughness: 0.35,
  });

  // You could tint top vs bottom differently if you want
  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.05);
  }

  return mat;
}

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
  });

  if (side === "bottom") {
    (mat as THREE.MeshStandardMaterial).color.offsetHSL(0, 0, -0.03);
  }

  return mat;
}

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
