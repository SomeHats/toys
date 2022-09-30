import { LiveValue } from "@/lib/live/LiveValue";
import { beforeEach, expect, test, vi } from "vitest";

const addOne = vi.fn((n: number) => n + 1);
beforeEach(() => {
    vi.restoreAllMocks();
});

test("read value", () => {
    const value = new LiveValue(1);
    expect(value.getWithoutListening()).toBe(1);
});

test("can read written value", () => {
    const value = new LiveValue(1);
    value.set(2);
    value.set(addOne);
    expect(value.getWithoutListening()).toBe(3);
});

test("lazily evaluates updates", () => {
    const value = new LiveValue(1);
    value.set(addOne);
    value.set(addOne);
    value.set(addOne);
    expect(addOne).toBeCalledTimes(0);
    expect(value.getWithoutListening()).toBe(4);
    expect(addOne).toBeCalledTimes(3);
});

test("cannot schedule update if another is in progress", () => {
    const value = new LiveValue(1);
    value.set((prev) => {
        value.set(addOne);
        return prev;
    });
    expect(() => value.getWithoutListening()).toThrowErrorMatchingInlineSnapshot(
        '"cannot call set from within an update callback"',
    );
});

test("cannot read when update is in progress", () => {
    const value = new LiveValue(1);
    value.set((prev) => {
        value.getWithoutListening();
        return prev;
    });
    expect(() => value.getWithoutListening()).toThrowErrorMatchingInlineSnapshot(
        '"cannot call getWithoutListening from within an update callback"',
    );
});

test("notifies once of invalidation", () => {
    const value = new LiveValue(1);
    const listener = vi.fn();
    value.addInvalidateListener(listener);

    value.set(addOne);
    expect(listener).toBeCalledTimes(1);
    value.set(addOne);
    expect(listener).toBeCalledTimes(1);

    value.getWithoutListening();
    expect(listener).toBeCalledTimes(1);
    value.set(addOne);
    expect(listener).toBeCalledTimes(2);
    value.set(addOne);
    expect(listener).toBeCalledTimes(2);
});
