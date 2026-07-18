type ArchiveInit = {
    workerUrl?: string;
};
export type UnpackResult = {
    archiveType: "zip" | "rar" | "single-file";
    files: Record<string, Uint8Array>;
};
export declare function unpackGerberArchive(input: ArrayBuffer | Uint8Array, init?: ArchiveInit): Promise<UnpackResult>;
export {};
