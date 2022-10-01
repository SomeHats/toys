import {
    defaultDragGestureHandler,
    DragStartGestureHandler,
    GestureDetector,
    TapGestureHandler,
} from "@/lib/hooks/useGestureDetector";
import { LiveValue } from "@/lib/live";
import { exhaustiveSwitchError } from "@/lib/utils";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { PointerEvent } from "react";

export interface EventContext<Event> {
    readonly splatapus: Splatapus;
    readonly event: Event;
}

export type PointerEventType = "down" | "move" | "up" | "cancel";
export interface PointerEventContext<Type extends PointerEventType = PointerEventType>
    extends EventContext<PointerEvent> {
    readonly eventType: Type;
}

export type KeyboardEventContext = EventContext<KeyboardEvent>;

export function applyPointerEvent<T>(
    obj: {
        onPointerDown(ctx: PointerEventContext<"down">): T;
        onPointerMove(ctx: PointerEventContext<"move">): T;
        onPointerUp(ctx: PointerEventContext<"up">): T;
        onPointerCancel(ctx: PointerEventContext<"cancel">): T;
    },
    ctx: PointerEventContext,
): T {
    switch (ctx.eventType) {
        case "down":
            return obj.onPointerDown(ctx as PointerEventContext<"down">);
        case "move":
            return obj.onPointerMove(ctx as PointerEventContext<"move">);
        case "up":
            return obj.onPointerUp(ctx as PointerEventContext<"up">);
        case "cancel":
            return obj.onPointerCancel(ctx as PointerEventContext<"cancel">);
        default:
            exhaustiveSwitchError(ctx.eventType);
    }
}

export class SplatapusGestureDetector extends GestureDetector<[splatapus: Splatapus]> {
    readonly isDragging = new LiveValue(false);

    constructor({
        onTap,
        onDragStart,
    }: {
        onTap?: TapGestureHandler<[splatapus: Splatapus]>;
        onDragStart?: DragStartGestureHandler<[splatapus: Splatapus]>;
    }) {
        const dragStart = onDragStart ?? defaultDragGestureHandler;
        super({
            onTap,
            onDragStart: (event, splatapus) => {
                this.isDragging.update(true);
                const handler = dragStart(event, splatapus);
                return {
                    couldBeTap: handler.couldBeTap,
                    onMove: handler.onMove,
                    onEnd: (event, ctx) => {
                        this.isDragging.update(false);
                        return handler.onEnd(event, splatapus);
                    },
                    onCancel: (event, ctx) => {
                        this.isDragging.update(false);
                        return handler.onCancel(event, splatapus);
                    },
                };
            },
        });
    }
    onPointerEvent(ctx: PointerEventContext) {
        switch (ctx.eventType) {
            case "down":
                return this.onPointerDown(ctx.event, ctx.splatapus);
            case "move":
                return this.onPointerMove(ctx.event, ctx.splatapus);
            case "up":
                return this.onPointerUp(ctx.event, ctx.splatapus);
            case "cancel":
                return this.onPointerCancel(ctx.event, ctx.splatapus);
            default:
                exhaustiveSwitchError(ctx.eventType);
        }
    }
}
