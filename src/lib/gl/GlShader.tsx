import { assertExists, fail } from "@/lib/assert";
import { Gl } from "@/lib/gl/Gl";
import { GlShaderType } from "@/lib/gl/GlTypes";

export class GlShader {
    readonly shader: WebGLShader;
    private readonly gl: Gl;

    constructor(_gl: Gl, readonly type: GlShaderType, source: string) {
        this.gl = _gl;
        const { gl } = _gl;
        const shader = assertExists(gl.createShader(type));
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            const error = `Failed to compile shader: ${gl.getShaderInfoLog(shader)}`;
            gl.deleteShader(shader);
            fail(error);
        }
        this.shader = shader;
    }
}
