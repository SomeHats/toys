import { Ref, useCallback } from "react";

export function assignRef<T>(ref: Ref<T>, instance: T) {
    if (!ref) {
        return;
    }
    if (typeof ref === "function") {
        ref(instance);
    } else {
        // @ts-expect-error react's ref types are funky imo
        ref.current = instance;
    }
}

export function useMergedRefs<T>(a: Ref<T>, b: Ref<T>): (instance: T | null) => void {
    return useCallback(
        (instance) => {
            assignRef(a, instance);
            assignRef(b, instance);
        },
        [a, b],
    );
}
