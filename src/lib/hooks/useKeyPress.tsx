import { useEffect } from "react";
import { useEvent } from "@/lib/hooks/useEvent";
import { IS_MAC } from "@/lib/utils";

type Key = string;
type KeyObj = {
    key: Key;
    command?: boolean;
    shift?: boolean;
    alt?: boolean;
};
type TargetKey = Key | KeyObj;

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
    const handler = useEvent((event: KeyboardEvent) => {
        if (matchesKeyDown(event, key)) {
            event.preventDefault();
            cb(event);
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [handler]);
}
