import EventEmitter from "@/lib/EventEmitter";
import { applyUpdate, UpdateAction } from "@/lib/utils";
import { useCallback, useSyncExternalStore } from "react";
import { Unsubscribe } from "use-subscription";

export class Cell<T> {
    private event = new EventEmitter<[current: T, previous: T]>();

    constructor(private value: T) {}

    get(): T {
        return this.value;
    }

    set(update: UpdateAction<T>) {
        const previous = this.value;
        this.value = applyUpdate(this.value, update);
        if (this.value !== previous) {
            this.event.emit(this.value, previous);
        }
    }

    subscribe(callback: (current: T, previous: T) => void): Unsubscribe {
        return this.event.listen(callback);
    }
}

export function useCellValue<T>(cell: Cell<T>): T {
    return useSyncExternalStore(
        useCallback((onChange) => cell.subscribe(onChange), [cell]),
        () => cell.get(),
    );
}
export function useCellUpdate<T>(cell: Cell<T>): (update: UpdateAction<T>) => void {
    return useCallback((update: UpdateAction<T>) => cell.set(update), [cell]);
}
export function useCell<T>(cell: Cell<T>): [T, (update: UpdateAction<T>) => void] {
    return [useCellValue(cell), useCellUpdate(cell)];
}
