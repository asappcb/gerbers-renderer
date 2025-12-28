import { BoardViewer } from './types';
export type BoardViewerOptions = {
    onDownload?: () => void;
};
export declare function createBoardViewer(host: HTMLElement, opts?: BoardViewerOptions): BoardViewer;
