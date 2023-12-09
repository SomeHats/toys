import { Path, PathSegment } from "@/lib/geom/Path";
import StraightPathSegment from "@/lib/geom/StraightPathSegment";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";

export function interpolateCubicBezier(
    start: Vector2,
    control1: Vector2,
    control2: Vector2,
    end: Vector2,
    n: number,
) {
    const a1 = start.lerp(control1, n);
    const a2 = control1.lerp(control2, n);
    const a3 = control2.lerp(end, n);
    const b1 = a1.lerp(a2, n);
    const b2 = a2.lerp(a3, n);
    return b1.lerp(b2, n);
}

export default class ApproxCubicBezierPathSegment implements PathSegment {
    private readonly path: Path;
    constructor(
        start: Vector2,
        control1: Vector2,
        control2: Vector2,
        end: Vector2,
        resolution = 100,
    ) {
        const path = new Path();
        let lastPoint = start;
        for (let i = 1; i <= resolution; i++) {
            const t = i / resolution;

            const point = interpolateCubicBezier(
                start,
                control1,
                control2,
                end,
                t,
            );
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
