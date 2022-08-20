import { StrokeOptions } from "@/splatapus/perfectFreehand";

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
