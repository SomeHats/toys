import { Schema } from "@/lib/schema";
import {
    Incremental,
    IncrementalArrayOfDiffType,
    IncrementalDiff,
    IncrementalValue,
    incrementalArrayOf,
    incrementalAtom,
    incrementalObject,
} from "@/splatapus2/store/Incremental";
import { expect, test } from "vitest";

function applyChecked<Inc extends Incremental<any, any>>(
    incremental: Inc,
    value: IncrementalValue<Inc>,
    diff: IncrementalDiff<Inc>,
) {
    const [next, undo] = incremental.apply(value, diff);
    const [inverted, redo] = incremental.apply(next, undo);

    expect(inverted).toStrictEqual(value);
    expect(redo).toStrictEqual(diff);

    return [next, undo];
}

test("incrementalAtom", () => {
    const n = incrementalAtom(Schema.number);

    expect(applyChecked(n, 0, 1)).toStrictEqual([1, 0]);
});

test("incrementalArrayOf", () => {
    const arr = incrementalArrayOf(Schema.unknown);

    expect(
        applyChecked(arr, [], {
            type: IncrementalArrayOfDiffType.Replace,
            value: [1, 2, 3],
        }),
    ).toStrictEqual([
        [1, 2, 3],
        { type: IncrementalArrayOfDiffType.Replace, value: [] },
    ]);

    expect(
        applyChecked(arr, [1, 2, 3], {
            type: IncrementalArrayOfDiffType.Splice,
            index: 3,
            insert: [4, 5, 6],
            deleteCount: 0,
        }),
    ).toStrictEqual([
        [1, 2, 3, 4, 5, 6],
        {
            type: IncrementalArrayOfDiffType.Splice,
            index: 3,
            insert: [],
            deleteCount: 3,
        },
    ]);

    expect(
        applyChecked(arr, [1, 2, 3], {
            type: IncrementalArrayOfDiffType.Splice,
            index: 1,
            insert: ["two"],
            deleteCount: 1,
        }),
    ).toStrictEqual([
        [1, "two", 3],
        {
            type: IncrementalArrayOfDiffType.Splice,
            index: 1,
            insert: [2],
            deleteCount: 1,
        },
    ]);
});

test("incrementalObject", () => {
    const obj = incrementalObject({
        a: incrementalAtom(Schema.string),
        b: incrementalArrayOf(Schema.unknown),
        c: incrementalObject({
            d: incrementalAtom(Schema.string),
            e: incrementalAtom(Schema.string),
        }),
    });

    expect(
        applyChecked(
            obj,
            {
                a: "a",
                b: [1, 2, 3],
                c: { d: "d", e: "e" },
            },
            {
                a: "changed",
            },
        ),
    ).toStrictEqual([
        {
            a: "changed",
            b: [1, 2, 3],
            c: { d: "d", e: "e" },
        },
        {
            a: "a",
        },
    ]);

    expect(
        applyChecked(
            obj,
            {
                a: "a",
                b: [1, 2, 3],
                c: { d: "d", e: "e" },
            },
            {
                b: {
                    type: IncrementalArrayOfDiffType.Splice,
                    index: 3,
                    insert: [4],
                    deleteCount: 0,
                },
                c: { d: "changed" },
            },
        ),
    ).toStrictEqual([
        {
            a: "a",
            b: [1, 2, 3, 4],
            c: { d: "changed", e: "e" },
        },
        {
            b: {
                type: IncrementalArrayOfDiffType.Splice,
                index: 3,
                insert: [],
                deleteCount: 1,
            },
            c: { d: "d" },
        },
    ]);
});
