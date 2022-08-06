import { ResizeObserver, ResizeObserverEntry, ResizeObserverSize } from "@juggle/resize-observer";
import { useEffect, useState } from "react";
import { assert, assertExists } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";

export { ResizeObserverEntry, ResizeObserverSize };

let cachedObserver: ResizeObserver | undefined;
const callbacksByElement = new Map<Element, Set<(entry: ResizeObserverEntry) => void>>();

function handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
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
    callback: (entry: ResizeObserverEntry) => T,
): T | null {
    const [value, setValue] = useState<T | null>(null);

    useEffect(() => {
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

export function sizeFromEntry(entry: ResizeObserverEntry): Vector2 {
    return new Vector2(entry.contentRect.width, entry.contentRect.height);
}
