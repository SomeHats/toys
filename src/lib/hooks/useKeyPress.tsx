import { Unsubscribe } from "@/lib/EventEmitter";
import { assert } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { IS_MAC } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

export const ANY = Symbol();

export type Key = string;
export interface KeyObj {
    key: Key;
    command?: boolean | typeof ANY;
    shift?: boolean | typeof ANY;
    alt?: boolean | typeof ANY;
}
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
        (target.command === ANY ||
            (target.command ?? false) === isCommandKeyPressed(event)) &&
        (target.shift === ANY || (target.shift ?? false) === event.shiftKey) &&
        (target.alt === ANY || (target.alt ?? false) === event.altKey)
    );
}
export function matchesKeyDown(event: KeyboardEvent, key: TargetKey): boolean {
    return matchesKey(event, key) && event.repeat === false;
}

export function useKeyPress(
    key: TargetKey,
    cb: (event: KeyboardEvent) => void,
) {
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
export function useKeyUp(cb: (event: KeyboardEvent) => boolean) {
    const keyHandler = useContext(KeyHandlerContext);
    const callback = useEvent(cb);
    useEffect(() => keyHandler.onKeyUp(callback), [callback, keyHandler]);
}

export function useIsKeyDown(key: TargetKey): boolean {
    const [isDown, setIsDown] = useState(false);
    useKeyDown((event) => {
        console.log(event.key);
        if (matchesKey(event, key)) {
            setIsDown(true);
            return true;
        }
        return false;
    });
    useKeyUp((event) => {
        if (matchesKey(event, key)) {
            setIsDown(false);
            return true;
        }
        return false;
    });
    return isDown;
}

class KeyHandler {
    private handlers = new Set<{
        type: "down" | "up";
        callback: (event: KeyboardEvent) => boolean;
    }>();

    constructor() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    onKeyDown(callback: (event: KeyboardEvent) => boolean): Unsubscribe {
        const handler = { type: "down" as const, callback };
        this.handlers.add(handler);
        return () => {
            assert(
                this.handlers.delete(handler),
                "handler has already been deleted",
            );
        };
    }

    onKeyUp(callback: (event: KeyboardEvent) => boolean): Unsubscribe {
        const handler = { type: "up" as const, callback };
        this.handlers.add(handler);
        return () => {
            assert(
                this.handlers.delete(handler),
                "handler has already been deleted",
            );
        };
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        for (const { type, callback } of this.handlers) {
            if (type === "down" && callback(e)) {
                return;
            }
        }
    };

    private handleKeyUp = (e: KeyboardEvent) => {
        for (const { type, callback } of this.handlers) {
            if (type === "up" && callback(e)) {
                return;
            }
        }
    };
}

const KeyHandlerContext = createContext<KeyHandler>(new KeyHandler());
