import { Tps } from "@/splatapus/ThinPlateSpline";
import { expect, test } from "vitest";

const testInputs = [
    [91, 28, 9],
    [3, 83, 40],
    [90, 92, 16],
    [45, 82, 87],
    [51, 91, 9],
    [63, 60, 30],
    [16, 97, 68],
    [49, 90, 47],
    [34, 93, 59],
    [39, 25, 26],
];

test("ThinPlateSpline", function () {
    const tps = new Tps(
        testInputs.map((input) => [input[0], input[1]]),
        testInputs.map((input) => input[2]),
    );
    expect(tps.getValue([53, 28]).toPrecision(10)).toMatchInlineSnapshot('"22.96223273"');
    expect(tps.getValue([84, 6]).toPrecision(10)).toMatchInlineSnapshot('"2.847564993"');
    expect(tps.getValue([25, 42]).toPrecision(10)).toMatchInlineSnapshot('"45.74377405"');
    expect(tps.getValue([21, 1]).toPrecision(10)).toMatchInlineSnapshot('"6.556757854"');
    expect(tps.getValue([2, 82]).toPrecision(10)).toMatchInlineSnapshot('"37.86663024"');
    expect(tps.getValue([91, 40]).toPrecision(10)).toMatchInlineSnapshot('"14.26136062"');
    expect(tps.getValue([8, 86]).toPrecision(10)).toMatchInlineSnapshot('"52.78258480"');
    expect(tps.getValue([29, 19]).toPrecision(10)).toMatchInlineSnapshot('"21.39156005"');
    expect(tps.getValue([90, 36]).toPrecision(10)).toMatchInlineSnapshot('"12.35507995"');
    expect(tps.getValue([97, 69]).toPrecision(10)).toMatchInlineSnapshot('"27.20192286"');
});
