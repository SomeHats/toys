import { Gestureland } from "@/gestureland/Gestureland";
import { Vector2 } from "@/lib/geom/Vector2";

export type GLPointerType = "mouse" | "pen" | "touch";

export type GLGestureType = "drag" | "twoFingerDrag" | "tap" | "doubleTap";

export interface GLTarget {
    readonly id: string;

    index: number;

    distanceTo(point: Vector2): number;

    onDrag?(event: GLPointerEvent): GLDragGesture;
    onTwoFingerDrag?(event: GLPointerEvent): GLDragGesture;

    onTap?(event: GLPointerEvent): GLTapGesture;
    onDoubleTap?(event: GLPointerEvent): GLTapGesture;
}

export interface GLDragGesture {
    onUpdate: (event: GLPointerEvent) => void;
    onEnd?: (event: GLPointerEvent) => void;
    onCancel: (event: GLPointerEvent) => void;
}

export interface GLTwoFingerDragGesture {
    onUpdate: (event: GLPointerEvent) => void;
    onEnd?: (event: GLPointerEvent) => void;
    onCancel: (event: GLPointerEvent) => void;
}

export interface GLTapGesture {
    onConfirm?: (event: GLPointerEvent) => void;
    onCancel: (event: GLPointerEvent) => void;
}

export type GLTargetFn = (editor: Gestureland) => null | GLTarget | GLTarget[];

export type GLPointerId = number;

export interface GLPointer {
    readonly pointerId: GLPointerId;
    readonly viewportPosition: Vector2;
    readonly isDown: boolean;
    readonly type: GLPointerType;
    readonly state: PointerState;
    readonly lastUpdatedAt: number;
}

export interface GLPointerEvent extends Omit<GLPointer, "state"> {
    readonly pagePosition: Vector2;
}

export interface IdlePointerState {
    readonly type: "idle";
}
// export interface DownPointerState {
//     readonly type: "down";
//     readonly drag: { target: GLTarget; gesture: GLDragGesture } | null;
// }
// export interface DraggingPointerState {
//     readonly type: 'dragging';
//     readonly target: GLTarget
//     readonly gesture: GLDragGesture
// }

export interface DragPointerState {
    readonly type: "drag";
    readonly isConfirmed: boolean;
    readonly target: GLTarget;
    readonly drag: GLDragGesture;
}

export type PointerState = IdlePointerState | DragPointerState;
