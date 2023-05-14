import { useLive } from "@/lib/live";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import { getSvgPathFromStroke } from "@/splatapus/model/perfectFreehand";
import React from "react";

export const ShapeVersionPreview = React.memo(function ShapeVersionPreview({
    width,
    height,
    shapeId,
    keyPointId,
    splatapus,
}: {
    width: number;
    height: number;
    shapeId: SplatShapeId;
    keyPointId: SplatKeyPointId;
    splatapus: Splatapus;
}) {
    const padding = 4;

    const centerPoints = useLive(() => {
        const document = splatapus.document.live();
        const shapeVersion = document.getShapeVersion(keyPointId, shapeId);
        if (!shapeVersion) {
            return null;
        }
        return document.getNormalizedCenterPointsForShapeVersion(shapeVersion.id)
            .normalizedCenterPoints;
    }, [keyPointId, shapeId, splatapus.document]);
    if (!centerPoints || centerPoints.length < 2) {
        return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const { center, radius } of centerPoints) {
        minX = Math.min(minX, center.x - radius);
        maxX = Math.max(maxX, center.x + radius);
        minY = Math.min(minY, center.y - radius);
        maxY = Math.max(maxY, center.y + radius);
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
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))}
                    className="fill-stone-800"
                />
            </g>
        </svg>
    );
});
