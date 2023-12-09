import { Vector2 } from "@/lib/geom/Vector2";
import { StrokeOptions } from "@/splatapus/model/perfectFreehand";

const LIME_SLIDE_WIDTH_PX = 1080;
const LIME_SLIDE_HEIGHT_PX = LIME_SLIDE_WIDTH_PX / (16 / 9);
export const LIME_SLIDE_SIZE_PX = new Vector2(
    LIME_SLIDE_WIDTH_PX,
    LIME_SLIDE_HEIGHT_PX,
);
export const LIME_SLIDE_PADDING_PX = new Vector2(32, 32);

export const LIME_SIDEBAR_WIDTH_PX = 200;

export const LIME_FREEHAND: Partial<StrokeOptions> = {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    last: true,
};
