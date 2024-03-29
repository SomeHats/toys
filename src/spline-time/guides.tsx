import { Vector2 } from "@/lib/geom/Vector2";

const MID_POINT_MARKER_SIZE_PX = 8;

export function BezierControlPoint({
    control,
    target,
}: {
    control: Vector2;
    target: Vector2;
}) {
    return (
        <>
            <line
                x1={target.x}
                y1={target.y}
                x2={control.x}
                y2={control.y}
                className="stroke-purple-400"
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx={control.x}
                cy={control.y}
                r={4}
                strokeWidth={2}
                className="fill-white stroke-purple-400"
            />
        </>
    );
}

export function FinalLine({ path }: { path: string }) {
    return (
        <path
            d={path}
            className="stroke-fuchsia-500"
            fill="none"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}

export function DottedGuideLine({ from, to }: { from: Vector2; to: Vector2 }) {
    const distance = from.distanceTo(to);

    const idealStrokeSpace = 5;
    let strokeCount = Math.ceil(distance / idealStrokeSpace);
    if (strokeCount % 2 === 1) strokeCount += 1;
    const strokeSpace = distance / strokeCount;

    return (
        <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="stroke-purple-300"
            fill="none"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`0 ${strokeSpace}`}
        />
    );
}

export function LineMarker({
    from,
    to,
    progress,
}: {
    from: Vector2;
    to: Vector2;
    progress: number;
}) {
    const lineNormal = to.sub(from).normalize().perpendicular();
    const markerPoint = from.lerp(to, progress);

    const markerStart = markerPoint.add(
        lineNormal.scale(MID_POINT_MARKER_SIZE_PX / 2),
    );
    const markerEnd = markerPoint.add(
        lineNormal.scale(-MID_POINT_MARKER_SIZE_PX / 2),
    );
    return (
        <line
            x1={markerStart.x}
            y1={markerStart.y}
            x2={markerEnd.x}
            y2={markerEnd.y}
            className="stroke-purple-500"
            fill="none"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}
