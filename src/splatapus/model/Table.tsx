import EventEmitter from "@/lib/EventEmitter";
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
import { memo } from "@/wires/Model";
import { Atom, Computed, ComputedOptions, RESET_VALUE, Signal, computed } from "signia";

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

    put(item: T): Table<T> {
        return new Table({ ...this.data, [item.id]: item });
    }

    insert(item: T): Table<T> {
        assert(!this.has(item.id));
        return this.put(item);
    }

    update(id: T["id"], update: UpdateAction<T>): Table<T> {
        const before = this.get(id);
        const after = applyUpdate(before, update);
        assert(before.id === after.id);
        return this.put(after);
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

export interface WritableSignal<Value, Diff = unknown> extends Signal<Value, Diff> {
    /**
     * Sets the value of this atom to the given value. If the value is the same as the current value, this is a no-op.
     *
     * @param value - The new value to set.
     * @param diff - The diff to use for the update. If not provided, the diff will be computed using [[AtomOptions.computeDiff]].
     */
    set(value: Value, diff?: Diff): Value;
    /**
     * Updates the value of this atom using the given updater function. If the returned value is the same as the current value, this is a no-op.
     *
     * @param updater - A function that takes the current value and returns the new value.
     */
    update(updater: (value: Value) => Value): Value;
}

export class WritableMemo<Value, Diff = unknown> implements WritableSignal<Value, Diff> {
    private readonly memo: Computed<Value, Dqiff>;
    constructor(
        name: string,
        compute: () => Value,
        private _write: (value: Value, diff?: Diff) => void,
        options?: ComputedOptions<Value, Diff>,
    ) {
        this.memo = computed<Value, Diff>(name, compute, options);
    }
    get name() {
        return this.memo.name;
    }
    get value() {
        return this.memo.value;
    }
    get lastChangedEpoch() {
        return this.memo.lastChangedEpoch;
    }
    getDiffSince(epoch: number): typeof RESET_VALUE | Diff[] {
        return this.memo.getDiffSince(epoch);
    }
    __unsafe__getWithoutCapture(): Value {
        return this.memo.__unsafe__getWithoutCapture();
    }
    set(value: Value, diff?: Diff): Value {
        this._write(value, diff);
        return value;
    }
    update(updater: (value: Value) => Value): Value {
        return this.set(updater(this.value));
    }
}

export class TableView<T extends UnknownTableEntry> {
    private insertEvent = new EventEmitter<[record: T]>();
    private updateEvent = new EventEmitter<[before: T, after: T]>();
    private deleteEvent = new EventEmitter<[deleted: T]>();

    constructor(private readonly _data: WritableMemo<Table<T>>) {}

    private get data(): Table<T> {
        return this._data.value;
    }

    @memo get count(): number {
        return this.data.count();
    }

    #records = new EntryCache(this._data, (entry) => entry);
    has(id: T["id"]): boolean {
        return !!this.#records.getIfExists(id);
    }

    get(id: T["id"]): T {
        return this.#records.get(id);
    }

    getIfExists(id: T["id"]): T | null {
        return this.#records.getIfExists(id);
    }

    insert(entry: T): this {
        this._data.update((data) => data.insert(entry));
        this.insertEvent.emit(entry);
        return this;
    }

    update(id: T["id"], update: UpdateAction<T>): this {
        const before = this.get(id);
        const after = applyUpdate(before, update);
        assert(before.id === after.id);
        this._data.update((data) => data.put(after));
        this.updateEvent.emit(before, after);
        return this;
    }

    delete(id: T["id"]): this {
        const entry = this.get(id);
        this._data.update((data) => data.delete(id));
        this.deleteEvent.emit(entry);
        return this;
    }
}

class EntryCache<T extends UnknownTableEntry, U> {
    private cache = new Map<T["id"], Computed<{ value: U } | null>>();
    constructor(private table: WritableMemo<Table<T>>, private compute: (entry: T) => U) {}

    private read(id: T["id"]): { value: U } | null {
        let entry = this.cache.get(id);
        if (!entry) {
            entry = computed<{ value: U } | null>(`entry ${id}`, () => {
                const record = this.table.value.getIfExists(id);
                if (!record) {
                    this.cache.delete(id);
                    return null;
                }
                return { value: this.compute(record) };
            });
            this.cache.set(id, entry);
        }
        return entry.value;
    }

    getIfExists(id: T["id"]): U | null {
        const result = this.read(id);
        return result ? result.value : null;
    }

    get(id: T["id"]): U {
        const result = this.read(id);
        if (!result) {
            throw new Error(`No entry with id ${id}`);
        }
        return result.value;
    }
}
