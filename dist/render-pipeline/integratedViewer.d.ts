import { BoardGeom, ViewerLayers, ViewerSideMode, BoardStackup } from '../viewer/types';
import { Marker as DfmMarker } from './core/renderContract';
import { Viewer } from './viewer';
import { DiffResult } from '../render/diff';
import { ViewState } from './viewState';
import { OverlayRegistry, MarkerRenderer, Selection } from './renderPasses';
export type IntegratedViewerOptions = {
    onDownload?: () => void;
    showDownloadButton?: boolean;
};
export declare function createIntegratedViewer(host: HTMLElement, opts?: IntegratedViewerOptions): {
    setData: (data: {
        boardGeom: BoardGeom;
        layers: ViewerLayers;
        stackup?: BoardStackup;
    }) => void;
    setSideMode: (mode: ViewerSideMode) => void;
    fit: () => void;
    dispose: () => void;
    exportPng: (mode?: "view" | "board", scale?: number) => Promise<void>;
    exportSvg: () => Promise<void>;
    showDiff: (result: DiffResult) => void;
    hideDiff: () => void;
    getViewState: () => ViewState;
    setViewState: (s: ViewState) => void;
    getShareUrl: () => string;
    copyShareLink: () => Promise<string>;
    applyStateFromHash: () => boolean;
    viewer: Viewer;
    visibility: import('./visibilityManager').VisibilityManager;
    overlayRegistry: OverlayRegistry;
    markerRenderer: MarkerRenderer;
    setSelection: (selection: Selection | null) => void;
    addMarker: (marker: DfmMarker) => void;
    addMarkers: (markers: DfmMarker[]) => void;
    removeMarker: (id: string) => void;
};
