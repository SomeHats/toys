import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { Live } from "@/lib/live/live";

let globalVersion = 0;
export function incrementGlobalVersion() {
    globalVersion++;
}

let pendingInvalidations: null | Set<EventEmitter> = null;
let computationContext: ComputationContext | null = null;

type DependencyMap = Map<Live<unknown>, { value: unknown; unsubscribe: Unsubscribe | null }>;
type ComputationContext = {
    previousDependencies: DependencyMap | null;
    nextDependencies: DependencyMap;
    previous: ComputationContext | null;
    invalidateListener: () => void;
    shouldListen: boolean;
};

export function emitInvalidation(event: EventEmitter) {
    if (pendingInvalidations) {
        pendingInvalidations.add(event);
    } else {
        event.emit();
    }
}
export function beginTracking(
    previousDependencies: DependencyMap | null,
    invalidateListener: () => void,
    shouldListen: boolean,
): ComputationContext {
    if (!computationContext) {
        assert(pendingInvalidations === null);
        pendingInvalidations = new Set();
    }
    computationContext = {
        previousDependencies,
        nextDependencies: new Map(),
        previous: computationContext,
        invalidateListener,
        shouldListen,
    };
    return computationContext;
}

export function endTracking(context: ComputationContext) {
    assert(computationContext === context);
    computationContext = computationContext.previous;

    if (context.previousDependencies) {
        for (const [liveValue, { unsubscribe }] of context.previousDependencies) {
            if (!context.nextDependencies.has(liveValue)) {
                unsubscribe?.();
            }
        }
    }

    return context.nextDependencies;
}
function flushInvalidations() {
    if (pendingInvalidations && !computationContext) {
        const invalidations = pendingInvalidations;
        pendingInvalidations = null;
        for (const invalidation of invalidations) {
            invalidation.emit();
        }
    }
}

export function trackRead(liveValue: Live<unknown>) {
    assert(computationContext, "cannot call .live() outside of a live context");

    if (!computationContext.nextDependencies.has(liveValue)) {
        const unsubscribe = computationContext.shouldListen
            ? computationContext.previousDependencies?.get(liveValue)?.unsubscribe ??
              liveValue.addInvalidateListener(computationContext.invalidateListener)
            : null;
        const value = liveValue.getWithoutListening();
        computationContext.nextDependencies.set(liveValue, { value, unsubscribe });
    }
}

function didAnyDependenciesChange(dependencies: DependencyMap) {
    for (const [liveValue, { value }] of dependencies) {
        if (!Object.is(liveValue.getWithoutListening(), value)) {
            return true;
        }
    }
    return false;
}

export class LiveComputation {
    private _isValid = false;
    private validForGlobalVersion = -1;
    private dependencies: null | DependencyMap = null;
    private invalidateEvent = new EventEmitter();
    private isComputing = false;

    constructor(private readonly compute: () => void) {}

    private invalidate = () => {
        assert(!this.isComputing, "cannot write whilst computing dependant live computation");
        if (this._isValid) {
            this._isValid = false;
            emitInvalidation(this.invalidateEvent);
        }
    };

    computeIfNeeded() {
        if (this.isValid()) {
            return;
        }

        if (this.dependencies && !didAnyDependenciesChange(this.dependencies)) {
            this.makeValidAt(globalVersion);
            return;
        }

        const initialGlobalVersion = globalVersion;
        const context = beginTracking(this.dependencies, this.invalidate, this.shouldListen());
        this.isComputing = true;
        this.compute();
        this.isComputing = false;
        this.dependencies = endTracking(context);
        this.makeValidAt(initialGlobalVersion);
        flushInvalidations();
        this.computeIfNeeded();
    }

    isValid(): boolean {
        if (this.shouldListen()) {
            return this._isValid;
        } else {
            return this.validForGlobalVersion === globalVersion;
        }
    }

    private makeValidAt(validForGlobalVersion: number) {
        this._isValid = globalVersion === validForGlobalVersion;
        this.validForGlobalVersion = validForGlobalVersion;
    }

    addInvalidateListener(callback: () => void): Unsubscribe {
        const unsubscribe = this.invalidateEvent.listen(callback);
        this.computeIfNeeded();
        return () => {
            unsubscribe();
            if (!this.shouldListen() && this.dependencies) {
                for (const subscription of this.dependencies.values()) {
                    subscription.unsubscribe?.();
                    subscription.unsubscribe = null;
                }
            }
        };
    }

    private shouldListen() {
        return this.invalidateEvent.handlerCount() > 0;
    }
}
