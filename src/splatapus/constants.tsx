import { StrokeOptions } from "@/splatapus/perfectFreehand";

export const LOAD_FROM_AUTOSAVE_ENABLED = true;
export const UNDO_ACTIONS = 30;
export const AUTOSAVE_DEBOUNCE_TIME_MS = 500;
export const USE_REACT_STRICT_MODE = false;

export const MIN_DRAG_GESTURE_DISTANCE_PX = 10;

export const perfectFreehandOpts: Required<StrokeOptions> = {
    size: 16,
    streamline: 0.5,
    smoothing: 0.5,
    thinning: 0.5,
    simulatePressure: true,
    easing: (t) => t,
    start: {},
    end: {},
    last: false,
};
