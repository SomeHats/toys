import { test } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { splatapusStateSchema } from "@/splatapus/model/store";

const exampleNames = readdirSync(__dirname).filter((file) => file.endsWith(".json"));

for (const exampleName of exampleNames) {
    test(`example: ${exampleName}`, () => {
        const example = JSON.parse(readFileSync(path.join(__dirname, exampleName), "utf8"));
        splatapusStateSchema.parse(example).unwrap();
    });
}
