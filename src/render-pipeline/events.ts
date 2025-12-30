export type Unsubscribe = () => void;

export class Emitter<EventMap extends Record<string, any>> {
  private handlers = new Map<keyof EventMap, Set<(payload: any) => void>>();

  on<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void): Unsubscribe {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(cb as any);

    return () => this.off(event, cb);
  }

  once<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void): Unsubscribe {
    const unsub = this.on(event, (payload) => {
      unsub();
      cb(payload);
    });
    return unsub;
  }

  off<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void) {
    const set = this.handlers.get(event);
    if (!set) return;
    set.delete(cb as any);
    if (set.size === 0) this.handlers.delete(event);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
    const set = this.handlers.get(event);
    if (!set || set.size === 0) return;

    // Copy to prevent issues if handlers unsubscribe during emit
    const snapshot = Array.from(set);
    for (const fn of snapshot) fn(payload);
  }

  clear() {
    this.handlers.clear();
  }
}
