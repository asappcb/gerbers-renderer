import { VisibilityState } from './core/renderContract';

export class VisibilityManager {
  private state: VisibilityState;
  private listeners: Set<(state: VisibilityState) => void> = new Set();

  constructor(initialState?: Partial<VisibilityState>) {
    this.state = {
      gerber: {
        copper: true,
        solderMask: true,
        silk: true,
        outline: true,
      },
      overlays: {},
      markers: true,
      ...initialState,
    };
  }

  getState(): VisibilityState {
    // Deep-copy the nested objects so handed-out snapshots don't mutate when
    // setGerberVisibility/setOverlayVisibility change state in place.
    return {
      gerber: { ...this.state.gerber },
      overlays: { ...this.state.overlays },
      markers: this.state.markers,
    };
  }

  setState(updates: Partial<VisibilityState>) {
    const oldState = this.getState();
    
    this.state = {
      ...this.state,
      ...updates,
      gerber: {
        ...this.state.gerber,
        ...(updates.gerber || {}),
      },
      overlays: {
        ...this.state.overlays,
        ...(updates.overlays || {}),
      },
    };

    // Only notify if state actually changed
    if (JSON.stringify(oldState) !== JSON.stringify(this.state)) {
      this.notifyListeners();
    }
  }

  setGerberVisibility(layer: keyof VisibilityState['gerber'], visible: boolean) {
    if (this.state.gerber[layer] !== visible) {
      this.state.gerber[layer] = visible;
      this.notifyListeners();
    }
  }

  setOverlayVisibility(overlayId: string, visible: boolean) {
    // Ensure the overlays object has the property
    if (!(overlayId in this.state.overlays)) {
      this.state.overlays[overlayId] = false;
    }
    
    if (this.state.overlays[overlayId] !== visible) {
      this.state.overlays[overlayId] = visible;
      this.notifyListeners();
    }
  }

  setMarkersVisibility(visible: boolean) {
    if (this.state.markers !== visible) {
      this.state.markers = visible;
      this.notifyListeners();
    }
  }

  toggleGerberLayer(layer: keyof VisibilityState['gerber']) {
    this.setGerberVisibility(layer, !this.state.gerber[layer]);
  }

  toggleOverlay(overlayId: string) {
    this.setOverlayVisibility(overlayId, !this.state.overlays[overlayId]);
  }

  toggleMarkers() {
    this.setMarkersVisibility(!this.state.markers);
  }

  // Subscription system for reactive updates
  subscribe(listener: (state: VisibilityState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }

  // Utility methods
  isGerberLayerVisible(layer: keyof VisibilityState['gerber']): boolean {
    return this.state.gerber[layer];
  }

  isOverlayVisible(overlayId: string): boolean {
    return this.state.overlays[overlayId] ?? false;
  }

  areMarkersVisible(): boolean {
    return this.state.markers;
  }

  // Presets
  applyPreset(preset: 'all' | 'none' | 'copper-only' | 'minimal') {
    switch (preset) {
      case 'all':
        this.setState({
          gerber: { copper: true, solderMask: true, silk: true, outline: true },
          markers: true,
        });
        break;
      case 'none':
        this.setState({
          gerber: { copper: false, solderMask: false, silk: false, outline: false },
          markers: false,
        });
        break;
      case 'copper-only':
        this.setState({
          gerber: { copper: true, solderMask: false, silk: false, outline: true },
          markers: false,
        });
        break;
      case 'minimal':
        this.setState({
          gerber: { copper: true, solderMask: false, silk: false, outline: true },
          markers: true,
        });
        break;
    }
  }
}
