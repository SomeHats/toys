// @flow
import { assert } from "@/lib/assert";
import Circle from "@/lib/geom/Circle";
import CirclePathSegment from "@/lib/geom/CirclePathSegment";
import { Line2 } from "@/lib/geom/Line2";
import StraightPathSegment from "@/lib/geom/StraightPathSegment";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { compact, constrain } from "@/lib/utils";

export interface PathSegment {
    getStart(): Vector2;
    getEnd(): Vector2;
    getLength(): number;
    getPointAtPosition(position: number): Vector2;
    getAngleAtPosition(position: number): number;

    appendToSvgPathBuilder(pathBuilder: SvgPathBuilder): void;
}

export class Path implements PathSegment {
    static segmentToSvgPath(segment: PathSegment): string {
        const pathBuilder = new SvgPathBuilder();
        segment.appendToSvgPathBuilder(pathBuilder);
        return pathBuilder.toString();
    }

    static straightThroughPoints(...points: ReadonlyArray<Vector2>): Path {
        let [lastPoint, ...remainingPoints] = points;
        const path = new Path();

        for (const point of remainingPoints) {
            path.addSegment(new StraightPathSegment(lastPoint, point));
            lastPoint = point;
        }

        return path;
    }

    static segmentAcrossCircle(
        containingCircle: Circle,
        entryAngle: number,
        exitAngle: number,
    ): CirclePathSegment | StraightPathSegment {
        entryAngle = entryAngle + Math.PI;
        const entryPoint = containingCircle.pointOnCircumference(entryAngle);
        const exitPoint = containingCircle.pointOnCircumference(exitAngle);

        const entryLineNormal = new Line2(
            containingCircle.center,
            entryPoint,
        ).perpendicularLineThroughPoint(entryPoint);
        const exitLineNormal = new Line2(
            containingCircle.center,
            exitPoint,
        ).perpendicularLineThroughPoint(exitPoint);

        if (entryLineNormal.isParallelTo(exitLineNormal)) {
            return new StraightPathSegment(entryPoint, exitPoint);
        }

        const roadCircleCenter =
            entryLineNormal.pointAtIntersectionWith(exitLineNormal);
        const roadCircleRadius = entryPoint.distanceTo(roadCircleCenter);

        // containingCircle.center.debugDraw('lime');
        // roadCircleCenter.debugDraw('blue');
        // entryPoint.debugDraw('magenta');
        // exitPoint.debugDraw('red');

        return new CirclePathSegment(
            roadCircleCenter,
            roadCircleRadius,
            entryPoint.sub(roadCircleCenter).angle(),
            exitPoint.sub(roadCircleCenter).angle(),
        );
    }

    segments: PathSegment[] = [];

    constructor(...segments: PathSegment[]) {
        this.addSegments(...segments);
    }

    getStart(): Vector2 {
        return this.segments[0].getStart();
    }

    getEnd(): Vector2 {
        return this.segments[this.segments.length - 1].getEnd();
    }

    getLength(): number {
        return this.segments.reduce(
            (length, segment) => length + segment.getLength(),
            0,
        );
    }

    appendToSvgPathBuilder(pathBuilder: SvgPathBuilder): void {
        for (const segment of this.segments) {
            segment.appendToSvgPathBuilder(pathBuilder);
        }
    }

    getPointAtPosition(position: number): Vector2 {
        const constrained = constrain(0, this.getLength(), position);
        let soFar = 0;
        for (const segment of this.segments) {
            if (constrained <= soFar + segment.getLength()) {
                return segment.getPointAtPosition(constrained - soFar);
            }
            soFar += segment.getLength();
        }
        throw new Error("this is supposed to be unreachable oops");
    }

    getAngleAtPosition(position: number): number {
        const constrained = constrain(0, this.getLength(), position);
        let soFar = 0;
        for (const segment of this.segments) {
            if (constrained <= soFar + segment.getLength()) {
                return segment.getAngleAtPosition(constrained - soFar);
            }
            soFar += segment.getLength();
        }
        throw new Error("this is supposed to be unreachable oops");
    }

    addSegment(segment: PathSegment): this {
        const lastSegment = this.segments[this.segments.length - 1];
        if (lastSegment) {
            assert(
                lastSegment.getEnd().equals(segment.getStart()),
                `segments must neatly join together - ${lastSegment
                    .getEnd()
                    .toString()} !== ${segment.getStart().toString()}`,
            );
        }
        this.segments.push(segment);
        return this;
    }

    addSegments(...segments: PathSegment[]): this {
        segments.forEach((segment) => this.addSegment(segment));
        return this;
    }

    autoRound(radius: number): this {
        const newSegments = this.segments.map(
            (segment, i): PathSegment | null => {
                const lastSegment = i === 0 ? null : this.segments[i - 1];
                if (!lastSegment) {
                    if (segment instanceof StraightPathSegment) return null;
                    return segment;
                }

                if (!(segment instanceof StraightPathSegment)) return segment;
                if (!(lastSegment instanceof StraightPathSegment)) return null;

                assert(
                    lastSegment.getEnd().equals(segment.getStart()),
                    "segments must join",
                );

                const entryAngle = lastSegment.angle();
                const exitAngle = segment.angle();
                const usableRadius = Math.min(
                    radius,
                    lastSegment.getLength() / 2,
                    segment.getLength() / 2,
                );

                const containingCircle = Circle.create(
                    segment.getStart().x,
                    segment.getStart().y,
                    usableRadius,
                );

                return Path.segmentAcrossCircle(
                    containingCircle,
                    entryAngle,
                    exitAngle,
                );
            },
        );

        const compacted = compact(newSegments);

        const start = this.getStart();
        const end = this.getEnd();
        let lastPoint = start;
        this.segments = [];

        compacted.forEach((segment) => {
            if (segment.getStart().equals(lastPoint)) {
                this.addSegment(segment);
            } else {
                this.addSegment(
                    new StraightPathSegment(lastPoint, segment.getStart()),
                );
                this.addSegment(segment);
            }

            lastPoint = segment.getEnd();
        });

        if (!lastPoint.equals(end)) {
            this.addSegment(new StraightPathSegment(lastPoint, end));
        }

        return this;
    }
}
