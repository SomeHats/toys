import { Path, PathSegment } from "@/lib/geom/Path";
import StraightPathSegment from "@/lib/geom/StraightPathSegment";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";

export default class ApproxQuadraticBezierPathSegment implements PathSegment {
    private readonly path: Path;
    constructor(
        start: Vector2,
        control: Vector2,
        end: Vector2,
        resolution = 100,
    ) {
        const path = new Path();
        let lastPoint = start;
        for (let i = 1; i <= resolution; i++) {
            const t = i / resolution;

            const point = start.lerp(control, t).lerp(control.lerp(end, t), t);
            path.addSegment(new StraightPathSegment(lastPoint, point));
            lastPoint = point;
        }
        this.path = path;
    }

    getStart(): Vector2 {
        return this.path.getStart();
    }

    getEnd(): Vector2 {
        return this.path.getEnd();
    }

    getLength(): number {
        return this.path.getLength();
    }

    getPointAtPosition(position: number): Vector2 {
        return this.path.getPointAtPosition(position);
    }

    getAngleAtPosition(position: number): number {
        return this.path.getAngleAtPosition(position);
    }

    appendToSvgPathBuilder(pathBuilder: SvgPathBuilder): void {
        this.path.appendToSvgPathBuilder(pathBuilder);
    }
}
