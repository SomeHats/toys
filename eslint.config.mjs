import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores([
        "scripts",
        "eslint.config.mjs",
        ".yarn",
        "**/tailwind.config.js",
        "**/postcss.config.js",
        "**/dist",
        "**/target",
        "**/pkg",
        "**/packages_out",
    ]),
    {
        extends: fixupConfigRules(
            compat.extends(
                "eslint:recommended",
                "plugin:react-hooks/recommended",
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:@typescript-eslint/recommended-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
            ),
        ),

        plugins: {
            react: fixupPluginRules(react),
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            "react-hooks": fixupPluginRules(reactHooks),
            "no-relative-import-paths": noRelativeImportPaths,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },

                project: true,
                tsconfigRootDir: ".",
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "^_",
                    args: "none",
                },
            ],

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",

            "no-constant-condition": [
                "error",
                {
                    checkLoops: false,
                },
            ],

            "prefer-const": [
                "error",
                {
                    destructuring: "all",
                },
            ],

            "no-relative-import-paths/no-relative-import-paths": ["error"],

            "react-hooks/exhaustive-deps": [
                "error",
                {
                    additionalHooks: "useLive",
                },
            ],
        },
    },
]);
