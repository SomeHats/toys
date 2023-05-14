import { useCallback, useEffect, useState } from "react";
import { UpdateAction, Initializer, applyUpdate } from "@/lib/utils";
import { getStorageItem, setStorageItem, urlStorage } from "@/lib/storage";
import { Schema } from "@/lib/schema";

export function useStorageState<T>(
    storage: Storage,
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
): [T, (update: UpdateAction<T>) => void] {
    const [stored, setStored] = useState(() => ({
        dirty: false,
        value: getStorageItem(storage, key, schema, initialValue),
    }));

    useEffect(() => {
        if (stored.dirty) {
            setStorageItem(storage, key, schema, stored.value);
        }
    }, [storage, key, schema, stored]);

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
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(window.localStorage, key, schema, initialValue);
}

export function useSessionStorageState<T>(
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(window.sessionStorage, key, schema, initialValue);
}

export function useUrlStorageState<T>(
    key: string,
    schema: Schema<T>,
    initialValue: Initializer<T>,
): [T, (update: UpdateAction<T>) => void] {
    return useStorageState(urlStorage, key, schema, initialValue);
}
