// src/render-pipeline/viewState.ts
//
// Serializable viewer state for shareable deep-links: side, camera, per-layer
// visibility, grid. Encoded as URL-safe base64 of JSON. Pure (no DOM).

export interface ViewState {
  /** Schema version. */
  v: 1;
  side: "top" | "bottom";
  /** Camera: center (mm), zoom (px/mm), rotation (rad). */
  cam: { x: number; y: number; zoom: number; rot?: number };
  /** Per-layer visibility overrides, keyed by layer id. */
  visible?: Record<string, boolean>;
  grid?: boolean;
  units?: "mm" | "in";
}

function b64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = typeof btoa !== "undefined"
    ? btoa(bin)
    : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = typeof atob !== "undefined"
    ? atob(b64)
    : Buffer.from(b64, "base64").toString("binary");
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Encode a view state to a compact URL-safe string. */
export function encodeViewState(state: ViewState): string {
  return b64UrlEncode(JSON.stringify(state));
}

/** Decode a view state string; returns null if malformed. */
export function decodeViewState(encoded: string): ViewState | null {
  try {
    const parsed = JSON.parse(b64UrlDecode(encoded));
    if (parsed && parsed.v === 1 && (parsed.side === "top" || parsed.side === "bottom") && parsed.cam) {
      return parsed as ViewState;
    }
    return null;
  } catch {
    return null;
  }
}
