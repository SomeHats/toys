import { Unsubscribe } from "@/lib/EventEmitter";
import { LiveWritable } from "@/lib/live";
import { incrementGlobalVersion, trackRead } from "@/lib/live/LiveComputation";
import { LiveInvalidation } from "@/lib/live/LiveInvalidation";
import { applyUpdate, UpdateAction } from "@/lib/utils";

export class LiveValue<T> implements LiveWritable<T> {
    private value: T;
    private pendingUpdates: Array<UpdateAction<T>> | null = null;
    private invalidation = new LiveInvalidation();
    private isUpdating = false;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    private updateIfNeeded() {
        if (!this.pendingUpdates || this.isUpdating) {
            return;
        }

        this.isUpdating = true;
        for (let i = 0; i < this.pendingUpdates.length; i++) {
            this.value = applyUpdate(this.value, this.pendingUpdates[i]);
        }

        this.pendingUpdates = null;
        this.isUpdating = false;
    }

    getWithoutListening(): T {
        this.updateIfNeeded();
        return this.value;
    }

    live(): T {
        this.updateIfNeeded();
        trackRead(this);
        return this.value;
    }

    update(update: UpdateAction<T>): void {
        if (!this.pendingUpdates) {
            this.pendingUpdates = [];
        }
        this.pendingUpdates.push(update);
        if (this.pendingUpdates.length === 1) {
            incrementGlobalVersion();
            this.invalidation.invalidate();
        }
    }

    addEagerInvalidateListener(callback: () => void): Unsubscribe {
        return this.invalidation.addEagerListener(callback);
    }
    addBatchInvalidateListener(callback: () => void): Unsubscribe {
        return this.invalidation.addBatchListener(callback);
    }

    getInvalidateListenerCount(): number {
        return this.invalidation.listenerCount();
    }
}
