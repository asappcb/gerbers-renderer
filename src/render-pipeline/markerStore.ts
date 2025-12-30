import { Marker } from './core/renderContract';
import { UniformGridIndex } from './uniformGridIndex';

export class MarkerStore {
  private byId = new Map<string, Marker>();
  private index = new UniformGridIndex(5); // 5mm cells is a decent default
  private dirtyList = true;
  private listCache: Marker[] = [];

  clear() {
    this.byId.clear();
    this.index.clear();
    this.dirtyList = true;
  }

  addMany(markers: Marker[]) {
    for (const m of markers) this.add(m);
  }

  add(marker: Marker) {
    if (this.byId.has(marker.id)) {
      // Replace behavior is up to you; I'd allow replace with remove+add
      const old = this.byId.get(marker.id)!;
      this.index.remove(old.id, old.x_mm, old.y_mm);
    }
    this.byId.set(marker.id, marker);
    this.index.insert(marker.id, marker.x_mm, marker.y_mm);
    this.dirtyList = true;
  }

  updateMany(partials: (Partial<Marker> & { id: string })[]) {
    for (const p of partials) {
      const old = this.byId.get(p.id);
      if (!old) continue;
      const next: Marker = { ...old, ...p };

      // If position changed, update index
      if (next.x_mm !== old.x_mm || next.y_mm !== old.y_mm) {
        this.index.remove(old.id, old.x_mm, old.y_mm);
        this.index.insert(old.id, next.x_mm, next.y_mm);
      }

      this.byId.set(old.id, next);
      this.dirtyList = true;
    }
  }

  remove(id: string) {
    const old = this.byId.get(id);
    if (!old) return;
    this.index.remove(old.id, old.x_mm, old.y_mm);
    this.byId.delete(id);
    this.dirtyList = true;
  }

  get(id: string) {
    return this.byId.get(id);
  }

  list(): Marker[] {
    if (this.dirtyList) {
      this.listCache = Array.from(this.byId.values());
      this.dirtyList = false;
    }
    return this.listCache;
  }

  // Used for picking
  queryNear(x_mm: number, y_mm: number, radius_mm: number): Marker[] {
    const ids = this.index.queryRadius(x_mm, y_mm, radius_mm);
    const out: Marker[] = [];
    for (const id of ids) {
      const m = this.byId.get(id);
      if (m) out.push(m);
    }
    return out;
  }
}
