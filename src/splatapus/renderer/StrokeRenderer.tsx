import { pathFromCenterPoints } from "@/splatapus/pathFromCenterPoints";
import { getSvgPathFromStroke, StrokeCenterPoint } from "@/splatapus/perfectFreehand";

export function StrokeRenderer({
    centerPoints,
}: {
    centerPoints: ReadonlyArray<StrokeCenterPoint>;
}) {
    return <path d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))} />;
}
