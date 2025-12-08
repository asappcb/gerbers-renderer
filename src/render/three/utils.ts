// src/render/three/utils.ts
import * as THREE from "three";

export function resizeRendererToDisplaySize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
): boolean {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return false;

  const needResize =
    canvas.width !== Math.floor(width * window.devicePixelRatio) ||
    canvas.height !== Math.floor(height * window.devicePixelRatio);

  if (needResize) {
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  return needResize;
}

export function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse(child => {
    const mesh = child as THREE.Mesh;
    if ((mesh as any).geometry && mesh.geometry instanceof THREE.BufferGeometry) {
      mesh.geometry.dispose();
    }
    if ((mesh as any).material) {
      const mat = mesh.material;
      if (Array.isArray(mat)) {
        mat.forEach(m => m.dispose());
      } else if (mat && (mat as any).dispose) {
        (mat as any).dispose();
      }
    }
  });
}
