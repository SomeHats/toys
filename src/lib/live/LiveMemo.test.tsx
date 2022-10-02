import { LiveMemo } from "@/lib/live/LiveMemo";
import { LiveValue } from "@/lib/live/LiveValue";
import { expect, test, vi } from "vitest";

test("computes derived values", () => {
    const v1 = new LiveValue(1);
    const v2 = new LiveValue(2);
    const memo = new LiveMemo(() => v1.live() + v2.live());

    expect(memo.getOnce()).toBe(3);
    v1.update(2);
    expect(memo.getOnce()).toBe(4);
});

test("compose memos execute lazily", () => {
    const v1 = new LiveValue(1);
    const v2 = new LiveValue(2);
    const v3 = new LiveValue(3);
    const compute1 = vi.fn(() => v1.live() + v2.live());
    const m1 = new LiveMemo(compute1);
    const compute2 = vi.fn(() => m1.live() + v3.live());
    const m2 = new LiveMemo(compute2);

    expect(m2.getOnce()).toBe(6);
    expect(compute1).toBeCalledTimes(1);
    expect(compute2).toBeCalledTimes(1);

    // values change, result is the same:
    v1.update(2);
    v2.update(1);
    expect(m2.getOnce()).toBe(6);
    expect(compute1).toBeCalledTimes(2);
    expect(compute2).toBeCalledTimes(1);
});
