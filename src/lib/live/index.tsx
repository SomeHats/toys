import { Unsubscribe } from "@/lib/EventEmitter";
import { LiveEffect, LiveEffectScheduleFn } from "@/lib/live/LiveEffect";
import { LiveMemo } from "@/lib/live/LiveMemo";
import { UpdateAction } from "@/lib/utils";
import { useCallback, useDebugValue, useMemo, useRef, useSyncExternalStore } from "react";

export { LiveValue } from "@/lib/live/LiveValue";
export { LiveMemo, LiveMemoWritable } from "@/lib/live/LiveMemo";
export { LiveEffect } from "@/lib/live/LiveEffect";
export { runLiveWithoutListening } from "@/lib/live/LiveComputation";

export interface Live<T> {
    getWithoutListening(): T;
    live(): T;
    addEagerInvalidateListener(callback: () => void): Unsubscribe;
    addBatchInvalidateListener(callback: () => void): Unsubscribe;
}

export interface LiveWritable<T> extends Live<T> {
    update(update: UpdateAction<T>): void;
}

/**
 * use live value with react. this probably does funky things with concurrent
 * mode because instead of using `useSyncExternalStore`, we use our own mini
 * subscription thing that schedules updates asyncronously
 */
export function useLiveValue<T>(live: Live<T>): T {
    const isRendering = useRef(true);
    isRendering.current = true;
    try {
        const value = useSyncExternalStore(
            useCallback((onChange) => live.addBatchInvalidateListener(onChange), [live]),
            () => {
                if (isRendering.current) {
                    return live.getWithoutListening();
                } else {
                    // when we get the value outside of a render, suppress errors to prevent zombie child issues
                    try {
                        return live.getWithoutListening();
                    } catch (err) {
                        console.groupCollapsed("[useLiveValue caught error]");
                        console.log(err);
                        console.groupEnd();
                        // return a dummy value to trigger a re-render. this should never get used in render
                        return {} as T;
                    }
                }
            },
        );
        useDebugValue(value);
        return value;
    } finally {
        isRendering.current = false;
    }
}

export function useLive<T>(compute: () => T, deps: ReadonlyArray<unknown>): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const liveMemo = useMemo(() => new LiveMemo(compute), deps);
    const value = useLiveValue(liveMemo);
    useDebugValue(value);
    return value;
}

export function runLive(schedule: LiveEffectScheduleFn, run: () => void): Unsubscribe {
    const effect = new LiveEffect(run, schedule);
    return () => effect.cancel;
}
