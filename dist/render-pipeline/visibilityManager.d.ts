import { VisibilityState } from './core/renderContract';
export declare class VisibilityManager {
    private state;
    private listeners;
    constructor(initialState?: Partial<VisibilityState>);
    getState(): VisibilityState;
    setState(updates: Partial<VisibilityState>): void;
    setGerberVisibility(layer: keyof VisibilityState['gerber'], visible: boolean): void;
    setOverlayVisibility(overlayId: string, visible: boolean): void;
    setMarkersVisibility(visible: boolean): void;
    toggleGerberLayer(layer: keyof VisibilityState['gerber']): void;
    toggleOverlay(overlayId: string): void;
    toggleMarkers(): void;
    subscribe(listener: (state: VisibilityState) => void): () => void;
    private notifyListeners;
    isGerberLayerVisible(layer: keyof VisibilityState['gerber']): boolean;
    isOverlayVisible(overlayId: string): boolean;
    areMarkersVisible(): boolean;
    applyPreset(preset: 'all' | 'none' | 'copper-only' | 'minimal'): void;
}
