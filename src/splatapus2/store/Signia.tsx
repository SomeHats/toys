import { assert } from "@/lib/assert";
import { ObjectMap } from "@/lib/utils";
import {
    IncrementalDiff,
    IncrementalObject,
    IncrementalObjectConfig,
    IncrementalSignal,
    IncrementalTable,
    IncrementalTableDiff,
} from "@/splatapus2/store/Incremental";
import { RESET_VALUE, computed, isUninitialized, withDiff } from "@tldraw/state";

export function computedIncrementalObjectProperty<
    Config extends IncrementalObjectConfig,
    Key extends keyof Config,
>(
    incrementalObject: IncrementalObject<Config>,
    key: Key,
    getSignal: () => IncrementalSignal<IncrementalObject<Config>>,
): IncrementalSignal<Config[Key]> {
    return computed(
        String(key),
        (previousValue, lastComputedEpoch) => {
            const signal = getSignal();

            const newValue = signal.value[key];
            if (isUninitialized(previousValue)) {
                return newValue;
            }

            if (newValue === previousValue) {
                return previousValue;
            }

            const objectDiffs = signal.getDiffSince(lastComputedEpoch);
            let diff: RESET_VALUE | IncrementalDiff<Config[Key]> = RESET_VALUE;
            if (objectDiffs !== RESET_VALUE) {
                for (const objectDiff of objectDiffs) {
                    const propertyDiff = objectDiff[key as keyof typeof objectDiff] as
                        | IncrementalDiff<Config[Key]>
                        | undefined;
                    if (propertyDiff !== undefined) {
                        if (diff === RESET_VALUE) {
                            diff = propertyDiff;
                        } else {
                            const coalesced = incrementalObject.config[key].coalesce(
                                diff,
                                propertyDiff,
                            );
                            if (coalesced) {
                                diff = coalesced;
                            } else {
                                diff = RESET_VALUE;
                                break;
                            }
                        }
                    }
                }
            }

            if (diff === RESET_VALUE) {
                return newValue;
            }

            return withDiff(newValue, diff);
        },
        { historyLength: 10 },
    );
}

export function incrementalTableAccessor<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
>(
    signal: IncrementalSignal<IncrementalTable<Id, Value, Diff>>,
    updateTable: (diff: IncrementalTableDiff<Id, Value, Diff>) => void,
) {
    return {
        signal,
        [Symbol.iterator]: () => signal.value[Symbol.iterator](),
        getIfExists: (id: Id) => signal.value.get(id),
        get: (id: Id) => {
            const value = signal.value.get(id);
            assert(value !== undefined, `ID ${id} not found in ${signal.name}`);
            return value;
        },
        insert: (value: Value) => {
            const insert: ObjectMap<Id, Value> = {};
            insert[value.id] = value;
            updateTable({ insert });
        },
        update: (id: Id, diff: Diff) => {
            const update: ObjectMap<Id, Diff[]> = {};
            update[id] = [diff];
            updateTable({ update });
        },
        delete: (id: Id) => {
            const del: ObjectMap<Id, 1> = {};
            del[id] = 1;
            updateTable({ delete: del });
        },
    };
}

export function idleScheduler(timeout?: number) {
    let scheduled: number | null = null;
    return (execute: () => void) => {
        if (scheduled !== null) {
            cancelIdleCallback(scheduled);
        }
        scheduled = requestIdleCallback(
            () => {
                scheduled = null;
                execute();
            },
            { timeout },
        );
    };
}
