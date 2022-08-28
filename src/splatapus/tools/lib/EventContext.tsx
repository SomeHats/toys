import { ReducerCtx } from "@/splatapus/useEditorState";
import { PointerEvent } from "react";

export interface EventContext<Event> extends ReducerCtx {
    event: Event;
}

export type PointerEventType = "down" | "move" | "up" | "cancel";
export interface PointerEventContext extends EventContext<PointerEvent> {
    eventType: PointerEventType;
}

export type KeyboardEventContext = EventContext<KeyboardEvent>;
