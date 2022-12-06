import { normalizeAngle, lerp } from "@/lib/utils";
import { Result } from "@/lib/Result";
import { Schema } from "@/lib/schema";
import { assert } from "@/lib/assert";

export type Vector2Ish =
    | { readonly x: number; readonly y: number }
    | readonly [x: number, y: number]
    | Vector2;

export type Vector2Args = [x: number, y: number] | [vector: Vector2Ish | Vector2];

export class Vector2 {
    static readonly schema = Schema.object({
        x: Schema.number,
        y: Schema.number,
    })
        .indexed({ x: 0, y: 1 })
        .transform<Vector2>(
            ({ x, y }) => Result.ok(new Vector2(x, y)),
            ({ x, y }) => ({ x, y }),
        );

    static readonly ZERO = new Vector2(0, 0);
    static readonly UNIT = new Vector2(1, 1);
    static readonly X = new Vector2(1, 0);
    static readonly Y = new Vector2(0, 1);

    static fromArgs(args: Vector2Args): Vector2 {
        if (args.length === 1) {
            return Vector2.from(args[0]);
        } else {
            const [x, y] = args;
            return new Vector2(x, y);
        }
    }

    static fromPolar(angle: number, radius: number) {
        return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    static average(points: ReadonlyArray<Vector2>): Vector2 {
        const sum = points.reduce((memo, p) => memo.add(p), Vector2.ZERO);
        return sum.div(points.length);
    }

    static from(vectorIsh: Vector2Ish): Vector2 {
        if (vectorIsh instanceof Vector2) {
            return vectorIsh;
        }
        if (Array.isArray(vectorIsh)) {
            return new Vector2(vectorIsh[0], vectorIsh[1]);
        }
        assert("x" in vectorIsh && "y" in vectorIsh);
        return new Vector2(vectorIsh.x, vectorIsh.y);
    }

    static fromEvent({ clientX, clientY }: { clientX: number; clientY: number }): Vector2 {
        return new Vector2(clientX, clientY);
    }

    constructor(public readonly x: number, public readonly y: number) {}

    toString(fixedAmt?: number): string {
        const x = fixedAmt == null ? this.x : this.x.toFixed(fixedAmt);
        const y = fixedAmt == null ? this.y : this.y.toFixed(fixedAmt);
        return `Vector2(${x}, ${y})`;
    }

    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    isInPolygon(polygon: ReadonlyArray<Vector2>): boolean {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        const { x, y } = this;

        let isInside = false;
        for (
            let currentIdx = 0, previousIdx = polygon.length - 1;
            currentIdx < polygon.length;
            previousIdx = currentIdx++
        ) {
            const { x: currentX, y: currentY } = polygon[currentIdx];
            const { x: previousX, y: previousY } = polygon[previousIdx];
            const doesIntersect =
                currentY > y != previousY > y &&
                x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;

            if (doesIntersect) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    equals(...args: Vector2Args): boolean {
        const other = Vector2.fromArgs(args);
        return this === other || (this.x === other.x && this.y === other.y);
    }

    distanceTo(...args: Vector2Args): number {
        const other = Vector2.fromArgs(args);
        return Math.hypot(this.x - other.x, this.y - other.y);
    }

    distanceToSquared(...args: Vector2Args): number {
        const other = Vector2.fromArgs(args);
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    angleTo(...args: Vector2Args): number {
        const other = Vector2.fromArgs(args);
        return other.sub(this).angle();
    }

    angleBetween(...args: Vector2Args): number {
        const other = Vector2.fromArgs(args);
        return normalizeAngle(Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x));
    }

    dot(...args: Vector2Args): number {
        const other = Vector2.fromArgs(args);
        return this.x * other.x + this.y * other.y;
    }

    div(scale: number): Vector2 {
        return new Vector2(this.x / scale, this.y / scale);
    }

    scale(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    negate(): Vector2 {
        return this.scale(-1);
    }

    add(...args: Vector2Args): Vector2 {
        const other = Vector2.fromArgs(args);
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(...args: Vector2Args): Vector2 {
        const other = Vector2.fromArgs(args);
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    floor(): Vector2 {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    ceil(): Vector2 {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    round(): Vector2 {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    withMagnitude(newMagnitude: number): Vector2 {
        return this.scale(newMagnitude / this.magnitude());
    }

    normalize(): Vector2 {
        return this.withMagnitude(1);
    }

    withAngle(newAngle: number): Vector2 {
        return Vector2.fromPolar(newAngle, this.magnitude());
    }

    rotate(byAngle: number): Vector2 {
        return this.withAngle(this.angle() + byAngle);
    }

    rotateAround(origin: Vector2Ish, byAngle: number): Vector2 {
        origin = Vector2.from(origin);
        const sin = Math.sin(byAngle);
        const cos = Math.cos(byAngle);

        const dx = this.x - origin.x;
        const dy = this.y - origin.y;

        const nx = dx * cos - dy * sin;
        const ny = dx * sin + dy * cos;

        return new Vector2(nx + origin.x, ny + origin.y);
    }

    lerp(other: Vector2Ish, n: number): Vector2 {
        other = Vector2.from(other);
        return new Vector2(lerp(this.x, other.x, n), lerp(this.y, other.y, n));
    }

    perpendicular(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    /** Project this point in the direction `direction` by scalar `distance` */
    project(direction: Vector2Ish, distance: number): Vector2 {
        return Vector2.from(direction).scale(distance).add(this);
    }
}
