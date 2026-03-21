/** GPU-accelerated image processing pipeline for adaptive dithering.
 *
 * Uses WebGL2 with the project's GL helpers for shader programs and textures,
 * plus raw WebGL for framebuffer ping-pong (not covered by the helpers).
 *
 * Pipeline:
 *   Pass 1: Brightness/contrast (fragment shader)
 *   Pass 2: Sobel edge detection (fragment shader)
 *   Pass 3: Jump Flood Algorithm to propagate contrast (multi-pass ping-pong)
 *   Pass 4: Adaptive Bayer dithering at varying block sizes (fragment shader)
 */

import type { ProcessingParams } from "@/adaptive-dither/processing";
import { assertExists } from "@/lib/assert";
import { Gl, glsl } from "@/lib/gl/Gl";
import type { GlProgram } from "@/lib/gl/GlProgram";
import { GlBufferUsage, GlVertexAttribType } from "@/lib/gl/GlTypes";
import type { GlVertexArray } from "@/lib/gl/GlVertexArray";

// ── shared vertex shader (fullscreen quad) ──────────────────────────────

const FULLSCREEN_VERT = glsl`#version 300 es
    in vec2 a_position;
    out vec2 v_uv;
    void main() {
        v_uv = a_position;
        gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
    }
`;

// ── Pass 1: Brightness / Contrast ───────────────────────────────────────

const BRIGHTNESS_CONTRAST_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_source;
    uniform float u_brightness;
    uniform float u_contrast;

    void main() {
        vec4 c = texture(u_source, v_uv);
        float gray = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        float factor = u_contrast >= 0.0 ? 1.0 + u_contrast * 3.0 : 1.0 + u_contrast;
        gray += u_brightness;
        gray = (gray - 0.5) * factor + 0.5;
        gray = clamp(gray, 0.0, 1.0);
        fragColor = vec4(gray, gray, gray, 1.0);
    }
`;

// ── Pass 2: Sobel edge detection ────────────────────────────────────────

const EDGE_DETECT_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_source;
    uniform vec2 u_texelSize;
    uniform float u_strength;

    void main() {
        float tl = texture(u_source, v_uv + vec2(-1, -1) * u_texelSize).r;
        float tc = texture(u_source, v_uv + vec2( 0, -1) * u_texelSize).r;
        float tr = texture(u_source, v_uv + vec2( 1, -1) * u_texelSize).r;
        float ml = texture(u_source, v_uv + vec2(-1,  0) * u_texelSize).r;
        float mr = texture(u_source, v_uv + vec2( 1,  0) * u_texelSize).r;
        float bl = texture(u_source, v_uv + vec2(-1,  1) * u_texelSize).r;
        float bc = texture(u_source, v_uv + vec2( 0,  1) * u_texelSize).r;
        float br = texture(u_source, v_uv + vec2( 1,  1) * u_texelSize).r;

        float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
        float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
        float mag = length(vec2(gx, gy)) * u_strength;
        fragColor = vec4(mag, mag, mag, 1.0);
    }
`;

// ── Pass 3a: JFA seed (initialize jump-flood from edge pixels) ──────────

const JFA_SEED_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_edges;
    uniform float u_threshold;

    void main() {
        float edge = texture(u_edges, v_uv).r;
        if (edge > u_threshold) {
            // Store this pixel's UV coords and edge value
            fragColor = vec4(v_uv, edge, 1.0);
        } else {
            // Sentinel: no source assigned yet
            fragColor = vec4(-1.0, -1.0, 0.0, 0.0);
        }
    }
`;

// ── Pass 3b: JFA step ───────────────────────────────────────────────────

const JFA_STEP_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_jfa;
    uniform vec2 u_texelSize;
    uniform float u_stepSize;

    void main() {
        vec4 best = texture(u_jfa, v_uv);
        float bestDist = best.w > 0.5 ? distance(v_uv, best.xy) : 1e10;

        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                if (dx == 0 && dy == 0) continue;
                vec2 sampleUV = v_uv + vec2(float(dx), float(dy)) * u_stepSize * u_texelSize;
                vec4 s = texture(u_jfa, sampleUV);
                if (s.w > 0.5) {
                    float d = distance(v_uv, s.xy);
                    if (d < bestDist) {
                        bestDist = d;
                        best = s;
                    }
                }
            }
        }
        fragColor = best;
    }
`;

// ── Pass 3c: JFA resolve (convert JFA result to contrast map) ───────────

const JFA_RESOLVE_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_jfa;
    uniform vec2 u_resolution;
    uniform float u_dropOffRate;
    uniform int u_dropOffFunction; // 0=linear, 1=exp, 2=quadratic, 3=sine

    float applyDropOff(float dist, float rate) {
        if (u_dropOffFunction == 0) {
            return max(0.0, 1.0 - dist * rate);
        } else if (u_dropOffFunction == 1) {
            return exp(-dist * rate);
        } else if (u_dropOffFunction == 2) {
            float v = dist * rate;
            return max(0.0, 1.0 - v * v);
        } else {
            float v = dist * rate;
            return v >= 1.0 ? 0.0 : cos(v * 1.5707963);
        }
    }

    void main() {
        vec4 jfa = texture(u_jfa, v_uv);
        if (jfa.w < 0.5) {
            fragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        float pixelDist = distance(v_uv * u_resolution, jfa.xy * u_resolution);
        float srcEdge = jfa.z;
        float val = srcEdge * applyDropOff(pixelDist, u_dropOffRate);
        fragColor = vec4(val, val, val, 1.0);
    }
`;

// ── Pass 4: Adaptive Bayer dithering ────────────────────────────────────

const ADAPTIVE_DITHER_FRAG = glsl`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_preprocessed;
    uniform sampler2D u_contrastMap;
    uniform vec2 u_resolution;
    uniform int u_maxLevels;
    uniform float u_rangeLow;
    uniform float u_rangeHigh;

    // 8x8 Bayer matrix (normalized to [0, 1))
    float bayer8(vec2 pos) {
        ivec2 p = ivec2(pos) & 7;
        int idx = p.x + p.y * 8;
        // Precomputed 8x8 Bayer matrix
        int b8[64] = int[64](
             0, 32,  8, 40,  2, 34, 10, 42,
            48, 16, 56, 24, 50, 18, 58, 26,
            12, 44,  4, 36, 14, 46,  6, 38,
            60, 28, 52, 20, 62, 30, 54, 22,
             3, 35, 11, 43,  1, 33,  9, 41,
            51, 19, 59, 27, 49, 17, 57, 25,
            15, 47,  7, 39, 13, 45,  5, 37,
            63, 31, 55, 23, 61, 29, 53, 21
        );
        return (float(b8[idx]) + 0.5) / 64.0;
    }

    // Dither at a given block size using Bayer pattern
    float ditherAtBlock(vec2 pixelCoord, float gray, int blockSize) {
        // Quantize pixel to block grid
        vec2 blockCoord = floor(pixelCoord / float(blockSize));
        // Average the block: sample at block center
        vec2 blockCenter = (blockCoord + 0.5) * float(blockSize) / u_resolution;
        float blockGray = texture(u_preprocessed, blockCenter).r;
        // Apply Bayer threshold within the block
        vec2 posInBlock = mod(pixelCoord, float(blockSize));
        float threshold = bayer8(posInBlock * (8.0 / float(blockSize)));
        return step(threshold, blockGray);
    }

    void main() {
        float contrast = texture(u_contrastMap, v_uv).r;
        vec2 pixelCoord = v_uv * u_resolution;
        float gray = texture(u_preprocessed, v_uv).r;

        // Map contrast to level index
        float t;
        if (contrast >= u_rangeHigh) {
            t = 0.0;
        } else if (contrast <= u_rangeLow) {
            t = 1.0;
        } else {
            t = 1.0 - (contrast - u_rangeLow) / (u_rangeHigh - u_rangeLow);
        }

        float levelFloat = t * float(u_maxLevels - 1);
        int level = int(round(levelFloat));
        level = min(level, u_maxLevels - 1);
        int blockSize = 1 << level;

        float result = ditherAtBlock(pixelCoord, gray, blockSize);
        fragColor = vec4(result, result, result, 1.0);
    }
`;

// ── Pipeline class ──────────────────────────────────────────────────────

const DROP_OFF_FN_INDEX: Record<ProcessingParams["dropOffFunction"], number> = {
    linear: 0,
    exponential: 1,
    quadratic: 2,
    sine: 3,
};

export class DitherPipeline {
    private glCtx: Gl;
    private rawGl: WebGL2RenderingContext;

    // Programs
    private brightnessContrastProg: GlProgram;
    private edgeDetectProg: GlProgram;
    private jfaSeedProg: GlProgram;
    private jfaStepProg: GlProgram;
    private jfaResolveProg: GlProgram;
    private adaptiveDitherProg: GlProgram;
    private displayProg: GlProgram;

    // Fullscreen quad
    private quadVao: GlVertexArray;

    // Framebuffers + textures (managed manually)
    private fbos: WebGLFramebuffer[] = [];
    private fboTextures: WebGLTexture[] = [];
    private jfaFbos: [WebGLFramebuffer, WebGLFramebuffer] = [null!, null!];
    private jfaTextures: [WebGLTexture, WebGLTexture] = [null!, null!];

    // Texture units for the source image
    private sourceTexture: WebGLTexture;

    private currentWidth = 0;
    private currentHeight = 0;

    // Pass indices into fbos/fboTextures:
    // 0 = preprocessed, 1 = edges, 2 = contrastMap, 3 = dithered
    private static readonly PASS_PREPROCESSED = 0;
    private static readonly PASS_EDGES = 1;
    private static readonly PASS_CONTRAST_MAP = 2;
    private static readonly PASS_DITHERED = 3;

    constructor(private canvas: HTMLCanvasElement) {
        this.glCtx = new Gl(canvas);
        this.rawGl = this.glCtx.gl;
        const gl = this.rawGl;

        // Create all shader programs
        this.brightnessContrastProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: BRIGHTNESS_CONTRAST_FRAG,
        });
        this.edgeDetectProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: EDGE_DETECT_FRAG,
        });
        this.jfaSeedProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: JFA_SEED_FRAG,
        });
        this.jfaStepProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: JFA_STEP_FRAG,
        });
        this.jfaResolveProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: JFA_RESOLVE_FRAG,
        });
        this.adaptiveDitherProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: ADAPTIVE_DITHER_FRAG,
        });
        this.displayProg = this.glCtx.createProgram({
            vertex: FULLSCREEN_VERT,
            fragment: glsl`#version 300 es
                precision highp float;
                in vec2 v_uv;
                out vec4 fragColor;
                uniform sampler2D u_source;
                void main() {
                    fragColor = texture(u_source, v_uv);
                }
            `,
        });

        // Fullscreen quad VAO (shared across all programs)
        // We'll bind it manually to each program
        this.quadVao =
            this.brightnessContrastProg.createAndBindVertexArrayObject({
                name: "a_position",
                size: 2,
                type: GlVertexAttribType.Float,
            });
        this.quadVao.bufferData(
            new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1]),
            GlBufferUsage.StaticDraw,
        );

        // Source image texture
        this.sourceTexture = assertExists(gl.createTexture());

        // Create pass framebuffers (4 passes)
        for (let i = 0; i < 4; i++) {
            const fbo = assertExists(gl.createFramebuffer());
            const tex = assertExists(gl.createTexture());
            this.fbos.push(fbo);
            this.fboTextures.push(tex);
        }

        // JFA ping-pong framebuffers
        for (let i = 0; i < 2; i++) {
            this.jfaFbos[i] = assertExists(gl.createFramebuffer());
            this.jfaTextures[i] = assertExists(gl.createTexture());
        }
    }

    private setupTexture(
        texture: WebGLTexture,
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
    ) {
        const gl = this.rawGl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            internalFormat,
            width,
            height,
            0,
            format,
            type,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    private resizeBuffers(width: number, height: number) {
        if (width === this.currentWidth && height === this.currentHeight)
            return;
        this.currentWidth = width;
        this.currentHeight = height;
        const gl = this.rawGl;

        // Pass FBOs (RGBA16F for precision)
        for (let i = 0; i < 4; i++) {
            this.setupTexture(
                this.fboTextures[i],
                width,
                height,
                gl.RGBA16F,
                gl.RGBA,
                gl.HALF_FLOAT,
            );
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[i]);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                this.fboTextures[i],
                0,
            );
        }

        // JFA FBOs (RGBA32F for storing UV coords + edge value + flag)
        for (let i = 0; i < 2; i++) {
            this.setupTexture(
                this.jfaTextures[i],
                width,
                height,
                gl.RGBA32F,
                gl.RGBA,
                gl.FLOAT,
            );
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.jfaFbos[i]);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                this.jfaTextures[i],
                0,
            );
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private drawQuad(program: GlProgram, targetFbo: WebGLFramebuffer | null) {
        const gl = this.rawGl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo);
        gl.viewport(0, 0, this.currentWidth, this.currentHeight);
        program.use();
        this.quadVao.bindVao();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    private bindTextureToUnit(texture: WebGLTexture, unit: number) {
        const gl = this.rawGl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    uploadImage(image: HTMLImageElement, width: number, height: number) {
        const gl = this.rawGl;
        this.resizeBuffers(width, height);

        // Draw image to an offscreen canvas at the target size, then upload
        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const ctx = offscreen.getContext("2d")!;
        ctx.drawImage(image, 0, 0, width, height);

        gl.bindTexture(gl.TEXTURE_2D, this.sourceTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA8,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            offscreen,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    runPipeline(params: ProcessingParams) {
        const gl = this.rawGl;
        const w = this.currentWidth;
        const h = this.currentHeight;

        // ── Pass 1: Brightness / Contrast ───────────────────────────
        this.bindTextureToUnit(this.sourceTexture, 0);
        const bc = this.brightnessContrastProg;
        gl.useProgram(bc.program);
        gl.uniform1i(gl.getUniformLocation(bc.program, "u_source"), 0);
        gl.uniform1f(
            gl.getUniformLocation(bc.program, "u_brightness"),
            params.brightness,
        );
        gl.uniform1f(
            gl.getUniformLocation(bc.program, "u_contrast"),
            params.contrast,
        );
        this.drawQuad(bc, this.fbos[DitherPipeline.PASS_PREPROCESSED]);

        // ── Pass 2: Edge Detection ──────────────────────────────────
        this.bindTextureToUnit(
            this.fboTextures[DitherPipeline.PASS_PREPROCESSED],
            0,
        );
        const ed = this.edgeDetectProg;
        gl.useProgram(ed.program);
        gl.uniform1i(gl.getUniformLocation(ed.program, "u_source"), 0);
        gl.uniform2f(
            gl.getUniformLocation(ed.program, "u_texelSize"),
            1 / w,
            1 / h,
        );
        gl.uniform1f(
            gl.getUniformLocation(ed.program, "u_strength"),
            params.edgeStrength,
        );
        this.drawQuad(ed, this.fbos[DitherPipeline.PASS_EDGES]);

        // ── Pass 3: Jump Flood Algorithm ────────────────────────────

        // 3a: Seed
        this.bindTextureToUnit(this.fboTextures[DitherPipeline.PASS_EDGES], 0);
        const seed = this.jfaSeedProg;
        gl.useProgram(seed.program);
        gl.uniform1i(gl.getUniformLocation(seed.program, "u_edges"), 0);
        gl.uniform1f(gl.getUniformLocation(seed.program, "u_threshold"), 0.05);
        this.drawQuad(seed, this.jfaFbos[0]);

        // 3b: JFA steps (ping-pong)
        const maxDim = Math.max(w, h);
        let stepSize = Math.pow(2, Math.ceil(Math.log2(maxDim)) - 1);
        let readIdx = 0;

        while (stepSize >= 1) {
            const writeIdx = 1 - readIdx;
            this.bindTextureToUnit(this.jfaTextures[readIdx], 0);
            const step = this.jfaStepProg;
            gl.useProgram(step.program);
            gl.uniform1i(gl.getUniformLocation(step.program, "u_jfa"), 0);
            gl.uniform2f(
                gl.getUniformLocation(step.program, "u_texelSize"),
                1 / w,
                1 / h,
            );
            gl.uniform1f(
                gl.getUniformLocation(step.program, "u_stepSize"),
                stepSize,
            );
            this.drawQuad(step, this.jfaFbos[writeIdx]);
            readIdx = writeIdx;
            stepSize = Math.floor(stepSize / 2);
        }

        // 3c: Resolve to contrast map
        this.bindTextureToUnit(this.jfaTextures[readIdx], 0);
        const res = this.jfaResolveProg;
        gl.useProgram(res.program);
        gl.uniform1i(gl.getUniformLocation(res.program, "u_jfa"), 0);
        gl.uniform2f(gl.getUniformLocation(res.program, "u_resolution"), w, h);
        gl.uniform1f(
            gl.getUniformLocation(res.program, "u_dropOffRate"),
            params.dropOffRate,
        );
        gl.uniform1i(
            gl.getUniformLocation(res.program, "u_dropOffFunction"),
            DROP_OFF_FN_INDEX[params.dropOffFunction],
        );
        this.drawQuad(res, this.fbos[DitherPipeline.PASS_CONTRAST_MAP]);

        // ── Pass 4: Adaptive Dithering ──────────────────────────────
        this.bindTextureToUnit(
            this.fboTextures[DitherPipeline.PASS_PREPROCESSED],
            0,
        );
        this.bindTextureToUnit(
            this.fboTextures[DitherPipeline.PASS_CONTRAST_MAP],
            1,
        );
        const ad = this.adaptiveDitherProg;
        gl.useProgram(ad.program);
        gl.uniform1i(gl.getUniformLocation(ad.program, "u_preprocessed"), 0);
        gl.uniform1i(gl.getUniformLocation(ad.program, "u_contrastMap"), 1);
        gl.uniform2f(gl.getUniformLocation(ad.program, "u_resolution"), w, h);
        gl.uniform1i(
            gl.getUniformLocation(ad.program, "u_maxLevels"),
            params.maxDitherLevels,
        );
        gl.uniform1f(
            gl.getUniformLocation(ad.program, "u_rangeLow"),
            params.contrastRangeLow,
        );
        gl.uniform1f(
            gl.getUniformLocation(ad.program, "u_rangeHigh"),
            params.contrastRangeHigh,
        );
        this.drawQuad(ad, this.fbos[DitherPipeline.PASS_DITHERED]);
    }

    /** Display one of the pass results to the visible canvas. */
    displayPass(
        pass:
            | "original"
            | "preprocessed"
            | "edges"
            | "contrastMap"
            | "dithered",
    ) {
        const gl = this.rawGl;
        this.canvas.width = this.currentWidth;
        this.canvas.height = this.currentHeight;

        let tex: WebGLTexture;
        switch (pass) {
            case "original":
                tex = this.sourceTexture;
                break;
            case "preprocessed":
                tex = this.fboTextures[DitherPipeline.PASS_PREPROCESSED];
                break;
            case "edges":
                tex = this.fboTextures[DitherPipeline.PASS_EDGES];
                break;
            case "contrastMap":
                tex = this.fboTextures[DitherPipeline.PASS_CONTRAST_MAP];
                break;
            case "dithered":
                tex = this.fboTextures[DitherPipeline.PASS_DITHERED];
                break;
        }

        this.bindTextureToUnit(tex, 0);
        const dp = this.displayProg;
        gl.useProgram(dp.program);
        gl.uniform1i(gl.getUniformLocation(dp.program, "u_source"), 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.currentWidth, this.currentHeight);
        dp.use();
        this.quadVao.bindVao();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    destroy() {
        const gl = this.rawGl;
        for (const fbo of this.fbos) gl.deleteFramebuffer(fbo);
        for (const tex of this.fboTextures) gl.deleteTexture(tex);
        for (const fbo of this.jfaFbos) gl.deleteFramebuffer(fbo);
        for (const tex of this.jfaTextures) gl.deleteTexture(tex);
        gl.deleteTexture(this.sourceTexture);
        this.glCtx.destroy();
    }
}
