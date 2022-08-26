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

const defaultState: State = { type: "idle" };

export function useGestureDetector(handlers: {
    onTap?: TapGestureHandler;
    onDragStart?: DragStartGestureHandler;
}) {
    const onTap = useEvent(handlers.onTap ?? defaultTapGestureHandler);
    const onDragStart = useEvent(handlers.onDragStart ?? defaultDragGestureHandler);

    const [state, setState] = useState(defaultState);

    return {
        isGestureInProgress: state.type !== "idle",
        events: useMemo(
            () => ({
                onPointerDown: (event: PointerEvent) => {
                    setState((state) => {
                        switch (state.type) {
                            case "idle": {
                                const dragHandler = onDragStart(event);
                                if (dragHandler.couldBeTap ?? true) {
                                    return {
                                        type: "dragUnconfirmed",
                                        pointerId: event.pointerId,
                                        startPosition: Vector2.fromEvent(event),
                                        dragHandler,
                                    };
                                }
                                return {
                                    type: "dragConfirmed",
                                    pointerId: event.pointerId,
                                    dragHandler,
                                };
                            }
                            case "dragUnconfirmed":
                            case "dragConfirmed":
                                return state;
                            default:
                                exhaustiveSwitchError(state);
                        }
                    });
                },
                onPointerMove: (event: PointerEvent) => {
                    setState((state) => {
                        switch (state.type) {
                            case "idle":
                                return state;
                            case "dragUnconfirmed":
                                if (state.pointerId !== event.pointerId) return state;
                                state.dragHandler.onMove(event);
                                if (
                                    state.startPosition.distanceTo(Vector2.fromEvent(event)) >=
                                    MIN_DRAG_GESTURE_DISTANCE_PX
                                ) {
                                    return {
                                        type: "dragConfirmed",
                                        pointerId: state.pointerId,
                                        dragHandler: state.dragHandler,
                                    };
                                }
                                return state;
                            case "dragConfirmed":
                                if (state.pointerId !== event.pointerId) return state;
                                state.dragHandler.onMove(event);
                                return state;
                            default:
                                exhaustiveSwitchError(state);
                        }
                    });
                },
                onPointerUp: (event: PointerEvent) => {
                    setState((state) => {
                        switch (state.type) {
                            case "idle":
                                return state;
                            case "dragUnconfirmed":
                                if (state.pointerId !== event.pointerId) return state;
                                state.dragHandler.onCancel(event);
                                onTap(event);
                                return { type: "idle" };
                            case "dragConfirmed":
                                if (state.pointerId !== event.pointerId) return state;
                                state.dragHandler.onEnd(event);
                                return { type: "idle" };
                            default:
                                exhaustiveSwitchError(state);
                        }
                    });
                },
                onPointerCancel: (event: PointerEvent) => {
                    setState((state) => {
                        switch (state.type) {
                            case "idle":
                                return state;
                            case "dragUnconfirmed":
                            case "dragConfirmed":
                                if (state.pointerId !== event.pointerId) return state;
                                state.dragHandler.onCancel(event);
                                return { type: "idle" };
                            default:
                                exhaustiveSwitchError(state);
                        }
                    });
                },
            }),
            [onDragStart, onTap],
        ),
    };
}
