import { assert, assertExists } from "@/lib/assert";
import { entries, keys } from "@/lib/utils";
import {
    IncrementalSignal,
    IncrementalTable,
} from "@/splatapus2/store/Incremental";
import {
    Computed,
    RESET_VALUE,
    computed,
    isUninitialized,
} from "@tldraw/state";
import Immutable from "immutable";

export class Index<
    Id extends string,
    Value extends { readonly id: Id },
    Diff,
    Field,
> {
    private readonly result: Computed<{
        index: Immutable.Map<Field, Immutable.Set<Id>>;
        fields: Immutable.Map<Id, Field>;
    }>;

    constructor(
        private readonly tableSignal: IncrementalSignal<
            IncrementalTable<Id, Value, Diff>
        >,
        getField: (value: Value) => Field,
    ) {
        const computeFromScratch = () => {
            console.log("computeFromScratch");
            const index = Immutable.Map<Field, Immutable.Set<Id>>().asMutable();
            const fields = Immutable.Map<Id, Field>().asMutable();

            for (const [id, value] of tableSignal.get()) {
                const field = getField(value);
                index.update(field, (ids) =>
                    ids ? ids.add(id) : Immutable.Set([id]),
                );
                fields.set(id, field);
            }

            return {
                index: index.asImmutable(),
                fields: fields.asImmutable(),
            };
        };

        this.result = computed(
            `${tableSignal.name}.${String(getField)}`,
            (previousValue, lastComputedEpoch) => {
                if (isUninitialized(previousValue)) {
                    return computeFromScratch();
                }

                const tableDiffs = tableSignal.getDiffSince(lastComputedEpoch);
                if (tableDiffs === RESET_VALUE) {
                    return computeFromScratch();
                }

                const index = previousValue.index.asMutable();
                const fields = previousValue.fields.asMutable();
                let didChange = false;

                for (const tableDiff of tableDiffs) {
                    if (tableDiff.insert) {
                        for (const [id, value] of entries(tableDiff.insert)) {
                            if (!value) continue;
                            const field = getField(value);
                            index.update(field, (ids) =>
                                ids ? ids.add(id) : Immutable.Set([id]),
                            );
                            fields.set(id, field);
                            didChange = true;
                        }
                    }
                    if (tableDiff.update) {
                        for (const [id, diff] of entries(tableDiff.update)) {
                            if (!diff) continue;
                            const value = tableSignal.get().get(id);
                            assert(value);
                            const oldField = assertExists(fields.get(id));
                            const newField = getField(value);
                            if (oldField !== newField) {
                                index.update(oldField, (ids) =>
                                    assertExists(ids).remove(id),
                                );
                                index.update(newField, (ids) =>
                                    ids ? ids.add(id) : Immutable.Set([id]),
                                );
                                fields.set(id, newField);
                                didChange = true;
                            }
                        }
                    }
                    if (tableDiff.delete) {
                        for (const id of keys(tableDiff.delete)) {
                            const field = assertExists(fields.get(id));
                            index.update(field, (ids) =>
                                assertExists(ids).remove(id),
                            );
                            fields.delete(id);
                            didChange = true;
                        }
                    }
                }

                if (!didChange) return previousValue;

                return {
                    index: index.asImmutable(),
                    fields: fields.asImmutable(),
                };
            },
        );
    }

    *iterate(field: Field) {
        const ids = this.result.get().index.get(field);
        if (!ids) return;
        for (const id of ids) {
            const value = this.tableSignal.get().get(id);
            assert(value);
            yield value;
        }
    }

    getOneIfExists(field: Field): Value | undefined {
        const ids = this.result.get().index.get(field);
        if (!ids) return;
        assert(ids.size === 1);
        return this.tableSignal.get().get(ids.first());
    }

    getOne(field: Field): Value {
        const value = this.getOneIfExists(field);
        assert(value);
        return value;
    }
}
