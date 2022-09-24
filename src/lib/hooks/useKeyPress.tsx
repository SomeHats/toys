import { createContext, useContext, useEffect } from "react";
import { useEvent } from "@/lib/hooks/useEvent";
import { IS_MAC } from "@/lib/utils";
import { Unsubscribe } from "@/lib/EventEmitter";
import { assert } from "@/lib/assert";

export type Key = string;
export type KeyObj = {
    key: Key;
    command?: boolean;
    shift?: boolean;
    alt?: boolean;
};
export type TargetKey = Key | KeyObj;

function isCommandKeyPressed(event: KeyboardEvent): boolean {
    if (IS_MAC) {
        return event.metaKey;
    } else {
        return event.ctrlKey;
    }
}

export function matchesKey(event: KeyboardEvent, key: TargetKey): boolean {
    const target: TargetKey = typeof key === "string" ? { key } : key;
    return (
        event.key.toLowerCase() === target.key.toLowerCase() &&
        (target.command ?? false) === isCommandKeyPressed(event) &&
        (target.shift ?? false) === event.shiftKey &&
        (target.alt ?? false) === event.altKey
    );
}
export function matchesKeyDown(event: KeyboardEvent, key: TargetKey): boolean {
    return matchesKey(event, key) && event.repeat === false;
}

export function useKeyPress(key: TargetKey, cb: (event: KeyboardEvent) => void) {
    useKeyDown((event) => {
        if (matchesKeyDown(event, key)) {
            event.preventDefault();
            cb(event);
            return true;
        }
        return false;
    });
}

export function useKeyDown(cb: (event: KeyboardEvent) => boolean) {
    const keyHandler = useContext(KeyHandlerContext);
    const callback = useEvent(cb);
    useEffect(() => keyHandler.onKeyDown(callback), [callback, keyHandler]);
}

class KeyHandler {
    private handlers = new Set<{ callback: (event: KeyboardEvent) => boolean }>();

    constructor() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    onKeyDown(callback: (event: KeyboardEvent) => boolean): Unsubscribe {
        const handler = { callback };
        this.handlers.add(handler);
        return () => {
            assert(this.handlers.delete(handler), "handler has already been deleted");
        };
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        for (const { callback } of this.handlers) {
            if (callback(e)) {
                return;
            }
        }
    };
}

const KeyHandlerContext = createContext<KeyHandler>(new KeyHandler());
