import { Unsubscribe } from "@/lib/EventEmitter";
import { Live, LiveWritable } from "@/lib/live";
import { LiveComputation, trackRead } from "@/lib/live/LiveComputation";
import { Result } from "@/lib/Result";
import { UpdateAction } from "@/lib/utils";

export class LiveMemo<T> implements Live<T> {
    private readonly computation: LiveComputation<T>;
    private completion: Result<T, unknown> | null = null;

    constructor(compute: () => T) {
        this.computation = new LiveComputation(compute);
    }

    getWithoutListening(): T {
        this.completion = this.computation.computeIfNeeded();
        return this.completion.unwrap();
    }

    live(): T {
        this.completion = this.computation.computeIfNeeded();
        trackRead(this);
        return this.completion.unwrap();
    }

    addEagerInvalidateListener(callback: () => void): Unsubscribe {
        return this.computation.addEagerInvalidateListener(callback);
    }
    addBatchInvalidateListener(callback: () => void): Unsubscribe {
        return this.computation.addBatchInvalidateListener(callback);
    }
}

export class LiveMemoWritable<T, Args extends Array<unknown> = []>
    extends LiveMemo<T>
    implements LiveWritable<T>
{
    constructor(
        read: () => T,
        private readonly write: (update: UpdateAction<T>, ...args: Args | []) => void,
    ) {
        super(read);
    }

    update(update: UpdateAction<T>, ...args: Args | []) {
        this.write(update, ...args);
        // // we have to eagerly evaluate memo updates because otherwise we don't know what to invalidate :(
        // const initialValue = this.getWithoutListening();
        // const newValue = applyUpdate(initialValue, update);
        // if (!Object.is(newValue, initialValue)) {
        //     this.write(newValue);
        // }
    }
}
