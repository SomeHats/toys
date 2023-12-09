import { Vector2 } from "@/lib/geom/Vector2";
import { Result } from "@/lib/Result";
import { Schema } from "@/lib/schema";
import { copyArrayAndInsert, copyArrayAndReplace } from "@/lib/utils";

export class SplineTimeLine {
    static schema = Schema.arrayOf(Vector2.schema).transform(
        (points) => Result.ok(new SplineTimeLine(points)),
        Schema.cannotValidate("SplineTimeLine"),
        (line) => line.points,
    );

    constructor(readonly points: readonly Vector2[]) {}

    insertPointAtIndex(index: number, point: Vector2) {
        return new SplineTimeLine(
            copyArrayAndInsert(this.points, index, point),
        );
    }

    updatePointAtIndex(index: number, point: Vector2) {
        return new SplineTimeLine(
            copyArrayAndReplace(this.points, index, point),
        );
    }

    getClosestPointTo(
        target: Vector2,
    ): { index: number; point: Vector2; distance: number } | null {
        if (this.points.length === 0) return null;

        let closestPointIndex = 0;
        let closestPointDistance = this.points[0].distanceTo(target);
        for (let i = 1; i < this.points.length; i++) {
            const point = this.points[i];
            const distance = point.distanceTo(target);
            if (distance < closestPointDistance) {
                closestPointIndex = i;
                closestPointDistance = distance;
            }
        }
        return {
            index: closestPointIndex,
            point: this.points[closestPointIndex],
            distance: closestPointDistance,
        };
    }

    getClosestPointIndexWithinRadius(point: Vector2, radius: number) {
        const closestPoint = this.getClosestPointTo(point);
        if (closestPoint && closestPoint.distance <= radius) {
            return closestPoint.index;
        }
        return null;
    }
}
