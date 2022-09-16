import { assert, assertExists } from "@/lib/assert";
import { GlProgram } from "@/lib/gl/GlProgram";
import { GlShader } from "@/lib/gl/GlShader";
import { GlShaderType } from "@/lib/gl/GlTypes";
import { get } from "@/lib/utils";

export class Gl {
    readonly gl: WebGL2RenderingContext;

    private shaders = new GlResources(
        (type: GlShaderType, source: string) => new GlShader(this, type, source),
        (shader) => this.gl.deleteShader(shader.shader),
    );
    private programs = new GlResources(
        (vertexShader: GlShader, fragmentShader: GlShader) =>
            new GlProgram(this, vertexShader, fragmentShader),
        (program) => this.gl.deleteProgram(program.program),
    );
    private buffers = new GlResources(
        () => assertExists(this.gl.createBuffer()),
        (buffer) => this.gl.deleteBuffer(buffer),
    );
    private vertexArrays = new GlResources(
        () => assertExists(this.gl.createVertexArray()),
        (vertexArray) => this.gl.deleteVertexArray(vertexArray),
    );

    constructor(readonly canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl2");
        assert(gl, "browser does not support webgl2");
        this.gl = gl;
    }

    destory() {
        this.shaders.destroyAll();
        this.programs.destroyAll();
        this.buffers.destroyAll();
        this.vertexArrays.destroyAll();
    }

    createShader(type: GlShaderType, source: string): GlShader {
        return this.shaders.create(type, source);
    }
    createProgram(vertexShader: GlShader, fragmentShader: GlShader): GlProgram {
        return this.programs.create(vertexShader, fragmentShader);
    }
    createBuffer() {
        return this.buffers.create();
    }
    createVertexArray() {
        return this.vertexArrays.create();
    }

    setDefaultViewport() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    clear() {
        const { gl } = this;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    enumToString(value: number) {
        const keys = [];
        for (const key in this.gl) {
            if (get(this.gl, key) === value) {
                keys.push(key);
            }
        }
        return keys.length ? keys.join(" | ") : `0x${value.toString(16)}`;
    }
}

class GlResources<T, Args extends Array<unknown>> {
    private resources: Array<T> = [];

    constructor(
        private readonly initializeResource: (...args: Args) => T,
        private readonly deleteResource: (resource: T) => void,
    ) {}

    create(...args: Args): T {
        const resource = this.initializeResource(...args);
        this.resources.push(resource);
        return resource;
    }

    destroyAll() {
        for (const resource of this.resources) {
            this.deleteResource(resource);
        }
        this.resources = [];
    }
}
