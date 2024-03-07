import { Vector2, Vector2Args } from "@/lib/geom/Vector2";

export class Transform2d {
    // prettier-ignore
    static readonly IDENTITY = new Transform2d(
        1, 0,
        0, 1,
        0, 0,
    );

    static translate(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);

        // prettier-ignore
        return new Transform2d(
            1, 0,
            0, 1,
            x, y,
        );
    }
    static rotate(angle: number) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        // prettier-ignore
        return new Transform2d(
            c, s,
            -s, c,
            0, 0,
        );
    }
    static scale(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);

        // prettier-ignore
        return new Transform2d(
            x, 0,
            0, y,
            0, 0,
        );
    }
    static scaleUniform(s: number) {
        return Transform2d.scale(s, s);
    }
    static fromDomMatrix(m: DOMMatrix) {
        return new Transform2d(m.a, m.b, m.c, m.d, m.e, m.f);
    }

    private constructor(
        readonly a: number,
        readonly b: number,
        readonly c: number,
        readonly d: number,
        readonly e: number,
        readonly f: number,
    ) {}

    multiply(other: Transform2d): Transform2d {
        return new Transform2d(
            this.a * other.a + this.c * other.b,
            this.b * other.a + this.d * other.b,
            this.a * other.c + this.c * other.d,
            this.b * other.c + this.d * other.d,
            this.a * other.e + this.c * other.f + this.e,
            this.b * other.e + this.d * other.f + this.f,
        );
    }

    translate(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);
        return this.multiply(Transform2d.translate(x, y));
    }

    rotate(angle: number) {
        return this.multiply(Transform2d.rotate(angle));
    }

    scale(...args: Vector2Args) {
        const { x, y } = Vector2.fromArgs(args);
        return this.multiply(Transform2d.scale(x, y));
    }

    scaleUniform(s: number) {
        return this.scale(s, s);
    }

    invert() {
        const denom = this.a * this.d - this.b * this.c;
        return new Transform2d(
            this.d / denom,
            this.b / -denom,
            this.c / -denom,
            this.a / denom,
            (this.d * this.e - this.c * this.f) / -denom,
            (this.b * this.e - this.a * this.f) / denom,
        );
    }

    apply(...args: Vector2Args) {
        const vec = Vector2.fromArgs(args);
        return new Vector2(
            this.a * vec.x + this.c * vec.y + this.e,
            this.b * vec.x + this.d * vec.y + this.f,
        );
    }

    toString(precision = 2): string {
        let numbers = [this.a, this.b, this.c, this.d, this.e, this.f].map(
            (n) => n.toFixed(precision),
        );
        const longest = Math.max(...numbers.map((n) => n.length));
        numbers = numbers.map((n) => n.padStart(longest, " "));

        return [
            "Transform2d(",
            `  ${numbers[0]}, ${numbers[1]}, ${numbers[4]},`,
            `  ${numbers[1]}, ${numbers[2]}, ${numbers[5]},`,
            ")",
        ].join("\n");
    }

    toCss(): string {
        // css matrix() is column-major and only accepts 6 values
        return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
    }

    toDomMatrix(): DOMMatrix {
        return new DOMMatrix([this.a, this.b, this.c, this.d, this.e, this.f]);
    }
}
