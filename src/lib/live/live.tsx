import { Unsubscribe } from "@/lib/EventEmitter";
import { LiveMemo } from "@/lib/live/LiveMemo";
import { useCallback, useMemo, useSyncExternalStore } from "react";

export { LiveValue } from "@/lib/live/LiveValue";
export { LiveMemo } from "@/lib/live/LiveMemo";

export interface Live<T> {
    getWithoutListening(): T;
    live(): T;
    addInvalidateListener(callback: () => void): Unsubscribe;
}

export function useLiveValue<T>(live: Live<T>): T {
    return useSyncExternalStore(
        useCallback((onChange) => live.addInvalidateListener(onChange), [live]),
        () => live.getWithoutListening(),
    );
}

export function useLive<T>(compute: () => T, deps: ReadonlyArray<unknown>): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const liveMemo = useMemo(() => new LiveMemo(compute), deps);
    return useLiveValue(liveMemo);
}
