import { defineConfig } from "vite";
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

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const glsl = await import("vite-plugin-glsl");
    return {
        plugins: [react(), glsl.default({ compress: mode === "production" })],
        base: process.env.VITE_BASE || "./",
        root: path.resolve(__dirname, "src"),
        publicDir: false,
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
                    assetFileNames: "assets/asset_[name].[hash].[ext]",
                    chunkFileNames: "chunks/chunk_[name].[hash].js",
                    entryFileNames: "[name]/[name].[hash].js",
                },
            },
        },
    };
});
