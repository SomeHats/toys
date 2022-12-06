import { assert, assertExists } from "@/lib/assert";
import { GlProgram } from "@/lib/gl/GlProgram";
import { GlShader } from "@/lib/gl/GlShader";
import { GlTexture2d } from "@/lib/gl/GlTexture2d";
import { GlCapability, glEnum, GlShaderType, GlTextureFormat } from "@/lib/gl/GlTypes";
import { GlVertexArray } from "@/lib/gl/GlVertexArray";
import { get } from "@/lib/utils";

export const glsl = (strings: TemplateStringsArray, ...values: any[]) => {
    let result = "";
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
};

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
    private textures = new GlResources(
        (textureUnit: number, format: GlTextureFormat, level?: number) =>
            new GlTexture2d(this, textureUnit, format, level),
        (texture) => this.gl.deleteTexture(texture.texture),
    );

    constructor(readonly canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl2");
        assert(gl, "browser does not support webgl2");
        this.gl = gl;
    }

    destroy() {
        this.shaders.destroyAll();
        this.programs.destroyAll();
        this.buffers.destroyAll();
        this.vertexArrays.destroyAll();
        this.textures.destroyAll();
    }

    createProgram({ vertex, fragment }: { vertex: string; fragment: string }): GlProgram {
        const vertexShader = this.shaders.create(GlShaderType.Vertex, vertex);
        const fragmentShader = this.shaders.create(GlShaderType.Fragment, fragment);
        return this.programs.create(vertexShader, fragmentShader);
    }
    createBuffer() {
        return this.buffers.create();
    }
    createVertexArray() {
        return this.vertexArrays.create();
    }
    createTexture(textureUnit: number, format: GlTextureFormat, level?: number) {
        return this.textures.create(textureUnit, format, level);
    }

    setDefaultViewport() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    clear() {
        const { gl } = this;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

    drawTriangles(program: GlProgram, positions: GlVertexArray, count: number) {
        program.use();
        positions.bindVao();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, count);
    }

    enable(capability: GlCapability) {
        this.gl.enable(glEnum(capability));
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
