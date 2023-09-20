import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { Result } from "@/lib/Result";
import { Schema } from "@/lib/schema";

export type Vector3Ish =
    | { readonly x: number; readonly y: number; readonly z: number }
    | readonly [x: number, y: number, z: number];
export type Vector3Args = [x: number, y: number, z: number] | [vector: Vector3Ish | Vector3];

export type Vector3Key = "x" | "y" | "z";

export class Vector3 {
    static readonly schema = Schema.object({
        x: Schema.number,
        y: Schema.number,
        z: Schema.number,
    })
        .indexed({ x: 0, y: 1, z: 2 })
        .instance(
            Vector3,
            ({ x, y, z }) => Result.ok(new Vector3(x, y, z)),
            ({ x, y, z }) => ({ x, y, z }),
        );

    static readonly ZERO = new Vector3(0, 0, 0);
    static readonly UNIT = new Vector3(1, 1, 1);
    static readonly X = new Vector3(1, 0, 0);
    static readonly Y = new Vector3(0, 1, 0);
    static readonly Z = new Vector3(0, 0, 1);

    static fromArgs(args: Vector3Args): Vector3 {
        if (args.length === 1) {
            return Vector3.from(args[0]);
        } else {
            return new Vector3(args[0], args[1], args[2]);
        }
    }

    static from(vector3Ish: Vector3Ish | Vector3) {
        if (vector3Ish instanceof Vector3) {
            return vector3Ish;
        }
        if (Array.isArray(vector3Ish)) {
            return new Vector3(vector3Ish[0], vector3Ish[1], vector3Ish[2]);
        }
        assert("x" in vector3Ish && "y" in vector3Ish && "z" in vector3Ish);
        return new Vector3(vector3Ish.x, vector3Ish.y, vector3Ish.z);
    }

    constructor(readonly x: number, readonly y: number, readonly z: number) {}

    toString(fixedAmt?: number) {
        const x = fixedAmt == null ? this.x : this.x.toFixed(fixedAmt);
        const y = fixedAmt == null ? this.y : this.y.toFixed(fixedAmt);
        const z = fixedAmt == null ? this.z : this.z.toFixed(fixedAmt);
        return `Vector3(${x}, ${y}, ${z})`;
    }

    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    equals(...args: Vector3Args) {
        const other = Vector3.fromArgs(args);
        return this === other || (this.x === other.x && this.y === other.y && this.z === other.z);
    }

    distanceToSquared(...args: Vector3Args) {
        const other = Vector3.fromArgs(args);
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return dx * dx + dy * dy + dz * dz;
    }

    distanceTo(...args: Vector3Args) {
        return Math.sqrt(this.distanceToSquared(...args));
    }

    scale(s: number): Vector3 {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    negate(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    add(...args: Vector3Args): Vector3 {
        const other = Vector3.fromArgs(args);
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    sub(...args: Vector3Args): Vector3 {
        const other = Vector3.fromArgs(args);
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    floor(): Vector3 {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    ceil(): Vector3 {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    round(): Vector3 {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }

    withMagnitude(magnitude: number): Vector3 {
        return this.scale(magnitude / this.magnitude());
    }

    normalize(): Vector3 {
        return this.withMagnitude(1);
    }

    lerp(other: Vector3Ish, t: number): Vector3 {
        return this.add(Vector3.from(other).sub(this).scale(t));
    }

    swizzle3(x: Vector3Key, y: Vector3Key, z: Vector3Key): Vector3 {
        return new Vector3(this[x], this[y], this[z]);
    }

    swizzle2(x: Vector3Key, y: Vector3Key): Vector2 {
        return new Vector2(this[x], this[y]);
    }

    cross(...args: Vector3Args) {
        const other = Vector3.fromArgs(args);
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x,
        );
    }
}
