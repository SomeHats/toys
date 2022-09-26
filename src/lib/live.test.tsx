import { LiveMemo, LiveValue } from "@/lib/live";
import { expect, test } from "vitest";

test("tracks dependencies", () => {
    const valueA = new LiveValue(1);
    const valueB = new LiveValue(2);
    const valueC = new LiveValue(3);

    const memoA = new LiveMemo(() => `a = ${valueA.live()}, b = ${valueB.live()}`);
    const memoB = new LiveMemo(() => `${memoA.live()}, c = ${valueC.live()}`);

    expect(memoA.peek()).toStrictEqual("a = 1, b = 2");
    expect(memoB.peek()).toStrictEqual("a = 1, b = 2, c = 3");

    valueA.set(2);
    expect(memoA.peek()).toStrictEqual("a = 2, b = 2");
    expect(memoB.peek()).toStrictEqual("a = 2, b = 2, c = 3");

    const aDeps = Array.from(memoA._dependent.dependencies());
    expect(aDeps).toHaveLength(2);
    expect(aDeps[0]).toStrictEqual(valueA._dependency);
    expect(aDeps[1]).toStrictEqual(valueB._dependency);

    const bDeps = Array.from(memoB._dependent.dependencies());
    expect(bDeps).toHaveLength(2);
    expect(bDeps[0]).toStrictEqual(memoA._dependency);
    expect(bDeps[1]).toStrictEqual(valueC._dependency);

    // dependents change:
    valueA.set(1);
    const memoC = new LiveMemo(() => {
        if (valueA.live() === 1) {
            return valueB.live();
        } else {
            return valueC.live();
        }
    });

    expect(memoC.peek()).toStrictEqual(2);
    const cDeps1 = Array.from(memoC._dependent.dependencies());
    expect(cDeps1).toHaveLength(2);
    expect(cDeps1[0]).toStrictEqual(valueA._dependency);
    expect(cDeps1[1]).toStrictEqual(valueB._dependency);

    valueA.set(2);
    expect(memoC.peek()).toStrictEqual(3);
    const cDeps2 = Array.from(memoC._dependent.dependencies());
    expect(cDeps2).toHaveLength(2);
    expect(cDeps2[0]).toStrictEqual(valueA._dependency);
    expect(cDeps2[1]).toStrictEqual(valueC._dependency);

    // values throw
    expect(() => valueA.live()).toThrow();
});
