import { splatapusStateSchema } from "@/splatapus/model/store";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { test } from "vitest";

const exampleNames = readdirSync(__dirname).filter((file) => file.endsWith(".json"));

for (const exampleName of exampleNames) {
    console.log({ exampleName });
    test(`example: ${exampleName}`, () => {
        const example = JSON.parse(readFileSync(path.join(__dirname, exampleName), "utf8"));
        splatapusStateSchema.parse(example).unwrap();
    });
}
