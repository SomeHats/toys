import Vector2 from "@/lib/geom/Vector2";
import { Gl } from "@/lib/gl/Gl";

export abstract class GlUniform<T> {
    constructor(readonly gl: Gl, readonly name: string, readonly location: WebGLUniformLocation) {}

    abstract set(value: T): void;
}

export class GlUniformVector2 extends GlUniform<Vector2> {
    set(value: Vector2) {
        this.gl.gl.uniform2f(this.location, value.x, value.y);
    }
}

export class GlUniformFloat extends GlUniform<number> {
    set(value: number) {
        this.gl.gl.uniform1f(this.location, value);
    }
}

export class GlUniformBool extends GlUniform<boolean> {
    set(value: boolean) {
        this.gl.gl.uniform1ui(this.location, value ? 1 : 0);
    }
}
