import { Vector2 } from "@/lib/geom/Vector2";
import {
    getSvgPathFromStroke,
    StrokeCenterPoint,
} from "@/splatapus/model/perfectFreehand";

export function pathFromCenterPoints(
    path: ReadonlyArray<StrokeCenterPoint>,
): Vector2[] {
    const leftPoints: Vector2[] = [];
    const rightPoints: Vector2[] = [];

    if (path.length === 0) {
        return [];
    }

    if (path.length === 1) {
        const dot: Vector2[] = [];

        for (let i = 0; i < 12; i++) {
            dot.push(
                path[0].center.add(
                    Vector2.fromPolar((i * Math.PI) / 6, path[0].radius),
                ),
            );
        }

        return dot;
    }

    const p0 = path[0];
    const p1 = path[1];
    const startDirection = p1.center.sub(p0.center).normalize();
    const startOffset = startDirection.perpendicular().scale(p0.radius);
    leftPoints.push(p0.center.sub(startDirection.scale(p0.radius)));
    leftPoints.push(p0.center.sub(startOffset));
    rightPoints.push(p0.center.add(startOffset));

    for (let i = 1; i < path.length - 1; i++) {
        const last = path[i - 1];
        const current = path[i];
        const next = path[i + 1];

        const direction = next.center.sub(last.center).normalize();
        const offset = direction.perpendicular().scale(current.radius);
        leftPoints.push(current.center.sub(offset));
        rightPoints.push(current.center.add(offset));
    }

    const last = path[path.length - 2];
    const current = path[path.length - 1];
    const endDirection = current.center.sub(last.center).normalize();
    const endOffset = endDirection.perpendicular().scale(current.radius);
    leftPoints.push(current.center.sub(endOffset));
    leftPoints.push(current.center.add(endDirection.scale(current.radius)));
    rightPoints.push(current.center.add(endOffset));

    return leftPoints.concat(rightPoints.reverse());
}

export function svgPathFromCenterPoints(
    path: ReadonlyArray<StrokeCenterPoint>,
): string {
    return getSvgPathFromStroke(pathFromCenterPoints(path));
}
