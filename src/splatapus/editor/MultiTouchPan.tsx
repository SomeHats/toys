import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { PointerEventContext } from "@/splatapus/editor/EventContext";
import { ViewportState } from "@/splatapus/editor/Viewport";
import { PointerEvent } from "react";

type ActivePointer = {
    id: number;
    startScreenPosition: Vector2;
    currentScreenPosition: Vector2;
    startEvent: PointerEvent;
};

export type MultiTouchPanState =
    | {
          type: "idle";
      }
    | {
          type: "oneFingerDown";
          pointerA: ActivePointer;
      }
    | {
          type: "bothFingersDown";
          pointerA: ActivePointer;
          pointerB: ActivePointer;
          initialViewportState: ViewportState;
      };

export class MultiTouchPan {
    private state: MultiTouchPanState = { type: "idle" };

    onPointerDown(ctx: PointerEventContext): PointerEventContext | null {
        const { event, splatapus } = ctx;
        switch (this.state.type) {
            case "idle":
                this.state = {
                    type: "oneFingerDown",
                    pointerA: {
                        id: event.pointerId,
                        startScreenPosition: Vector2.fromEvent(event),
                        currentScreenPosition: Vector2.fromEvent(event),
                        startEvent: event,
                    },
                };
                return ctx;
            case "oneFingerDown":
                this.state = {
                    type: "bothFingersDown",
                    pointerA: this.state.pointerA,
                    pointerB: {
                        id: event.pointerId,
                        startScreenPosition: Vector2.fromEvent(event),
                        currentScreenPosition: Vector2.fromEvent(event),
                        startEvent: event,
                    },
                    initialViewportState: splatapus.viewport.state.getOnce(),
                };
                // we're now doing a proper pan gesture, so cancel
                // any down stream gestures that might have been
                // detected from the initial pointerdown:
                return {
                    splatapus,
                    eventType: "cancel",
                    event: this.state.pointerA.startEvent,
                };
            case "bothFingersDown":
                return ctx;
            default:
                throw exhaustiveSwitchError(this.state);
        }
    }
    onPointerMove(ctx: PointerEventContext): PointerEventContext | null {
        const { event, splatapus } = ctx;
        switch (this.state.type) {
            case "idle":
                return ctx;
            case "oneFingerDown":
                if (this.state.pointerA.id === event.pointerId) {
                    this.state.pointerA.currentScreenPosition =
                        Vector2.fromEvent(event);
                }
                return ctx;
            case "bothFingersDown":
                if (
                    event.pointerId === this.state.pointerA.id ||
                    event.pointerId === this.state.pointerB.id
                ) {
                    const pointerAScreenPosition =
                        event.pointerId === this.state.pointerA.id ?
                            Vector2.fromEvent(event)
                        :   this.state.pointerA.currentScreenPosition;
                    const pointerBScreenPosition =
                        event.pointerId === this.state.pointerB.id ?
                            Vector2.fromEvent(event)
                        :   this.state.pointerB.currentScreenPosition;

                    const initialScreenDistance =
                        this.state.pointerA.startScreenPosition.distanceTo(
                            this.state.pointerB.startScreenPosition,
                        );
                    const currentScreenDistance =
                        pointerAScreenPosition.distanceTo(
                            pointerBScreenPosition,
                        );
                    const scaleChange =
                        currentScreenDistance / initialScreenDistance;

                    const initialScreenCenterPoint =
                        this.state.pointerA.startScreenPosition.lerp(
                            this.state.pointerB.startScreenPosition,
                            0.5,
                        );
                    const currentScreenCenterPoint =
                        pointerAScreenPosition.lerp(
                            pointerBScreenPosition,
                            0.5,
                        );

                    const newPan = initialScreenCenterPoint
                        .add(this.state.initialViewportState.pan)
                        .scale(scaleChange)
                        .sub(currentScreenCenterPoint);

                    splatapus.viewport.state.update({
                        zoom:
                            this.state.initialViewportState.zoom * scaleChange,
                        pan: newPan,
                    });

                    this.state.pointerA.currentScreenPosition =
                        pointerAScreenPosition;
                    this.state.pointerB.currentScreenPosition =
                        pointerBScreenPosition;

                    // we're actively handling things, so don't pass-thru
                    return null;
                }
                return ctx;
            default:
                throw exhaustiveSwitchError(this.state);
        }
    }
    onPointerUp(ctx: PointerEventContext): PointerEventContext | null {
        const { event } = ctx;
        switch (this.state.type) {
            case "idle":
                return ctx;
            case "oneFingerDown":
                if (event.pointerId === this.state.pointerA.id) {
                    this.state = { type: "idle" };
                }
                return ctx;
            case "bothFingersDown":
                if (
                    event.pointerId === this.state.pointerA.id ||
                    event.pointerId === this.state.pointerB.id
                ) {
                    this.state = { type: "idle" };
                    return null;
                }
                return ctx;
            default:
                throw exhaustiveSwitchError(this.state);
        }
    }
    onPointerCancel(ctx: PointerEventContext): PointerEventContext | null {
        return this.onPointerUp(ctx);
    }
}
