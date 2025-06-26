#!/usr/bin/env node
import vitePluginReact from "@vitejs/plugin-react";
import { execFile } from "child_process";
import fs from "fs/promises";
import path from "path";
import rimrafDefault from "rimraf";
import url from "url";
import { promisify } from "util";
import * as vite from "vite";
import vitePluginDts from "vite-plugin-dts";

const rimraf = promisify(rimrafDefault);

const scriptDir = url.fileURLToPath(new URL(".", import.meta.url));
const rootDir = path.resolve(scriptDir, "..");

const packagesDir = path.resolve(scriptDir, "../packages");
const pacakgesOutDir = path.resolve(scriptDir, "../packages_out");
void buildAll();

async function buildAll() {
    rimraf(pacakgesOutDir);
    for (const file of await fs.readdir(packagesDir)) {
        const packageJsonPath = path.resolve(packagesDir, file);
        await buildIfNeeded(packageJsonPath);
    }
}
/**
 * @param {string} packageJsonPath
 */
async function buildIfNeeded(packageJsonPath) {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    if (await isUpToDate(packageJson.name, packageJson.version)) {
        return;
    }

    const entryPoint = path.resolve(
        path.dirname(packageJsonPath),
        packageJson.main,
    );

    const outDir = path.resolve(pacakgesOutDir, packageJson.name);

    await vite.build({
        configFile: false,
        base: `${rootDir}/`,
        root: rootDir,
        publicDir: false,
        plugins: [vitePluginReact(), vitePluginDts()],
        resolve: {
            alias: [{ find: "@", replacement: path.resolve(rootDir, "src") }],
        },
        build: {
            outDir,
            minify: false,
            lib: {
                entry: entryPoint,
                name: packageJson.name,
                fileName: "index",
            },
        },
    });

    rimraf(path.resolve(outDir, "src/slomojs"));
    rimraf(path.resolve(outDir, "src/vite-env.d.ts"));
    rimraf(path.resolve(outDir, "types"));

    const typesPath = path
        .relative(rootDir, entryPoint)
        .replace(/\.tsx?$/, ".d.ts");
    const packageJsonFile = {
        ...packageJson,
        main: "./index.umd.js",
        types: `./${typesPath}`,
        exports: {
            import: "./index.mjs",
            require: "./index.umd.js",
        },
    };
    await fs.writeFile(
        path.resolve(outDir, "package.json"),
        JSON.stringify(packageJsonFile, null, 2),
        "utf-8",
    );
}

/**
 * @param {string} name
 * @param {string} version
 */
async function isUpToDate(name, version) {
    try {
        const currentVersion = await run("npm", ["view", name, "version"]);
        return currentVersion === version;
    } catch {
        // does not exist
        return false;
    }
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<string>}
 */
async function run(command, args) {
    return new Promise((resolve, reject) => {
        execFile(command, args, (err, stdout) => {
            if (err) {
                reject(new Error(err));
            }
            resolve(stdout.trim());
        });
    });
}
