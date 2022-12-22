import { windows } from "@/lib/utils";
import { LayerProps } from "@/spline-time/layers/Layer";

const MID_POINT_MARKER_SIZE_PX = 8;

export function midPointMarkerLayer({ line, showExtras }: LayerProps) {
    if (!showExtras) return null;

    const midpoints = windows(line.points, 2).map(([p1, p2], i) => {
        const lineNormal = p2.sub(p1).normalize().perpendicular();
        const midPoint = p1.lerp(p2, 0.5);

        const midPointMarkerStart = midPoint.add(lineNormal.scale(MID_POINT_MARKER_SIZE_PX / 2));
        const midPointMarkerEnd = midPoint.add(lineNormal.scale(-MID_POINT_MARKER_SIZE_PX / 2));
        return (
            <line
                key={i}
                x1={midPointMarkerStart.x}
                y1={midPointMarkerStart.y}
                x2={midPointMarkerEnd.x}
                y2={midPointMarkerEnd.y}
                className="stroke-purple-500"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        );
    });

    return <>{midpoints}</>;
}
