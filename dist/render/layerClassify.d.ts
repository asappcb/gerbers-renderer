export type Classified = Partial<{
    top_copper: string;
    bottom_copper: string;
    top_mask: string;
    bottom_mask: string;
    top_silk: string;
    bottom_silk: string;
    /** All drill files found (supports multiple, e.g. Altium PTH + slots) */
    drills: string[];
    outline: string;
}>;
export declare function classifyLayerNames(names: string[]): Classified;
