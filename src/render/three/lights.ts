// src/render/three/lights.ts
import * as THREE from "three";

export function addDefaultLights(scene: THREE.Scene) {
  const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.6);
  hemi.position.set(0, 1, 0);
  scene.add(hemi);

  const dir1 = new THREE.DirectionalLight(0xffffff, 0.7);
  dir1.position.set(2, 3, 4);
  scene.add(dir1);

  const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
  dir2.position.set(-3, -2, -4);
  scene.add(dir2);
}
