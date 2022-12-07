import { Vector2, Vector2Args } from "@/lib/geom/Vector2";

// prettier-ignore
type Matrix3Data = Readonly<[
    number, number, number,
    number, number, number,
    number, number, number,
]>;

const M_00 = 0;
const M_01 = 3;
const M_02 = 6;
const M_10 = 1;
const M_11 = 4;
const M_12 = 7;
const M_20 = 2;
const M_21 = 5;
const M_22 = 8;

export class Matrix3 {
    // prettier-ignore
    static create(
        m00: number, m01: number, m02: number,
        m10: number, m11: number, m12: number,
        m20: number, m21: number, m22: number,
    ) {
        return new Matrix3([
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22,
        ]);
    }

    // prettier-ignore
    static readonly IDENTITY = Matrix3.create(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    );

    static translate(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);

        // prettier-ignore
        return Matrix3.create(
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        );
    }
    static rotate(angle: number) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        // prettier-ignore
        return Matrix3.create(
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        );
    }
    static scale(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);

        // prettier-ignore
        return Matrix3.create(
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        );
    }
    static scaleUniform(s: number) {
        return Matrix3.scale(s, s);
    }
    static projection(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);

        // prettier-ignore
        return Matrix3.create(
            2 / x, 0, 0,
            0, -2 / y, 0,
            -1, 1, 1,
        );
    }

    private constructor(readonly data: Matrix3Data) {}

    multiply({ data: other }: Matrix3): Matrix3 {
        const data = this.data;

        const a00 = data[M_00];
        const a01 = data[M_01];
        const a02 = data[M_02];
        const a10 = data[M_10];
        const a11 = data[M_11];
        const a12 = data[M_12];
        const a20 = data[M_20];
        const a21 = data[M_21];
        const a22 = data[M_22];
        const b00 = other[M_00];
        const b01 = other[M_01];
        const b02 = other[M_02];
        const b10 = other[M_10];
        const b11 = other[M_11];
        const b12 = other[M_12];
        const b20 = other[M_20];
        const b21 = other[M_21];
        const b22 = other[M_22];

        return new Matrix3([
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ]);
    }

    translate(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);
        return this.multiply(Matrix3.translate(x, y));
    }

    rotate(angle: number) {
        return this.multiply(Matrix3.rotate(angle));
    }

    scale(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);
        return this.multiply(Matrix3.scale(x, y));
    }

    scaleUniform(s: number) {
        return this.scale(s, s);
    }

    projection(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);
        return this.multiply(Matrix3.projection(x, y));
    }

    toString(precision = 2): string {
        let numbers = this.data.map((n) => n.toFixed(precision));
        const longest = Math.max(...numbers.map((n) => n.length));
        numbers = numbers.map((n) => n.padStart(longest, " "));

        return [
            "Matrix3(",
            `  ${numbers[M_00]}, ${numbers[M_01]}, ${numbers[M_02]},`,
            `  ${numbers[M_10]}, ${numbers[M_11]}, ${numbers[M_12]},`,
            `  ${numbers[M_20]}, ${numbers[M_21]}, ${numbers[M_22]},`,
            ")",
        ].join("\n");
    }

    toCss(): string {
        // css matrix() is column-major and only accepts 6 values
        return `matrix(${this.data[M_00]}, ${this.data[M_10]}, ${this.data[M_01]}, ${this.data[M_11]}, ${this.data[M_02]}, ${this.data[M_12]})`;
    }
}
