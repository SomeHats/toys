import { LiveValue } from "@/lib/live/live";
import { LiveComputation } from "@/lib/live/LiveComputation";
import { noop } from "@/lib/utils";
import { expect, test, vi } from "vitest";

function scenario() {
    const v1 = new LiveValue(1);
    const v2 = new LiveValue(0);
    const vConditional = new LiveValue(true);

    const computationFn = vi.fn(() => {
        v1.live();
        if (v2.live()) {
            vConditional.live();
        }
    });

    const computation = new LiveComputation(computationFn);

    return { v1, v2, vConditional, computation, computationFn };
}

test("tracks dependencies", () => {
    const { v1, v2, vConditional, computation } = scenario();
    expect(v1.getInvalidateListenerCount()).toBe(0);
    expect(v2.getInvalidateListenerCount()).toBe(0);
    expect(vConditional.getInvalidateListenerCount()).toBe(0);

    const unsubscribe = computation.addInvalidateListener(noop);

    computation.computeIfNeeded();
    expect(v1.getInvalidateListenerCount()).toBe(1);
    expect(v2.getInvalidateListenerCount()).toBe(1);
    expect(vConditional.getInvalidateListenerCount()).toBe(0);

    v2.set(1);
    computation.computeIfNeeded();
    expect(v1.getInvalidateListenerCount()).toBe(1);
    expect(v2.getInvalidateListenerCount()).toBe(1);
    expect(vConditional.getInvalidateListenerCount()).toBe(1);

    v2.set(0);
    computation.computeIfNeeded();
    expect(v1.getInvalidateListenerCount()).toBe(1);
    expect(v2.getInvalidateListenerCount()).toBe(1);
    expect(vConditional.getInvalidateListenerCount()).toBe(0);

    unsubscribe();
    expect(v1.getInvalidateListenerCount()).toBe(0);
    expect(v2.getInvalidateListenerCount()).toBe(0);
    expect(vConditional.getInvalidateListenerCount()).toBe(0);
});

test("invalidates and recomputes lazily", () => {
    const { v1, v2, computation, computationFn } = scenario();
    const invalidated = vi.fn();

    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(0);

    computation.addInvalidateListener(invalidated);
    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(1);
    expect(invalidated).toHaveBeenCalledTimes(0);

    // set to same value means invalidate but no recomputation
    v1.set(v1.getWithoutListening());
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);
    expect(invalidated).toHaveBeenCalledTimes(1);

    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(1);
    expect(invalidated).toHaveBeenCalledTimes(1);

    // set to different values on multiple only results in 1 recomputation/invalidation
    v1.set(2);
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);
    expect(invalidated).toHaveBeenCalledTimes(2);

    v2.set(3);
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);
    expect(invalidated).toHaveBeenCalledTimes(2);

    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(2);
    expect(invalidated).toHaveBeenCalledTimes(2);
});

test("invalidates and recomputes lazily event without invalidation fn", () => {
    const { v1, v2, computation, computationFn } = scenario();

    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(0);

    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(1);

    // set to same value means invalidate but no recomputation
    v1.set(v1.getWithoutListening());
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);

    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(1);

    // set to different values on multiple only results in 1 recomputation/invalidation
    v1.set(2);
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);

    v2.set(3);
    expect(computation.isValid()).toBe(false);
    expect(computationFn).toHaveBeenCalledTimes(1);

    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(computationFn).toHaveBeenCalledTimes(2);
});

test.only("can write from computation", () => {
    const value = new LiveValue(2);
    const computation = new LiveComputation(() => {
        const v = value.live();
        if (v % 3 !== 0) {
            value.set(v - 1);
        }
    });

    expect(computation.isValid()).toBe(false);
    computation.computeIfNeeded();
    expect(computation.isValid()).toBe(true);
    expect(value.getWithoutListening()).toBe(0);
});