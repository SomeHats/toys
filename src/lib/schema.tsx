import { assert } from "@/lib/assert";
import { Result } from "@/lib/Result";
import {
    entries,
    exhaustiveSwitchError,
    get,
    identity,
    keys,
    ReadonlyObjectMap,
    ReadonlyRecord,
    values,
} from "@/lib/utils";

export type SchemaType<S extends Schema<any>> = S extends Schema<infer T> ? T : never;

export class SchemaParseError {
    constructor(
        public readonly message: string,
        public readonly path: ReadonlyArray<number | string> = [],
    ) {}

    formatPath(): string | null {
        if (!this.path.length) {
            return null;
        }
        let path = "";
        for (const item of this.path) {
            if (typeof item === "number") {
                path += `[${item}]`;
            } else {
                path += `.${item}`;
            }
        }
        return path;
    }

    toString() {
        const path = this.formatPath();
        const indentedMessage = this.message
            .split("\n")
            .map((line, i) => (i === 0 ? line : `  ${line}`))
            .join("\n");
        return path ? `At ${path}: ${indentedMessage}` : indentedMessage;
    }
}

function prefixError(error: SchemaParseError, within: string | number): SchemaParseError {
    return new SchemaParseError(error.message, [within, ...error.path]);
}

function typeToString(value: unknown): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "an array";
    const type = typeof value;
    switch (type) {
        case "bigint":
        case "boolean":
        case "function":
        case "number":
        case "string":
        case "symbol":
            return `a ${type}`;
        case "object":
            return `an ${type}`;
        case "undefined":
            return "undefined";
        default:
            exhaustiveSwitchError(type);
    }
}

export class Schema<Parsed> {
    constructor(
        public readonly parse: (input: unknown) => Result<Parsed, SchemaParseError>,
        public readonly serialize: (input: Parsed) => unknown,
    ) {}

    transform<U>(
        parse: (input: Parsed) => Result<U, SchemaParseError>,
        serialize: (input: U) => Parsed,
    ): Schema<U> {
        return new Schema(
            (input) => this.parse(input).andThen(parse),
            (input) => this.serialize(serialize(input)),
        );
    }

    nullable(): Schema<Parsed | null> {
        return new Schema<Parsed | null>(
            (input) => {
                if (input === null || input === undefined) {
                    return Result.ok(null);
                }
                return this.parse(input);
            },
            (input) => {
                if (input === null) {
                    return null;
                }
                return this.serialize(input);
            },
        );
    }

    private static typeof<T>(type: string): Schema<T> {
        return new Schema<T>((input) => {
            if (typeof input === type) {
                return Result.ok(input as T);
            }
            return Result.error(
                new SchemaParseError(`Expected ${type}, got ${typeToString(input)}`, []),
            );
        }, identity);
    }

    static unknown = new Schema<unknown>((value) => Result.ok(value), identity);
    static string = Schema.typeof<string>("string");
    static number = Schema.typeof<number>("number");
    static bigint = Schema.typeof<bigint>("bigint");
    static boolean = Schema.typeof<boolean>("boolean");
    static null = new Schema<null>(
        (input) => {
            if (input === null || input === undefined) {
                return Result.ok(null);
            }
            return Result.error(
                new SchemaParseError(`Expected null or undefined, got ${typeToString(input)}`),
            );
        },
        () => null,
    );

    static arrayOf<Item>(itemSchema: Schema<Item>): Schema<ReadonlyArray<Item>> {
        return new Schema<ReadonlyArray<Item>>(
            (input) => {
                if (!Array.isArray(input)) {
                    return Result.error(
                        new SchemaParseError(`Expected an array, got ${typeToString(input)}`, []),
                    );
                }

                return Result.collect(
                    input.map((rawItem, i) =>
                        itemSchema.parse(rawItem).mapErr((err) => prefixError(err, i)),
                    ),
                );
            },
            (input) => input.map((item) => itemSchema.serialize(item)),
        );
    }

    static object<Shape extends ReadonlyRecord<string, unknown>>(config: {
        [K in keyof Shape]: Schema<Shape[K]>;
    }): ObjectSchema<Readonly<Shape>> {
        return new ObjectSchema(config);
    }

    static objectMap<K extends string, V>(
        keySchema: Schema<K>,
        valueSchema: Schema<V>,
    ): Schema<ReadonlyObjectMap<K, V>> {
        return new Schema<ReadonlyObjectMap<K, V>>(
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(`Expected object, got ${typeToString(input)}`, []),
                    );
                }

                return Result.collect(
                    keys(input).map((key) =>
                        keySchema
                            .parse(key)
                            .andThen((key) =>
                                valueSchema.parse(get(input, key)).map((value) => [key, value]),
                            )
                            .mapErr((err) => prefixError(err, key)),
                    ),
                ).map((parsedEntries) => Object.fromEntries(parsedEntries));
            },
            (input) => {
                const result: Record<string, unknown> = {};
                for (const [key, value] of entries(input)) {
                    if (value === undefined) continue;
                    const serializedKey = keySchema.serialize(key);
                    assert(typeof serializedKey === "string" || typeof serializedKey === "number");
                    result[serializedKey] = valueSchema.serialize(value);
                }
                return result;
            },
        );
    }

    static enum<
        T extends
            | ReadonlyArray<string | number | boolean>
            | ReadonlyRecord<string, string | number | boolean>,
    >(rawItems: T): Schema<EnumValues<T>> {
        const enumValues: Set<EnumValues<T>> = new Set(
            Array.isArray(rawItems) ? rawItems : values(rawItems as Record<string, EnumValues<T>>),
        );
        return new Schema((input) => {
            if (enumValues.has(input as EnumValues<T>)) {
                return Result.ok(input as EnumValues<T>);
            } else {
                const actual =
                    typeof input === "string"
                        ? `"${input}"`
                        : typeof input === "boolean" || typeof input === "number"
                        ? String(input)
                        : typeToString(input);

                const expected = Array.from(enumValues, (value) =>
                    typeof value === "string" ? `"${value}"` : `${value}`,
                ).join(" or ");

                return Result.error(new SchemaParseError(`Expected ${expected}, got ${actual}`));
            }
        }, identity);
    }
}

type EnumValues<
    T extends
        | ReadonlyArray<string | number | boolean>
        | ReadonlyRecord<string, string | number | boolean>,
> = T extends ReadonlyArray<infer Values>
    ? Values
    : T extends Record<string, infer Values>
    ? Values
    : never;

export class ObjectSchema<Shape extends ReadonlyRecord<string, unknown>> extends Schema<Shape> {
    constructor(
        private readonly config: {
            [K in keyof Shape]: Schema<Shape[K]>;
        },
    ) {
        super(
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(`Expected object, got ${typeToString(input)}`, []),
                    );
                }

                return Result.collect(
                    entries(this.config).map(([key, schema]) =>
                        schema
                            .parse(get(input, key))
                            .map((value) => [key, value])
                            .mapErr((err) => prefixError(err, key)),
                    ),
                ).map((parsedEntries) => Object.fromEntries(parsedEntries));
            },
            (object) => {
                const result: Record<string, unknown> = {};
                for (const [key, schema] of entries(this.config)) {
                    // @ts-expect-error typescript doesn't know the value matches
                    result[key] = schema.serialize(object[key]);
                }
                return result;
            },
        );
    }

    indexed(indexByKey: { [K in keyof Shape]: number }): Schema<Shape> {
        const keyByIndex: Array<string | undefined> = [];
        for (const [key, index] of entries(indexByKey)) {
            assert(
                keyByIndex[index] === undefined,
                `Duplicate index ${index} for keys "${key}" & "${keyByIndex[index]}"`,
            );
            keyByIndex[index] = key;
        }
        for (let i = 0; i < keyByIndex.length; i++) {
            if (keyByIndex[i] === undefined) {
                keyByIndex[i] = undefined;
            }
        }

        return new Schema<Shape>(
            (input) => {
                if (!Array.isArray(input)) {
                    // try and parse as an object
                    return this.parse(input);
                }
                const reassembledObject: Record<string, unknown> = {};
                for (let i = 0; i < input.length; i++) {
                    const key = keyByIndex[i];
                    if (key === undefined) {
                        continue;
                    }
                    reassembledObject[key] = input[i];
                }
                return this.parse(reassembledObject);
            },
            (object) => {
                const serialized = this.serialize(object);
                return keyByIndex.map((key) => {
                    if (key === undefined) {
                        return null;
                    }
                    // @ts-expect-error typescript doesn't know the type of serialized
                    return serialized[key];
                });
            },
        );
    }
}
