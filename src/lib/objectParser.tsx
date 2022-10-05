import { Result } from "@/lib/Result";
import {
    entries,
    exhaustiveSwitchError,
    get,
    keys,
    ObjectMap,
    ReadonlyObjectMap,
    ReadonlyRecord,
    values,
} from "@/lib/utils";

export type Parser<Output, Input = unknown> = (input: Input) => Result<Output, ParserError>;
export type ParserType<T extends Parser<unknown>> = T extends Parser<infer U> ? U : never;

export class ParserError {
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

function createTypeofParser<T>(type: string): Parser<T> {
    return (input: unknown) => {
        if (typeof input === type) {
            return Result.ok(input as T);
        }
        return Result.error(new ParserError(`Expected ${type}, got ${typeof input}`, []));
    };
}

function prefixError(error: ParserError, within: string | number): ParserError {
    return new ParserError(error.message, [within, ...error.path]);
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

export const parseString = createTypeofParser<string>("string");
export const parseNumber = createTypeofParser<number>("number");
export const parseBoolean = createTypeofParser<boolean>("boolean");
export function parseNull(input: unknown): Result<null, ParserError> {
    if (input === null || input === undefined) {
        return Result.ok(null);
    }
    return Result.error(new ParserError(`Expected null or undefined, got ${typeToString(input)}`));
}

export function createArrayParser<T>(parseItem: Parser<T>): Parser<ReadonlyArray<T>> {
    return (input: unknown) => {
        if (!Array.isArray(input)) {
            return Result.error(new ParserError(`Expected Array, got ${typeToString(input)}`, []));
        }

        return Result.collect(
            input.map((rawItem, i) => parseItem(rawItem).mapErr((err) => prefixError(err, i))),
        );
    };
}

export function createShapeParser<T extends ObjectMap<string, unknown>>(parserMap: {
    [K in keyof T]: Parser<T[K]>;
}): Parser<Readonly<T>> {
    return (input: unknown) => {
        if (typeof input !== "object" || input === null) {
            return Result.error(new ParserError(`Expected object, got ${typeToString(input)}`, []));
        }

        return Result.collect(
            entries(parserMap).map(([key, parseValue]) =>
                parseValue(get(input, key))
                    .map((value) => [key, value])
                    .mapErr((err) => prefixError(err, key)),
            ),
        ).map((parsedEntries) => Object.fromEntries(parsedEntries));
    };
}

export function createDictParser<K extends string, V>(
    parseKey: Parser<K>,
    parseValue: Parser<V>,
): Parser<ReadonlyObjectMap<K, V>> {
    return (input: unknown) => {
        if (typeof input !== "object" || input === null) {
            return Result.error(new ParserError(`Expected object, got ${typeToString(input)}`, []));
        }

        return Result.collect(
            keys(input).map((key) =>
                parseKey(key)
                    .andThen((key) => parseValue(get(input, key)).map((value) => [key, value]))
                    .mapErr((err) => prefixError(err, key)),
            ),
        ).map((parsedEntries) => Object.fromEntries(parsedEntries));
    };
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

export function createEnumParser<
    T extends
        | ReadonlyArray<string | number | boolean>
        | ReadonlyRecord<string, string | number | boolean>,
>(rawItems: T): Parser<EnumValues<T>> {
    const enumValues: Set<EnumValues<T>> = new Set(
        Array.isArray(rawItems) ? rawItems : values(rawItems as Record<string, EnumValues<T>>),
    );
    return (value: unknown) => {
        if (enumValues.has(value as EnumValues<T>)) {
            return Result.ok(value as EnumValues<T>);
        } else {
            const actual =
                typeof value === "string"
                    ? `"${value}"`
                    : typeof value === "boolean" || typeof value === "number"
                    ? String(value)
                    : typeToString(value);

            const expected = Array.from(enumValues, (value) =>
                typeof value === "string" ? `"${value}"` : `${value}`,
            ).join(" or ");

            return Result.error(new ParserError(`Expected ${expected}, got ${actual}`));
        }
    };
}

export function createIntersectionParser<T extends Record<string, Parser<unknown>>>(
    parsers: T,
): Parser<ParserType<T[keyof T]>> {
    const parserEntries = entries(parsers);
    return (input) => {
        const errors = [];
        for (const [name, parse] of parserEntries) {
            const result = parse(input) as Result<ParserType<T[keyof T]>, ParserError>;
            if (result.isOk()) {
                return result;
            }
            errors.push(`- ${name}: ${result.error.toString()}`);
        }
        return Result.error(
            new ParserError(
                `Expected one of the following to pass, but all errored:\n${errors.join("\n")}`,
            ),
        );
    };
}

export function composeParsers<A, B, C>(parse: Parser<B, A>, validate: Parser<C, B>): Parser<C, A> {
    return (input) => parse(input).andThen(validate);
}

export function createNullableParser<O>(parser: Parser<O>): Parser<O | null> {
    return createIntersectionParser({
        value: parser,
        null: parseNull,
    });
}
