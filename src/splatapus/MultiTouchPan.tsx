import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { PointerEventContext } from "@/splatapus/tools/lib/EventContext";
import { PointerEvent } from "react";

type ActivePointer = {
    readonly id: number;
    readonly startScreenPosition: Vector2;
    readonly currentScreenPosition: Vector2;
    readonly startEvent: PointerEvent;
};

export type MultiTouchPan =
    | {
          readonly state: "idle";
      }
    | {
          readonly state: "oneFingerDown";
          readonly pointerA: ActivePointer;
      }
    | {
          readonly state: "bothFingersDown";
          readonly pointerA: ActivePointer;
          readonly pointerB: ActivePointer;
          readonly initialPan: Vector2;
          readonly initialZoom: number;
      };

export const MultiTouchPan = {
    initialize(): MultiTouchPan {
        return { state: "idle" };
    },
    onPointerEvent(
        ctx: PointerEventContext,
        pan: MultiTouchPan,
    ): { pan: MultiTouchPan; passthroughContext: PointerEventContext | null } {
        switch (ctx.eventType) {
            case "down":
                switch (pan.state) {
                    case "idle":
                        return {
                            pan: {
                                state: "oneFingerDown",
                                pointerA: {
                                    id: ctx.event.pointerId,
                                    startScreenPosition: Vector2.fromEvent(ctx.event),
                                    currentScreenPosition: Vector2.fromEvent(ctx.event),
                                    startEvent: ctx.event,
                                },
                            },
                            passthroughContext: ctx,
                        };
                    case "oneFingerDown":
                        return {
                            pan: {
                                state: "bothFingersDown",
                                pointerA: pan.pointerA,
                                pointerB: {
                                    id: ctx.event.pointerId,
                                    startScreenPosition: Vector2.fromEvent(ctx.event),
                                    currentScreenPosition: Vector2.fromEvent(ctx.event),
                                    startEvent: ctx.event,
                                },
                                initialPan: ctx.viewport.pan,
                                initialZoom: ctx.viewport.zoom,
                            },
                            // we're now doing a proper pan gesture, so cancel
                            // any down stream gestures that might have been
                            // detected from the initial pointerdown:
                            passthroughContext: {
                                ...ctx,
                                eventType: "cancel",
                                event: pan.pointerA.startEvent,
                            },
                        };
                    case "bothFingersDown":
                        return { pan, passthroughContext: ctx };
                    default:
                        throw exhaustiveSwitchError(pan);
                }
            case "move":
                switch (pan.state) {
                    case "idle":
                        return { pan, passthroughContext: ctx };
                    case "oneFingerDown":
                        if (pan.pointerA.id === ctx.event.pointerId) {
                            return {
                                pan: {
                                    ...pan,
                                    pointerA: {
                                        ...pan.pointerA,
                                        currentScreenPosition: Vector2.fromEvent(ctx.event),
                                    },
                                },
                                passthroughContext: ctx,
                            };
                        }
                        return { pan, passthroughContext: ctx };
                    case "bothFingersDown":
                        if (
                            ctx.event.pointerId === pan.pointerA.id ||
                            ctx.event.pointerId === pan.pointerB.id
                        ) {
                            const pointerAScreenPosition =
                                ctx.event.pointerId === pan.pointerA.id
                                    ? Vector2.fromEvent(ctx.event)
                                    : pan.pointerA.currentScreenPosition;
                            const pointerBScreenPosition =
                                ctx.event.pointerId === pan.pointerB.id
                                    ? Vector2.fromEvent(ctx.event)
                                    : pan.pointerB.currentScreenPosition;

                            const initialScreenDistance =
                                pan.pointerA.startScreenPosition.distanceTo(
                                    pan.pointerB.startScreenPosition,
                                );
                            const currentScreenDistance =
                                pointerAScreenPosition.distanceTo(pointerBScreenPosition);
                            const scaleChange = currentScreenDistance / initialScreenDistance;

                            const initialScreenCenterPoint = pan.pointerA.startScreenPosition.lerp(
                                pan.pointerB.startScreenPosition,
                                0.5,
                            );
                            const currentScreenCenterPoint = pointerAScreenPosition.lerp(
                                pointerBScreenPosition,
                                0.5,
                            );

                            ctx.updateViewport(() => {
                                const newPan = initialScreenCenterPoint
                                    .add(pan.initialPan)
                                    .scale(scaleChange)
                                    .sub(currentScreenCenterPoint);

                                return { zoom: pan.initialZoom * scaleChange, pan: newPan };
                            });

                            return {
                                pan: {
                                    ...pan,
                                    pointerA: {
                                        ...pan.pointerA,
                                        currentScreenPosition: pointerAScreenPosition,
                                    },
                                    pointerB: {
                                        ...pan.pointerB,
                                        currentScreenPosition: pointerBScreenPosition,
                                    },
                                },
                                passthroughContext: null,
                            };
                        }
                        return { pan, passthroughContext: ctx };
                    default:
                        throw exhaustiveSwitchError(pan);
                }
            case "up":
            case "cancel":
                switch (pan.state) {
                    case "idle":
                        return { pan, passthroughContext: ctx };
                    case "oneFingerDown":
                        if (ctx.event.pointerId === pan.pointerA.id) {
                            return { pan: { state: "idle" }, passthroughContext: ctx };
                        }
                        return { pan, passthroughContext: ctx };
                    case "bothFingersDown":
                        if (
                            ctx.event.pointerId === pan.pointerA.id ||
                            ctx.event.pointerId === pan.pointerB.id
                        ) {
                            return { pan: { state: "idle" }, passthroughContext: null };
                        }
                        return { pan, passthroughContext: ctx };
                    default:
                        throw exhaustiveSwitchError(pan);
                }
            default:
                exhaustiveSwitchError(ctx.eventType);
        }
    },
};
