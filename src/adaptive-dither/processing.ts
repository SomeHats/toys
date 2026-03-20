/** Image processing pipeline for adaptive dithering */

export interface ProcessingParams {
    // Pass 1: Preprocessing
    scale: number;
    brightness: number;
    contrast: number;

    // Pass 2: Edge detection
    edgeStrength: number;

    // Pass 3: Contrast map
    dropOffRate: number;
    dropOffFunction: "linear" | "exponential" | "quadratic" | "sine";

    // Pass 4: Adaptive dithering
    maxDitherLevels: number;
    contrastRangeLow: number;
    contrastRangeHigh: number;
}

export const DEFAULT_PARAMS: ProcessingParams = {
    scale: 1,
    brightness: 0,
    contrast: 0,
    edgeStrength: 1,
    dropOffRate: 0.05,
    dropOffFunction: "exponential",
    maxDitherLevels: 5,
    contrastRangeLow: 0.1,
    contrastRangeHigh: 0.8,
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

/**
 * Drop-off functions for the contrast map propagation.
 */
function getDropOffFn(
    type: ProcessingParams["dropOffFunction"],
): (distance: number, rate: number) => number {
    switch (type) {
        case "linear":
            return (d, r) => Math.max(0, 1 - d * r);
        case "exponential":
            return (d, r) => Math.exp(-d * r);
        case "quadratic":
            return (d, r) => Math.max(0, 1 - (d * r) * (d * r));
        case "sine":
            return (d, r) => {
                const v = d * r;
                return v >= 1 ?
                        0
                    :   Math.cos((v * Math.PI) / 2);
            };
    }
}

/**
 * Pass 3: Build contrast map by propagating edge values outward.
 * This works like a distance field: high-contrast pixels seed the map,
 * and their influence drops off with distance according to the chosen function.
 *
 * Uses a BFS-like flood fill from high-edge pixels.
 */
export function buildContrastMap(
    edges: Float32Array,
    width: number,
    height: number,
    dropOffRate: number,
    dropOffFunction: ProcessingParams["dropOffFunction"],
): Float32Array {
    const contrastMap = new Float32Array(width * height);
    const dropOff = getDropOffFn(dropOffFunction);

    // Distance from nearest significant edge pixel
    const dist = new Float32Array(width * height).fill(Infinity);

    // Edge value of the source pixel that influenced each cell
    const sourceEdge = new Float32Array(width * height);

    // BFS queue: [index, distance, sourceEdgeValue]
    const queue: [number, number, number][] = [];

    // Seed with all pixels that have non-trivial edge values
    const threshold = 0.05;
    for (let i = 0; i < edges.length; i++) {
        if (edges[i] > threshold) {
            dist[i] = 0;
            sourceEdge[i] = edges[i];
            contrastMap[i] = edges[i];
            queue.push([i, 0, edges[i]]);
        }
    }

    // Sort by edge value descending so strongest edges propagate first
    queue.sort((a, b) => b[2] - a[2]);

    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];

    let head = 0;
    while (head < queue.length) {
        const [idx, d, srcEdge] = queue[head++];
        const x = idx % width;
        const y = (idx - x) / width;

        for (let dir = 0; dir < 4; dir++) {
            const nx = x + dx[dir];
            const ny = y + dy[dir];
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

            const nIdx = ny * width + nx;
            const newDist = d + 1;
            const newVal = srcEdge * dropOff(newDist, dropOffRate);

            if (newVal > contrastMap[nIdx]) {
                contrastMap[nIdx] = newVal;
                dist[nIdx] = newDist;
                sourceEdge[nIdx] = srcEdge;
                queue.push([nIdx, newDist, srcEdge]);
            }
        }
    }

    // Normalize the contrast map to [0, 1]
    let maxVal = 0;
    for (const v of contrastMap) {
        if (v > maxVal) maxVal = v;
    }
    if (maxVal > 0) {
        for (let i = 0; i < contrastMap.length; i++) {
            contrastMap[i] /= maxVal;
        }
    }

    return contrastMap;
}

/**
 * Floyd-Steinberg dithering on a grayscale buffer at a given block size.
 * blockSize=1 means pixel-level dithering, blockSize=2 means 2x2 blocks, etc.
 * Returns a Uint8Array of 0 or 255 values at the original resolution.
 */
function ditherAtBlockSize(
    gray: Float32Array,
    width: number,
    height: number,
    blockSize: number,
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

    // Floyd-Steinberg on the blocked image
    const dithered = new Float32Array(blocked);
    for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
            const idx = y * bw + x;
            const old = dithered[idx];
            const newVal = old >= 0.5 ? 1 : 0;
            dithered[idx] = newVal;
            const err = old - newVal;

            if (x + 1 < bw) dithered[idx + 1] += err * 7 / 16;
            if (y + 1 < bh) {
                if (x - 1 >= 0) dithered[(y + 1) * bw + (x - 1)] += err * 3 / 16;
                dithered[(y + 1) * bw + x] += err * 5 / 16;
                if (x + 1 < bw) dithered[(y + 1) * bw + (x + 1)] += err * 1 / 16;
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
export function adaptiveDither(
    preprocessed: Float32Array,
    contrastMap: Float32Array,
    width: number,
    height: number,
    maxLevels: number,
    rangeLow: number,
    rangeHigh: number,
): Uint8Array {
    // Generate dithered versions at each block size level
    const levels: Uint8Array[] = [];
    for (let i = 0; i < maxLevels; i++) {
        const blockSize = 1 << i; // 1, 2, 4, 8, 16, ...
        levels.push(ditherAtBlockSize(preprocessed, width, height, blockSize));
    }

    // Blend based on contrast map
    const output = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
        const c = contrastMap[i];
        // Map contrast value to a level index
        // High contrast (>= rangeHigh) -> level 0 (finest)
        // Low contrast (<= rangeLow) -> level maxLevels-1 (coarsest)
        let t: number;
        if (c >= rangeHigh) {
            t = 0;
        } else if (c <= rangeLow) {
            t = 1;
        } else {
            t = 1 - (c - rangeLow) / (rangeHigh - rangeLow);
        }

        const levelFloat = t * (maxLevels - 1);
        const levelIdx = Math.round(levelFloat);
        output[i] = levels[Math.min(levelIdx, maxLevels - 1)][i];
    }

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
