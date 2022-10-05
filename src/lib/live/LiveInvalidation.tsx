import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { unstable_batchedUpdates } from "react-dom";

const PRINT_DEBUG_LOG = false && process.env.NODE_ENV !== "production";

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

let idCount = 0;
export function getDebugLabel(type: string) {
    if (process.env.NODE_ENV !== "production") {
        const stackLines = new Error().stack?.split("\n");
        if (stackLines) {
            for (const stackLine of stackLines) {
                const match = stackLine.match(/^\s*at (.*) \((.*)\)\s*$/);
                if (!match) continue;
                if (match[2].includes("/lib/live/") || match[2].includes("/node_modules/"))
                    continue;
                return `${type} at ${match[1]} (${match[2]})`;
            }
        }
    }
    return `unknown ${type} ${idCount++}`;
}

export class LiveInvalidation {
    private eagerInvalidation = new EventEmitter();
    private batchedInvalidation = new EventEmitter();
    private debugName: string;

    constructor(debugName: string | undefined, type: string) {
        this.debugName = debugName ?? getDebugLabel(type);
    }

    getDebugName() {
        return this.debugName;
    }

    addEagerListener(listener: () => void): Unsubscribe {
        return this.eagerInvalidation.listen(listener);
    }

    addBatchListener(listener: () => void): Unsubscribe {
        return this.batchedInvalidation.listen(listener);
    }

    invalidate() {
        if (PRINT_DEBUG_LOG && this.debugName) {
            console.group(`%c[live] invalidate ${this.debugName}`, "color: #7f7f7f");
        }
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
        if (PRINT_DEBUG_LOG && this.debugName) {
            console.groupEnd();
        }
    }

    listenerCount(): number {
        return this.eagerInvalidation.listenerCount() + this.batchedInvalidation.listenerCount();
    }

    hasListeners() {
        return this.eagerInvalidation.hasListeners() || this.batchedInvalidation.hasListeners();
    }
}
