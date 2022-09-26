import { findPositionForNewKeyPoint } from "@/splatapus/model/findPositionForNewKeyPoint";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import { getSvgPathFromStroke } from "@/splatapus/model/perfectFreehand";
import { Button } from "@/splatapus/ui/Button";
import { useEditorEvents, useEditorState } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";
import React from "react";
import { useToolClassNames } from "@/splatapus/editor/toolClassNames";

// const buttonStyle = {
//     width: SIDEBAR_WIDTH_PX - 24,
// };
// const rowStyle = {
//     minWidth: SIDEBAR_WIDTH_PX - 24,
// };

const WIDTH_PER_THUMB = 84;
const HEIGHT_PER_THUMB = 80;

export function RightBar() {
    const { updateLocation, updateDocument } = useEditorEvents();
    const keyPointId = useEditorState((state) => state.location.keyPointId);
    const shapeId = useEditorState((state) => state.location.shapeId);
    const keyPoints = Array.from(useEditorState((state) => state.document.keyPoints));
    const shapes = Array.from(useEditorState((state) => state.document.shapes));
    const keyFrameIndex = Array.from(keyPoints).findIndex((keyPoint) => keyPointId === keyPoint.id);
    const shapeIndex = Array.from(shapes).findIndex((shape) => shapeId === shape.id);
    const toolClassNames = useToolClassNames();

    return (
        <div className="relative flex h-full flex-col gap-4 overflow-auto p-5 [-webkit-overflow-scrolling:touch]">
            <div
                className="absolute top-5 left-5 z-0 w-20 rounded bg-stone-200 ring-2 ring-stone-200 transition-transform"
                style={{
                    height: -16 + HEIGHT_PER_THUMB * shapes.length,
                    transform: `translateX(${keyFrameIndex * WIDTH_PER_THUMB}px)`,
                }}
            />
            <div
                className="absolute top-5 z-0 h-16 rounded bg-stone-200 ring-2 ring-stone-200 transition-transform"
                style={{
                    width: -4 + WIDTH_PER_THUMB * (keyPoints.length + 1),
                    transform: `translateY(${shapeIndex * HEIGHT_PER_THUMB}px)`,
                }}
            />
            {shapes.map((shape, i) => (
                <div className="relative flex w-max flex-col gap-2" key={shape.id}>
                    <div className={"flex gap-1"}>
                        {keyPoints.map((keyPoint) => (
                            <button
                                key={keyPoint.id}
                                className={classNames(
                                    "overflow-none h-16 w-20 flex-none rounded border",
                                    shape.id === shapeId && keyPoint.id === keyPointId
                                        ? `${toolClassNames.border500} ring-1 ${toolClassNames.ring500} bg-white`
                                        : "border-stone-300 bg-white/25 hover:bg-white/50",
                                )}
                                onClick={() => {
                                    updateLocation(({ location }) =>
                                        location.with({
                                            shapeId: shape.id,
                                            keyPointId: keyPoint.id,
                                        }),
                                    );
                                }}
                            >
                                <ShapeVersionPreview
                                    width={78}
                                    height={62}
                                    keyPointId={keyPoint.id}
                                    shapeId={shape.id}
                                />
                            </button>
                        ))}
                        <button
                            className="h-16 w-20 flex-none rounded border border-stone-300 text-xl text-stone-400 hover:bg-white/50"
                            onClick={() => {
                                const keyPointId = SplatKeyPointId.generate();
                                updateDocument(
                                    ({ document, viewport }) =>
                                        document.addKeyPoint(
                                            keyPointId,
                                            findPositionForNewKeyPoint(document, viewport),
                                        ),
                                    {
                                        lockstepLocation: (location) =>
                                            location.with({ keyPointId, shapeId: shape.id }),
                                    },
                                );
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
            <Button
                className="sticky left-0"
                onClick={() => {
                    const shapeId = SplatShapeId.generate();
                    updateDocument(({ document }) => document.addShape(shapeId), {
                        lockstepLocation: (location) => location.with({ shapeId }),
                    });
                }}
            >
                + shape
            </Button>
        </div>
    );
}

const ShapeVersionPreview = React.memo(function ShapeVersionPreview({
    width,
    height,
    shapeId,
    keyPointId,
}: {
    width: number;
    height: number;
    shapeId: SplatShapeId;
    keyPointId: SplatKeyPointId;
}) {
    const padding = 4;

    const centerPoints = useEditorState(({ document }) => {
        const shapeVersion = document.getShapeVersion(keyPointId, shapeId);
        if (!shapeVersion) {
            return null;
        }
        return document.getNormalizedCenterPointsForShapeVersion(shapeVersion.id);
    });
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
