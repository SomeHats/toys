import { assert, assertExists, fail } from "@/lib/assert";
import { createDictParser, createShapeParser, Parser } from "@/lib/objectParser";
import {
    applyUpdate,
    copyAndRemove,
    fromEntries,
    get,
    has,
    ObjectMap,
    ReadonlyObjectMap,
    UpdateAction,
} from "@/lib/utils";

export type UnknownTableEntry = { readonly id: string };
export type TableData<T extends UnknownTableEntry> = ReadonlyObjectMap<T["id"], T>;

export function createTableDataParser<T extends UnknownTableEntry>(parsers: {
    [K in keyof T]: Parser<T[K]>;
}): Parser<TableData<T>> {
    return createDictParser(parsers.id, createShapeParser(parsers));
}

export class Table<T extends UnknownTableEntry> implements Iterable<T> {
    readonly data: TableData<T>;

    static fromArray<T extends UnknownTableEntry>(entries: Array<T>): Table<T> {
        return new Table(fromEntries(entries.map((item) => [item.id, item] as [T["id"], T])));
    }

    constructor(data: TableData<T>) {
        this.data = data;
    }

    has(id: T["id"]): boolean {
        return has(this.data, id);
    }

    getIfExists(id: T["id"]): T | undefined {
        return get(this.data, id);
    }

    get(id: T["id"]): T {
        const item = this.getIfExists(id);
        assert(item != null, `Item with id ${id} not found`);
        return item;
    }

    insert(item: T): Table<T> {
        return new Table({ ...this.data, [item.id]: item });
    }

    update(id: T["id"], update: UpdateAction<T>): Table<T> {
        const before = this.get(id);
        const after = applyUpdate(before, update);
        assert(before.id === after.id);
        return this.insert(after);
    }

    delete(id: T["id"]): Table<T> {
        const { [id]: _, ...data } = this.data;
        return new Table(data as TableData<T>);
    }

    *[Symbol.iterator](): Iterator<T, void> {
        for (const id in this.data) {
            if (has(this.data, id)) {
                yield assertExists(this.data[id as T["id"]]);
            }
        }
    }
}

export class OneToOneIndex<From extends string, To extends string> {
    static build<From extends string, To extends string, Key extends string>(
        key: Key,
        entries: Iterable<{ readonly id: From } & { readonly [K in Key]: To }>,
    ): OneToOneIndex<From, To> {
        const index: ObjectMap<To, Array<From>> = {};
        for (const entry of entries) {
            const fromId = entry.id;
            const toId: To = entry[key];
            const indexItem = get(index, toId);
            if (indexItem) {
                indexItem.push(fromId);
            } else {
                index[toId] = [fromId];
            }
        }
        return new OneToOneIndex(index);
    }

    constructor(private readonly inverse: ReadonlyObjectMap<To, ReadonlyArray<From>> = {}) {}

    lookupInverseIfExists(id: To): From | undefined {
        return get(this.inverse, id)?.[0];
    }

    lookupInverse(id: To): From {
        const entry = this.lookupInverseIfExists(id);
        assert(entry != null, `Item with id ${id} not found`);
        return entry;
    }

    add(fromId: From, toId: To): OneToOneIndex<From, To> {
        const existing = get(this.inverse, toId);
        if (existing) {
            assert(
                !existing.includes(fromId),
                `relation ${toId}<->${fromId} already exists in index`,
            );

            return new OneToOneIndex({
                ...this.inverse,
                [toId]: [...existing, fromId],
            });
        }

        return new OneToOneIndex({
            ...this.inverse,
            [toId]: [fromId],
        });
    }

    remove(fromId: From, toId: To): OneToOneIndex<From, To> {
        const existing = get(this.inverse, toId);
        if (existing) {
            const existingIndex = existing.indexOf(fromId);
            if (existingIndex >= 0) {
                if (existing.length > 1) {
                    return new OneToOneIndex({
                        ...this.inverse,
                        [toId]: copyAndRemove(existing, existingIndex),
                    });
                } else {
                    return new OneToOneIndex({
                        ...this.inverse,
                        [toId]: undefined,
                    });
                }
            }
        }
        fail(`relation ${toId}<->${fromId} not found in index`);
    }
}
