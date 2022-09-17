import { assertExists, fail } from "@/lib/assert";
import { Gl } from "@/lib/gl/Gl";
import { GlShader } from "@/lib/gl/GlShader";
import { glEnum, GlVertexAttribType } from "@/lib/gl/GlTypes";
import {
    GlUniformBool,
    GlUniformFloat,
    GlUniformTexture2d,
    GlUniformVector2,
} from "@/lib/gl/GlUniform";
import { GlVertexArray } from "@/lib/gl/GlVertexArray";

export class GlProgram {
    readonly program: WebGLProgram;
    private readonly gl: Gl;

    constructor(_gl: Gl, readonly vertexShader: GlShader, readonly fragmentShader: GlShader) {
        this.gl = _gl;
        const { gl } = _gl;
        const program = assertExists(gl.createProgram());
        gl.attachShader(program, vertexShader.shader);
        gl.attachShader(program, fragmentShader.shader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            const error = `Failed to link shaders: ${gl.getProgramInfoLog(program)}`;
            gl.deleteProgram(program);
            fail(error);
        }

        this.program = program;
    }

    createAndBindVertexArray({
        name,
        size,
        type,
        normalize = false,
        stride = 0,
        offset = 0,
    }: {
        name: string;
        size: number;
        type: GlVertexAttribType;
        normalize?: boolean;
        stride?: number;
        offset?: number;
    }): GlVertexArray {
        const { gl } = this.gl;
        const buffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const vertexArray = this.gl.createVertexArray();
        gl.bindVertexArray(vertexArray);

        const attribLocation = gl.getAttribLocation(this.program, name);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, size, glEnum(type), normalize, stride, offset);

        return new GlVertexArray(this.gl, vertexArray, buffer);
    }

    private getUniformLocation(name: string) {
        return assertExists(this.gl.gl.getUniformLocation(this.program, name));
    }

    uniformVector2(name: string) {
        return new GlUniformVector2(this.gl, name, this.getUniformLocation(name));
    }
    uniformFloat(name: string) {
        return new GlUniformFloat(this.gl, name, this.getUniformLocation(name));
    }
    uniformBool(name: string) {
        return new GlUniformBool(this.gl, name, this.getUniformLocation(name));
    }
    uniformTexture2d(name: string) {
        return new GlUniformTexture2d(this.gl, name, this.getUniformLocation(name));
    }

    use() {
        this.gl.gl.useProgram(this.program);
    }
}
