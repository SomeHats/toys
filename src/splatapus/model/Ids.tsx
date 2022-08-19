import { sample, times } from "@/lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

export class IdGenerator<Prefix extends string> {
    private readonly prefix: Prefix;
    readonly Id: `${Prefix}.${string}`;

    constructor(prefix: Prefix, readonly randomLength = 16) {
        this.prefix = prefix;
        this.Id = `${prefix}.SAMPLE`;
    }

    generate(): this["Id"] {
        const randomSection = times(this.randomLength, () => sample(ALPHABET)).join("");
        return `${this.prefix}.${randomSection}`;
    }
}
