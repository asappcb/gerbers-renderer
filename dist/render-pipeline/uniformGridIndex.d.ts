export declare class UniformGridIndex {
    private cellSize_mm;
    private cells;
    constructor(cellSize_mm: number);
    private cellCoord;
    clear(): void;
    insert(id: string, x_mm: number, y_mm: number): void;
    remove(id: string, x_mm: number, y_mm: number): void;
    queryRadius(x_mm: number, y_mm: number, radius_mm: number): string[];
}
