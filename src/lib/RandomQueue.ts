import { assert } from "@/lib/assert";
import { random } from "@/lib/utils";

export default class RandomQueue<T> {
    private items: Array<T> = [];

    constructor(items: Array<T> = []) {
        this.items = items.slice();
    }

    add(item: T): void {
        this.items.push(item);
    }

    get size(): number {
        return this.items.length;
    }

    pop(): T {
        assert(this.size, "RandomQueue must not be empty");
        const index = Math.floor(random(this.items.length));
        const item = this.items[index];
        this.items.splice(index, 1);
        return item;
    }
}
