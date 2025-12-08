// src/render/three/viewer-3d.ts
import * as THREE from "three";
import type { PcbModelGeometry } from "../../types/pcb-model";
import { buildPcbScene, type SceneBuildResult } from "./scene-builder";
import { addDefaultLights } from "./lights";
import { createOrbitControls } from "./controls";
import { resizeRendererToDisplaySize, disposeObject3D } from "./utils";

export interface Viewer3DOptions {
  canvas: HTMLCanvasElement;
  autoResize?: boolean;
  usePbrMaterials?: boolean;
  backgroundColor?: number;
}

export class Viewer3D {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private running = false;
  private controls: any;
  private sceneBuild: SceneBuildResult;
  private autoResize: boolean;
  private animationFrameId: number | null = null;

  constructor(geometry: PcbModelGeometry, options: Viewer3DOptions) {
    const { canvas, autoResize = true, backgroundColor = 0x111111 } = options;

    this.autoResize = autoResize;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      5000
    );

    addDefaultLights(this.scene);

    this.sceneBuild = buildPcbScene(geometry, {
      usePbrMaterials: options.usePbrMaterials,
    });
    this.scene.add(this.sceneBuild.rootGroup);

    this.controls = createOrbitControls(this.camera, canvas);

    this.positionCameraToFitBoard(geometry);

    if (this.autoResize) {
      window.addEventListener("resize", this.handleResize);
    }

    this.start();
  }

  private positionCameraToFitBoard(geometry: PcbModelGeometry) {
    const mmToUnits = 0.1;
    const widthUnits = geometry.widthMm * mmToUnits;
    const heightUnits = geometry.heightMm * mmToUnits;
    const thicknessUnits = geometry.thicknessMm * mmToUnits;

    const maxDim = Math.max(widthUnits, heightUnits, thicknessUnits);
    const dist = maxDim * 2.0;

    this.camera.position.set(dist, dist, dist);
    this.camera.lookAt(0, 0, 0);
  }

  private handleResize = () => {
    resizeRendererToDisplaySize(this.renderer, this.camera);
  };

  private start() {
    this.running = true;
    const renderLoop = () => {
      if (!this.running) return;
      this.animationFrameId = requestAnimationFrame(renderLoop);
      this.controls.update();
      resizeRendererToDisplaySize(this.renderer, this.camera);
      this.renderer.render(this.scene, this.camera);
    };
    renderLoop();
  }

  /**
   * Toggle visibility by prefix, for example:
   * - "copper:top"
   * - "mask:bottom"
   * - "silk:top"
   */
  setLayerVisible(prefix: string, visible: boolean) {
    for (const [id, mesh] of this.sceneBuild.layerMeshes.entries()) {
      if (id.startsWith(prefix)) {
        mesh.visible = visible;
      }
    }
  }

  resize() {
    resizeRendererToDisplaySize(this.renderer, this.camera);
  }

  dispose() {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.autoResize) {
      window.removeEventListener("resize", this.handleResize);
    }

    this.controls?.dispose?.();

    disposeObject3D(this.scene);
    this.renderer.dispose();
  }
}
