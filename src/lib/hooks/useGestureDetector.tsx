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
) => DragGestureHandler<Args>;
export type DragGestureHandler<Args extends ReadonlyArray<unknown> = []> = {
    couldBeTap: boolean;
    onCancel: (event: PointerEvent, ...args: Args) => void;
    onMove: (event: PointerEvent, ...args: Args) => void;
    onEnd: (event: PointerEvent, ...args: Args) => void;
};

export const defaultTapGestureHandler: TapGestureHandler<Array<unknown>> = noop;
export const defaultDragGestureHandler: DragStartGestureHandler<Array<unknown>> = () => ({
    couldBeTap: true,
    onCancel: noop,
    onMove: noop,
    onEnd: noop,
});

type State<Args extends ReadonlyArray<unknown>> =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "dragUnconfirmed";
          readonly pointerId: PointerId;
          readonly startPosition: Vector2;
          readonly dragHandler: DragGestureHandler<Args>;
      }
    | {
          readonly type: "dragConfirmed";
          readonly pointerId: PointerId;
          readonly dragHandler: DragGestureHandler<Args>;
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
                if (dragHandler.couldBeTap ?? true) {
                    this.state = {
                        type: "dragUnconfirmed",
                        pointerId: event.pointerId,
                        startPosition: Vector2.fromEvent(event),
                        dragHandler,
                    };
                } else {
                    this.state = {
                        type: "dragConfirmed",
                        pointerId: event.pointerId,
                        dragHandler,
                    };
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

    onPointerMove(event: PointerEvent, ...args: Args) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onMove(event, ...args);
                if (
                    this.state.startPosition.distanceTo(Vector2.fromEvent(event)) >=
                    MIN_DRAG_GESTURE_DISTANCE_PX
                ) {
                    this.state = {
                        type: "dragConfirmed",
                        pointerId: this.state.pointerId,
                        dragHandler: this.state.dragHandler,
                    };
                }
                return;
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onMove(event, ...args);
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerUp(event: PointerEvent, ...args: Args) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onCancel(event, ...args);
                this.onTap(event, ...args);
                this.state = { type: "idle" };
                return;
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onEnd(event, ...args);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerCancel(event: PointerEvent, ...args: Args) {
        this.lastEvent = event;
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onCancel(event, ...args);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    cancel(...args: Args) {
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
            case "dragConfirmed":
                this.state.dragHandler.onCancel(assertExists(this.lastEvent), ...args);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }
    end(...args: Args) {
        const event = assertExists(this.lastEvent);
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                this.state.dragHandler.onCancel(event, ...args);
                this.onTap(event, ...args);
                this.state = { type: "idle" };
                return;
            case "dragConfirmed":
                this.state.dragHandler.onEnd(event, ...args);
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
