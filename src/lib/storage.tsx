import { Schema } from "@/lib/schema";
import { Initializer, resolveInitializer } from "@/lib/utils";

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
