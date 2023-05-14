import { assert, assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { ResizeObserver, ResizeObserverEntry, ResizeObserverSize } from "@juggle/resize-observer";
import { useLayoutEffect, useState } from "react";

export { ResizeObserverEntry, ResizeObserverSize };

let cachedObserver: ResizeObserver | undefined;
const callbacksByElement = new Map<Element, Set<(entry: ResizeObserverEntry) => void>>();
const lastEntryByElement = new WeakMap<Element, ResizeObserverEntry>();

function handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
        lastEntryByElement.set(entry.target, entry);
        for (const callback of assertExists(
            callbacksByElement.get(entry.target),
            "callback does not exist for tracked entry",
        )) {
            callback(entry);
        }
    }
}

function getObserver(): ResizeObserver {
    if (!cachedObserver) {
        cachedObserver = new ResizeObserver(handleResize);
    }
    return cachedObserver;
}

function addCallbackForElement(element: Element, callback: (entry: ResizeObserverEntry) => void) {
    let callbacksForElement = callbacksByElement.get(element);

    if (!callbacksForElement) {
        callbacksForElement = new Set();
        callbacksByElement.set(element, callbacksForElement);
        getObserver().observe(element);
    }

    const lastEntry = lastEntryByElement.get(element);
    if (lastEntry) {
        callback(lastEntry);
    }

    callbacksForElement.add(callback);
}

function removeCallbackForElement(
    element: Element,
    callback: (entry: ResizeObserverEntry) => void,
) {
    const callbacksForElement = callbacksByElement.get(element);
    assert(callbacksForElement, "element is not tracked");

    const didExist = callbacksForElement.delete(callback);
    assert(didExist, "callback did not exist for element");

    if (callbacksForElement.size === 0) {
        callbacksByElement.delete(element);
        getObserver().unobserve(element);
    }
}

export function useResizeObserver<T>(
    target: Element | null,
    rawCallback: (entry: ResizeObserverEntry) => T,
): T | null {
    const [value, setValue] = useState<T | null>(null);
    const callback = useEvent(rawCallback);

    useLayoutEffect(() => {
        if (!target) {
            return undefined;
        }

        const handler = (entry: ResizeObserverEntry) => {
            setValue(callback(entry));
        };

        addCallbackForElement(target, handler);
        return () => {
            removeCallbackForElement(target, handler);
        };
    }, [target, callback]);

    return value;
}

export function sizeFromContentRect(entry: ResizeObserverEntry): Vector2 {
    return new Vector2(entry.contentRect.width, entry.contentRect.height);
}

export function sizeFromBorderBox(entry: ResizeObserverEntry): Vector2 {
    return new Vector2(entry.borderBoxSize[0].inlineSize, entry.borderBoxSize[0].blockSize);
}
