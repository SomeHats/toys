import { Unsubscribe } from "@/lib/EventEmitter";
import { Schema } from "@/lib/schema";
import { Initializer, resolveInitializer } from "@/lib/utils";

export interface WatchableStorage extends Storage {
    watchItem(key: string, callback: () => void): Unsubscribe;
}

export function getStorageItem<T>(
    storage: Storage,
    key: string,
    schema: Schema<T>,
    fallback: Initializer<T>,
): T {
    try {
        const item = storage.getItem(key);
        return item ? schema.parse(JSON.parse(item)).unwrap() : resolveInitializer(fallback);
    } catch (error) {
        // If error also return initialValue
        console.log("Error reading from storage:", error);
        return resolveInitializer(fallback);
    }
}

export function getStorageItemUnchecked(
    storage: Storage,
    key: string,
    fallback: Initializer<unknown> = null,
): unknown {
    return getStorageItem(storage, key, Schema.unknown, fallback);
}

export function setStorageItem<T>(storage: Storage, key: string, schema: Schema<T>, value: T) {
    const stringified = JSON.stringify(schema.serialize(value));
    try {
        storage.setItem(key, stringified);
    } catch (error) {
        console.log(error);
    }
}

export function setStorageItemUnchecked(storage: Storage, key: string, value: unknown) {
    return setStorageItem(storage, key, Schema.unknown, value);
}

export function getLocalStorageItemUnchecked(
    key: string,
    fallback?: Initializer<unknown>,
): unknown {
    return getStorageItemUnchecked(window.localStorage, key, fallback);
}
export function setLocalStorageItemUnchecked(key: string, value: unknown) {
    return setStorageItemUnchecked(window.localStorage, key, value);
}
export function getLocalStorageItem<T>(
    key: string,
    schema: Schema<T>,
    fallback: Initializer<T>,
): T {
    return getStorageItem(window.localStorage, key, schema, fallback);
}
export function setLocalStorageItem<T>(key: string, schema: Schema<T>, value: T) {
    return setStorageItem(window.localStorage, key, schema, value);
}

export function getSessionStorageItemUnchecked(
    key: string,
    fallback?: Initializer<unknown>,
): unknown {
    return getStorageItemUnchecked(window.sessionStorage, key, fallback);
}
export function setSessionStorageItemUnchecked(key: string, value: unknown) {
    return setStorageItemUnchecked(window.sessionStorage, key, value);
}
export function getSessionStorageItem<T>(
    key: string,
    schema: Schema<T>,
    fallback: Initializer<T>,
): T {
    return getStorageItem(window.sessionStorage, key, schema, fallback);
}
export function setSessionStorageItem<T>(key: string, schema: Schema<T>, value: T) {
    return setStorageItem(window.sessionStorage, key, schema, value);
}

let lastUrlSearchParams: URLSearchParams | null = null;
export const urlStorage: WatchableStorage = {
    get length(): number {
        return Array.from(new URLSearchParams(window.location.search).keys()).length;
    },
    clear: function (): void {
        window.history.replaceState(null, "", window.location.pathname);
    },
    getItem: function (key: string): string | null {
        const rawValue = new URLSearchParams(window.location.search).get(key);
        if (rawValue === null) {
            return null;
        }
        return rawValue;
    },
    key: function (index: number): string | null {
        const keys = Array.from(new URLSearchParams(window.location.search).keys());
        if (index < 0 || index >= keys.length) {
            return null;
        }
        return keys[index];
    },
    removeItem: function (key: string): void {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    },
    setItem: function (key: string, value: string): void {
        const params = new URLSearchParams(window.location.search);
        params.set(key, value);
        window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    },
    watchItem(key, callback) {
        const onUrlStateChange = () => {
            const searchParams = new URLSearchParams(window.location.search);
            if (lastUrlSearchParams && searchParams.get(key) === lastUrlSearchParams.get(key)) {
                return;
            }
            lastUrlSearchParams = searchParams;
            callback();
        };
        window.addEventListener("popstate", onUrlStateChange);
        return () => window.removeEventListener("popstate", onUrlStateChange);
    },
};

export function getUrlStorageItemUnchecked(key: string, fallback?: Initializer<unknown>): unknown {
    return getStorageItemUnchecked(urlStorage, key, fallback);
}

export function setUrlStorageItemUnchecked(key: string, value: unknown) {
    return setStorageItemUnchecked(urlStorage, key, value);
}

export function getUrlStorageItem<T>(key: string, schema: Schema<T>, fallback: Initializer<T>): T {
    return getStorageItem(urlStorage, key, schema, fallback);
}

export function setUrlStorageItem<T>(key: string, schema: Schema<T>, value: T) {
    return setStorageItem(urlStorage, key, schema, value);
}
