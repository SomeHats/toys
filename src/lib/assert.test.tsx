import { assert } from "@/lib/assert";
import { expect, test } from "vitest";

test("normalizes stack traces", () => {
    function myFunctionThatThrows() {
        assert(2 + 2 === 5, "it failed!");
    }

    let thrownError: Error | undefined = undefined;
    try {
        myFunctionThatThrows();
    } catch (err) {
        thrownError = err as Error;
    }

    assert(thrownError);
    assert(thrownError.stack?.startsWith(`Error: it failed!\n    at myFunctionThatThrows`));
});

test("automatically inserts an error message", () => {
    // this is actually testing code in `vite.config.ts`
    expect(() => assert(2 + 2 === 5)).toThrowErrorMatchingInlineSnapshot(
        '"Assertion Error: 2 + 2 === 5"',
    );
});
