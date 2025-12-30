import { Marker } from './core/renderContract';
export type ViewerEvents = {
    "hover:marker": {
        markerId: string | null;
        marker?: Marker;
    };
    "select:marker": {
        markerId: string | null;
        marker?: Marker;
    };
    "click:board": {
        x_mm: number;
        y_mm: number;
    };
    "view:change": {
        center_mm: {
            x: number;
            y: number;
        };
        zoom: number;
        rotation_rad: number;
    };
};
