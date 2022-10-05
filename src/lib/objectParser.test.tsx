import {
    createArrayParser,
    createDictParser,
    createEnumParser,
    createNullableParser,
    createShapeParser,
    parseString,
} from "@/lib/objectParser";
import { expect, test } from "vitest";

test("createEnumParser", () => {
    const arrayParser = createEnumParser(["one", 2, true] as const);
    enum TestEnum {
        One = "one",
        Two = "two",
    }
    const enumParser = createEnumParser(TestEnum);

    expect(arrayParser(true).unwrap()).toBe(true);
    expect(arrayParser(false).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected \\"one\\" or 2 or true, got false"',
    );

    expect(enumParser("one").unwrap()).toBe(TestEnum.One);
    expect(enumParser({ hello: "world" }).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected \\"one\\" or \\"two\\", got an object"',
    );
});

test("nested errors", () => {
    const parse = createShapeParser({
        foo: createDictParser(
            createEnumParser(["one", "two", "three"] as const),
            createArrayParser(parseString),
        ),
    });

    expect(parse(false).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected object, got a boolean"',
    );
    expect(parse({ foo: false }).unwrapError().toString()).toMatchInlineSnapshot(
        '"At .foo: Expected object, got a boolean"',
    );
    expect(
        parse({ foo: { four: "hi" } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .foo.four: Expected \\"one\\" or \\"two\\" or \\"three\\", got \\"four\\""',
    );
    expect(
        parse({ foo: { two: ["a", "b", 3, "d"] } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot('"At .foo.two[2]: Expected string, got number"');
});

test("createNullableParser", () => {
    const parse = createNullableParser(parseString);
    expect(parse(null).unwrap()).toBe(null);
    expect(parse("hi").unwrap()).toBe("hi");
    expect(parse(3).unwrapError().toString()).toMatchInlineSnapshot(`
      "Expected one of the following to pass, but all errored:
        - value: Expected string, got number
        - null: Expected null or undefined, got a number"
    `);
});
