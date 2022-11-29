import { Schema } from "@/lib/schema";
import { expect, test } from "vitest";

test("Schema.enum", () => {
    const arraySchema = Schema.enum(["one", 2, true] as const);
    enum TestEnum {
        One = "one",
        Two = "two",
    }
    const enumSchema = Schema.enum(TestEnum);

    expect(arraySchema.parse(true).unwrap()).toBe(true);
    expect(arraySchema.parse(false).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected \\"one\\" or 2 or true, got false"',
    );

    expect(enumSchema.parse("one").unwrap()).toBe(TestEnum.One);
    expect(enumSchema.parse({ hello: "world" }).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected \\"one\\" or \\"two\\", got an object"',
    );
});

test("nested errors", () => {
    const schema = Schema.object({
        foo: Schema.objectMap(
            Schema.enum(["one", "two", "three"] as const),
            Schema.arrayOf(Schema.string),
        ),
    });

    expect(schema.parse(false).unwrapError().toString()).toMatchInlineSnapshot(
        '"Expected object, got a boolean"',
    );
    expect(schema.parse({ foo: false }).unwrapError().toString()).toMatchInlineSnapshot(
        '"At .foo: Expected object, got a boolean"',
    );
    expect(
        schema
            .parse({ foo: { four: "hi" } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .foo.four: Expected \\"one\\" or \\"two\\" or \\"three\\", got \\"four\\""',
    );
    expect(
        schema
            .parse({ foo: { two: ["a", "b", 3, "d"] } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot('"At .foo.two[2]: Expected string, got a number"');
});

test("ObjectSchema.indexed", () => {
    const schema = Schema.object({
        foo: Schema.boolean,
        bar: Schema.string,
    }).indexed({
        foo: 0,
        // 1 is missing
        bar: 2,
    });

    // accepts the actual object
    expect(schema.parse({ foo: true, bar: "hello" }).unwrap()).toEqual({ foo: true, bar: "hello" });
    // accepts an array
    expect(schema.parse([true, null, "hello"]).unwrap()).toEqual({ foo: true, bar: "hello" });
});
