import Vector2 from "@/lib/geom/Vector2";
import { Gl } from "@/lib/gl/Gl";
import { GlTexture2d } from "@/lib/gl/GlTexture2d";

export abstract class GlUniform<T> {
    value: T;
    constructor(
        readonly gl: Gl,
        readonly name: string,
        readonly location: WebGLUniformLocation,
        initialValue: T,
    ) {
        this.value = initialValue;
    }

    abstract apply(): void;
}

export class GlUniformVector2 extends GlUniform<Vector2> {
    apply() {
        this.gl.gl.uniform2f(this.location, this.value.x, this.value.y);
    }
}

export class GlUniformFloat extends GlUniform<number> {
    apply() {
        this.gl.gl.uniform1f(this.location, this.value);
    }
}

export class GlUniformBool extends GlUniform<boolean> {
    apply() {
        this.gl.gl.uniform1ui(this.location, this.value ? 1 : 0);
    }
}

export class GlUniformTexture2d extends GlUniform<GlTexture2d> {
    apply() {
        this.gl.gl.uniform1i(this.location, this.value.textureUnit);
    }
}

export class GlUniformEnum<T extends number> extends GlUniform<T> {
    apply(): void {
        this.gl.gl.uniform1i(this.location, this.value);
    }
}
