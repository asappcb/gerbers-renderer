import { describe, it, expect, vi, afterEach } from "vitest";

describe("renderGerbersInWorker", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

  it("sends only the Uint8Array view's bytes, not its whole backing buffer", async () => {
    const sent: unknown[] = [];
    class FakeWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage(msg: { id: number; input: unknown }) {
        sent.push(msg.input);
        // Settle the request so the call returns.
        queueMicrotask(() => this.onmessage?.({ data: { id: msg.id, ok: false, error: { message: "stub" } } } as MessageEvent));
      }
      terminate() {}
    }
    vi.stubGlobal("Worker", FakeWorker);
    const { renderGerbersInWorker } = await import("./renderGerbersWorker");

    // A view at an offset inside a larger buffer, like a pooled Node Buffer.
    const backing = new Uint8Array([9, 9, 1, 2, 3, 9, 9]);
    const view = backing.subarray(2, 5);
    await expect(renderGerbersInWorker(view)).rejects.toThrow();

    expect(new Uint8Array(sent[0] as ArrayBuffer)).toEqual(new Uint8Array([1, 2, 3]));
    expect(view).toEqual(new Uint8Array([1, 2, 3])); // caller's data untouched
  });
});
