import { Schema } from "@/lib/schema";
import {
    WatchableStorage,
    getStorageItem,
    setStorageItem,
    urlStorage,
} from "@/lib/storage";
import { Initializer, UpdateAction, applyUpdate } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

interface Opts {
    delayMs?: number | null;
}

export function useStorageState<T>(
    storage: Storage | WatchableStorage,
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
    { delayMs = null }: Opts = {},
): [T, (update: UpdateAction<T>) => void] {
    const [stored, setStored] = useState(() => ({
        dirty: false,
        value: getStorageItem(storage, key, schema, initialValue),
    }));

    useEffect(() => {
        if (stored.dirty) {
            if (delayMs !== null) {
                const timer = setTimeout(() => {
                    setStorageItem(storage, key, schema, stored.value);
                }, delayMs);
                return () => clearTimeout(timer);
            } else {
                setStorageItem(storage, key, schema, stored.value);
            }
        }
    }, [storage, key, schema, stored, delayMs]);

    useEffect(() => {
        if ("watchItem" in storage) {
            return storage.watchItem(key, () => {
                setStored((prev) => ({
                    dirty: false,
                    value: getStorageItem(storage, key, schema, prev.value),
                }));
            });
        }
    }, [storage, key, schema]);

    return [
        stored.value,
        useCallback((update) => {
            setStored((prev) => ({
                dirty: true,
                value: applyUpdate(prev.value, update),
            }));
        }, []),
    ];
}

export function useLocalStorageState<T>(
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
    opts?: Opts,
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(window.localStorage, key, schema, initialValue);
}

export function useSessionStorageState<T>(
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
    opts?: Opts,
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(window.sessionStorage, key, schema, initialValue);
}

export function useUrlStorageState<T>(
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
    opts?: Opts,
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(urlStorage, key, schema, initialValue);
}
