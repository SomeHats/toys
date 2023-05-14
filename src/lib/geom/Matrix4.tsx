import { Vector3, Vector3Args, Vector3Ish } from "@/lib/geom/Vector3";
import { lerp } from "@/lib/utils";

// prettier-ignore
type Matrix4Data = Readonly<[
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
]>;

const M_00 = 0;
const M_01 = 1;
const M_02 = 2;
const M_03 = 3;
const M_10 = 4;
const M_11 = 5;
const M_12 = 6;
const M_13 = 7;
const M_20 = 8;
const M_21 = 9;
const M_22 = 10;
const M_23 = 11;
const M_30 = 12;
const M_31 = 13;
const M_32 = 14;
const M_33 = 15;

export class Matrix4 {
    // prettier-ignore
    static create(
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number,
    ): Matrix4 {
        return new Matrix4([
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33,
        ]);
    }

    // prettier-ignore
    static readonly IDENTITY = Matrix4.create(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );

    static translate(...args: Vector3Args): Matrix4 {
        const { x, y, z } = Vector3.fromArgs(args);

        // prettier-ignore
        return Matrix4.create(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        );
    }

    static rotateX(angle: number): Matrix4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        // prettier-ignore
        return Matrix4.create(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        );
    }

    static rotateY(angle: number): Matrix4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        // prettier-ignore
        return Matrix4.create(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        );
    }

    static rotateZ(angle: number): Matrix4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        // prettier-ignore
        return Matrix4.create(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }

    static scale(...args: Vector3Args): Matrix4 {
        const { x, y, z } = Vector3.fromArgs(args);

        // prettier-ignore
        return Matrix4.create(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        );
    }

    static scaleUniform(s: number): Matrix4 {
        return Matrix4.scale(s, s, s);
    }

    static orthographic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number,
    ): Matrix4 {
        // prettier-ignore
        return Matrix4.create(
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        );
    }
    static perspective(
        fieldOfViewRadians: number,
        aspect: number,
        near: number,
        far: number,
    ): Matrix4 {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadians);
        const rangeInv = 1.0 / (near - far);

        // prettier-ignore
        return Matrix4.create(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0,
        );
    }

    static lookAt(cameraPosition: Vector3Ish, target: Vector3Ish, up: Vector3Ish): Matrix4 {
        const cameraPositionVec = Vector3.from(cameraPosition);

        const zAxis = cameraPositionVec.sub(target).normalize();
        const xAxis = Vector3.from(up).cross(zAxis).normalize();
        const yAxis = zAxis.cross(xAxis).normalize();

        // prettier-ignore
        return Matrix4.create(
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            cameraPositionVec.x, cameraPositionVec.y, cameraPositionVec.z, 1,
        );
    }

    constructor(readonly data: Matrix4Data) {}

    multiply(other: Matrix4): Matrix4 {
        const a = this.data;
        const b = other.data;

        const a00 = a[M_00];
        const a01 = a[M_01];
        const a02 = a[M_02];
        const a03 = a[M_03];
        const a10 = a[M_10];
        const a11 = a[M_11];
        const a12 = a[M_12];
        const a13 = a[M_13];
        const a20 = a[M_20];
        const a21 = a[M_21];
        const a22 = a[M_22];
        const a23 = a[M_23];
        const a30 = a[M_30];
        const a31 = a[M_31];
        const a32 = a[M_32];
        const a33 = a[M_33];

        const b00 = b[M_00];
        const b01 = b[M_01];
        const b02 = b[M_02];
        const b03 = b[M_03];
        const b10 = b[M_10];
        const b11 = b[M_11];
        const b12 = b[M_12];
        const b13 = b[M_13];
        const b20 = b[M_20];
        const b21 = b[M_21];
        const b22 = b[M_22];
        const b23 = b[M_23];
        const b30 = b[M_30];
        const b31 = b[M_31];
        const b32 = b[M_32];
        const b33 = b[M_33];

        return new Matrix4([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
    }

    inverse(): Matrix4 {
        const m = this.data;

        const m00 = m[M_00];
        const m01 = m[M_01];
        const m02 = m[M_02];
        const m03 = m[M_03];
        const m10 = m[M_10];
        const m11 = m[M_11];
        const m12 = m[M_12];
        const m13 = m[M_13];
        const m20 = m[M_20];
        const m21 = m[M_21];
        const m22 = m[M_22];
        const m23 = m[M_23];
        const m30 = m[M_30];
        const m31 = m[M_31];
        const m32 = m[M_32];
        const m33 = m[M_33];

        const tmp_0 = m22 * m33;
        const tmp_1 = m32 * m23;
        const tmp_2 = m12 * m33;
        const tmp_3 = m32 * m13;
        const tmp_4 = m12 * m23;
        const tmp_5 = m22 * m13;
        const tmp_6 = m02 * m33;
        const tmp_7 = m32 * m03;
        const tmp_8 = m02 * m23;
        const tmp_9 = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 =
            tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 =
            tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 =
            tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 =
            tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Matrix4([
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d *
                (tmp_1 * m10 +
                    tmp_2 * m20 +
                    tmp_5 * m30 -
                    (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d *
                (tmp_0 * m00 +
                    tmp_7 * m20 +
                    tmp_8 * m30 -
                    (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d *
                (tmp_3 * m00 +
                    tmp_6 * m10 +
                    tmp_11 * m30 -
                    (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d *
                (tmp_4 * m00 +
                    tmp_9 * m10 +
                    tmp_10 * m20 -
                    (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d *
                (tmp_12 * m13 +
                    tmp_15 * m23 +
                    tmp_16 * m33 -
                    (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d *
                (tmp_13 * m03 +
                    tmp_18 * m23 +
                    tmp_21 * m33 -
                    (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d *
                (tmp_14 * m03 +
                    tmp_19 * m13 +
                    tmp_22 * m33 -
                    (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d *
                (tmp_17 * m03 +
                    tmp_20 * m13 +
                    tmp_23 * m23 -
                    (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d *
                (tmp_14 * m22 +
                    tmp_17 * m32 +
                    tmp_13 * m12 -
                    (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d *
                (tmp_20 * m32 +
                    tmp_12 * m02 +
                    tmp_19 * m22 -
                    (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d *
                (tmp_18 * m12 +
                    tmp_23 * m32 +
                    tmp_15 * m02 -
                    (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d *
                (tmp_22 * m22 +
                    tmp_16 * m02 +
                    tmp_21 * m12 -
                    (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
        ]);
    }

    transformVector3(...args: Vector3Args) {
        const { x, y, z } = Vector3.fromArgs(args);
        const e = this.data;

        const w = 1 / (e[M_03] * x + e[M_13] * y + e[M_23] * z + e[M_33]);

        return new Vector3(
            (e[M_00] * x + e[M_10] * y + e[M_20] * z + e[M_30]) * w,
            (e[M_01] * x + e[M_11] * y + e[M_21] * z + e[M_31]) * w,
            (e[M_02] * x + e[M_12] * y + e[M_22] * z + e[M_32]) * w,
        );
    }

    translate(...args: Vector3Args): Matrix4 {
        return this.multiply(Matrix4.translate(...args));
    }

    rotateX(angle: number): Matrix4 {
        return this.multiply(Matrix4.rotateX(angle));
    }

    rotateY(angle: number): Matrix4 {
        return this.multiply(Matrix4.rotateY(angle));
    }

    rotateZ(angle: number): Matrix4 {
        return this.multiply(Matrix4.rotateZ(angle));
    }

    scale(...args: Vector3Args): Matrix4 {
        return this.multiply(Matrix4.scale(...args));
    }

    scaleUniform(s: number): Matrix4 {
        return this.multiply(Matrix4.scaleUniform(s));
    }

    lerp(other: Matrix4, amount: number): Matrix4 {
        const a = this.data;
        const b = other.data;
        return new Matrix4([
            lerp(a[M_00], b[M_00], amount),
            lerp(a[M_01], b[M_01], amount),
            lerp(a[M_02], b[M_02], amount),
            lerp(a[M_03], b[M_03], amount),
            lerp(a[M_10], b[M_10], amount),
            lerp(a[M_11], b[M_11], amount),
            lerp(a[M_12], b[M_12], amount),
            lerp(a[M_13], b[M_13], amount),
            lerp(a[M_20], b[M_20], amount),
            lerp(a[M_21], b[M_21], amount),
            lerp(a[M_22], b[M_22], amount),
            lerp(a[M_23], b[M_23], amount),
            lerp(a[M_30], b[M_30], amount),
            lerp(a[M_31], b[M_31], amount),
            lerp(a[M_32], b[M_32], amount),
            lerp(a[M_33], b[M_33], amount),
        ]);
    }

    toString(precision = 2): string {
        let numbers = this.data.map((n) => n.toFixed(precision));
        const longest = Math.max(...numbers.map((n) => n.length));
        numbers = numbers.map((n) => n.padStart(longest, " "));
        return [
            "Matrix4(",
            `  ${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]},`,
            `  ${numbers[4]}, ${numbers[5]}, ${numbers[6]}, ${numbers[7]},`,
            `  ${numbers[8]}, ${numbers[9]}, ${numbers[10]}, ${numbers[11]},`,
            `  ${numbers[12]}, ${numbers[13]}, ${numbers[14]}, ${numbers[15]},`,
            ")",
        ].join("\n");
    }
}

// function __printM4(data: Matrix4Data, precision = 2): string {
//     let numbers = data.map((n) => n.toFixed(precision));
//     const longest = Math.max(...numbers.map((n) => n.length));
//     numbers = numbers.map((n) => n.padStart(longest, " "));
//     return [
//         "Matrix4(",
//         `  ${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]},`,
//         `  ${numbers[4]}, ${numbers[5]}, ${numbers[6]}, ${numbers[7]},`,
//         `  ${numbers[8]}, ${numbers[9]}, ${numbers[10]}, ${numbers[11]},`,
//         `  ${numbers[12]}, ${numbers[13]}, ${numbers[14]}, ${numbers[15]},`,
//         ")",
//     ].join("\n");
// }
