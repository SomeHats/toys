export function fail(message: string): never {
    throw new Error(message);
}

export function assert(value: unknown, message?: string): asserts value {
    if (!value) {
        fail(message || "Assertion Error");
    }
}

export function assertNumber(value: unknown): number {
    assert(typeof value === "number", "value must be number");
    return value;
}

export function assertExists<T>(value: T): NonNullable<T> {
    if (!value) {
        fail("value must be defined");
    }
    return value as NonNullable<T>;
}
