import { normalizeAngle, lerp } from "@/lib/utils";
import { composeParsers, createShapeParser, parseNumber } from "@/lib/objectParser";
import { Result } from "@/lib/Result";

export type Vector2Ish = { readonly x: number; readonly y: number };

export default class Vector2 {
    static readonly ZERO = new Vector2(0, 0);
    static readonly UNIT = new Vector2(1, 1);
    static readonly X = new Vector2(1, 0);
    static readonly Y = new Vector2(0, 1);

    static fromPolar(angle: number, radius: number) {
        return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    static average(points: ReadonlyArray<Vector2>): Vector2 {
        const sum = points.reduce((memo, p) => memo.add(p), Vector2.ZERO);
        return sum.div(points.length);
    }

    static fromVectorLike({ x, y }: Vector2Ish): Vector2 {
        return new Vector2(x, y);
    }

    static fromEvent({ clientX, clientY }: { clientX: number; clientY: number }): Vector2 {
        return new Vector2(clientX, clientY);
    }

    static parse = composeParsers(
        createShapeParser({ x: parseNumber, y: parseNumber }),
        ({ x, y }) => Result.ok(new Vector2(x, y)),
    );

    constructor(public readonly x: number, public readonly y: number) {}

    toString(fixedAmt?: number): string {
        return `Vector2(${fixedAmt == null ? this.x : this.x.toFixed(fixedAmt)}, ${
            fixedAmt == null ? this.y : this.y.toFixed(fixedAmt)
        })`;
    }

    get magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude(): number {
        return Math.sqrt(this.magnitudeSquared);
    }

    get angle(): number {
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

    equals(other: Vector2) {
        return this === other || (this.x === other.x && this.y === other.y);
    }

    distanceTo({ x, y }: Vector2): number {
        return Math.hypot(this.x - x, this.y - y);
    }

    distanceToSq({ x, y }: Vector2): number {
        const dx = this.x - x;
        const dy = this.y - y;
        return dx * dx + dy * dy;
    }

    angleTo(other: Vector2): number {
        return other.sub(this).angle;
    }

    angleBetween(other: Vector2): number {
        return normalizeAngle(Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x));
    }

    dot(other: Vector2): number {
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

    add({ x, y }: Vector2): Vector2 {
        return new Vector2(this.x + x, this.y + y);
    }

    sub({ x, y }: Vector2): Vector2 {
        return new Vector2(this.x - x, this.y - y);
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
        return Vector2.fromPolar(this.angle, newMagnitude);
    }

    normalize(): Vector2 {
        return this.withMagnitude(1);
    }

    withAngle(newAngle: number): Vector2 {
        return Vector2.fromPolar(newAngle, this.magnitude);
    }

    rotate(byAngle: number): Vector2 {
        return this.withAngle(this.angle + byAngle);
    }

    rotateAround(origin: Vector2, byAngle: number): Vector2 {
        const sin = Math.sin(byAngle);
        const cos = Math.cos(byAngle);

        const dx = this.x - origin.x;
        const dy = this.y - origin.y;

        const nx = dx * cos - dy * sin;
        const ny = dx * sin + dy * cos;

        return new Vector2(nx + origin.x, ny + origin.y);
    }

    lerp(other: Vector2, n: number): Vector2 {
        return new Vector2(lerp(this.x, other.x, n), lerp(this.y, other.y, n));
    }

    perpendicular(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    /** Project this point in the direction `direction` by scalar `distance` */
    project(direction: Vector2, distance: number): Vector2 {
        return direction.scale(distance).add(this);
    }
}
