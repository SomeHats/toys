import { Splatapus } from "@/splatapus/editor/useEditor";
import { PointerEvent } from "react";

export interface EventContext<Event> {
    splatapus: Splatapus;
    event: Event;
}

export type PointerEventType = "down" | "move" | "up" | "cancel";
export interface PointerEventContext extends EventContext<PointerEvent> {
    eventType: PointerEventType;
}

export type KeyboardEventContext = EventContext<KeyboardEvent>;
