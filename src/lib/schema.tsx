import { assert, fail } from "@/lib/assert";
import { Result } from "@/lib/Result";
import {
    entries,
    exhaustiveSwitchError,
    get,
    has,
    identity,
    keys,
    ReadonlyObjectMap,
    ReadonlyRecord,
    values,
} from "@/lib/utils";

export type SchemaType<S extends Schema<any>> =
    S extends Schema<infer T> ? T : never;

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
                path += `.${item}`;
            } else if (item.startsWith("(")) {
                if (path.endsWith(")")) {
                    path = `${path.slice(0, -1)}, ${item.slice(1)}`;
                } else {
                    path += item;
                }
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

function prefixError(
    error: SchemaParseError,
    ...within: ReadonlyArray<string | number>
): SchemaParseError {
    return new SchemaParseError(error.message, [...within, ...error.path]);
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
        public readonly parse: (
            input: unknown,
        ) => Result<Parsed, SchemaParseError>,
        public readonly _validate: (
            input: unknown,
        ) => Result<Parsed, SchemaParseError>,
        public readonly serialize: (input: Parsed) => unknown,
    ) {}

    validate(input: unknown): Result<Parsed, SchemaParseError> {
        const result = this._validate(input);
        if (result.ok) {
            assert(Object.is(result.value, input));
        }
        return result;
    }

    transform<U>(
        parse: (input: Parsed) => Result<U, SchemaParseError>,
        validate: (input: Parsed) => Result<U, SchemaParseError>,
        serialize: (input: U) => Parsed,
    ): Schema<U> {
        return new Schema(
            (input) => this.parse(input).andThen(parse),
            (input) => this.validate(input).andThen(validate),
            (input) => this.serialize(serialize(input)),
        );
    }

    instance<Ctor extends { new (...args: any[]): InstanceType<Ctor> }>(
        ctor: Ctor,
        parse: (input: Parsed) => Result<InstanceType<Ctor>, SchemaParseError>,
        serialize: (input: InstanceType<Ctor>) => Parsed,
    ): Schema<InstanceType<Ctor>> {
        return this.transform(
            parse,
            (input) => {
                if (input instanceof ctor) {
                    return Result.ok(input);
                }
                return Result.error(
                    new SchemaParseError(
                        `Expected instance of ${ctor.name}, got ${typeToString(
                            input,
                        )}`,
                    ),
                );
            },
            serialize,
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
                    return Result.ok(null);
                }
                return this.validate(input);
            },
            (input) => {
                if (input === null) {
                    return null;
                }
                return this.serialize(input);
            },
        );
    }

    optional(): Schema<Parsed | undefined> {
        return new Schema<Parsed | undefined>(
            (input) => {
                if (input == undefined) {
                    return Result.ok(undefined);
                }
                return this.parse(input);
            },
            (input) => {
                if (input === undefined) {
                    return Result.ok(undefined);
                }
                return this.validate(input);
            },
            (input) => {
                if (input == undefined) {
                    return undefined;
                }
                return this.serialize(input);
            },
        );
    }

    parseUnwrap(input: unknown): Parsed {
        return this.parse(input).unwrap();
    }

    validateUnwrap(input: unknown): Parsed {
        return this.validate(input).unwrap();
    }

    asValidator(): { validate: (input: unknown) => Parsed } {
        return { validate: (input: unknown) => this.validateUnwrap(input) };
    }

    private static typeof<T>(type: string): Schema<T> {
        const validate = (input: unknown) => {
            if (typeof input === type) {
                return Result.ok(input as T);
            }
            return Result.error(
                new SchemaParseError(
                    `Expected ${type}, got ${typeToString(input)}`,
                    [],
                ),
            );
        };
        return new Schema<T>(validate, validate, identity);
    }

    static unknown = new Schema<unknown>(
        (value) => Result.ok(value),
        (value) => Result.ok(value),
        identity,
    );
    static never = new Schema<undefined>(
        () => Result.error(new SchemaParseError("Cannot parse never schema")),
        () =>
            Result.error(new SchemaParseError("Cannot validate never schema")),
        () => {
            fail("Cannot serialize never schema");
        },
    );
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
                new SchemaParseError(
                    `Expected null or undefined, got ${typeToString(input)}`,
                ),
            );
        },
        (input) => {
            if (input === null) {
                return Result.ok(null);
            }
            return Result.error(
                new SchemaParseError(
                    `Expected null, got ${typeToString(input)}`,
                ),
            );
        },
        () => null,
    );
    static value<V extends string | number | boolean>(
        value: V,
    ): ValueSchema<V> {
        return new ValueSchema(value);
    }
    static valueUnion<const V extends ReadonlyArray<string | number | boolean>>(
        ...values: V
    ): Schema<V[number]> {
        const validate = (input: unknown) => {
            if (values.includes(input as any)) {
                return Result.ok(input as V[number]);
            }
            return Result.error(
                new SchemaParseError(
                    `Expected one of ${values.join(" or ")}, got ${typeToString(
                        input,
                    )}`,
                ),
            );
        };
        return new Schema<V[number]>(validate, validate, identity);
    }

    static arrayOf<Item>(
        itemSchema: Schema<Item>,
    ): Schema<ReadonlyArray<Item>> {
        return new Schema<ReadonlyArray<Item>>(
            (input) => {
                if (!Array.isArray(input)) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected an array, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                return Result.collect(
                    input.map((rawItem, i) =>
                        itemSchema
                            .parse(rawItem)
                            .mapErr((err) => prefixError(err, i)),
                    ),
                );
            },
            (input) => {
                if (!Array.isArray(input)) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected an array, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                for (let i = 0; i < input.length; i++) {
                    const item = input[i];
                    const result = itemSchema.validate(item);
                    if (!result.ok) {
                        return result.mapErr((err) => prefixError(err, i));
                    }
                }

                return Result.ok(input);
            },
            (input) => input.map((item) => itemSchema.serialize(item)),
        );
    }

    static object<Shape extends object>(config: {
        readonly [K in keyof Shape]-?: Schema<Shape[K]>;
    }): ObjectSchema<Shape> {
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
                        new SchemaParseError(
                            `Expected object, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                return Result.collect(
                    keys(input).map((key) =>
                        keySchema
                            .parse(key)
                            .andThen((key) =>
                                valueSchema
                                    .parse(get(input, key))
                                    .map((value) => [key, value]),
                            )
                            .mapErr((err) => prefixError(err, key)),
                    ),
                ).map((parsedEntries) => Object.fromEntries(parsedEntries));
            },
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected object, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                for (const [key, value] of entries(input)) {
                    const keyResult = keySchema.validate(key);
                    if (!keyResult.ok) {
                        return keyResult.mapErr((err) => prefixError(err, key));
                    }
                    const valueResult = valueSchema.validate(value);
                    if (!valueResult.ok) {
                        return valueResult.mapErr((err) =>
                            prefixError(err, key),
                        );
                    }
                }

                return Result.ok(input);
            },
            (input) => {
                const result: Record<string, unknown> = {};
                for (const [key, value] of entries(input)) {
                    if (value === undefined) continue;
                    const serializedKey = keySchema.serialize(key);
                    assert(
                        typeof serializedKey === "string" ||
                            typeof serializedKey === "number",
                    );
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
            Array.isArray(rawItems) ? rawItems : (
                values(rawItems as Record<string, EnumValues<T>>)
            ),
        );
        const validate = (input: unknown) => {
            if (enumValues.has(input as EnumValues<T>)) {
                return Result.ok(input as EnumValues<T>);
            } else {
                const actual =
                    typeof input === "string" ? `"${input}"`
                    : typeof input === "boolean" || typeof input === "number" ?
                        String(input)
                    :   typeToString(input);

                const expected = Array.from(enumValues, (value) =>
                    typeof value === "string" ? `"${value}"` : `${value}`,
                ).join(" or ");

                return Result.error(
                    new SchemaParseError(`Expected ${expected}, got ${actual}`),
                );
            }
        };
        return new Schema(validate, validate, identity);
    }
    static union<
        Key extends string,
        Config extends UnionObjectSchemaConfig<Key, Config>,
    >(key: Key, config: Config): UnionObjectSchema<Key, Config> {
        return new UnionObjectSchema(key, config);
    }
    static indexedUnion<
        Key extends string,
        Config extends IndexedUnionObjectSchemaConfig<Key, Config>,
    >(key: Key, config: Config): IndexedUnionObjectSchema<Key, Config> {
        return new IndexedUnionObjectSchema(key, config);
    }

    static cannotValidate(name: string) {
        return (input: unknown): never => {
            fail(`Cannot validate ${name}, only parse/serialize available.`);
        };
    }
}

type EnumValues<
    T extends
        | ReadonlyArray<string | number | boolean>
        | ReadonlyRecord<string, string | number | boolean>,
> =
    T extends ReadonlyArray<infer Values> ? Values
    : T extends Record<string, infer Values> ? Values
    : never;

export class ValueSchema<
    Value extends string | number | boolean,
> extends Schema<Value> {
    constructor(private readonly value: Value) {
        const validate = (input: unknown) => {
            if (input === value) {
                return Result.ok(value);
            }
            return Result.error(
                new SchemaParseError(
                    `Expected ${
                        typeof value === "string" ? `"${value}"` : value
                    }, got ${typeToString(input)}`,
                ),
            );
        };
        super(validate, validate, identity);
    }
}

export class ObjectSchema<Shape extends object> extends Schema<Shape> {
    constructor(
        readonly config: { readonly [K in keyof Shape]-?: Schema<Shape[K]> },
    ) {
        super(
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected object, got ${typeToString(input)}`,
                            [],
                        ),
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
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected object, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                const unknownProperties = new Set(
                    keys(input as Record<string, unknown>),
                );
                for (const [key, schema] of entries(this.config)) {
                    unknownProperties.delete(key);
                    const value = get(input, key);
                    const result = schema.validate(value);
                    if (!result.ok) {
                        return result.mapErr((err) => prefixError(err, key));
                    }
                }

                if (unknownProperties.size) {
                    return Result.error(
                        new SchemaParseError(
                            `Unknown properties: ${Array.from(unknownProperties)
                                .map((key) => JSON.stringify(key))
                                .join(", ")}`,
                        ),
                    );
                }

                return Result.ok(input as Shape);
            },
            (object) => {
                const result: Record<string, unknown> = {};
                for (const [key, schema] of entries(this.config)) {
                    result[key] = schema.serialize(get(object, key) as any);
                }
                return result;
            },
        );
    }

    indexed(indexByKey: {
        [K in keyof Shape]: number;
    }): IndexedObjectSchema<Shape> {
        return new IndexedObjectSchema(this, indexByKey);
    }
}

export class IndexedObjectSchema<Shape extends object> extends Schema<Shape> {
    readonly keyByIndex: ReadonlyArray<string | undefined>;
    constructor(
        readonly objectSchema: ObjectSchema<Shape>,
        readonly indexByKey: { readonly [K in keyof Shape]: number },
    ) {
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

        super(
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected an object or an array, got ${typeToString(
                                input,
                            )}`,
                        ),
                    );
                }
                if (!Array.isArray(input)) {
                    return this.objectSchema.parse(input);
                }
                return Result.collect(
                    entries(objectSchema.config).map(([key, schema]) => {
                        const index = indexByKey[key as keyof Shape];
                        return schema
                            .parse(input[index])
                            .map((value) => [key, value])
                            .mapErr((err) =>
                                prefixError(err, key, `(${index})`),
                            );
                    }),
                ).map((parsedEntries) => Object.fromEntries(parsedEntries));
            },
            (input) => {
                return this.objectSchema.validate(input);
            },
            (object) => {
                const serialized = objectSchema.serialize(object);
                assert(typeof serialized === "object" && serialized !== null);
                return this.keyByIndex.map((key) => {
                    if (key === undefined) {
                        return null;
                    }
                    return get(serialized, key);
                });
            },
        );

        this.keyByIndex = keyByIndex;
    }
}

// pass this into itself e.g. Config extends UnionObjectSchemaConfig<Key, Config>
type UnionObjectSchemaConfig<Key extends string, Config> = {
    readonly [Variant in keyof Config]: ObjectSchema<any> & {
        parseUnwrap: (input: any) => { readonly [K in Key]: Variant };
    };
};
export class UnionObjectSchema<
    Key extends string,
    Config extends UnionObjectSchemaConfig<Key, Config>,
> extends Schema<SchemaType<Config[keyof Config]>> {
    constructor(
        private readonly key: Key,
        private readonly config: Config,
    ) {
        const getMatchingSchema = (input: unknown) => {
            if (typeof input !== "object" || input === null) {
                return Result.error(
                    new SchemaParseError(
                        `Expected an object, got ${typeToString(input)}`,
                        [],
                    ),
                );
            }

            const variant = get(input, key) as keyof Config | undefined;
            if (typeof variant !== "string") {
                return Result.error(
                    new SchemaParseError(
                        `Expected a string for key "${key}", got ${typeToString(
                            variant,
                        )}`,
                        [],
                    ),
                );
            }

            const matchingSchema =
                has(config, variant) ? config[variant] : undefined;
            if (matchingSchema === undefined) {
                return Result.error(
                    new SchemaParseError(
                        `Expected one of ${Object.keys(this.config)
                            .map((key) => JSON.stringify(key))
                            .join(" or ")}, got ${typeToString(variant)}`,
                        [key],
                    ),
                );
            }

            return Result.ok({ schema: matchingSchema, variant });
        };
        super(
            (input) => {
                const result = getMatchingSchema(input);
                if (!result.ok) return result;

                const { schema, variant } = result.value;
                return schema
                    .parse(input)
                    .mapErr((err) =>
                        prefixError(err, `(${key} = ${variant})`),
                    ) as any;
            },
            (input) => {
                const result = getMatchingSchema(input);
                if (!result.ok) return result;

                const { schema, variant } = result.value;
                return schema
                    .validate(input)
                    .mapErr((err) =>
                        prefixError(err, `(${key} = ${variant})`),
                    ) as any;
            },
            (object) => {
                const type = object[key] as keyof Config;
                const schema = has(config, type) ? this.config[type] : null;
                assert(schema, `schema type ${String(type)} must exist`);
                return schema.serialize(object);
            },
        );
    }
}

// pass this into itself e.g. Config extends UnionObjectSchemaConfig<Key, Config>
type IndexedUnionObjectSchemaConfig<Key extends string, Config> = {
    readonly [Variant in keyof Config]: IndexedObjectSchema<any> & {
        parseUnwrap: (input: any) => { readonly [K in Key]: Variant };
    };
};
export class IndexedUnionObjectSchema<
    Key extends string,
    Config extends IndexedUnionObjectSchemaConfig<Key, Config>,
> extends Schema<SchemaType<Config[keyof Config]>> {
    constructor(
        private readonly key: Key,
        private readonly config: Config,
    ) {
        for (const [variant, schema] of entries(config)) {
            assert(
                schema.keyByIndex[0] === key,
                `Variant ${variant} must have ${key} at index 0`,
            );
        }

        super(
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected an object or an array, got ${typeToString(
                                input,
                            )}`,
                            [],
                        ),
                    );
                }

                const isArray = Array.isArray(input);
                let variant: keyof Config | undefined =
                    Array.isArray(input) ? input[0] : get(input, key);
                if (typeof variant === "number")
                    variant = String(variant) as keyof Config;
                if (typeof variant !== "string") {
                    return Result.error(
                        new SchemaParseError(
                            `Expected a string, got ${typeToString(variant)}`,
                            [isArray ? 0 : key],
                        ),
                    );
                }

                const matchingSchema =
                    has(config, variant) ? config[variant] : undefined;
                if (matchingSchema === undefined) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected one of ${Object.keys(this.config)
                                .map((key) => JSON.stringify(key))
                                .join(" or ")}, got ${typeToString(variant)}`,
                            [isArray ? 0 : key],
                        ),
                    );
                }

                return matchingSchema
                    .parse(input)
                    .mapErr((err) =>
                        prefixError(err, `(${key} = ${String(variant)})`),
                    ) as any;
            },
            (input) => {
                if (typeof input !== "object" || input === null) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected an object, got ${typeToString(input)}`,
                            [],
                        ),
                    );
                }

                const variant = get(input, key) as keyof Config | undefined;
                if (typeof variant !== "string") {
                    return Result.error(
                        new SchemaParseError(
                            `Expected a string for key "${key}", got ${typeToString(
                                variant,
                            )}`,
                            [],
                        ),
                    );
                }

                const matchingSchema =
                    has(config, variant) ? config[variant] : undefined;
                if (matchingSchema === undefined) {
                    return Result.error(
                        new SchemaParseError(
                            `Expected one of ${Object.keys(this.config)
                                .map((key) => JSON.stringify(key))
                                .join(" or ")}, got ${typeToString(variant)}`,
                            [key],
                        ),
                    );
                }

                return matchingSchema
                    .validate(input)
                    .mapErr((err) =>
                        prefixError(err, `(${key} = ${String(variant)})`),
                    ) as any;
            },
            (object) => {
                const type = object[key] as keyof Config;
                const schema = has(config, type) ? this.config[type] : null;
                assert(schema);
                return schema.serialize(object);
            },
        );
    }
}
