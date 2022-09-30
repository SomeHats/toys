import { assert } from "@/lib/assert";
import { Unsubscribe } from "@/lib/EventEmitter";
import { Live } from "@/lib/live/live";
import { LiveComputation, trackRead } from "@/lib/live/LiveComputation";
import { applyUpdate, UpdateAction } from "@/lib/utils";

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

export class LiveMemoWritable<T> extends LiveMemo<T> {
    constructor(read: () => T, private readonly write: (newValue: T) => void) {
        super(read);
    }

    set(update: UpdateAction<T>) {
        // we have to eagerly evaluate memo updates because otherwise we don't know what to invalidate :(
        const initialValue = this.getWithoutListening();
        const newValue = applyUpdate(initialValue, update);
        if (!Object.is(newValue, initialValue)) {
            this.write(newValue);
        }
    }
}
