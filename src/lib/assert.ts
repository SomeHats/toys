export function fail(message: string): never {
    throw new Error(message);
}

export function assert(value: unknown, message?: string, debug?: boolean): asserts value {
    if (!value) {
        if (process.env.NODE_ENV !== "production" && !import.meta.vitest && debug) {
            // eslint-disable-next-line no-debugger
            debugger;
        }
        fail(message || "Assertion Error");
    }
}

export function assertNumber(value: unknown): number {
    assert(typeof value === "number", "value must be number");
    return value;
}

export function assertExists<T>(value: T, message?: string): NonNullable<T> {
    if (value == null) {
        fail(message ?? "value must be defined");
    }
    return value as NonNullable<T>;
}
