// @flow
import { constrain } from "../utils";
import Vector2 from "./Vector2";
import { PathSegment } from "./Path";
import Line2 from "./Line2";

export default class StraightPathSegment implements PathSegment {
    readonly line: Line2;
    private readonly delta: Vector2;

    constructor(start: Vector2, end: Vector2) {
        this.line = new Line2(start, end);
        this.delta = this.line.getDelta();
        Object.freeze(this);
    }

    getStart(): Vector2 {
        return this.line.start;
    }

    getEnd(): Vector2 {
        return this.line.end;
    }

    getDelta(): Vector2 {
        return this.delta;
    }

    getLength(): number {
        return this.delta.magnitude;
    }

    get angle(): number {
        return this.delta.angle;
    }

    getPointAtPosition(position: number): Vector2 {
        const constrainedPosition = constrain(0, this.getLength(), position);
        return this.delta.withMagnitude(constrainedPosition).add(this.line.start);
    }

    getAngleAtPosition(): number {
        return this.delta.angle;
    }
}
