#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* global require __dirname */

const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("../tailwind.config");
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

const colors = resolveConfig(tailwindConfig).theme.colors;

const code = [
    "// GENERATED FILE, DO NOT EDIT DIRECTLY",
    "function makeColor<T extends Record<string, string>>(colors: T) {",
    "return function get<K extends keyof T>(key: K): T[K] {",
    "return colors[key];",
    "}",
    "}",
    `export const tailwindColors = {`,
    ...Object.entries(colors).flatMap(([name, colors]) => {
        if (typeof colors !== "object") {
            return [];
        }
        return [
            ...Object.entries(colors).map(([num, v]) => `${name}${num}: ${JSON.stringify(v)},`),
            `${name}: makeColor(${JSON.stringify(colors)}),`,
        ];
    }),
    "} as const;",
].join("\n");

prettier.resolveConfig(__dirname).then((config) => {
    const formattedCode = prettier.format(code, { ...config, parser: "typescript" });
    fs.writeFileSync(path.resolve(__dirname, "../src/lib/theme.tsx"), formattedCode, "utf-8");
});
