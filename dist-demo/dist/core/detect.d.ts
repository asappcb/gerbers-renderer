import { GerberDetectResult } from './types';
export declare function detectGerberBundle(input: ArrayBuffer | Uint8Array | Record<string, Uint8Array>): Promise<GerberDetectResult>;
