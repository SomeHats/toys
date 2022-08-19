import { assert, assertExists } from "@/lib/assert";
import { get, has, ReadonlyRecord } from "@/lib/utils";

export type TableData<T extends { readonly id: string }> = ReadonlyRecord<T["id"], T>;

export class Table<T extends { readonly id: string }> implements Iterable<T> {
    readonly data: TableData<T>;

    constructor(data: TableData<T>) {
        this.data = data;
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
