// src/render/three/scene-builder.ts
import * as THREE from "three";
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

export interface SceneBuildOptions {
  usePbrMaterials?: boolean;
}

export interface SceneBuildResult {
  rootGroup: THREE.Group;
  layerMeshes: Map<string, THREE.Mesh>;
  drillMeshes: THREE.Mesh[];
}

/**
 * Builds a 3D group containing:
 * - FR4 core
 * - Copper layers (top/bottom)
 * - Optional soldermask and silkscreen layers
 * - Drill cylinders
 */
export function buildPcbScene(
  geometry: PcbModelGeometry,
  opts: SceneBuildOptions = {}
): SceneBuildResult {
  const group = new THREE.Group();
  const layerMeshes = new Map<string, THREE.Mesh>();
  const drillMeshes: THREE.Mesh[] = [];

  const mmToUnits = 0.1;

  const widthUnits = geometry.widthMm * mmToUnits;
  const heightUnits = geometry.heightMm * mmToUnits;
  const thicknessUnits = geometry.thicknessMm * mmToUnits;

  const offsetXmm = geometry.widthMm / 2;
  const offsetYmm = geometry.heightMm / 2;

  // FR4 core - centered at origin
  const fr4Geom = new THREE.BoxGeometry(widthUnits, heightUnits, thicknessUnits);
  const fr4Mat = createFr4Material(opts);
  const fr4Mesh = new THREE.Mesh(fr4Geom, fr4Mat);
  group.add(fr4Mesh);

  // Copper, mask, silk thickness in units
  const copperThick = 0.035 * mmToUnits;
  const maskThick = 0.01 * mmToUnits;
  const silkThick = 0.01 * mmToUnits;

  const topSurfaceZ = thicknessUnits / 2;
  const bottomSurfaceZ = -thicknessUnits / 2;

  // Copper
  for (const layer of geometry.copperLayers) {
    if (!layer.side) continue;
    const mat = createCopperMaterial(layer.side, opts);
    const parts = extrudeLayerPolygons(
      layer,
      geometry,
      mmToUnits,
      offsetXmm,
      offsetYmm,
      copperThick
    );
    for (let idx = 0; idx < parts.length; idx++) {
      const mesh = new THREE.Mesh(parts[idx], mat);
      const baseZ =
        layer.side === "top"
          ? topSurfaceZ - copperThick * 0.5
          : bottomSurfaceZ + copperThick * 0.5;
      mesh.position.z = baseZ;
      const id = `copper:${layer.side}:${layer.name}:${idx}`;
      layerMeshes.set(id, mesh);
      group.add(mesh);
    }
  }

  // Soldermask
  for (const layer of geometry.maskLayers) {
    if (!layer.side) continue;
    const mat = createSoldermaskMaterial(layer.side, opts);
    const parts = extrudeLayerPolygons(
      layer,
      geometry,
      mmToUnits,
      offsetXmm,
      offsetYmm,
      maskThick
    );
    for (let idx = 0; idx < parts.length; idx++) {
      const mesh = new THREE.Mesh(parts[idx], mat);
      const baseZ =
        layer.side === "top"
          ? topSurfaceZ - copperThick - maskThick * 0.5
          : bottomSurfaceZ + copperThick + maskThick * 0.5;
      mesh.position.z = baseZ;
      const id = `mask:${layer.side}:${layer.name}:${idx}`;
      layerMeshes.set(id, mesh);
      group.add(mesh);
    }
  }

  // Silkscreen
  for (const layer of geometry.silkLayers) {
    if (!layer.side) continue;
    const mat = createSilkscreenMaterial(layer.side, opts);
    const parts = extrudeLayerPolygons(
      layer,
      geometry,
      mmToUnits,
      offsetXmm,
      offsetYmm,
      silkThick
    );
    for (let idx = 0; idx < parts.length; idx++) {
      const mesh = new THREE.Mesh(parts[idx], mat);
      const baseZ =
        layer.side === "top"
          ? topSurfaceZ - copperThick - maskThick - silkThick * 0.5
          : bottomSurfaceZ + copperThick + maskThick + silkThick * 0.5;
      mesh.position.z = baseZ;
      const id = `silk:${layer.side}:${layer.name}:${idx}`;
      layerMeshes.set(id, mesh);
      group.add(mesh);
    }
  }

  // Drills
  if (geometry.drills.length > 0) {
    const drillGroup = buildDrillGroup(
      geometry.drills,
      geometry,
      mmToUnits,
      offsetXmm,
      offsetYmm,
      thicknessUnits
    );
    drillMeshes.push(...(drillGroup.children as THREE.Mesh[]));
    group.add(drillGroup);
  }

  // Center group at origin
  group.position.set(0, 0, 0);

  return {
    rootGroup: group,
    layerMeshes,
    drillMeshes,
  };
}

function extrudeLayerPolygons(
  layer: LayerGeometry,
  geometry: PcbModelGeometry,
  mmToUnits: number,
  offsetXmm: number,
  offsetYmm: number,
  thicknessUnits: number
): THREE.BufferGeometry[] {
  const geoms: THREE.BufferGeometry[] = [];
  for (const poly of layer.polygons) {
    const shape = polygonToShape(poly, mmToUnits, offsetXmm, offsetYmm);
    const extrudeGeom = new THREE.ExtrudeGeometry(shape, {
      depth: thicknessUnits,
      bevelEnabled: false,
    });
    geoms.push(extrudeGeom);
  }
  return geoms;
}

function polygonToShape(
  poly: Polygon,
  mmToUnits: number,
  offsetXmm: number,
  offsetYmm: number
): THREE.Shape {
  const shape = new THREE.Shape();

  if (!poly.outer.length) {
    return shape;
  }

  const first = poly.outer[0];
  shape.moveTo(
    (first.x - offsetXmm) * mmToUnits,
    (first.y - offsetYmm) * mmToUnits
  );

  for (let i = 1; i < poly.outer.length; i++) {
    const p = poly.outer[i];
    shape.lineTo(
      (p.x - offsetXmm) * mmToUnits,
      (p.y - offsetYmm) * mmToUnits
    );
  }

  shape.closePath();

  for (const hole of poly.holes || []) {
    if (!hole.length) continue;
    const path = new THREE.Path();
    const h0 = hole[0];
    path.moveTo(
      (h0.x - offsetXmm) * mmToUnits,
      (h0.y - offsetYmm) * mmToUnits
    );
    for (let i = 1; i < hole.length; i++) {
      const hp = hole[i];
      path.lineTo(
        (hp.x - offsetXmm) * mmToUnits,
        (hp.y - offsetYmm) * mmToUnits
      );
    }
    path.closePath();
    shape.holes.push(path);
  }

  return shape;
}

function buildDrillGroup(
  drills: DrillHole[],
  geometry: PcbModelGeometry,
  mmToUnits: number,
  offsetXmm: number,
  offsetYmm: number,
  thicknessUnits: number
): THREE.Group {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x303030),
    metalness: 0.3,
    roughness: 0.7,
  });

  for (const hole of drills) {
    const radiusUnits = (hole.diameter / 2) * mmToUnits;
    const heightUnits = thicknessUnits * 1.2;

    const geom = new THREE.CylinderGeometry(
      radiusUnits,
      radiusUnits,
      heightUnits,
      16
    );

    // Cylinder axis is Y in Three by default, we want Z
    geom.rotateX(Math.PI / 2);

    const xUnits = (hole.x - offsetXmm) * mmToUnits;
    const yUnits = (hole.y - offsetYmm) * mmToUnits;

    geom.translate(xUnits, yUnits, 0);

    const mesh = new THREE.Mesh(geom, mat);
    group.add(mesh);
  }

  return group;
}
