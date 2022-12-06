import { Gl } from "@/lib/gl/Gl";
import { GlBuffer } from "@/lib/gl/GlBuffer";

export class GlVertexArray extends GlBuffer {
    constructor(gl: Gl, readonly vertexArray: WebGLVertexArrayObject, buffer: WebGLBuffer) {
        super(gl, buffer);
    }

    bindVao() {
        const { gl } = this.gl;
        gl.bindVertexArray(this.vertexArray);
    }
}
