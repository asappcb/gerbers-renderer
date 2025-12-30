import { Overlay } from './core/renderContract';

export class OverlayRegistry {
  private overlays = new Map<string, Overlay>();
  private sortedCache: Overlay[] = [];
  private dirty = true;

  add(overlay: Overlay) {
    if (this.overlays.has(overlay.id)) {
      throw new Error(`Overlay already exists: ${overlay.id}`);
    }
    this.overlays.set(overlay.id, overlay);
    this.dirty = true;
  }

  remove(id: string) {
    const ov = this.overlays.get(id);
    if (!ov) return;
    this.overlays.delete(id);
    this.dirty = true;
    return ov;
  }

  get(id: string): Overlay | undefined {
    return this.overlays.get(id);
  }

  setVisible(id: string, visible: boolean) {
    const ov = this.overlays.get(id);
    if (!ov) return;
    if (ov.visible === visible) return;
    ov.visible = visible;
    // no need to re-sort
  }

  setZIndex(id: string, zIndex: number) {
    const ov = this.overlays.get(id);
    if (!ov) return;
    if (ov.zIndex === zIndex) return;
    ov.zIndex = zIndex;
    this.dirty = true;
  }

  list(): Overlay[] {
    return Array.from(this.overlays.values());
  }

  getSortedVisible(): Overlay[] {
    if (this.dirty) {
      this.sortedCache = Array.from(this.overlays.values()).sort((a, b) => a.zIndex - b.zIndex);
      this.dirty = false;
    }
    // Filter visible without rebuilding cache
    return this.sortedCache.filter((o) => o.visible);
  }
}
