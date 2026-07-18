// src/render-pipeline/board3d.ts
//
// Optional 3D board view. three.js is a dynamic import so it stays an optional
// peer dependency — nothing is pulled in unless the 3D view is actually opened.

import type { BoardGeom, BoardStackup } from "../viewer/types";

export interface Board3DHandle {
  dispose(): void;
  resize(): void;
}

export interface Board3DOptions {
  boardGeom: BoardGeom;
  stackup: BoardStackup;
  substrateColor: string;
  thicknessMm?: number;
}

/**
 * Mount a simple 3D board view into `container`. Extrudes the board outline into
 * an FR4 slab and lays the top/bottom copper on its faces as textured planes,
 * with orbit controls. Requires `three` to be installed (optional peer dep).
 */
export async function createBoard3D(container: HTMLElement, opts: Board3DOptions): Promise<Board3DHandle> {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

  const b = opts.boardGeom.board.mm_bounds;
  const wMm = b.max_x_mm - b.min_x_mm;
  const hMm = b.max_y_mm - b.min_y_mm;
  const cx = (b.min_x_mm + b.max_x_mm) / 2;
  const cy = (b.min_y_mm + b.max_y_mm) / 2;
  const thick = opts.thicknessMm ?? 1.6;

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  const diag = Math.hypot(wMm, hMm);
  camera.position.set(0, -diag * 0.9, diag * 0.9);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(1, -1, 2);
  scene.add(dir);

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T): T => { disposables.push(x); return x; };

  // Board slab (extruded outline if available, else a box). Centred at the origin.
  const group = new THREE.Group();
  scene.add(group);

  let slabGeom: any;
  const loops = opts.boardGeom.outline_loops_mm;
  if (loops && loops.length) {
    const shape = new THREE.Shape();
    const outer = loops[0];
    shape.moveTo(outer[0].x - cx, outer[0].y - cy);
    for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i].x - cx, outer[i].y - cy);
    shape.closePath();
    for (let k = 1; k < loops.length; k++) {
      const hole = new THREE.Path();
      hole.moveTo(loops[k][0].x - cx, loops[k][0].y - cy);
      for (let i = 1; i < loops[k].length; i++) hole.lineTo(loops[k][i].x - cx, loops[k][i].y - cy);
      hole.closePath();
      shape.holes.push(hole);
    }
    slabGeom = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
    slabGeom.translate(0, 0, -thick / 2);
  } else {
    slabGeom = new THREE.BoxGeometry(wMm, hMm, thick);
  }
  track(slabGeom);
  const slabMat = track(new THREE.MeshStandardMaterial({ color: new THREE.Color(opts.substrateColor), roughness: 0.6, metalness: 0.1 }));
  group.add(new THREE.Mesh(slabGeom, slabMat));

  // Copper faces: textured planes just above/below the slab.
  const texLoader = new THREE.TextureLoader();
  const addCopper = (url: string | undefined, z: number, flip: boolean) => {
    if (!url) return;
    const tex = track(texLoader.load(url));
    tex.colorSpace = THREE.SRGBColorSpace;
    const geom = track(new THREE.PlaneGeometry(wMm, hMm));
    const mat = track(new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.z = z;
    if (flip) mesh.rotation.y = Math.PI; // mirror bottom side
    group.add(mesh);
  };
  const top = opts.stackup.copper.find((c) => c.role === "top");
  const bottom = opts.stackup.copper.find((c) => c.role === "bottom");
  addCopper(top?.url, thick / 2 + 0.02, false);
  addCopper(bottom?.url, -thick / 2 - 0.02, true);

  let raf = 0;
  let alive = true;
  const loop = () => {
    if (!alive) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  loop();

  return {
    resize() {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      controls.dispose();
      for (const d of disposables) { try { d.dispose(); } catch { /* ignore */ } }
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
