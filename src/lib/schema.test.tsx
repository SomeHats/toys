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
    expect(
        arraySchema.parse(false).unwrapError().toString(),
    ).toMatchInlineSnapshot('"Expected \\"one\\" or 2 or true, got false"');

    expect(enumSchema.parse("one").unwrap()).toBe(TestEnum.One);
    expect(
        enumSchema.parse({ hello: "world" }).unwrapError().toString(),
    ).toMatchInlineSnapshot('"Expected \\"one\\" or \\"two\\", got an object"');
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
    expect(
        schema.parse({ foo: false }).unwrapError().toString(),
    ).toMatchInlineSnapshot('"At .foo: Expected object, got a boolean"');
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
    ).toMatchInlineSnapshot('"At .foo.two.2: Expected string, got a number"');
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
    expect(schema.parse({ foo: true, bar: "hello" }).unwrap()).toEqual({
        foo: true,
        bar: "hello",
    });
    // accepts an array
    expect(schema.parse([true, null, "hello"]).unwrap()).toEqual({
        foo: true,
        bar: "hello",
    });
    // tags errors with the index
    expect(
        schema.parse([true, null, 3]).unwrapError().toString(),
    ).toMatchInlineSnapshot('"At .bar(2): Expected string, got a number"');
});

test("UnionSchema", () => {
    const catSchema = Schema.object({
        type: Schema.value("cat"),
        meow: Schema.boolean,
    });
    const dogSchema = Schema.object({
        type: Schema.value("dog"),
        bark: Schema.boolean,
    });
    const animalSchema = Schema.union("type", {
        cat: catSchema,
        dog: dogSchema,
    });

    const nested = Schema.object({
        animal: animalSchema,
    });

    expect(animalSchema.parse({ type: "cat", meow: true }).unwrap()).toEqual({
        type: "cat",
        meow: true,
    });
    expect(
        animalSchema
            .parse({ type: "cow", moo: false })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .type: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );
    expect(
        nested
            .parse({ animal: { type: "cow", moo: false } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal.type: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );
    expect(
        nested
            .parse({ animal: { type: "cat", moo: false } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal(type = cat).meow: Expected boolean, got undefined"',
    );
});

test("IndexedUnionSchema", () => {
    const catSchema = Schema.object({
        type: Schema.value("cat"),
        meow: Schema.boolean,
    }).indexed({ type: 0, meow: 1 });
    const dogSchema = Schema.object({
        type: Schema.value("dog"),
        bark: Schema.boolean,
    }).indexed({ type: 0, bark: 1 });
    const animalSchema = Schema.indexedUnion("type", {
        cat: catSchema,
        dog: dogSchema,
    });

    const nested = Schema.object({
        animal: animalSchema,
    }).indexed({ animal: 1 });

    expect(animalSchema.parse({ type: "cat", meow: true }).unwrap()).toEqual({
        type: "cat",
        meow: true,
    });
    expect(animalSchema.parse(["cat", true]).unwrap()).toEqual({
        type: "cat",
        meow: true,
    });

    expect(
        animalSchema
            .parse({ type: "cow", moo: false })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .type: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );
    expect(
        animalSchema.parse(["cow", false]).unwrapError().toString(),
    ).toMatchInlineSnapshot(
        '"At .0: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );

    expect(
        nested
            .parse({ animal: { type: "cow", moo: false } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal.type: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );
    expect(
        nested
            .parse([null, ["cow", false]])
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal(1).0: Expected one of \\"cat\\" or \\"dog\\", got a string"',
    );

    expect(
        nested
            .parse({ animal: { type: "cat", moo: false } })
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal(type = cat).meow: Expected boolean, got undefined"',
    );
    expect(
        nested
            .parse([null, ["cat", 3]])
            .unwrapError()
            .toString(),
    ).toMatchInlineSnapshot(
        '"At .animal(1, type = cat).meow(1): Expected boolean, got a number"',
    );
});
