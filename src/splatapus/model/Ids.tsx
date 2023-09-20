import { Result } from "@/lib/Result";
import { Schema, SchemaParseError } from "@/lib/schema";
import { identity, sample, times } from "@/lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const USE_DEBUG_IDS = process.env.NODE_ENV !== "production";

export class IdGenerator<const Prefix extends string> {
    private readonly prefix: Prefix;
    readonly Id: `${Prefix}.${string}`;
    private debugIdCounter = 0;

    constructor(prefix: Prefix, readonly randomLength = 16) {
        this.prefix = prefix;
        this.Id = `${prefix}.SAMPLE`;
        const re = new RegExp(`^${this.prefix}\\.([a-zA-Z0-9_]+)$`);
        const validate = (input: string) => {
            if (re.test(input)) {
                return Result.ok(input as this["Id"]);
            } else {
                return Result.error(
                    new SchemaParseError(`Expected ${this.prefix}.*, got ${input}`, []),
                );
            }
        };
        this.schema = Schema.string.transform(validate, validate, identity);
    }

    generate(debugPrefix?: string): this["Id"] {
        const randomSection = times(this.randomLength, () => sample(ALPHABET)).join("");
        if (USE_DEBUG_IDS) {
            let debugSection = debugPrefix ?? `${this.debugIdCounter++}`;
            debugSection = debugSection.slice(0, this.randomLength - 5);
            return `${this.prefix}.${debugSection}_${randomSection.slice(
                0,
                this.randomLength - (debugSection.length + 1),
            )}`;
        }
        return `${this.prefix}.${randomSection}`;
    }

    schema: Schema<this["Id"]>;
}
