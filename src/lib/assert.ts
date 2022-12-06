import { omitFromStackTrace } from "@/lib/omitFromStackTrace";

export const fail: (message: string) => never = omitFromStackTrace((message) => {
    throw new Error(message);
});

export const assert: (value: unknown, message?: string, debug?: boolean) => asserts value =
    omitFromStackTrace((value, message, debug) => {
        if (!value) {
            if (process.env.NODE_ENV !== "production" && !import.meta.vitest && debug) {
                // eslint-disable-next-line no-debugger
                debugger;
            }
            fail(message || "Assertion Error");
        }
    });

export function assertNumber(value: unknown): number {
    assert(typeof value === "number", "value must be number");
    return value;
}

export const assertExists = omitFromStackTrace(<T>(value: T, message?: string): NonNullable<T> => {
    if (value == null) {
        fail(message ?? "value must be defined");
    }
    return value as NonNullable<T>;
});
