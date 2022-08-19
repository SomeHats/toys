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

export function useKeyPress(key: TargetKey, cb: (event: KeyboardEvent) => void) {
    const handler = useEvent((event: KeyboardEvent) => {
        const target: TargetKey = typeof key === "string" ? { key } : key;
        if (
            event.key.toLowerCase() === target.key.toLowerCase() &&
            (target.command ?? false) === isCommandKeyPressed(event) &&
            (target.shift ?? false) === event.shiftKey &&
            (target.alt ?? false) === event.altKey &&
            event.repeat === false
        ) {
            event.preventDefault();
            console.log("ACTIVATING!", target, event);
            cb(event);
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [handler]);
}
