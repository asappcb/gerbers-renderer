export interface LoadFromZipOptions {
  boardThicknessMm?: number;
  layerHints?: Record<string, "top_cu" | "bot_cu" | "top_mask" >;
}

export interface Viewer3DOptions {
  canvas: HTMLCanvasElement;
  autoResize?: boolean;
  showSoldermask?: boolean;
  showSilk?: boolean;
  pbr?: boolean;
}

export interface RenderFromZipOptions extends LoadFromZipOptions, Viewer3DOptions {}
