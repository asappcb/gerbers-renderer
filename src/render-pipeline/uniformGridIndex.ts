export class UniformGridIndex {
  private cellSize_mm: number;
  private cells = new Map<string, Set<string>>();

  constructor(cellSize_mm: number) {
    this.cellSize_mm = cellSize_mm;
  }

  private cellCoord(x_mm: number, y_mm: number) {
    const cx = Math.floor(x_mm / this.cellSize_mm);
    const cy = Math.floor(y_mm / this.cellSize_mm);
    return { cx, cy, key: `${cx},${cy}` };
  }

  clear() {
    this.cells.clear();
  }

  insert(id: string, x_mm: number, y_mm: number) {
    const { key } = this.cellCoord(x_mm, y_mm);
    let s = this.cells.get(key);
    if (!s) {
      s = new Set();
      this.cells.set(key, s);
    }
    s.add(id);
  }

  remove(id: string, x_mm: number, y_mm: number) {
    const { key } = this.cellCoord(x_mm, y_mm);
    const s = this.cells.get(key);
    if (!s) return;
    s.delete(id);
    if (s.size === 0) this.cells.delete(key);
  }

  // Query ids near a point within radius_mm
  queryRadius(x_mm: number, y_mm: number, radius_mm: number): string[] {
    const { cx, cy } = this.cellCoord(x_mm, y_mm);
    const rCells = Math.ceil(radius_mm / this.cellSize_mm);

    const out: string[] = [];
    for (let dx = -rCells; dx <= rCells; dx++) {
      for (let dy = -rCells; dy <= rCells; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const s = this.cells.get(key);
        if (!s) continue;
        for (const id of s) out.push(id);
      }
    }
    return out;
  }
}
