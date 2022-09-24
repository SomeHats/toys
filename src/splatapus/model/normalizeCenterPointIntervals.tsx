import { lerp } from "@/lib/utils";
import { StrokeCenterPoint } from "@/splatapus/model/perfectFreehand";

export function normalizeCenterPointIntervalsLinear(
    path: StrokeCenterPoint[],
    intervalSize: number,
) {
    if (path.length < 2) return path;

    const result: StrokeCenterPoint[] = [path[0]];

    let currentTargetDist = intervalSize;

    let prev = path[0];
    for (let i = 1; i < path.length; i++) {
        const current = path[i];

        const distanceBetweenPoints = current.center.distanceTo(prev.center);
        let consumedDistance = 0;
        while (distanceBetweenPoints - consumedDistance >= currentTargetDist) {
            const t = (currentTargetDist + consumedDistance) / distanceBetweenPoints;
            result.push({
                center: prev.center.lerp(current.center, t),
                radius: lerp(prev.radius, current.radius, t),
            });

            consumedDistance += currentTargetDist;
            currentTargetDist = intervalSize;
        }
        currentTargetDist -= distanceBetweenPoints - consumedDistance;

        prev = current;
    }

    // result.push(path[path.length - 1]);
    // result.push(path[path.length - 1]);
    // result.push(path[path.length - 1]);
    result.push(path[path.length - 1]);

    return result;
}

export function normalizeCenterPointIntervalsQuadratic(
    path: StrokeCenterPoint[],
    intervalSize: number,
): StrokeCenterPoint[] {
    const result: StrokeCenterPoint[] = [path[0]];

    if (path.length === 0) {
        return [];
    }

    let currentTargetDist = intervalSize;

    let prev = path[0];
    let prevMidPoint = path[0].center;
    for (let i = 1; i < path.length; i++) {
        const current = path[i];
        const next = path[Math.min(i + 1, path.length - 1)];
        const midPoint = current.center.add(next.center).scale(0.5);

        const distanceBetweenPoints = current.center.distanceTo(prev.center);

        const start = prevMidPoint;
        const control = current.center;
        const end = midPoint;
        let consumedDistance = 0;
        while (distanceBetweenPoints - consumedDistance >= currentTargetDist) {
            const t = (currentTargetDist + consumedDistance) / distanceBetweenPoints;
            result.push({
                center: start.lerp(control, t).lerp(control.lerp(end, t), t),
                radius: lerp(prev.radius, current.radius, t),
            });

            consumedDistance += currentTargetDist;
            currentTargetDist = intervalSize;
        }
        currentTargetDist -= distanceBetweenPoints - consumedDistance;

        prev = current;
        prevMidPoint = midPoint;
    }

    result.push(path[path.length - 1]);

    return result;
}
