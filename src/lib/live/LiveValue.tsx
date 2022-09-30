import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { Live } from "@/lib/live/live";
import { emitInvalidation, incrementGlobalVersion, trackRead } from "@/lib/live/LiveComputation";
import { applyUpdate, UpdateAction } from "@/lib/utils";

export class LiveValue<T> implements Live<T> {
    private value: T;
    private pendingUpdates: Array<UpdateAction<T>> | null = null;
    private isUpdating = false;
    private invalidateEvent = new EventEmitter();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    private updateIfNeeded() {
        if (!this.pendingUpdates) {
            return;
        }

        let value = this.value;
        this.isUpdating = true;
        for (const update of this.pendingUpdates) {
            value = applyUpdate(value, update);
        }

        this.isUpdating = false;
        this.value = value;
        this.pendingUpdates = null;
    }

    getWithoutListening(): T {
        assert(!this.isUpdating, "cannot call getWithoutListening from within an update callback");
        this.updateIfNeeded();
        return this.value;
    }

    live(): T {
        assert(!this.isUpdating, "cannot call live from within an update callback");
        this.updateIfNeeded();
        trackRead(this);
        return this.value;
    }

    set(update: UpdateAction<T>): void {
        assert(!this.isUpdating, "cannot call set from within an update callback");
        if (!this.pendingUpdates) {
            this.pendingUpdates = [];
            incrementGlobalVersion();
            emitInvalidation(this.invalidateEvent);
        }
        this.pendingUpdates.push(update);
    }

    addInvalidateListener(callback: () => void): Unsubscribe {
        return this.invalidateEvent.listen(callback);
    }

    getInvalidateListenerCount(): number {
        return this.invalidateEvent.handlerCount();
    }
}
