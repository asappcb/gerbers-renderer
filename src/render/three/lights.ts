// src/render/three/lights.ts
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

export interface EnvLightOptions {
  /**
   * Path to an HDR environment map (equirectangular).
   * Place it under your Vite `public/` folder so
   * `/public/textures/studio_env.hdr` -> "/textures/studio_env.hdr"
   */
  envMapPath?: string;

  /**
   * Multiplier for environment reflections (used to tweak envMapIntensity).
   */
  intensity?: number;

  /**
   * If true, environment is also used as scene background.
   */
  useAsBackground?: boolean;
}

/**
 * Setup environment lighting:
 * - Tries to load an HDR environment and use it for reflections + background.
 * - If that fails, falls back to simple hemisphere + directional lights.
 *
 * Call once after creating scene + renderer.
 */
export async function addDefaultLights(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  options: EnvLightOptions = {}
): Promise<void> {
  const {
    envMapPath = "/textures/studio_env.hdr",
    intensity = 1.0,
    useAsBackground = true,
  } = options;

  // Always add a tiny ambient so nothing goes totally black.
  const ambient = new THREE.AmbientLight(0xffffff, 0.12);
  scene.add(ambient);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const loader = new HDRLoader();

  const hdrTexture = await new Promise<THREE.DataTexture | null>((resolve) => {
    loader.load(
      envMapPath,
      (tex) => resolve(tex),
      undefined,
      (err) => {
        console.warn(
          "[lights] Failed to load HDR env map:",
          envMapPath,
          err
        );
        resolve(null);
      }
    );
  });

  if (!hdrTexture) {
    // Fallback: soft studio-like lights if HDR missing or failed
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.4);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(3, 4, 5);
    dir.castShadow = false;
    scene.add(dir);

    return;
  }

  // Convert HDR to prefiltered env map for PBR
  hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
  const envRT = pmrem.fromEquirectangular(hdrTexture);
  const envMap = envRT.texture;

  hdrTexture.dispose();
  pmrem.dispose();

  scene.environment = envMap;
  if (useAsBackground) {
    scene.background = envMap;
  }

  // Set envMapIntensity on existing materials that support it
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material as any;
    if (mat && "envMapIntensity" in mat) {
      mat.envMapIntensity = intensity;
      mat.needsUpdate = true;
    }
  });

  // Optional: subtle directional kicker so lighting has a clear "sun" direction
  const dirSoft = new THREE.DirectionalLight(0xffffff, 0.2);
  dirSoft.position.set(3, 4, 5);
  dirSoft.castShadow = false;
  scene.add(dirSoft);
}
