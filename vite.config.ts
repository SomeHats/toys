import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { glob } from "glob";
import wasmPack from "vite-plugin-wasm-pack";

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
export default defineConfig(async () => {
    const glsl = await import("vite-plugin-glsl");
    return {
        plugins: [react(), glsl.default()],
        base: "./",
        root: path.resolve(__dirname, "src"),
        publicDir: false,
        build: {
            outDir: path.resolve(__dirname, "dist"),
            rollupOptions: {
                input: {
                    main: mainIndex,
                    ...Object.fromEntries(roots),
                },
            },
        },
    };
});
