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

export class SplatapusGestureDetector<Args extends Array<unknown> = []> {
    readonly isDragging = new LiveValue(false);

    private readonly gesture: GestureDetector<[splatapus: Splatapus, ...args: Args]>;

    constructor({
        onTap,
        onDragStart,
    }: {
        onTap?: TapGestureHandler<[splatapus: Splatapus, ...args: Args]>;
        onDragStart?: DragStartGestureHandler<[splatapus: Splatapus, ...args: Args]>;
    }) {
        const dragStart = onDragStart ?? defaultDragGestureHandler;
        this.gesture = new GestureDetector({
            onTap,
            onDragStart: (event, splatapus, ...args) => {
                const handler = dragStart(event, splatapus, ...args);
                if (!handler) {
                    return null;
                }
                this.isDragging.update(true);
                return {
                    couldBeTap: handler.couldBeTap,
                    onMove: handler.onMove,
                    onEnd: (event) => {
                        this.isDragging.update(false);
                        return handler.onEnd(event);
                    },
                    onCancel: (event) => {
                        this.isDragging.update(false);
                        return handler.onCancel(event);
                    },
                };
            },
        });
    }
    onPointerEvent(ctx: PointerEventContext, ...args: Args) {
        switch (ctx.eventType) {
            case "down":
                return this.gesture.onPointerDown(ctx.event, ctx.splatapus, ...args);
            case "move":
                return this.gesture.onPointerMove(ctx.event);
            case "up":
                return this.gesture.onPointerUp(ctx.event);
            case "cancel":
                return this.gesture.onPointerCancel(ctx.event);
            default:
                exhaustiveSwitchError(ctx.eventType);
        }
    }

    end() {
        this.gesture.end();
    }

    cancel() {
        this.gesture.end();
    }
}
