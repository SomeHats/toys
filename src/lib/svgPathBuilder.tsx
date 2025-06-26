import { assertExists } from "@/lib/assert";
import Circle from "@/lib/geom/Circle";
import { Vector2, Vector2Args, Vector2Ish } from "@/lib/geom/Vector2";
import { clockwiseAngleDist } from "@/lib/utils";

export class SvgPathBuilder {
    private parts: string[] = [];
    private lastPoint: Vector2 | null = null;

    static straightThroughPoints(points: Vector2Ish[]) {
        const builder = new SvgPathBuilder();
        builder.moveTo(points[0]);
        for (let i = 1; i < points.length; i++) {
            builder.lineTo(points[i]);
        }
        return builder;
    }

    static midpointQuadraticViaPoints(points: readonly Vector2[]) {
        const builder = new SvgPathBuilder();
        if (points.length >= 2) {
            builder.moveTo(points[0]);
            builder.lineTo(points[0].lerp(points[1], 0.5));
            let prevPoint = points[1];
            for (let i = 2; i < points.length; i++) {
                const nextPoint = points[i];
                const midPoint = prevPoint.lerp(nextPoint, 0.5);
                builder.quadraticCurveTo(prevPoint, midPoint);
                prevPoint = nextPoint;
            }
            builder.lineTo(prevPoint);
        }
        return builder;
    }

    constructor() {}

    toString() {
        return this.parts.join(" ");
    }

    add(command: string): this {
        this.parts.push(command);
        return this;
    }

    moveTo(...args: Vector2Args) {
        const position = Vector2.fromArgs(args);
        this.lastPoint = position;
        return this.add(`M${position.x} ${position.y}`);
    }

    moveToIfNeeded(...args: Vector2Args) {
        const position = Vector2.fromArgs(args);
        if (this.lastPoint?.equals(position)) return this;
        return this.moveTo(position);
    }

    lineTo(...args: Vector2Args) {
        const position = Vector2.fromArgs(args);
        this.lastPoint = position;
        return this.add(`L${position.x} ${position.y}`);
    }

    closePath() {
        return this.add("Z");
    }

    arcTo(
        rx: number,
        ry: number,
        xAxisRotation: number,
        largeArcFlag: boolean,
        sweepFlag: boolean,
        ...args: Vector2Args
    ) {
        const position = Vector2.fromArgs(args);
        this.lastPoint = position;
        return this.add(
            `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag ? 1 : 0} ${
                sweepFlag ? 1 : 0
            } ${position.x} ${position.y}`,
        );
    }

    cArcTo(
        r: number,
        largeArcFlag: boolean,
        sweepFlag: boolean,
        ...args: Vector2Args
    ) {
        return this.arcTo(r, r, 0, largeArcFlag, sweepFlag, ...args);
    }

    clockwiseArcTo(center: Vector2Ish, ...args: Vector2Args) {
        const c = Vector2.from(center);
        const t = Vector2.fromArgs(args);
        const r = c.distanceTo(t);
        const largeArcFlag =
            clockwiseAngleDist(
                c.angleTo(assertExists(this.lastPoint)),
                c.angleTo(t),
            ) > Math.PI;
        return this.cArcTo(r, largeArcFlag, true, t);
    }

    counterClockwiseArcTo(center: Vector2Ish, ...args: Vector2Args) {
        const c = Vector2.from(center);
        const t = Vector2.fromArgs(args);
        const r = c.distanceTo(t);
        const largeArcFlag =
            clockwiseAngleDist(
                c.angleTo(assertExists(this.lastPoint)),
                c.angleTo(t),
            ) < Math.PI;
        return this.cArcTo(r, largeArcFlag, false, t);
    }

    circle(circle: Circle) {
        const left = circle.center.add(circle.radius, 0);
        const right = circle.center.add(-circle.radius, 0);
        return this.moveTo(left)
            .clockwiseArcTo(circle.center, right)
            .clockwiseArcTo(circle.center, left);
    }

    quadraticCurveTo(control: Vector2Ish, target: Vector2Ish) {
        const c = Vector2.from(control);
        const t = Vector2.from(target);
        this.lastPoint = t;
        return this.add(`Q${c.x} ${c.y} ${t.x} ${t.y}`);
    }

    smoothQuadraticCurveTo(target: Vector2Ish) {
        const t = Vector2.from(target);
        this.lastPoint = t;
        return this.add(`T${t.x} ${t.y}`);
    }

    bezierCurveTo(
        control1: Vector2Ish,
        control2: Vector2Ish,
        target: Vector2Ish,
    ) {
        const c1 = Vector2.from(control1);
        const c2 = Vector2.from(control2);
        const t = Vector2.from(target);
        this.lastPoint = t;
        return this.add(`C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${t.x} ${t.y}`);
    }

    smoothBezierCurveTo(control: Vector2Ish, target: Vector2Ish) {
        const c = Vector2.from(control);
        const t = Vector2.from(target);
        this.lastPoint = t;
        return this.add(`S${c.x} ${c.y} ${t.x} ${t.y}`);
    }
}
