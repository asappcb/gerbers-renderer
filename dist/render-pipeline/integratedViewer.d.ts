import { BoardGeom, ViewerLayers, ViewerSideMode } from '../viewer/types';
import { Marker as DfmMarker } from './core/renderContract';
import { Viewer } from './viewer';
import { VisibilityManager } from './visibilityManager';
import { OverlayRegistry, MarkerRenderer, Selection } from './renderPasses';
export type IntegratedViewerOptions = {
    onDownload?: () => void;
    showDownloadButton?: boolean;
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
    addMarker: (marker: DfmMarker) => void;
    addMarkers: (markers: DfmMarker[]) => void;
    removeMarker: (id: string) => void;
};
