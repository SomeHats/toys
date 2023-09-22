export { default as deepEqual } from "fast-deep-equal/es6";

export type TimeoutId = ReturnType<typeof setTimeout>;
export type IntervalId = ReturnType<typeof setInterval>;

export type ReadonlyRecord<K extends PropertyKey, T> = {
    readonly [P in K]: T;
};

export type ObjectMap<K extends PropertyKey, T> = {
    [P in K]?: T;
};

export type ReadonlyObjectMap<K extends PropertyKey, T> = {
    readonly [P in K]?: T;
};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export function times<T>(n: number, fn: (idx: number) => T): Array<T> {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(fn(i));
    }
    return result;
}

export function lerp(a: number, b: number, n: number): number {
    return (b - a) * n + a;
}

export function invLerp(a: number, b: number, n: number): number {
    return (n - a) / (b - a);
}

export function isWithin(a: number, b: number, n: number): boolean {
    return a > b ? b <= n && n <= a : a <= n && n <= b;
}

export function constrain(min: number, max: number, n: number): number {
    return Math.min(max, Math.max(min, n));
}

export function constrainWrapped(min: number, max: number, n: number): number {
    const size = max - min;
    if (size < 0.0001) {
        return min;
    }
    n = n - min;
    while (n < 0) {
        n += size;
    }
    n = n % size;
    return min + n;
}

export function mapRange(a1: number, b1: number, a2: number, b2: number, n: number): number {
    return lerp(a2, b2, invLerp(a1, b1, n));
}

export function random(a: number, b?: number) {
    if (typeof b === "number") {
        return lerp(a, b, Math.random());
    }
    return lerp(0, a, Math.random());
}

export function randomInt(a: number, b?: number) {
    return Math.floor(random(a, b));
}

export function varyAbsolute(base: number, amount: number): number {
    return random(base - amount, base + amount);
}

export function varyRelative(base: number, amount: number): number {
    return varyAbsolute(base, base * amount);
}

export function sample<T>(arr: ReadonlyArray<T>): T {
    return arr[Math.floor(random(arr.length))];
}

export function flatten<T>(arr: ReadonlyArray<ReadonlyArray<T>>): Array<T> {
    return arr.reduce<Array<T>>((a, b) => a.concat(b), []);
}

export function uniq<T>(arr: T[]): Array<T> {
    return Array.from(new Set(arr));
}

export function intersection<T>(a1: T[], a2: T[]): T[] {
    const a1Items = new Set(a1);
    const result = new Set<T>();
    for (const item of a2) {
        if (a1Items.has(item)) {
            result.add(item);
        }
    }
    return Array.from(result);
}

export function groupBy<T, Key>(
    items: ReadonlyArray<T>,
    getKey: (item: T) => Key,
): Map<Key, Array<T>> {
    const groups = new Map<Key, T[]>();
    for (const item of items) {
        const key = getKey(item);
        const existing = groups.get(key);
        if (existing) {
            existing.push(item);
        } else {
            groups.set(key, [item]);
        }
    }

    return groups;
}

export function sortBy<T, Key extends number | string>(
    items: ReadonlyArray<T>,
    getKey: (item: T) => Key,
): Array<T> {
    return items.slice().sort((a, b) => (getKey(a) < getKey(b) ? -1 : 1));
}

export function partition<T>(items: ReadonlyArray<T>, condition: (item: T) => boolean): [T[], T[]] {
    const pass = [];
    const fail = [];
    for (const item of items) {
        if (condition(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    }
    return [pass, fail];
}

export function randomColor(): string {
    return `rgb(${Math.floor(random(256))},${Math.floor(random(256))},${Math.floor(random(256))})`;
}

export function removeFromArray<T>(array: Array<T>, item: T) {
    const idx = array.indexOf(item);
    if (idx !== -1) {
        array.splice(idx, 1);
    }
}

export function frame(): Promise<number> {
    return new Promise((resolve) => {
        window.requestAnimationFrame((time) => resolve(time));
    });
}

export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export function frameLoop(cb: (time: number, cancel: () => void) => void): () => void {
    let shouldCancel = false;
    const cancel = () => {
        shouldCancel = true;
    };
    (async () => {
        while (true) {
            if (shouldCancel) {
                return;
            }
            cb(await frame(), cancel);
        }
    })();
    return cancel;
}

export function fromEntries<K extends PropertyKey, V>(entries: Iterable<[K, V]>): Record<K, V> {
    const result = {} as Record<K, V>;
    for (const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}

export function keys<K extends string, V>(object: ReadonlyObjectMap<K, V>): Array<K> {
    return Object.keys(object) as K[];
}

export function values<K extends string, V>(object: ReadonlyRecord<K, V>): Array<V> {
    return Object.values(object) as V[];
}

export function entries<K extends string, V>(object: ReadonlyRecord<K, V>): Array<[K, V]>;
export function entries<K extends string, V>(
    object: ReadonlyObjectMap<K, V>,
): Array<[K, V | undefined]>;
export function entries<K extends string, V>(object: ReadonlyRecord<K, V>): Array<[K, V]> {
    return Object.entries(object) as [K, V][];
}

export function compact<T>(arr: ReadonlyArray<T>): Array<NonNullable<T>> {
    return arr.filter((item): item is NonNullable<T> => item !== null && item !== undefined);
}

export function normalizeAngle(angle: number): number {
    return constrainWrapped(-Math.PI, Math.PI, angle);
}

export function clamp(a: number, b: number, n: number): number {
    return Math.max(Math.min(a, b), Math.min(Math.max(a, b), n));
}

export function shuffle<T>(arr: ReadonlyArray<T>): Array<T> {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export function getId(prefix = ""): string {
    return `${prefix}${Math.random().toString(36).slice(1)}`;
}

export function debounce<Args extends Array<unknown>>(
    ms: number,
    fn: (...args: Args) => void,
): { (...args: Args): void; cancel: () => void } {
    let timeoutHandle: TimeoutId | undefined;

    const debounced = (...args: Args) => {
        if (timeoutHandle !== undefined) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout(() => fn(...args), ms);
    };

    debounced.cancel = () => {
        if (timeoutHandle !== undefined) {
            clearTimeout(timeoutHandle);
        }
    };

    return debounced;
}

export function exhaustiveSwitchError(value: never): never {
    throw new Error(`Unknown switch case ${value}`);
}

export function has(obj: object, key: string | number | symbol): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function get<K extends string, V>(obj: Partial<Record<K, V>>, key: K): V | undefined;
export function get(obj: object, key: string): unknown;
export function get(obj: object, key: string): unknown {
    if (!has(obj, key)) {
        return undefined;
    }
    // @ts-expect-error we know the property exists
    return obj[key];
}

export function approxEq(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}

export function queueMicrotask(callback: () => void): () => void {
    let isCancelled = false;
    Promise.resolve()
        .then(() => {
            if (isCancelled) {
                return;
            }
            callback();
        })
        .catch((e) =>
            setTimeout(() => {
                throw e;
            }),
        );
    return () => {
        isCancelled = true;
    };
}

export function promiseFromEvents<T>(
    setupResolve: (resolve: (value: T) => void) => void,
    setupReject: (reject: (error: unknown) => void) => void,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        setupResolve(resolve);
        setupReject(reject);
    });
}

export function mapObjectValues<K extends string, V, U>(
    object: ReadonlyRecord<K, V>,
    fn: (value: V, key: K, obj: ReadonlyRecord<K, V>) => U,
): Record<K, U>;
export function mapObjectValues<K extends string, V, U>(
    object: ReadonlyObjectMap<K, V>,
    fn: (value: V, key: K, obj: ReadonlyObjectMap<K, V>) => U,
): ObjectMap<K, U>;
export function mapObjectValues<K extends string, V, U>(
    object: ReadonlyRecord<K, V>,
    fn: (value: V, key: K, obj: ReadonlyRecord<K, V>) => U,
): Record<K, U> {
    const result = {} as Record<K, U>;
    for (const [k, v] of entries(object)) {
        result[k] = fn(v, k, object);
    }
    return result;
}

export function last<T>(arr: ReadonlyArray<T>): T | undefined {
    if (!arr.length) {
        return undefined;
    }
    return arr[arr.length - 1];
}

export function* indexed<T>(iterable: Iterable<T>): Generator<[number, T], void> {
    let i = 0;
    for (const item of iterable) {
        yield [i, item];
        i++;
    }
}

export function copyArrayAndInsert<T>(array: ReadonlyArray<T>, index: number, item: T): Array<T> {
    const copied = array.slice();
    copied.splice(index, 0, item);
    return copied;
}

export function copyArrayAndReplace<T>(array: ReadonlyArray<T>, index: number, item: T): Array<T> {
    const copied = array.slice();
    copied[index] = item;
    return copied;
}

export function copyAndRemove<T>(array: ReadonlyArray<T>, index: number): Array<T> {
    const copied = array.slice();
    copied.splice(index, 1);
    return copied;
}

export function noop() {}
export function identity<T>(value: T): T {
    return value;
}

export const IS_MAC = /(Mac|iPhone|iPod|iPad)/i.test(globalThis.navigator?.platform ?? "");

export type CallbackAction<T> = (state: T) => T;
export type UpdateAction<T> = CallbackAction<T> | T;
export type UpdateFn<T> = (update: UpdateAction<T>) => void;

/**
 * Updates a `T` by either replacing it directly with a new `T` or calling a
 * function with the old value to return a new one.
 */
export function applyUpdate<T>(prev: T, action: UpdateAction<T>): T {
    if (typeof action == "function") {
        return (action as (state: T) => T)(prev);
    } else {
        return action;
    }
}

/**
 * Updates a `T[Key]` by either replacing it directly with a new `T[Key]` or
 * calling a function with the old value to return a new one.
 */
export function applyUpdateWithin<T, Key extends keyof T>(
    state: T,
    key: Key,
    update: UpdateAction<T[Key]>,
): T {
    const before = state[key];
    const after = applyUpdate(before, update);
    if (Object.is(before, after)) {
        return state;
    }
    return {
        ...state,
        [key]: after,
    };
}

export type Initializer<T> = T | (() => T);
export function resolveInitializer<T>(initializer: Initializer<T>): T {
    if (typeof initializer === "function") {
        return (initializer as () => T)();
    } else {
        return initializer;
    }
}

export function stringFromError(error: unknown) {
    if (typeof error === "string") {
        return error;
    }
    if (typeof error === "object" && error !== null) {
        const message = get(error, "message");
        if (message) {
            return message;
        }
    }
    return "unknown error";
}

export function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI;
}

export function windows<T>(array: ReadonlyArray<T>, size: number): Array<Array<T>> {
    const result = [];
    for (let i = 0; i < array.length - size + 1; i++) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export function maxBy<T>(array: ReadonlyArray<T>, fn: (item: T) => number): T | undefined {
    let max: T | undefined;
    let maxValue: number | undefined;
    for (const item of array) {
        const value = fn(item);
        if (maxValue === undefined || value > maxValue) {
            max = item;
            maxValue = value;
        }
    }
    return max;
}

export function minBy<T>(array: ReadonlyArray<T>, fn: (item: T) => number): T | undefined {
    return maxBy(array, (item) => -fn(item));
}

/**
 * A binary search implementation that returns the index if a match is found.
 * If no match is found, then the left-index (the index associated with the item that comes just
 * before the desired index) is returned. To maintain proper sort order, a splice would happen at
 * the next index:
 */
export function binarySearch(
    haystack: number[],
    needle: number,
    low = 0,
    high = haystack.length - 1,
) {
    while (low <= high) {
        const mid = low + ((high - low) >> 1);
        const cmp = haystack[mid] - needle;
        if (cmp === 0) {
            return mid;
        }
        if (cmp < 0) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low - 1;
}
