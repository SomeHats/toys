import Vector2 from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { exhaustiveSwitchError, noop } from "@/lib/utils";
import { PointerEvent, useMemo, useState } from "react";

const MIN_DRAG_GESTURE_DISTANCE_PX = 10;

type PointerId = PointerEvent["pointerId"];

export type TapGestureHandler = (event: PointerEvent) => void;
export type DragStartGestureHandler = (event: PointerEvent) => DragGestureHandler;
export type DragGestureHandler = {
    couldBeTap: boolean;
    onCancel: (event: PointerEvent) => void;
    onMove: (event: PointerEvent) => void;
    onEnd: (event: PointerEvent) => void;
};

const defaultTapGestureHandler: TapGestureHandler = noop;
const defaultDragGestureHandler: DragStartGestureHandler = () => ({
    couldBeTap: true,
    onCancel: noop,
    onMove: noop,
    onEnd: noop,
});

type State =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "dragUnconfirmed";
          readonly pointerId: PointerId;
          readonly startPosition: Vector2;
          readonly dragHandler: DragGestureHandler;
      }
    | {
          readonly type: "dragConfirmed";
          readonly pointerId: PointerId;
          readonly dragHandler: DragGestureHandler;
      };

export class GestureDetector {
    private state: State = { type: "idle" };

    constructor(
        private readonly onTap = defaultTapGestureHandler,
        private readonly onDragStart = defaultDragGestureHandler,
    ) {}

    isGestureInProgress() {
        return this.state.type !== "idle";
    }

    onPointerDown(event: PointerEvent) {
        switch (this.state.type) {
            case "idle": {
                const dragHandler = this.onDragStart(event);
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

    onPointerMove(event: PointerEvent) {
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
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onCancel(event);
                this.onTap(event);
                this.state = { type: "idle" };
                return;
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onEnd(event);
                this.state = { type: "idle" };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onPointerCancel(event: PointerEvent) {
        switch (this.state.type) {
            case "idle":
                return;
            case "dragUnconfirmed":
            case "dragConfirmed":
                if (this.state.pointerId !== event.pointerId) return;
                this.state.dragHandler.onCancel(event);
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

    const [detector] = useState(() => new GestureDetector(onTap, onDragStart));
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
