import { Signal } from "@/lib/signals/Signals";
import { useMemo } from "react";
import { useSubscription } from "use-subscription";

export default function useSignal(signal: Signal): number {
    return useSubscription(
        useMemo(
            () => ({
                getCurrentValue: () => signal.read(),
                subscribe: (cb) => signal.manager.onUpdate(cb),
            }),
            [signal],
        ),
    );
}
