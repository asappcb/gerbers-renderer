import { Marker } from './core/renderContract';
export declare class MarkerStore {
    private byId;
    private index;
    private dirtyList;
    private listCache;
    clear(): void;
    addMany(markers: Marker[]): void;
    add(marker: Marker): void;
    updateMany(partials: (Partial<Marker> & {
        id: string;
    })[]): void;
    remove(id: string): void;
    get(id: string): Marker | undefined;
    list(): Marker[];
    queryNear(x_mm: number, y_mm: number, radius_mm: number): Marker[];
}
