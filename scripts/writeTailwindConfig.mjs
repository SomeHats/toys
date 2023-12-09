#!/usr/bin/env node
/* eslint-disable no-relative-import-paths/no-relative-import-paths */

import fs from "fs";
import path from "path";
import prettier from "prettier";
import resolveConfig from "tailwindcss/resolveConfig.js";
import url from "url";
import rawTailwindConfig from "../tailwind.config.js";

const tailwindConfig = resolveConfig(rawTailwindConfig);
const { colors, transitionTimingFunction: easings } = tailwindConfig.theme;

const scriptDir = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * @param {string} name
 */
function camelCase(name) {
    return name.replace(
        /([a-z])-([a-z])/g,
        (/** @type {any} */ _, /** @type {any} */ a, /** @type {string} */ b) =>
            `${a}${b.toUpperCase()}`,
    );
}

const code = [
    "// GENERATED FILE, DO NOT EDIT DIRECTLY",
    "// To edit, change `tailwind.config.js` and run `./scripts/writeTailwindConfig.mjs`.",
    "function makeColor<T extends Record<string, string>>(colors: T) {",
    "return function get<K extends keyof T>(key: K): T[K] {",
    "return colors[key];",
    "}",
    "}",
    "export const tailwindColors = {",
    ...Object.entries(colors).flatMap(([name, colors]) => {
        if (typeof colors !== "object") {
            return [];
        }
        const niceName = camelCase(name);
        return [
            ...Object.entries(colors).map(
                ([num, v]) => `${niceName}${num}: ${JSON.stringify(v)},`,
            ),
            `${niceName}: makeColor({`,
            ...Object.entries(colors).map(
                ([num, v]) => `${num}: ${JSON.stringify(v)},`,
            ),
            `}),`,
        ];
    }),
    "} as const;",
    "export const tailwindEasings = {",
    ...Object.entries(easings).map(([name, value]) => {
        const niceName = camelCase(name);
        return `${niceName}: ${JSON.stringify(value)},`;
    }),
    "} as const;",
].join("\n");

const prettierConfig = await prettier.resolveConfig(scriptDir);
const formattedCode = await prettier.format(code, {
    ...prettierConfig,
    parser: "typescript",
});
fs.writeFileSync(
    path.resolve(scriptDir, "../src/lib/theme.tsx"),
    formattedCode,
    "utf-8",
);
