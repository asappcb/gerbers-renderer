import { BoardGeom, ViewerLayers } from '../viewer/types';
export type RenderResult = {
    boardGeom: BoardGeom;
    layers: ViewerLayers;
    revoke: () => void;
};
export declare function renderGerbersZip(file: File): Promise<RenderResult>;
