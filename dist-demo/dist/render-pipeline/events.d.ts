export type Unsubscribe = () => void;
export declare class Emitter<EventMap extends Record<string, any>> {
    private handlers;
    on<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void): Unsubscribe;
    once<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void): Unsubscribe;
    off<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void): void;
    emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
    clear(): void;
}
