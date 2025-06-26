import { Result } from "@/lib/Result";
import { assert, assertExists, fail } from "@/lib/assert";
import { Schema } from "@/lib/schema";
import {
    ObjectMap,
    ReadonlyObjectMap,
    ReadonlyRecord,
    exhaustiveSwitchError,
    keys,
    mapObjectValues,
} from "@/lib/utils";
import { Signal } from "@tldraw/state";
import Immutable from "immutable";

export interface Incremental<Value, Diff> {
    readonly valueSchema: Schema<Value>;
    readonly diffSchema: Schema<Diff>;
    apply(value: Value, diff: Diff): [value: Value, inverse: Diff];
    coalesce(diff1: Diff, diff2: Diff): Diff | null;
}

export type IncrementalValue<Inc extends Incremental<any, any>> =
    Inc extends Incremental<infer Value, any> ? Value : never;
export type IncrementalDiff<Inc extends Incremental<any, any>> =
    Inc extends Incremental<any, infer Diff> ? Diff : never;

export type IncrementalSignal<Inc extends Incremental<any, any>> = Signal<
    IncrementalValue<Inc>,
    IncrementalDiff<Inc>
>;

export function incrementalStatic<Value>(
    schema: Schema<Value>,
): Incremental<Value, undefined> {
    return {
        valueSchema: schema,
        diffSchema: Schema.never,
        apply(value, diff) {
            fail("Cannot apply diff to static value");
        },
        coalesce(diff1, diff2) {
            fail("Cannot coalesce diffs for static value");
        },
    };
}

export function incrementalAtom<Value>(
    schema: Schema<Value>,
): Incremental<Value, Value> {
    return {
        valueSchema: schema,
        diffSchema: schema,
        apply(value, diff) {
            return [diff, value];
        },
        coalesce(diff1, diff2) {
            return diff2;
        },
    };
}

// todo: make this work with nested incrementals?
export function incrementalArrayOf<Value>(
    schema: Schema<Value>,
): Incremental<readonly Value[], IncrementalArrayOfDiff<Value>> {
    return {
        valueSchema: Schema.arrayOf(schema),
        diffSchema: incrementalArrayOfDiffSchema(schema),
        apply(value, diff) {
            switch (diff.type) {
                case IncrementalArrayOfDiffType.Replace:
                    return [
                        diff.value,
                        { type: IncrementalArrayOfDiffType.Replace, value },
                    ];
                case IncrementalArrayOfDiffType.Splice: {
                    assert(diff.index >= 0);
                    assert(diff.index <= value.length);
                    assert(diff.deleteCount >= 0);
                    assert(diff.index + diff.deleteCount <= value.length);

                    const inverse: IncrementalArrayOfDiff<Value> = {
                        type: IncrementalArrayOfDiffType.Splice,
                        index: diff.index,
                        deleteCount: diff.insert.length,
                        insert: value.slice(
                            diff.index,
                            diff.index + diff.deleteCount,
                        ),
                    };

                    const result = value
                        .slice(0, diff.index)
                        .concat(
                            diff.insert,
                            value.slice(diff.index + diff.deleteCount),
                        );

                    return [result, inverse];
                }
                default:
                    exhaustiveSwitchError(diff);
            }
        },
        coalesce(diff1, diff2) {
            switch (diff1.type) {
                case IncrementalArrayOfDiffType.Replace:
                    switch (diff2.type) {
                        case IncrementalArrayOfDiffType.Replace:
                            return diff2;
                        case IncrementalArrayOfDiffType.Splice:
                            return {
                                type: IncrementalArrayOfDiffType.Replace,
                                value: diff1.value
                                    .slice()
                                    .splice(
                                        diff2.index,
                                        diff2.deleteCount,
                                        ...diff2.insert,
                                    ),
                            };
                        default:
                            return exhaustiveSwitchError(diff2);
                    }
                case IncrementalArrayOfDiffType.Splice:
                    switch (diff2.type) {
                        case IncrementalArrayOfDiffType.Replace:
                            return diff2;
                        case IncrementalArrayOfDiffType.Splice: {
                            if (diff1.index + diff1.deleteCount < diff2.index) {
                                return null;
                            }
                            if (diff2.index + diff2.deleteCount < diff1.index) {
                                return null;
                            }
                            const start = Math.min(diff1.index, diff2.index);
                            const end = Math.max(
                                diff1.index + diff1.deleteCount,
                                diff2.index + diff2.deleteCount,
                            );
                            const insert = [...diff1.insert, ...diff2.insert];
                            return {
                                type: IncrementalArrayOfDiffType.Splice,
                                index: start,
                                deleteCount: end - start,
                                insert,
                            };
                        }
                        default:
                            return exhaustiveSwitchError(diff2);
                    }
                default:
                    return exhaustiveSwitchError(diff1);
            }
        },
    };
}

export enum IncrementalArrayOfDiffType {
    Splice = 0,
    Replace = 1,
}
export type IncrementalArrayOfDiff<Value> =
    | {
          readonly type: IncrementalArrayOfDiffType.Splice;
          readonly index: number;
          readonly insert: readonly Value[];
          readonly deleteCount: number;
      }
    | {
          readonly type: IncrementalArrayOfDiffType.Replace;
          readonly value: readonly Value[];
      };
function incrementalArrayOfDiffSchema<Value>(
    valueSchema: Schema<Value>,
): Schema<IncrementalArrayOfDiff<Value>> {
    return Schema.indexedUnion("type", {
        [IncrementalArrayOfDiffType.Splice]: Schema.object({
            type: Schema.value(IncrementalArrayOfDiffType.Splice),
            index: Schema.number,
            deleteCount: Schema.number,
            insert: Schema.arrayOf(valueSchema),
        }).indexed({
            type: 0,
            index: 1,
            deleteCount: 2,
            insert: 3,
        }),
        [IncrementalArrayOfDiffType.Replace]: Schema.object({
            type: Schema.value(IncrementalArrayOfDiffType.Replace),
            value: Schema.arrayOf(valueSchema),
        }).indexed({
            type: 0,
            value: 1,
        }),
    });
}

export type IncrementalObjectConfig = ReadonlyRecord<
    string,
    Incremental<any, any>
>;
export type IncrementalObjectValue<Config extends IncrementalObjectConfig> = {
    [K in keyof Config]: Config[K] extends Incremental<infer Value, any> ? Value
    :   never;
};
export type IncrementalObjectDiff<Config extends IncrementalObjectConfig> = {
    [K in keyof Config]?: Config[K] extends Incremental<any, infer Diff> ? Diff
    :   never;
};
export interface IncrementalObject<Config extends IncrementalObjectConfig>
    extends Incremental<
        IncrementalObjectValue<Config>,
        IncrementalObjectDiff<Config>
    > {
    readonly config: Config;
}
export function incrementalObject<Config extends IncrementalObjectConfig>(
    config: Config,
): IncrementalObject<Config> {
    return {
        config,
        valueSchema: Schema.object(
            mapObjectValues(config, (incremental) => incremental.valueSchema),
        ) as unknown as Schema<IncrementalObjectValue<Config>>,
        diffSchema: Schema.object(
            mapObjectValues(config, (incremental) =>
                incremental.diffSchema.optional(),
            ),
        ) as unknown as Schema<IncrementalObjectDiff<Config>>,
        apply(value, diff) {
            const result = { ...value };
            const inverseDiff: IncrementalObjectDiff<Config> = {};
            for (const key in diff) {
                const incremental = config[key];
                const [newValue, inverse] = incremental.apply(
                    value[key],
                    diff[key],
                );
                result[key] = newValue;
                inverseDiff[key] = inverse;
            }
            return [result, inverseDiff];
        },
        coalesce(diff1, diff2) {
            const diffWithAllPresentKeysCoallesced = { ...diff1 };
            for (const key in diff2) {
                const existingDiff = diffWithAllPresentKeysCoallesced[key];
                const diff = diff2[key];
                if (existingDiff === undefined) {
                    diffWithAllPresentKeysCoallesced[key] = diff;
                } else {
                    const incremental = config[key];
                    const coalescedDiff = incremental.coalesce(
                        existingDiff,
                        diff,
                    );
                    if (coalescedDiff === null) {
                        return null;
                    }
                    diffWithAllPresentKeysCoallesced[key] = coalescedDiff;
                }
            }
            return diffWithAllPresentKeysCoallesced;
        },
    };
}

export type IncrementalTableValue<
    Id extends string,
    Value extends { readonly id: Id },
> = Immutable.Map<Id, Value>;
export interface IncrementalTableDiff<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
> {
    readonly insert?: ReadonlyObjectMap<Id, Value> | undefined;
    readonly update?: ReadonlyObjectMap<Id, readonly Diff[]> | undefined;
    readonly delete?: ReadonlyObjectMap<Id, 1> | undefined;
}
interface MutableIncrementalTableDiff<
    Id extends string,
    Value extends { id: Id },
    Diff,
> {
    insert?: ObjectMap<Id, Value> | undefined;
    update?: ObjectMap<Id, Diff[]> | undefined;
    delete?: ObjectMap<Id, 1> | undefined;
}

function incrementalTableDiffSchema<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
>(idSchema: Schema<Id>, incremental: Incremental<Value, Diff>) {
    return Schema.object<IncrementalTableDiff<Id, Value, Diff>>({
        insert: Schema.objectMap(idSchema, incremental.valueSchema).optional(),
        update: Schema.objectMap(
            idSchema,
            Schema.arrayOf(incremental.diffSchema),
        ).optional(),
        delete: Schema.objectMap(idSchema, Schema.value(1)).optional(),
    }).indexed({
        insert: 0,
        update: 1,
        delete: 2,
    });
}

export interface IncrementalTable<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
> extends Incremental<
        IncrementalTableValue<Id, Value>,
        IncrementalTableDiff<Id, Value, Diff>
    > {
    readonly idSchema: Schema<Id>;
    readonly record: Incremental<Value, Diff>;
}

export function incrementalTable<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
>(
    idSchema: Schema<Id>,
    record: Incremental<Value, Diff>,
): IncrementalTable<Id, Value, Diff> {
    return {
        idSchema,
        record,
        valueSchema: Schema.arrayOf(record.valueSchema).transform(
            (array) =>
                Result.ok(
                    Immutable.Map(array.map((value) => [value.id, value])),
                ),
            Schema.cannotValidate("IncrementalTable"),
            (table) => table.valueSeq().toArray(),
        ),
        diffSchema: incrementalTableDiffSchema(idSchema, record),
        apply(value, diff) {
            const result = value.asMutable();
            const inverse: MutableIncrementalTableDiff<Id, Value, Diff> = {
                insert: undefined,
                update: undefined,
                delete: undefined,
            };
            if (diff.insert !== undefined) {
                inverse.delete = {};
                for (const id of keys(diff.insert)) {
                    const value = assertExists(diff.insert[id]);
                    assert(!result.has(id));
                    result.set(id, value);
                    inverse.delete[id] = 1;
                }
            }
            if (diff.update !== undefined) {
                inverse.update = {};
                for (const id of keys(diff.update)) {
                    const oldValue = assertExists(result.get(id));
                    const updates = assertExists(diff.update[id]);
                    let newValue = oldValue;
                    const inverseUpdates: Diff[] = [];
                    for (const update of updates) {
                        const [_newValue, inverseUpdate] = record.apply(
                            newValue,
                            update,
                        );
                        newValue = _newValue;
                        const lastInverseUpdate =
                            inverseUpdates[inverseUpdates.length - 1];
                        const coalescedInverseUpdate =
                            lastInverseUpdate ?
                                record.coalesce(
                                    lastInverseUpdate,
                                    inverseUpdate,
                                )
                            :   null;
                        if (coalescedInverseUpdate === null) {
                            inverseUpdates.push(inverseUpdate);
                        } else {
                            inverseUpdates[inverseUpdates.length - 1] =
                                coalescedInverseUpdate;
                        }
                    }
                    inverse.update[id] = inverseUpdates;
                    result.set(id, newValue);
                }
            }
            if (diff.delete !== undefined) {
                inverse.insert = {};
                for (const id of keys(diff.delete)) {
                    const value = assertExists(result.get(id));
                    result.delete(id);
                    inverse.insert[id] = value;
                }
            }
            return [result.asImmutable(), inverse];
        },
        coalesce(diff1, diff2) {
            const result: MutableIncrementalTableDiff<Id, Value, Diff> = {
                insert: undefined,
                update: undefined,
                delete: undefined,
            };

            if (diff1.insert !== undefined) {
                result.insert = { ...diff1.insert };
            }

            if (diff1.update !== undefined) {
                result.update = {
                    ...mapObjectValues(diff1.update, (updates) =>
                        updates?.slice(),
                    ),
                };
            }

            if (diff1.delete !== undefined) {
                result.delete = { ...diff1.delete };
            }

            if (diff2.insert !== undefined) {
                result.insert ??= {};
                for (const id of keys(diff2.insert)) {
                    assert(!result.insert[id] && !result.update?.[id]);
                    result.insert[id] = diff2.insert[id];
                    if (result.delete?.[id]) {
                        delete result.delete[id];
                    }
                }
            }

            if (diff2.update !== undefined) {
                result.update ??= {};
                for (const id of keys(diff2.update)) {
                    assert(!result.delete?.[id]);
                    const updates = assertExists(diff2.update[id]);
                    let insertedValue = result.insert?.[id];
                    if (insertedValue) {
                        for (const update of updates) {
                            const [newValue, _] = record.apply(
                                insertedValue!,
                                update,
                            );
                            insertedValue = newValue;
                        }
                        result.insert![id] = insertedValue;
                    } else {
                        const existingUpdates = result.update?.[id];
                        if (existingUpdates) {
                            const lastExistingUpdate =
                                existingUpdates[existingUpdates.length - 1];
                            const nextUpdate = assertExists(updates[0]);
                            const coalescedUpdate =
                                lastExistingUpdate ?
                                    record.coalesce(
                                        lastExistingUpdate,
                                        nextUpdate,
                                    )
                                :   null;
                            if (coalescedUpdate === null) {
                                existingUpdates.push(...updates);
                            } else {
                                existingUpdates[existingUpdates.length - 1] =
                                    coalescedUpdate;
                                existingUpdates.push(...updates.slice(1));
                            }
                        } else {
                            result.update[id] = updates.slice();
                        }
                    }
                }
            }

            if (diff2.delete !== undefined) {
                result.delete ??= {};
                for (const id of keys(diff2.delete)) {
                    if (result.insert?.[id]) {
                        delete result.insert[id];
                    } else {
                        if (result.update?.[id]) {
                            delete result.update[id];
                        }
                        result.delete[id] = 1;
                    }
                }
            }

            return result;
        },
    };
}

export function appendIncrementalDiff<Value, Diff>(
    incremental: Incremental<Value, Diff>,
    array: readonly Diff[],
    nextDiff: Diff,
): Diff[] {
    const lastDiff = array[array.length - 1];
    const coalescedDiff =
        lastDiff ? incremental.coalesce(lastDiff, nextDiff) : null;
    if (coalescedDiff === null) {
        return [...array, nextDiff];
    } else {
        return [...array.slice(0, array.length - 1), coalescedDiff];
    }
}
