import { times } from "@/lib/utils";

export default class RingBuffer<T> {
    private start = 0;
    private end = 0;
    private buffer: (T | null)[];

    constructor(size = 32) {
        this.buffer = times(Math.max(size, 1), () => null);
    }

    private resize(size: number) {
        const length = this.length;
        this.buffer = times(size, (i) => (i < length ? this.get(i) : null));
        this.start = 0;
        this.end = length;
    }

    private growForInsertIfNeeded() {
        if (this.length >= this.capacity - 1) {
            this.resize(this.capacity * 2);
        }
    }

    get length(): number {
        if (this.start <= this.end) {
            return this.end - this.start;
        } else {
            return this.end + this.buffer.length - this.start;
        }
    }

    get capacity(): number {
        return this.buffer.length;
    }

    get(index: number): T | null {
        return this.buffer[(this.start + index) % this.capacity];
    }

    push(item: T) {
        this.growForInsertIfNeeded();
        this.buffer[this.end] = item;
        this.end = (this.end + 1) % this.capacity;
    }

    pop(): T | null {
        if (this.end === this.start) {
            return null;
        }

        if (this.end === 0) {
            this.end = this.capacity - 1;
        } else {
            this.end = this.end - 1;
        }

        const value = this.buffer[this.end];
        this.buffer[this.end] = null;
        return value;
    }

    unshift(item: T) {
        this.growForInsertIfNeeded();
        if (this.start === 0) {
            this.start = this.capacity - 1;
        } else {
            this.start = this.start - 1;
        }
        this.buffer[this.start] = item;
    }

    shift(): T | null {
        if (this.end === this.start) {
            return null;
        }

        const value = this.buffer[this.start];
        this.buffer[this.start] = null;

        this.start = (this.start + 1) % this.capacity;
        return value;
    }

    first(): T | null {
        return this.get(0);
    }

    last(): T | null {
        return this.get(this.length - 1);
    }
}
