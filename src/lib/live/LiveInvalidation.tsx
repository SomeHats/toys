import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { unstable_batchedUpdates } from "react-dom";

let pendingSyncInvalidations: null | Set<EventEmitter> = null;
let pendingBatchedInvalidations: null | Set<EventEmitter> = null;

function flushBatched() {
    if (!pendingBatchedInvalidations) {
        return;
    }
    const invalidations = pendingBatchedInvalidations;
    pendingBatchedInvalidations = null;
    unstable_batchedUpdates(() => {
        for (const invalidation of invalidations) {
            invalidation.emit();
        }
    });
}

export function beginSyncInvalidationBatch() {
    assert(pendingSyncInvalidations === null);
    pendingSyncInvalidations = new Set();
}

export function flushSyncInvalidationBatch() {
    assert(pendingSyncInvalidations);
    const invalidations = pendingSyncInvalidations;
    pendingSyncInvalidations = null;
    for (const invalidation of invalidations) {
        invalidation.emit();
    }
    if (pendingSyncInvalidations) {
        // more invalidations were registered whilst invalidating this batch,
        // flush them synchronously so that update-in-update doesn't cause an
        // async gap
        flushSyncInvalidationBatch();
    }
}

export function isSyncInvalidationBatchInProgress() {
    return !!pendingSyncInvalidations;
}

export class LiveInvalidation {
    private eagerInvalidation = new EventEmitter();
    private batchedInvalidation = new EventEmitter();

    addEagerListener(listener: () => void): Unsubscribe {
        return this.eagerInvalidation.listen(listener);
    }

    addBatchListener(listener: () => void): Unsubscribe {
        return this.batchedInvalidation.listen(listener);
    }

    invalidate() {
        if (pendingSyncInvalidations) {
            pendingSyncInvalidations.add(this.eagerInvalidation);
        } else {
            this.eagerInvalidation.emit();
        }

        if (!pendingBatchedInvalidations) {
            pendingBatchedInvalidations = new Set();
            queueMicrotask(flushBatched);
        }
        pendingBatchedInvalidations.add(this.batchedInvalidation);
    }

    listenerCount(): number {
        return this.eagerInvalidation.listenerCount() + this.batchedInvalidation.listenerCount();
    }

    hasListeners() {
        return this.eagerInvalidation.hasListeners() || this.batchedInvalidation.hasListeners();
    }
}
