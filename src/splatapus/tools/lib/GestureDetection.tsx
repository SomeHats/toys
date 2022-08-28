import Vector2 from "@/lib/geom/Vector2";
import { applyUpdateWithin, exhaustiveSwitchError } from "@/lib/utils";
import { MIN_DRAG_GESTURE_DISTANCE_PX } from "@/splatapus/constants";
import { PointerEventContext } from "@/splatapus/tools/lib/EventContext";
import { PointerEvent } from "react";

type PointerId = PointerEvent["pointerId"];
type GestureDetectorState<IdleState, ActiveState, StartArg> =
    | {
          readonly state: "idle";
          readonly childState: IdleState;
      }
    | {
          readonly state: "dragUnconfirmed";
          readonly pointerId: PointerId;
          readonly startPosition: Vector2;
          readonly childState: ActiveState;
          readonly startArg: StartArg | undefined;
      }
    | {
          readonly state: "dragConfirmed";
          readonly pointerId: PointerId;
          readonly childState: ActiveState;
          readonly startArg: StartArg | undefined;
      };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GestureType<Gesture> = Gesture extends ReturnType<
    typeof createGestureDetector<infer IdleState, infer ActiveState, infer StartArg>
>
    ? GestureDetectorState<IdleState, ActiveState, StartArg>
    : never;

export function createGestureDetector<
    IdleState,
    ActiveState = IdleState,
    StartArg = undefined,
>(handlers: {
    onTap?: (
        ctx: PointerEventContext,
        state: IdleState,
        startArg: StartArg | undefined,
    ) => IdleState;
    onDragStart: (
        ctx: PointerEventContext,
        state: IdleState,
        startArg: StartArg | undefined,
    ) => ActiveState | null;
    onDragMove: (ctx: PointerEventContext, state: ActiveState) => ActiveState;
    onDragEnd: (ctx: PointerEventContext, state: ActiveState) => IdleState;
    onDragCancel: (ctx: PointerEventContext, state: ActiveState) => IdleState;
}) {
    type Gesture = GestureDetectorState<IdleState, ActiveState, StartArg>;
    const self = {
        initialize: (childState: IdleState): Gesture => ({ state: "idle", childState }),
        isIdle: (gesture: Gesture) => gesture.state === "idle",
        getState: (gesture: Gesture) => gesture.childState,
        onPointerEvent: (
            ctx: PointerEventContext,
            gesture: Gesture,
            startArg?: StartArg,
        ): Gesture => {
            switch (ctx.eventType) {
                case "down":
                    switch (gesture.state) {
                        case "idle": {
                            const nextChildState = handlers.onDragStart(
                                ctx,
                                gesture.childState,
                                startArg,
                            );
                            if (!nextChildState) {
                                return gesture;
                            }
                            ctx.event.preventDefault();
                            if (handlers.onTap) {
                                return {
                                    state: "dragUnconfirmed",
                                    pointerId: ctx.event.pointerId,
                                    startPosition: Vector2.fromEvent(ctx.event),
                                    childState: nextChildState,
                                    startArg,
                                };
                            } else {
                                return {
                                    state: "dragConfirmed",
                                    pointerId: ctx.event.pointerId,
                                    childState: nextChildState,
                                    startArg,
                                };
                            }
                        }
                        case "dragUnconfirmed":
                        case "dragConfirmed":
                            return gesture;
                        default:
                            throw exhaustiveSwitchError(gesture);
                    }
                case "move":
                    switch (gesture.state) {
                        case "idle":
                            return gesture;
                        case "dragUnconfirmed": {
                            if (gesture.pointerId !== ctx.event.pointerId) return gesture;
                            const nextChildState = handlers.onDragMove(ctx, gesture.childState);
                            if (
                                gesture.startPosition.distanceTo(Vector2.fromEvent(ctx.event)) >=
                                MIN_DRAG_GESTURE_DISTANCE_PX
                            ) {
                                return {
                                    state: "dragConfirmed",
                                    pointerId: gesture.pointerId,
                                    childState: nextChildState,
                                    startArg: gesture.startArg,
                                };
                            }
                            if (Object.is(gesture.childState, nextChildState)) {
                                return gesture;
                            }
                            return { ...gesture, childState: nextChildState };
                        }
                        case "dragConfirmed": {
                            if (gesture.pointerId !== ctx.event.pointerId) return gesture;
                            const nextChildState = handlers.onDragMove(ctx, gesture.childState);
                            if (Object.is(gesture.childState, nextChildState)) {
                                return gesture;
                            }
                            return { ...gesture, childState: nextChildState };
                        }
                        default:
                            throw exhaustiveSwitchError(gesture);
                    }
                case "up":
                    switch (gesture.state) {
                        case "idle":
                            return gesture;
                        case "dragUnconfirmed": {
                            if (gesture.pointerId !== ctx.event.pointerId) return gesture;
                            let nextChildState = handlers.onDragCancel(ctx, gesture.childState);
                            nextChildState = handlers.onTap
                                ? handlers.onTap(ctx, nextChildState, gesture.startArg)
                                : nextChildState;
                            return { state: "idle", childState: nextChildState };
                        }
                        case "dragConfirmed": {
                            if (gesture.pointerId !== ctx.event.pointerId) return gesture;
                            const nextChildState = handlers.onDragEnd(ctx, gesture.childState);
                            return { state: "idle", childState: nextChildState };
                        }
                        default:
                            throw exhaustiveSwitchError(gesture);
                    }
                case "cancel":
                    switch (gesture.state) {
                        case "idle":
                            return gesture;
                        case "dragUnconfirmed":
                        case "dragConfirmed": {
                            if (gesture.pointerId !== ctx.event.pointerId) return gesture;
                            const nextChildState = handlers.onDragCancel(ctx, gesture.childState);
                            return { state: "idle", childState: nextChildState };
                        }
                        default:
                            throw exhaustiveSwitchError(gesture);
                    }
                default:
                    exhaustiveSwitchError(ctx.eventType);
            }
        },
        createOnPointerEvent:
            <Key extends string, T extends Record<Key, Gesture>>(key: Key) =>
            (ctx: PointerEventContext, wrapper: T, startArg?: StartArg): T =>
                applyUpdateWithin(
                    wrapper,
                    key,
                    (gesture) => self.onPointerEvent(ctx, gesture, startArg) as T[Key],
                ),
    };
    return self;
}
