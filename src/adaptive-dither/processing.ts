/** Image processing pipeline for adaptive dithering */

import { frame } from "@/lib/utils";

export interface ProcessingParams {
    // Pass 1: Preprocessing
    scale: number;
    brightness: number;
    contrast: number;

    // Pass 2: Edge detection
    edgeStrength: number;

    // Pass 3: Contrast map (GPU JFA)
    radius: number;
    dropOffFunction: "linear" | "exponential" | "quadratic" | "sine";

    // Pass 4: Adaptive dithering
    ditherPattern: "floyd-steinberg" | "atkinson" | "ordered" | "noise";
    maxDitherLevels: number;
    contrastRangeLow: number;
    contrastRangeHigh: number;
    preserveBlocks: boolean;
}

export const DEFAULT_PARAMS: ProcessingParams = {
    scale: 1,
    brightness: 0,
    contrast: 0,
    edgeStrength: 1,
    radius: 50,
    dropOffFunction: "exponential",
    ditherPattern: "floyd-steinberg",
    maxDitherLevels: 5,
    contrastRangeLow: 0.1,
    contrastRangeHigh: 0.8,
    preserveBlocks: false,
};

/**
 * Get grayscale pixel data from an image, scaled to the given dimensions.
 * Returns a Float32Array of values in [0, 1].
 */
export function getScaledGrayscale(
    image: HTMLImageElement,
    width: number,
    height: number,
): Float32Array {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const gray = new Float32Array(width * height);
    for (let i = 0; i < gray.length; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    return gray;
}

/**
 * Pass 1: Apply brightness and contrast adjustments.
 * brightness in [-1, 1], contrast in [-1, 1].
 */
export function applyBrightnessContrast(
    gray: Float32Array,
    brightness: number,
    contrast: number,
): Float32Array {
    const out = new Float32Array(gray.length);
    // contrast factor: maps [-1, 1] to a multiplier
    const factor = contrast >= 0 ? 1 + contrast * 3 : 1 + contrast;
    for (let i = 0; i < gray.length; i++) {
        let v = gray[i];
        // apply brightness
        v += brightness;
        // apply contrast around midpoint
        v = (v - 0.5) * factor + 0.5;
        out[i] = Math.max(0, Math.min(1, v));
    }
    return out;
}

/**
 * Pass 2: Sobel edge detection.
 * Returns a Float32Array of edge magnitudes normalized to [0, 1].
 */
export function detectEdges(
    gray: Float32Array,
    width: number,
    height: number,
    strength: number,
): Float32Array {
    const edges = new Float32Array(width * height);
    let maxVal = 0;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const tl = gray[(y - 1) * width + (x - 1)];
            const tc = gray[(y - 1) * width + x];
            const tr = gray[(y - 1) * width + (x + 1)];
            const ml = gray[y * width + (x - 1)];
            const mr = gray[y * width + (x + 1)];
            const bl = gray[(y + 1) * width + (x - 1)];
            const bc = gray[(y + 1) * width + x];
            const br = gray[(y + 1) * width + (x + 1)];

            const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
            const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
            const mag = Math.sqrt(gx * gx + gy * gy) * strength;
            edges[y * width + x] = mag;
            if (mag > maxVal) maxVal = mag;
        }
    }

    // Normalize
    if (maxVal > 0) {
        for (let i = 0; i < edges.length; i++) {
            edges[i] = Math.min(1, edges[i] / maxVal);
        }
    }

    return edges;
}

// prettier-ignore
const BAYER_8X8 = [
     0, 48, 12, 60,  3, 51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
     8, 56,  4, 52, 11, 59,  7, 55,
    40, 24, 36, 20, 43, 27, 39, 23,
     2, 50, 14, 62,  1, 49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58,  6, 54,  9, 57,  5, 53,
    42, 26, 38, 22, 41, 25, 37, 21,
];
const BAYER_NORM = BAYER_8X8.map((v) => (v + 0.5) / 64);

/** Simple deterministic hash for noise dithering. */
function hashNoise(x: number, y: number, seed: number): number {
    let h = (seed * 374761393 + x * 668265263 + y * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h = h ^ (h >>> 16);
    return (h & 0x7fffffff) / 0x7fffffff;
}

/**
 * Dither a grayscale buffer at a given block size using the specified pattern.
 * Returns a Uint8Array of 0 or 255 values at the original resolution.
 */
function ditherAtBlockSize(
    gray: Float32Array,
    width: number,
    height: number,
    blockSize: number,
    pattern: ProcessingParams["ditherPattern"],
): Uint8Array {
    // Downsample by averaging blocks
    const bw = Math.ceil(width / blockSize);
    const bh = Math.ceil(height / blockSize);
    const blocked = new Float32Array(bw * bh);

    for (let by = 0; by < bh; by++) {
        for (let bx = 0; bx < bw; bx++) {
            let sum = 0;
            let count = 0;
            for (let dy = 0; dy < blockSize; dy++) {
                for (let dx = 0; dx < blockSize; dx++) {
                    const sx = bx * blockSize + dx;
                    const sy = by * blockSize + dy;
                    if (sx < width && sy < height) {
                        sum += gray[sy * width + sx];
                        count++;
                    }
                }
            }
            blocked[by * bw + bx] = sum / count;
        }
    }

    const dithered = new Float32Array(blocked);

    if (pattern === "floyd-steinberg") {
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const idx = y * bw + x;
                const old = dithered[idx];
                const newVal = old >= 0.5 ? 1 : 0;
                dithered[idx] = newVal;
                const err = old - newVal;

                if (x + 1 < bw) dithered[idx + 1] += (err * 7) / 16;
                if (y + 1 < bh) {
                    if (x - 1 >= 0)
                        dithered[(y + 1) * bw + (x - 1)] += (err * 3) / 16;
                    dithered[(y + 1) * bw + x] += (err * 5) / 16;
                    if (x + 1 < bw)
                        dithered[(y + 1) * bw + (x + 1)] += (err * 1) / 16;
                }
            }
        }
    } else if (pattern === "atkinson") {
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const idx = y * bw + x;
                const old = dithered[idx];
                const newVal = old >= 0.5 ? 1 : 0;
                dithered[idx] = newVal;
                const err = (old - newVal) / 8;

                if (x + 1 < bw) dithered[idx + 1] += err;
                if (x + 2 < bw) dithered[idx + 2] += err;
                if (y + 1 < bh) {
                    if (x - 1 >= 0) dithered[(y + 1) * bw + (x - 1)] += err;
                    dithered[(y + 1) * bw + x] += err;
                    if (x + 1 < bw) dithered[(y + 1) * bw + (x + 1)] += err;
                }
                if (y + 2 < bh) {
                    dithered[(y + 2) * bw + x] += err;
                }
            }
        }
    } else if (pattern === "ordered") {
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const threshold = BAYER_NORM[(y & 7) * 8 + (x & 7)];
                dithered[y * bw + x] = blocked[y * bw + x] > threshold ? 1 : 0;
            }
        }
    } else {
        // noise
        const seed = blockSize * 31337;
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const threshold = hashNoise(x, y, seed);
                dithered[y * bw + x] = blocked[y * bw + x] > threshold ? 1 : 0;
            }
        }
    }

    // Upscale back to original resolution
    const result = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const bx = Math.floor(x / blockSize);
            const by = Math.floor(y / blockSize);
            result[y * width + x] = dithered[by * bw + bx] >= 0.5 ? 255 : 0;
        }
    }

    return result;
}

/**
 * Pass 4: Adaptive multi-resolution dithering.
 *
 * Uses the contrast map to select dithering resolution per region.
 * High contrast areas get fine (1:1) dithering.
 * Low contrast areas get coarse (large block) dithering.
 */
/** Compute per-pixel level index from contrast map value. */
function contrastToLevel(
    c: number,
    rangeLow: number,
    rangeHigh: number,
    maxLevels: number,
): number {
    let t: number;
    if (c >= rangeHigh) {
        t = 0;
    } else if (c <= rangeLow) {
        t = 1;
    } else {
        t = 1 - (c - rangeLow) / (rangeHigh - rangeLow);
    }
    return Math.min(Math.round(t * (maxLevels - 1)), maxLevels - 1);
}

/**
 * Block-preserving compositing: iterate coarse-to-fine, overwriting entire
 * blocks atomically when any pixel in the block requests that level or finer.
 */
function compositeBlocks(
    levels: Uint8Array[],
    levelMap: Uint8Array,
    width: number,
    height: number,
    maxLevels: number,
): Uint8Array {
    // Start with the coarsest level
    const output = new Uint8Array(levels[maxLevels - 1]);

    // Iterate from second-coarsest down to finest
    for (let level = maxLevels - 2; level >= 0; level--) {
        const blockSize = 1 << level;
        const bw = Math.ceil(width / blockSize);
        const bh = Math.ceil(height / blockSize);

        for (let by = 0; by < bh; by++) {
            for (let bx = 0; bx < bw; bx++) {
                const x0 = bx * blockSize;
                const y0 = by * blockSize;
                const x1 = Math.min(x0 + blockSize, width);
                const y1 = Math.min(y0 + blockSize, height);

                // Check if any pixel in this block needs this level or finer
                let needsLevel = false;
                for (let y = y0; y < y1 && !needsLevel; y++) {
                    for (let x = x0; x < x1 && !needsLevel; x++) {
                        if (levelMap[y * width + x] <= level) {
                            needsLevel = true;
                        }
                    }
                }

                if (needsLevel) {
                    const src = levels[level];
                    for (let y = y0; y < y1; y++) {
                        for (let x = x0; x < x1; x++) {
                            const idx = y * width + x;
                            output[idx] = src[idx];
                        }
                    }
                }
            }
        }
    }

    return output;
}

export function adaptiveDither(
    preprocessed: Float32Array,
    contrastMap: Float32Array,
    width: number,
    height: number,
    maxLevels: number,
    rangeLow: number,
    rangeHigh: number,
    ditherPattern: ProcessingParams["ditherPattern"],
    preserveBlocks: boolean,
): Uint8Array {
    // Generate dithered versions at each block size level
    const levels: Uint8Array[] = [];
    for (let i = 0; i < maxLevels; i++) {
        const blockSize = 1 << i; // 1, 2, 4, 8, 16, ...
        levels.push(
            ditherAtBlockSize(
                preprocessed,
                width,
                height,
                blockSize,
                ditherPattern,
            ),
        );
    }

    if (preserveBlocks) {
        const levelMap = new Uint8Array(width * height);
        for (let i = 0; i < width * height; i++) {
            levelMap[i] = contrastToLevel(
                contrastMap[i],
                rangeLow,
                rangeHigh,
                maxLevels,
            );
        }
        return compositeBlocks(levels, levelMap, width, height, maxLevels);
    }

    // Per-pixel blending (original behavior)
    const output = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
        const levelIdx = contrastToLevel(
            contrastMap[i],
            rangeLow,
            rangeHigh,
            maxLevels,
        );
        output[i] = levels[levelIdx][i];
    }

    return output;
}

// ── Async batched CPU passes ─────────────────────────────────────────

interface AsyncPassOptions {
    signal: AbortSignal;
    onProgress: (progress: number) => void;
}

async function yieldIfNeeded(start: number): Promise<number> {
    if (performance.now() - start > 10) {
        await frame();
        return performance.now();
    }
    return start;
}

/**
 * Async version of adaptiveDither that yields to the browser and supports
 * cancellation. Reports progress across dither level generation and blending.
 */
export async function adaptiveDitherAsync(
    preprocessed: Float32Array,
    contrastMap: Float32Array,
    width: number,
    height: number,
    maxLevels: number,
    rangeLow: number,
    rangeHigh: number,
    ditherPattern: ProcessingParams["ditherPattern"],
    preserveBlocks: boolean,
    { signal, onProgress }: AsyncPassOptions,
): Promise<Uint8Array> {
    // Phase 1: Generate dithered versions (50% of progress)
    const levels: Uint8Array[] = [];
    for (let i = 0; i < maxLevels; i++) {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        const blockSize = 1 << i;
        levels.push(
            ditherAtBlockSize(
                preprocessed,
                width,
                height,
                blockSize,
                ditherPattern,
            ),
        );
        onProgress(((i + 1) / maxLevels) * 0.5);
        await frame();
    }

    // Phase 2: Composite / blend (remaining 50%)
    const totalPixels = width * height;

    if (preserveBlocks) {
        // Build per-pixel level map
        const levelMap = new Uint8Array(totalPixels);
        let lastYield = performance.now();
        for (let i = 0; i < totalPixels; i++) {
            levelMap[i] = contrastToLevel(
                contrastMap[i],
                rangeLow,
                rangeHigh,
                maxLevels,
            );
            if (i % 50000 === 0) {
                if (signal.aborted)
                    throw new DOMException("Aborted", "AbortError");
                onProgress(0.5 + (i / totalPixels) * 0.25);
                lastYield = await yieldIfNeeded(lastYield);
            }
        }

        // Block compositing
        const output = compositeBlocks(
            levels,
            levelMap,
            width,
            height,
            maxLevels,
        );
        onProgress(1);
        return output;
    }

    // Per-pixel blending (original behavior)
    const output = new Uint8Array(totalPixels);
    let lastYield = performance.now();

    for (let i = 0; i < totalPixels; i++) {
        const levelIdx = contrastToLevel(
            contrastMap[i],
            rangeLow,
            rangeHigh,
            maxLevels,
        );
        output[i] = levels[levelIdx][i];

        if (i % 50000 === 0) {
            if (signal.aborted) throw new DOMException("Aborted", "AbortError");
            onProgress(0.5 + (i / totalPixels) * 0.5);
            lastYield = await yieldIfNeeded(lastYield);
        }
    }

    onProgress(1);
    return output;
}

/**
 * Render a Float32Array [0,1] as grayscale onto a canvas.
 */
export function renderGrayscale(
    data: Float32Array,
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
): void {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < data.length; i++) {
        const v = Math.max(0, Math.min(255, Math.round(data[i] * 255)));
        imageData.data[i * 4] = v;
        imageData.data[i * 4 + 1] = v;
        imageData.data[i * 4 + 2] = v;
        imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Render a Uint8Array (0 or 255) as black/white onto a canvas.
 */
export function renderBinary(
    data: Uint8Array,
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
): void {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < data.length; i++) {
        const v = data[i];
        imageData.data[i * 4] = v;
        imageData.data[i * 4 + 1] = v;
        imageData.data[i * 4 + 2] = v;
        imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}
