import { useLive } from "@/lib/live";
import { compact } from "@/lib/utils";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { interpolationCache } from "@/splatapus/model/InterpolationCache";
import { svgPathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { useMemo } from "react";

export function KeyPointPreview({
    splatapus,
    keyPointId,
    width,
    height,
    className,
}: {
    splatapus: Splatapus;
    keyPointId: SplatKeyPointId;
    width: number;
    height: number;
    className?: string;
}) {
    const padding = 4;
    const paths = useLive(() => {
        const document = splatapus.document.live();
        return compact(
            Array.from(document.shapes, (shape) => {
                const actualCenterPoints = interpolationCache.getCenterPointsAtPosition(
                    document,
                    shape.id,
                    PreviewPosition.keyPointId(keyPointId),
                );
                if (actualCenterPoints) {
                    return {
                        centerPoints: actualCenterPoints,
                        svg: svgPathFromCenterPoints(actualCenterPoints),
                        shapeId: shape.id,
                    };
                }
                return null;
            }),
        );
    }, [splatapus, keyPointId]);

    const { minX, minY, maxX, maxY } = useMemo(() => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const path of paths) {
            for (const { center, radius } of path.centerPoints) {
                minX = Math.min(minX, center.x - radius);
                maxX = Math.max(maxX, center.x + radius);
                minY = Math.min(minY, center.y - radius);
                maxY = Math.max(maxY, center.y + radius);
            }
        }

        return { minX, minY, maxX, maxY };
    }, [paths]);

    if (!paths.length) {
        return null;
    }

    const shapeWidth = maxX - minX;
    const shapeHeight = maxY - minY;

    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    const scaleX = Math.min(availableWidth / shapeWidth, 0.8);
    const scaleY = Math.min(availableHeight / shapeHeight, 0.8);
    const scale = Math.min(scaleX, scaleY);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width, height }}>
            <g
                transform={`translate(${
                    padding + Math.max(availableWidth - shapeWidth * scale, 0) / 2
                }, ${
                    padding + Math.max(availableHeight - shapeHeight * scale, 0) / 2
                }) scale(${scale}) translate(${-minX}, ${-minY})`}
            >
                {paths.map(({ svg, shapeId }) => (
                    <path key={shapeId} d={svg} className="fill-stone-800" />
                ))}
            </g>
        </svg>
    );
}
