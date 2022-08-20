import { composeParsers, Parser, ParserError, parseString } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { sample, times } from "@/lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

export class IdGenerator<Prefix extends string> {
    private readonly prefix: Prefix;
    readonly Id: `${Prefix}.${string}`;

    constructor(prefix: Prefix, readonly randomLength = 16) {
        this.prefix = prefix;
        this.Id = `${prefix}.SAMPLE`;
        const re = new RegExp(`^${this.prefix}\\.([a-zA-Z0-9]+)$`);
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
        return `${this.prefix}.${randomSection}`;
    }

    parse: Parser<this["Id"]>;
}
