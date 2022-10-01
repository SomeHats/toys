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
