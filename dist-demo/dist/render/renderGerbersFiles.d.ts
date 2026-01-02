import { BoardGeom, ViewerLayers } from '../viewer/types';
export type RenderResult = {
    boardGeom: BoardGeom;
    layers: ViewerLayers;
    revoke: () => void;
};
export declare function renderGerbersFiles(files: Record<string, Uint8Array>): Promise<RenderResult>;
