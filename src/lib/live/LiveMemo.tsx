import { assert } from "@/lib/assert";
import { Unsubscribe } from "@/lib/EventEmitter";
import { Live } from "@/lib/live/live";
import { LiveComputation, trackRead } from "@/lib/live/LiveComputation";

const NOT_COMPUTED = Symbol();

export class LiveMemo<T> implements Live<T> {
    private readonly computation: LiveComputation;
    private value: T | typeof NOT_COMPUTED = NOT_COMPUTED;

    constructor(compute: () => T) {
        this.computation = new LiveComputation(() => {
            this.value = compute();
        });
    }

    getWithoutListening(): T {
        this.computation.computeIfNeeded();
        assert(this.value !== NOT_COMPUTED);
        return this.value;
    }

    live(): T {
        this.computation.computeIfNeeded();
        trackRead(this);
        assert(this.value !== NOT_COMPUTED);
        return this.value;
    }

    addInvalidateListener(callback: () => void): Unsubscribe {
        return this.computation.addInvalidateListener(callback);
    }
}
