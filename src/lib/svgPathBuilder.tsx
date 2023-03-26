import { Vector2, Vector2Args, Vector2Ish } from "@/lib/geom/Vector2";

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
        if (this.lastPoint && this.lastPoint.equals(position)) return this;
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
        largeArcFlag: number,
        sweepFlag: number,
        ...args: Vector2Args
    ) {
        const position = Vector2.fromArgs(args);
        this.lastPoint = position;
        return this.add(
            `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${position.x} ${position.y}`,
        );
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

    bezierCurveTo(control1: Vector2Ish, control2: Vector2Ish, target: Vector2Ish) {
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
