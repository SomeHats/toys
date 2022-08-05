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
