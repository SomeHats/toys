import { Matrix3 } from "@/lib/geom/Matrix3";
import { Matrix4 } from "@/lib/geom/Matrix4";
import { Vector2 } from "@/lib/geom/Vector2";
import { Vector3 } from "@/lib/geom/Vector3";
import { Gl } from "@/lib/gl/Gl";
import { GlTexture2d } from "@/lib/gl/GlTexture2d";

export type GlUniformInitialValue<T> = T | (() => T);

export abstract class GlUniform<T> {
    private _value: GlUniformInitialValue<T>;
    constructor(
        readonly gl: Gl,
        readonly name: string,
        readonly location: WebGLUniformLocation,
        initialValue: GlUniformInitialValue<T>,
    ) {
        this._value = initialValue;
    }

    get value(): T {
        return typeof this._value === "function" ?
                (this._value as () => T)()
            :   this._value;
    }

    set value(value: T) {
        this._value = value;
    }

    abstract apply(): void;
}

export class GlUniformVector2 extends GlUniform<Vector2> {
    apply() {
        this.gl.gl.uniform2f(this.location, this.value.x, this.value.y);
    }
}

export class GlUniformVector3 extends GlUniform<Vector3> {
    apply() {
        this.gl.gl.uniform3f(
            this.location,
            this.value.x,
            this.value.y,
            this.value.z,
        );
    }
}

export class GlUniformVector4 extends GlUniform<
    [number, number, number, number]
> {
    apply(): void {
        this.gl.gl.uniform4f(this.location, ...this.value);
    }
}

export class GlUniformMatrix3 extends GlUniform<Matrix3> {
    apply(): void {
        this.gl.gl.uniformMatrix3fv(
            this.location,
            false,
            new Float32Array(this.value.data),
        );
    }
}

export class GlUniformMatrix4 extends GlUniform<Matrix4> {
    apply(): void {
        this.gl.gl.uniformMatrix4fv(
            this.location,
            false,
            new Float32Array(this.value.data),
        );
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
