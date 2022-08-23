import { composeParsers, Parser, ParserError, parseString } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { sample, times } from "@/lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const USE_DEBUG_IDS = process.env.NODE_ENV !== "production";

export class IdGenerator<Prefix extends string> {
    private readonly prefix: Prefix;
    readonly Id: `${Prefix}.${string}`;
    private debugIdCounter = 0;

    constructor(prefix: Prefix, readonly randomLength = 16) {
        this.prefix = prefix;
        this.Id = `${prefix}.SAMPLE`;
        const re = new RegExp(`^${this.prefix}\\.([a-zA-Z0-9_]+)$`);
        this.parse = composeParsers(parseString, (input) => {
            if (re.test(input)) {
                return Result.ok(input as this["Id"]);
            } else {
                return Result.error(new ParserError(`Expected ${this.prefix}.*, got ${input}`, []));
            }
        });
    }

    generate(): this["Id"] {
        const randomSection = times(this.randomLength, () => sample(ALPHABET)).join("");
        if (USE_DEBUG_IDS) {
            const debugSection = `${this.debugIdCounter++}`;
            return `${this.prefix}.${debugSection}_${randomSection.slice(
                0,
                this.randomLength - (debugSection.length + 1),
            )}`;
        }
        return `${this.prefix}.${randomSection}`;
    }

    parse: Parser<this["Id"]>;
}
