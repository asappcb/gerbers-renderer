/**
 * A single entry inside the unzipped gerbers.zip
 */
export interface ZipEntry {
    /** Normalized path style name, always forward slashes */
    name: string;
    /** Read entry as UTF-8 text */
    text: () => Promise<string>;
    /** Read entry as ArrayBuffer */
    arrayBuffer: () => Promise<ArrayBuffer>;
}
/**
 * Accepts a File, Blob, or ArrayBuffer and returns a list of ZipEntry helpers.
 */
export declare function unzipGerbersZip(input: File | Blob | ArrayBuffer): Promise<ZipEntry[]>;
