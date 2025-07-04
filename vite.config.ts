import { PluginObj } from "@babel/core";
import generate from "@babel/generator";
import * as T from "@babel/types";
import react from "@vitejs/plugin-react";
import assert from "assert";
import { glob } from "glob";
import path from "path";
import { defineConfig, PluginOption } from "vite";

const mainIndex = path.resolve(__dirname, "src/index.html");
const roots = glob
    .sync(path.join(__dirname, "src/**/*.html"))
    .filter((root) => root !== mainIndex)
    .map((root) => path.relative(__dirname, root))
    .map((root) => [
        root.replace(/^src\//, "").replace(/\/index\.html$/, ""),
        path.resolve(__dirname, root),
    ]);

const baseUrl = process.env.VITE_BASE ?? "./";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const glsl = await import("vite-plugin-glsl");
    return {
        plugins: [
            react({
                babel: {
                    plugins: [
                        createAssertPlugin(),
                        [
                            "@babel/plugin-proposal-decorators",
                            { version: "2023-01" },
                        ],
                    ],
                },
            }),
            glsl.default({ compress: mode === "production" }),
            resolveATags(),
        ],
        base: baseUrl,
        root: path.resolve(__dirname, "src"),
        publicDir: path.resolve(__dirname, "public"),
        resolve: {
            alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
        },
        build: {
            outDir: path.resolve(__dirname, "dist"),
            rollupOptions: {
                input: {
                    main: mainIndex,
                    ...Object.fromEntries(roots),
                },
                output: {
                    assetFileNames: "static/asset_[name].[hash].[ext]",
                    chunkFileNames: "static/chunk_[name].[hash].js",
                    entryFileNames: "static/[name].[hash].js",
                },
            },
        },
    };
});

function resolveATags(): PluginOption {
    return {
        name: "resolve-a-tags",
        transformIndexHtml: (html, ctx) => {
            for (let i = 0; i < html.length; i++) {
                if (
                    html[i] !== "<" ||
                    html[i + 1] !== "a" ||
                    !(/\s/.exec(html[i + 2]))
                ) {
                    continue;
                }

                const tagStart = i;
                let tagEnd = null;
                for (; i < html.length; i++) {
                    if (html[i] !== ">") continue;
                    tagEnd = i;
                    break;
                }
                if (tagEnd === null) continue;

                const tag = html.slice(tagStart, tagEnd + 1);
                if (!tag.includes("href")) continue;
                const hrefStart = tag.indexOf('href="') + 'href="'.length;
                const hrefEnd = tag.indexOf('"', hrefStart);
                const href = tag.slice(hrefStart, hrefEnd);
                const newHref = path.join(baseUrl, href);

                html =
                    html.slice(0, tagStart + hrefStart) +
                    newHref +
                    html.slice(tagStart + hrefEnd);

                i = tagEnd;
            }

            return html;
        },
    };
}

function createAssertPlugin(): PluginObj {
    return {
        visitor: {
            CallExpression(path, state) {
                try {
                    if (path.node.callee.type !== "Identifier") {
                        return;
                    }
                    const calleeName = path.node.callee.name;
                    const binding = path.scope.getBinding(calleeName);
                    if (!binding) return;

                    const importSpecifier = binding.path.node;
                    if (importSpecifier.type !== "ImportSpecifier") return;
                    const importDeclaration = binding.path.parent;
                    assert(importDeclaration.type === "ImportDeclaration");

                    if (importDeclaration.source.value !== "@/lib/assert")
                        return;
                    if (importSpecifier.imported.type !== "Identifier") return;
                    if (
                        importSpecifier.imported.name !== "assert" &&
                        importSpecifier.imported.name !== "assertExists"
                    ) {
                        return;
                    }

                    const args = path.node.arguments;
                    if (args.length !== 1) return;
                    const argString = generate(args[0]).code;
                    args.push(T.stringLiteral(`Assertion Error: ${argString}`));
                } catch (e: any) {
                    console.log("err", e.stack);
                    throw e;
                }
            },
        },
    };
}
