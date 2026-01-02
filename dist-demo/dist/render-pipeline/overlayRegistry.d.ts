import { Overlay } from './core/renderContract';
export declare class OverlayRegistry {
    private overlays;
    private sortedCache;
    private dirty;
    add(overlay: Overlay): void;
    remove(id: string): Overlay | undefined;
    get(id: string): Overlay | undefined;
    setVisible(id: string, visible: boolean): void;
    setZIndex(id: string, zIndex: number): void;
    list(): Overlay[];
    getSortedVisible(): Overlay[];
}
