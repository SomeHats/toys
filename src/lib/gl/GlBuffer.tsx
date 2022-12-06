import { Gl } from "@/lib/gl/Gl";
import { GlBufferUsage, glEnum } from "@/lib/gl/GlTypes";

export class GlBuffer {
    constructor(protected readonly gl: Gl, readonly buffer: WebGLBuffer) {}

    bufferData(data: BufferSource, usage: GlBufferUsage) {
        const { gl } = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, glEnum(usage));
    }
}
