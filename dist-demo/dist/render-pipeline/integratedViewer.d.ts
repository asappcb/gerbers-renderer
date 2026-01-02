import { BoardGeom, ViewerLayers, ViewerSideMode } from '../viewer/types';
import { Viewer } from './viewer';
import { VisibilityManager } from './visibilityManager';
import { OverlayRegistry, MarkerRenderer, Marker, Selection } from './renderPasses';
export type IntegratedViewerOptions = {
    onDownload?: () => void;
};
export declare function createIntegratedViewer(host: HTMLElement, opts?: IntegratedViewerOptions): {
    setData: (data: {
        boardGeom: BoardGeom;
        layers: ViewerLayers;
    }) => void;
    setSideMode: (mode: ViewerSideMode) => void;
    fit: () => void;
    dispose: () => void;
    viewer: Viewer;
    visibility: VisibilityManager;
    overlayRegistry: OverlayRegistry;
    markerRenderer: MarkerRenderer;
    setSelection: (selection: Selection | null) => void;
    addMarker: (marker: Marker) => void;
    removeMarker: (id: string) => void;
};
