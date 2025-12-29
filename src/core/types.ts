// src/core/types.ts

export type GerberBundleType =
  | "zip"
  | "rar"
  | "7z"
  | "tar"
  | "directory"
  | "single-file"
  | "unknown";

export type GerberDetectResult = {
  isGerber: boolean;
  archiveType: GerberBundleType;
  confidence: number; // 0..1
  reasons: string[];
  files?: string[];
};

export type ListedLayer = {
  filename: string;
  type: "copper" | "mask" | "silk" | "drill" | "outline" | "unknown";
  side?: "top" | "bottom" | "inner";
};

export type GerberFileListResult = {
  layers: ListedLayer[];
  boardOutlinePresent: boolean;
  drillPresent: boolean;
};
