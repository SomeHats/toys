// @flow
import Circle from "@/lib/geom/Circle";
import { PathSegment } from "@/lib/geom/Path";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { constrain, mapRange } from "@/lib/utils";

export default class CirclePathSegment implements PathSegment {
    readonly circle: Circle;
    readonly startAngle: number;
    readonly endAngle: number;

    constructor(
        center: Vector2,
        radius: number,
        startAngle: number,
        endAngle: number,
    ) {
        this.circle = Circle.create(center.x, center.y, radius);
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        Object.freeze(this);
    }

    getStart(): Vector2 {
        return this.circle.pointOnCircumference(this.startAngle);
    }

    getEnd(): Vector2 {
        return this.circle.pointOnCircumference(this.endAngle);
    }

    get angleDifference(): number {
        return Math.atan2(
            Math.sin(this.endAngle - this.startAngle),
            Math.cos(this.endAngle - this.startAngle),
        );
    }

    getLength(): number {
        const proportion = Math.abs(this.angleDifference) / (Math.PI * 2);
        return this.circle.circumference * proportion;
    }

    get isAnticlockwise(): boolean {
        return this.angleDifference < 0;
    }

    getPointAtPosition(position: number): Vector2 {
        const angle = mapRange(
            0,
            this.getLength(),
            this.startAngle,
            this.startAngle + this.angleDifference,
            constrain(0, this.getLength(), position),
        );
        return this.circle.pointOnCircumference(angle);
    }

    getAngleAtPosition(position: number): number {
        if (this.isAnticlockwise) {
            return (
                mapRange(
                    0,
                    this.getLength(),
                    this.startAngle,
                    this.startAngle + this.angleDifference,
                    constrain(0, this.getLength(), position),
                ) -
                Math.PI / 2
            );
        } else {
            return (
                mapRange(
                    0,
                    this.getLength(),
                    this.startAngle,
                    this.startAngle + this.angleDifference,
                    constrain(0, this.getLength(), position),
                ) +
                Math.PI / 2
            );
        }
    }

    appendToSvgPathBuilder(pathBuilder: SvgPathBuilder): void {
        pathBuilder.moveToIfNeeded(this.getStart());
        pathBuilder.arcTo(
            this.circle.radius,
            this.circle.radius,
            0,
            0,
            this.isAnticlockwise ? 0 : 1,
            this.getEnd(),
        );
    }
}
