import { assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { exhaustiveSwitchError, noop } from "@/lib/utils";
import { PointerEvent, useMemo, useState } from "react";

const MIN_DRAG_GESTURE_DISTANCE_PX = 10;

type PointerId = PointerEvent["pointerId"];

export type TapGestureHandler<Args extends ReadonlyArray<unknown> = []> = (
    event: PointerEvent,
    ...args: Args
) => void;
export type DragStartGestureHandler<Args extends ReadonlyArray<unknown> = []> = (
    event: PointerEvent,
    ...args: Args
) => DragGestureHandler | null;
export type DragGestureHandler = {
    couldBeTap: boolean;
    pointerCapture: boolean;
    onCancel: (event: PointerEvent) => void;
    onMove: (event: PointerEvent) => void;
    onEnd: (event: PointerEvent) => void;
    onConfirm?: (event: PointerEvent) => void;
};

export const defaultTapGestureHandler: TapGestureHandler<Array<unknown>> = noop;
export const defaultDragGestureHandler: DragStartGestureHandler<Array<unknown>> = () => null;

type State<Args extends ReadonlyArray<unknown>> =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "dragUnconfirmed";
          readonly pointerId: PointerId;
          readonly startPosition: Vector2;
          readonly dragHandler: DragGestureHandler;
          readonly args: Args;
      }
    | {
          readonly type: "dragConfirmed";
          readonly pointerId: PointerId;
          readonly dragHandler: DragGestureHandler;
      };

export class GestureDetector<Args extends Array<unknown> = []> {
    private state: State<Args> = { type: "idle" };
    private readonly onTap: TapGestureHandler<Args>;
    private readonly onDragStart: DragStartGestureHandler<Args>;
    private lastEvent: PointerEvent | null = null;

    constructor({
        onTap = defaultTapGestureHandler,
        onDragStart = defaultDragGestureHandler,
    }: {
        onTap?: TapGestureHandler<Args>;
        onDragStart?: DragStartGestureHandler<Args>;
    }) {
        this.onTap = onTap;
        this.onDragStart = onDragStart;
    }

    isGestureInProgress() {
        return this.state.type !== "idle";
    }

    onPointerDown(event: PointerEvent, ...args: Args) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle": {
                const dragHandler = this.onDragStart(event, ...args);
                if (!dragHandler) {
                    return;
                }
                if (dragHandler.pointerCapture) {
                    event.currentTarget.setPointerCapture(event.pointerId);
                }
                if (dragHandler.couldBeTap ?? true) {
                    this.state = {
                        type: "dragUnconfirmed",
                        pointerId: event.pointerId,
                        startPosition: Vector2.fromEvent(event),
                        dragHandler,
                        args,
                    };
                } else {
                    this.state = {
                        type: "dragConfirmed",
                        pointerId: event.pointerId,
                        dragHandler,
                    };
                    dragHandler.onConfirm?.(event);
                }
                return;
            }
            case "dragUnconfirmed":
            case "dragConfirmed":
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerMove(event: PointerEvent) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onMove(event);
                if (
                    this.state.startPosition.distanceTo(Vector2.fromEvent(event)) >=
                    MIN_DRAG_GESTURE_DISTANCE_PX
                ) {
                    this.state.dragHandler.onConfirm?.(event);
                    this.state = {
                        type: "dragConfirmed",
                        pointerId: this.state.pointerId,
                        dragHandler: this.state.dragHandler,
                    };
                }
                return;
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onMove(event);
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerUp(event: PointerEvent) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                if (this.state.dragHandler.pointerCapture) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                this.state.dragHandler.onCancel(event);
                this.onTap(event, ...this.state.args);
                this.state = { type: "idle" };
                return;
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                if (this.state.dragHandler.pointerCapture) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                this.state.dragHandler.onEnd(event);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerCancel(event: PointerEvent) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                if (this.state.dragHandler.pointerCapture) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                this.state.dragHandler.onCancel(event);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    cancel() {
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
            case "dragConfirmed":
                this.state.dragHandler.onCancel(assertExists(this.lastEvent));
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }
    end() {
        const event = assertExists(this.lastEvent);
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                this.state.dragHandler.onCancel(event);
                this.onTap(event, ...this.state.args);
                this.state = { type: "idle" };
                return;
            case "dragConfirmed":
                this.state.dragHandler.onEnd(event);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }
}

export function useGestureDetector(handlers: {
    onTap?: TapGestureHandler;
    onDragStart?: DragStartGestureHandler;
}) {
    const onTap = useEvent(handlers.onTap ?? defaultTapGestureHandler);
    const onDragStart = useEvent(handlers.onDragStart ?? defaultDragGestureHandler);

    const [detector] = useState(() => new GestureDetector({ onTap, onDragStart }));
    const [isGestureInProgress, setIsGestureInProgress] = useState(false);

    return {
        isGestureInProgress,
        events: useMemo(
            () => ({
                onPointerDown: (event: PointerEvent) => {
                    detector.onPointerDown(event);
                    setIsGestureInProgress(detector.isGestureInProgress());
                },
                onPointerMove: (event: PointerEvent) => {
                    detector.onPointerMove(event);
                    setIsGestureInProgress(detector.isGestureInProgress());
                },
                onPointerUp: (event: PointerEvent) => {
                    detector.onPointerUp(event);
                    setIsGestureInProgress(detector.isGestureInProgress());
                },
                onPointerCancel: (event: PointerEvent) => {
                    detector.onPointerCancel(event);
                    setIsGestureInProgress(detector.isGestureInProgress());
                },
            }),
            [detector],
        ),
    };
}
