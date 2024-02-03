import { assertExists, fail } from "@/lib/assert";
import { Matrix3 } from "@/lib/geom/Matrix3";
import { Matrix4 } from "@/lib/geom/Matrix4";
import { Vector2 } from "@/lib/geom/Vector2";
import { Vector3 } from "@/lib/geom/Vector3";
import { Gl } from "@/lib/gl/Gl";
import { GlBuffer } from "@/lib/gl/GlBuffer";
import { GlShader } from "@/lib/gl/GlShader";
import { GlTexture2d } from "@/lib/gl/GlTexture2d";
import { GlVertexAttribType, glEnum } from "@/lib/gl/GlTypes";
import {
    GlUniform,
    GlUniformBool,
    GlUniformEnum,
    GlUniformFloat,
    GlUniformInitialValue,
    GlUniformMatrix3,
    GlUniformMatrix4,
    GlUniformTexture2d,
    GlUniformVector2,
    GlUniformVector3,
    GlUniformVector4,
} from "@/lib/gl/GlUniform";
import { GlVertexArray } from "@/lib/gl/GlVertexArray";

export class GlProgram {
    readonly program: WebGLProgram;
    private readonly gl: Gl;
    private readonly uniforms: GlUniform<unknown>[] = [];

    constructor(
        _gl: Gl,
        readonly vertexShader: GlShader,
        readonly fragmentShader: GlShader,
    ) {
        this.gl = _gl;
        const { gl } = _gl;
        const program = assertExists(gl.createProgram());
        gl.attachShader(program, vertexShader.shader);
        gl.attachShader(program, fragmentShader.shader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            const error = `Failed to link shaders: ${gl.getProgramInfoLog(
                program,
            )}`;
            gl.deleteProgram(program);
            fail(error);
        }

        this.program = program;
    }

    createAndBindVertexArrayObject({
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
        gl.vertexAttribPointer(
            attribLocation,
            size,
            glEnum(type),
            normalize,
            stride,
            offset,
        );

        return new GlVertexArray(this.gl, vertexArray, buffer);
    }

    createAndBindVertexAttribute({
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
    }) {
        const { gl } = this.gl;
        const buffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const attribLocation = gl.getAttribLocation(this.program, name);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(
            attribLocation,
            size,
            glEnum(type),
            normalize,
            stride,
            offset,
        );

        return new GlBuffer(this.gl, buffer);
    }

    private getUniformLocation(name: string) {
        return assertExists(
            this.gl.gl.getUniformLocation(this.program, name),
            `uniform ${name} does not exist`,
        );
    }
    private addUniform<T, Uniform extends GlUniform<T>>(
        GlUniformType: new (
            gl: Gl,
            name: string,
            location: WebGLUniformLocation,
            initialValue: GlUniformInitialValue<T>,
        ) => Uniform,
        name: string,
        initialValue: GlUniformInitialValue<T>,
    ): Uniform {
        const uniform = new GlUniformType(
            this.gl,
            name,
            this.getUniformLocation(name),
            initialValue,
        );
        this.uniforms.push(uniform);
        return uniform;
    }
    uniformVector2(name: string, initialValue: GlUniformInitialValue<Vector2>) {
        return this.addUniform(GlUniformVector2, name, initialValue);
    }
    uniformVector3(name: string, initialValue: GlUniformInitialValue<Vector3>) {
        return this.addUniform(GlUniformVector3, name, initialValue);
    }
    uniformVector4(
        name: string,
        initialValue: GlUniformInitialValue<[number, number, number, number]>,
    ) {
        return this.addUniform(GlUniformVector4, name, initialValue);
    }
    uniformMatrix3(name: string, initialValue: GlUniformInitialValue<Matrix3>) {
        return this.addUniform(GlUniformMatrix3, name, initialValue);
    }
    uniformMatrix4(name: string, initialValue: GlUniformInitialValue<Matrix4>) {
        return this.addUniform(GlUniformMatrix4, name, initialValue);
    }
    uniformFloat(name: string, initialValue: GlUniformInitialValue<number>) {
        return this.addUniform(GlUniformFloat, name, initialValue);
    }
    uniformBool(name: string, initialValue: GlUniformInitialValue<boolean>) {
        return this.addUniform(GlUniformBool, name, initialValue);
    }
    uniformTexture2d(
        name: string,
        initialValue: GlUniformInitialValue<GlTexture2d>,
    ) {
        return this.addUniform(GlUniformTexture2d, name, initialValue);
    }
    uniformEnum<T extends number>(
        name: string,
        initialValue: GlUniformInitialValue<T>,
    ) {
        return this.addUniform(GlUniformEnum, name, initialValue);
    }

    use() {
        this.gl.gl.useProgram(this.program);
        for (const uniform of this.uniforms) {
            uniform.apply();
        }
    }
}
