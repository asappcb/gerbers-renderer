export declare class GerberError extends Error {
    code: "NOT_AN_ARCHIVE" | "UNSUPPORTED_ARCHIVE" | "NOT_GERBER" | "MISSING_LAYERS" | "PARSE_ERROR";
    details?: unknown;
    constructor(code: GerberError["code"], message: string, details?: unknown);
}
