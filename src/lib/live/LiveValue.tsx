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
    private wasRead = true;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    private markRead() {
        this.wasRead = true;
    }

    getOnce(): T {
        this.markRead();
        return this.value;
    }

    live(): T {
        this.markRead();
        trackRead(this);
        return this.value;
    }

    update(update: UpdateAction<T>): void {
        if (this.isUpdating) {
            if (!this.pendingUpdates) this.pendingUpdates = [];
            this.pendingUpdates.push(update);
            return;
        }

        this.isUpdating = true;
        try {
            this.value = applyUpdate(this.value, update);
            this.invalidate();
            if (this.pendingUpdates) {
                for (let i = 0; i < this.pendingUpdates.length; i++) {
                    this.value = applyUpdate(this.value, update);
                    this.invalidate();
                }
            }
        } finally {
            this.pendingUpdates = null;
            this.isUpdating = false;
        }
    }

    invalidate() {
        if (this.wasRead) {
            this.wasRead = false;
            this.invalidation.invalidate();
            incrementGlobalVersion();
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
