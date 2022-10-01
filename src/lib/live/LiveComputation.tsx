import { assert, assertExists } from "@/lib/assert";
import { Unsubscribe } from "@/lib/EventEmitter";
import { Live } from "@/lib/live";
import {
    beginSyncInvalidationBatch,
    flushSyncInvalidationBatch,
    isSyncInvalidationBatchInProgress,
    LiveInvalidation,
} from "@/lib/live/LiveInvalidation";
import { Result } from "@/lib/Result";

let globalVersion = 0;
export function incrementGlobalVersion() {
    globalVersion++;
}

let computationContext: ComputationContext | null = null;

type DependencyMap = Map<Live<unknown>, { value: unknown; unsubscribe: Unsubscribe | null }>;
type NonTrackingContext = {
    previous: ComputationContext | null;
    shouldTrack: false;
};
type TrackingContext = {
    shouldTrack: true;
    previousDependencies: DependencyMap | null;
    nextDependencies: DependencyMap;
    previous: ComputationContext | null;
    invalidateListener: () => void;
    shouldListen: boolean;
};
type ComputationContext = TrackingContext | NonTrackingContext;

export function beginTracking(
    previousDependencies: DependencyMap | null,
    invalidateListener: () => void,
    shouldListen: boolean,
): TrackingContext {
    if (!computationContext) {
        beginSyncInvalidationBatch();
    }
    computationContext = {
        shouldTrack: true,
        previousDependencies,
        nextDependencies: new Map(),
        previous: computationContext,
        invalidateListener,
        shouldListen,
    };
    return computationContext;
}

export function endTracking(context: TrackingContext) {
    assert(computationContext === context);
    computationContext = computationContext.previous;

    if (context.shouldTrack && context.previousDependencies) {
        for (const [liveValue, { unsubscribe }] of context.previousDependencies) {
            if (!context.nextDependencies.has(liveValue)) {
                unsubscribe?.();
            }
        }
    }

    return context.nextDependencies;
}
function flushInvalidations() {
    if (isSyncInvalidationBatchInProgress() && !computationContext) {
        flushSyncInvalidationBatch();
    }
}

export function trackRead(liveValue: Live<unknown>) {
    assert(computationContext, "cannot call .live() outside of a live context");

    if (computationContext.shouldTrack && !computationContext.nextDependencies.has(liveValue)) {
        const unsubscribe = computationContext.shouldListen
            ? computationContext.previousDependencies?.get(liveValue)?.unsubscribe ??
              liveValue.addEagerInvalidateListener(computationContext.invalidateListener)
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

export function runLiveWithoutListening<T>(fn: () => T): T {
    const nonTracking: NonTrackingContext = { shouldTrack: false, previous: computationContext };
    computationContext = nonTracking;
    const result = fn();
    assert(computationContext === nonTracking);
    computationContext = nonTracking.previous;
    return result;
}

export class LiveComputation<T> {
    private _isValid = false;
    private validForGlobalVersion = -1;
    private dependencies: null | DependencyMap = null;
    private invalidation = new LiveInvalidation();
    private isComputing = false;
    private completion: Result<T, unknown> | null = null;

    constructor(private readonly compute: () => T) {}

    private invalidate = () => {
        assert(!this.isComputing, "cannot write whilst computing dependant live computation");
        if (this._isValid) {
            this._isValid = false;
            this.invalidation.invalidate();
        }
    };

    computeIfNeeded(): Result<T, unknown> {
        if (this.isValid()) {
            return assertExists(this.completion);
        }

        if (this.dependencies && !didAnyDependenciesChange(this.dependencies)) {
            this.makeValidAt(globalVersion);
            return assertExists(this.completion);
        }

        const initialGlobalVersion = globalVersion;
        const context = beginTracking(
            this.dependencies,
            this.invalidate,
            this.invalidation.hasListeners(),
        );
        this.isComputing = true;
        let didSucceed;
        try {
            this.completion = Result.ok(this.compute());
            didSucceed = true;
        } catch (err) {
            this.completion = Result.error(err);
            didSucceed = false;
        }
        this.isComputing = false;
        this.dependencies = endTracking(context);
        if (didSucceed) {
            this.makeValidAt(initialGlobalVersion);
            flushInvalidations();
            this.computeIfNeeded();
        } else {
            flushInvalidations();
        }
        return this.completion;
    }

    isValid(): boolean {
        if (this.invalidation.hasListeners()) {
            return this._isValid;
        } else {
            return this.validForGlobalVersion === globalVersion;
        }
    }

    private makeValidAt(validForGlobalVersion: number) {
        this._isValid = globalVersion === validForGlobalVersion;
        this.validForGlobalVersion = validForGlobalVersion;
    }

    addEagerInvalidateListener(callback: () => void): Unsubscribe {
        const isListening = this.invalidation.hasListeners();
        const unsubscribe = this.invalidation.addEagerListener(callback);
        if (!isListening) {
            this.subscribeToDependencies();
        }

        return () => {
            unsubscribe();
            if (!this.invalidation.hasListeners()) {
                this.unsubscribeFromDependencies();
            }
        };
    }
    addBatchInvalidateListener(callback: () => void): Unsubscribe {
        const isListening = this.invalidation.hasListeners();
        const unsubscribe = this.invalidation.addBatchListener(callback);
        if (!isListening) {
            this.subscribeToDependencies();
        }

        return () => {
            unsubscribe();
            if (!this.invalidation.hasListeners()) {
                this.unsubscribeFromDependencies();
            }
        };
    }

    subscribeToDependencies() {
        if (this.isValid() && this.dependencies) {
            for (const [liveValue, subscription] of this.dependencies) {
                subscription.unsubscribe = liveValue.addEagerInvalidateListener(this.invalidate);
            }
        } else {
            this.computeIfNeeded();
        }
    }

    unsubscribeFromDependencies() {
        if (this.dependencies) {
            for (const subscription of this.dependencies.values()) {
                subscription.unsubscribe?.();
                subscription.unsubscribe = null;
            }
        }
    }
}
