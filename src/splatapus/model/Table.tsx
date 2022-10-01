import { assert, assertExists } from "@/lib/assert";
import {
    applyUpdate,
    fromEntries,
    get,
    has,
    keys,
    ReadonlyObjectMap,
    UpdateAction,
} from "@/lib/utils";

export type UnknownTableEntry = { readonly id: string };
export type TableData<T extends UnknownTableEntry> = ReadonlyObjectMap<T["id"], T>;

export class Table<T extends UnknownTableEntry> implements Iterable<T> {
    readonly data: TableData<T>;

    static fromArray<T extends UnknownTableEntry>(entries: Array<T>): Table<T> {
        return new Table(fromEntries(entries.map((item) => [item.id, item] as [T["id"], T])));
    }

    constructor(data: TableData<T>) {
        this.data = data;
    }

    count(): number {
        return keys(this.data).length;
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

    toJSON() {
        return this.data;
    }
}

export class UniqueIndex<Entry, Value, Lookup> {
    static build<Entry, Value, Lookup>(
        entries: Iterable<Entry>,
        getKey: (entry: Entry) => string,
        getValue: (entry: Entry) => Value,
        getLookupKey: (lookup: Lookup) => string,
    ): UniqueIndex<Entry, Value, Lookup> {
        const index = new Map<string, Value>();
        for (const entry of entries) {
            const key = getKey(entry);
            assert(!index.has(key));
            index.set(key, getValue(entry));
        }
        return new UniqueIndex(index, getKey, getValue, getLookupKey);
    }

    #getKey: (entry: Entry) => string;
    #getValue: (entry: Entry) => Value;
    #getLookupKey: (Lookup: Lookup) => string;

    private constructor(
        private readonly index: ReadonlyMap<string, Value>,
        getKey: (entry: Entry) => string,
        getValue: (entry: Entry) => Value,
        getLookupKey: (Lookup: Lookup) => string,
    ) {
        this.#getKey = getKey;
        this.#getValue = getValue;
        this.#getLookupKey = getLookupKey;
    }

    private withIndex(index: ReadonlyMap<string, Value>): UniqueIndex<Entry, Value, Lookup> {
        return new UniqueIndex(index, this.#getKey, this.#getValue, this.#getLookupKey);
    }

    lookup(lookup: Lookup): Value | undefined {
        return this.index.get(this.#getLookupKey(lookup));
    }

    insert(entry: Entry) {
        const key = this.#getKey(entry);
        assert(!this.index.has(key), `key ${key} already exists in index`);
        const index = new Map(this.index);
        index.set(key, this.#getValue(entry));
        return this.withIndex(index);
    }

    remove(entry: Entry) {
        const key = this.#getKey(entry);
        assert(this.index.has(key), `key ${key} does not exist in index`);
        const index = new Map(this.index);
        index.delete(key);
        return this.withIndex(index);
    }

    update(entry: Entry) {
        const key = this.#getKey(entry);
        assert(this.index.has(key), `key ${key} does not exist in index`);
        const index = new Map(this.index);
        index.set(key, this.#getValue(entry));
        return this.withIndex(index);
    }

    toJSON() {
        return fromEntries(this.index);
    }
}

const EMPTY_SET: ReadonlySet<never> = new Set();

export class Index<Entry, Value extends string, Lookup> {
    static build<Entry, Value extends string, Lookup>(
        entries: Iterable<Entry>,
        getKey: (entry: Entry) => string,
        getValue: (entry: Entry) => Value,
        getLookupKey: (lookup: Lookup) => string,
    ): Index<Entry, Value, Lookup> {
        const index = new Map<string, Set<Value>>();
        for (const entry of entries) {
            const key = getKey(entry);
            let set = index.get(key);
            if (!set) {
                set = new Set();
                index.set(key, set);
            }
            set.add(getValue(entry));
        }
        return new Index(index, getKey, getValue, getLookupKey);
    }

    #getKey: (entry: Entry) => string;
    #getValue: (entry: Entry) => Value;
    #getLookupKey: (Lookup: Lookup) => string;

    private constructor(
        private readonly index: ReadonlyMap<string, ReadonlySet<Value>>,
        getKey: (entry: Entry) => string,
        getValue: (entry: Entry) => Value,
        getLookupKey: (Lookup: Lookup) => string,
    ) {
        this.#getKey = getKey;
        this.#getValue = getValue;
        this.#getLookupKey = getLookupKey;
    }

    private withIndex(index: ReadonlyMap<string, ReadonlySet<Value>>): Index<Entry, Value, Lookup> {
        return new Index(index, this.#getKey, this.#getValue, this.#getLookupKey);
    }

    lookup(lookup: Lookup): ReadonlySet<Value> {
        return this.index.get(this.#getLookupKey(lookup)) ?? EMPTY_SET;
    }

    insert(entry: Entry) {
        const key = this.#getKey(entry);
        const value = this.#getValue(entry);
        const set = this.index.get(key);
        let nextSet: Set<Value>;
        if (set) {
            assert(!set.has(value), "already exists");
            nextSet = new Set(set);
        } else {
            nextSet = new Set();
        }
        nextSet.add(value);

        const index = new Map(this.index);
        index.set(key, nextSet);
        return this.withIndex(index);
    }

    remove(entry: Entry) {
        const key = this.#getKey(entry);
        const value = this.#getValue(entry);
        const set = this.index.get(key);
        assert(set && set.has(value), "value does not exist");

        const nextSet = new Set(set);
        nextSet.delete(value);
        const index = new Map(this.index);
        index.delete(key);
        return this.withIndex(index);
    }

    update(entryBefore: Entry, entryAfter: Entry) {
        return this.remove(entryBefore).insert(entryAfter);
    }

    toJSON() {
        return fromEntries(this.index);
    }
}
