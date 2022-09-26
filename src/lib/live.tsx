import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { applyUpdate, queueMicrotask, UpdateAction } from "@/lib/utils";
import { useCallback, useMemo, useSyncExternalStore } from "react";

type Context = {
    target: LiveComputation<unknown>;
    prev: Context | null;
    dependencies: Set<LiveDependency>;
};

let currentContext: Context | null = null;

let pendingUpdateBatch: null | Set<EventEmitter> = null;
function scheduleCallback(cb: () => void) {
    queueMicrotask(cb);
}
export function flush() {
    if (pendingUpdateBatch) {
        for (const event of pendingUpdateBatch) {
            event.emit();
        }
        pendingUpdateBatch = null;
    }
}
function scheduleBatchedUpdate(event: EventEmitter) {
    if (!pendingUpdateBatch) {
        pendingUpdateBatch = new Set();
        scheduleCallback(flush);
    }
    pendingUpdateBatch.add(event);
}

function beginTracking(target: LiveComputation<unknown>): Context {
    const context: Context = { target, prev: currentContext, dependencies: new Set() };
    currentContext = context;
    return context;
}
function endTracking(context: Context): Set<LiveDependency> {
    assert(currentContext === context, "context doesn't match between begin and end");
    currentContext = context.prev;
    return context.dependencies;
}
function addDependency(target: { _dependency: LiveDependency }) {
    assert(currentContext);
    currentContext.dependencies.add(target._dependency);
}

class LiveDependency {
    private dependents = new Set<LiveDependent>();
    addDependent(dependent: LiveDependent) {
        this.dependents.add(dependent);
    }
    removeDependent(dependent: LiveDependent) {
        this.dependents.delete(dependent);
    }
    invalidate() {
        for (const dependent of this.dependents) {
            dependent.invalidate();
        }
    }
}
class LiveDependent {
    private _dependencies = new Set<LiveDependency>();
    constructor(readonly invalidate: () => void) {}
    dependencies(): ReadonlySet<LiveDependency> {
        return this._dependencies;
    }
    updateDependencies(newDependencies: Set<LiveDependency>) {
        console.log("updateDependencies", newDependencies);
        for (const oldDependency of this._dependencies) {
            if (!newDependencies.has(oldDependency)) {
                oldDependency.removeDependent(this);
            }
        }
        for (const newDependency of newDependencies) {
            if (!this._dependencies.has(newDependency)) {
                newDependency.addDependent(this);
            }
        }
        this._dependencies = newDependencies;
    }
}

export interface Live<T> {
    peek(): T;
    live(): T;
    addListener(callback: () => void): Unsubscribe;
}

export class LiveValue<T> implements Live<T> {
    private value: T;
    private invalidate = new EventEmitter();
    /** @internal */
    _dependency = new LiveDependency();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    peek(): T {
        return this.value;
    }

    live(): T {
        addDependency(this);
        return this.value;
    }

    addListener(callback: () => void): Unsubscribe {
        return this.invalidate.listen(callback);
    }

    set(update: UpdateAction<T>) {
        this.value = applyUpdate(this.value, update);
        this._dependency.invalidate();
        scheduleBatchedUpdate(this.invalidate);
    }
}

abstract class LiveComputation<T> {
    /** @internal */
    _dependency = new LiveDependency();
    /** @internal */
    _dependent = new LiveDependent(() => {
        if (this._isValid()) {
            this._invalidate();
            this._dependency.invalidate();
            scheduleBatchedUpdate(this.invalidate);
        }
    });

    readonly invalidate = new EventEmitter();

    protected abstract _invalidate(): void;
    protected abstract _isValid(): boolean;
    protected abstract compute(): T;

    protected computeTracked(): T {
        const context = beginTracking(this);
        try {
            return this.compute();
        } finally {
            const newDependencies = endTracking(context);
            this._dependent.updateDependencies(newDependencies);
        }
    }
}

export class LiveMemo<T> extends LiveComputation<T> implements Live<T> {
    private value: { current: T } | null = null;

    constructor(private computeValue: () => T) {
        super();
    }

    private updateValueIfNeeded(): T {
        if (this.value) {
            return this.value.current;
        }

        return this.computeTracked();
    }

    protected compute() {
        const value = this.computeValue();
        this.value = { current: value };
        return value;
    }

    peek(): T {
        return this.updateValueIfNeeded();
    }

    live(): T {
        addDependency(this);
        return this.updateValueIfNeeded();
    }

    addListener(callback: () => void): Unsubscribe {
        return this.invalidate.listen(callback);
    }

    protected _invalidate(): void {
        this.value = null;
    }
    protected _isValid(): boolean {
        return !!this.value;
    }
}

export function useLiveValue<T>(live: Live<T>): T {
    return useSyncExternalStore(
        useCallback((onChange) => live.addListener(onChange), [live]),
        useCallback(() => live.peek(), [live]),
    );
}

export function useLive<T>(compute: () => T, deps: ReadonlyArray<unknown>): T {
    const memo = useMemo(() => new LiveMemo(compute), deps);
    return useLiveValue(memo);
}
