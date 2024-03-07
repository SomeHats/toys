import { GLPointerType } from "@/gestureland/types";

export const POINTER_SENSITIVITY_PX = {
    mouse: 8,
    pen: 8,
    touch: 16,
} as const satisfies Record<GLPointerType, number>;

export const EXPIRE_POINTER_AFTER_MS = 1000;

export const MAX_TIME_BETWEEN_MULTI_TAP_MS = 200;
export const MAX_DISTANCE_FOR_MULTI_TAP_MS = 40;
