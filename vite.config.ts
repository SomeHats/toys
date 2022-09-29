import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { glob } from "glob";

const mainIndex = path.resolve(__dirname, "src/index.html");
const roots = glob
    .sync(path.join(__dirname, "src/**/*.html"))
    .filter((root) => root !== mainIndex)
    .map((root) => path.relative(__dirname, root))
    .map((root) => [
        root.replace(/^src\//, "").replace(/\/index\.html$/, ""),
        path.resolve(__dirname, root),
    ]);

const baseUrl = process.env.VITE_BASE || "./";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const glsl = await import("vite-plugin-glsl");
    return {
        plugins: [react(), glsl.default({ compress: mode === "production" }), resolveATags()],
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
        transformIndexHtml: async (html, ctx) => {
            return html.replace(/(<a [^>]*?href=")([^"]+?)("[^>]*?>)/g, (_, pre, url, post) => {
                return `${pre}${path.join(baseUrl, url)}${post}`;
            });
        },
    };
}
