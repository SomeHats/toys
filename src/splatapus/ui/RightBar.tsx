import { tailwindColors } from "@/lib/theme";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { findPositionForNewKeyPoint } from "@/splatapus/findPositionForNewKeyPoint";
import { SplatKeyPointId, SplatShapeId, SplatShapeVersion } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { pathFromCenterPoints } from "@/splatapus/pathFromCenterPoints";
import { getSvgPathFromStroke } from "@/splatapus/perfectFreehand";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { Button } from "@/splatapus/ui/Button";
import { makeGradient } from "@/splatapus/ui/makeGradient";
import { OpOptions } from "@/splatapus/UndoStack";
import { CtxAction } from "@/splatapus/useEditorState";
import classNames from "classnames";
import Color from "color";
import React from "react";

const contentGradient = makeGradient(Color(tailwindColors.stone50), "to right", 40, 1);
const contentStyle = {
    webkitMaskImage: contentGradient,
    maskImage: contentGradient,
};
const buttonStyle = {
    width: SIDEBAR_WIDTH_PX - 24,
};
const rowStyle = {
    minWidth: SIDEBAR_WIDTH_PX - 24,
};

const WIDTH_PER_THUMB = 84;
const HEIGHT_PER_THUMB = 80;

export function RightBar({
    document,
    location,
    updateDocument,
    updateLocation,
}: {
    document: SplatDocModel;
    location: SplatLocation;
    updateDocument: (ctx: CtxAction<SplatDocModel>, options: OpOptions) => void;
    updateLocation: (ctx: CtxAction<SplatLocation>) => void;
}) {
    const keyFrameIndex = Array.from(document.keyPoints).findIndex(
        (keyPoint) => location.keyPointId === keyPoint.id,
    );

    return (
        <div
            className="relative flex h-full flex-col gap-4 overflow-auto p-5 pl-8 [-webkit-overflow-scrolling:touch]"
            style={contentStyle}
        >
            <div
                className="absolute top-5 z-0 w-20 rounded bg-stone-300/25 ring-2 ring-stone-300/25"
                style={{
                    height: -16 + HEIGHT_PER_THUMB * document.shapes.count(),
                    left: 32 + keyFrameIndex * WIDTH_PER_THUMB,
                }}
            />
            {Array.from(document.shapes, (shape, i) => (
                <div className="relative flex w-max flex-col gap-2">
                    <div
                        className={classNames(
                            "flex gap-1",
                            shape.id === location.shapeId &&
                                "rounded bg-stone-300/25 ring-2 ring-stone-300/25",
                        )}
                        style={rowStyle}
                    >
                        {Array.from(document.keyPoints, (keyPoint) => (
                            <button
                                className={classNames(
                                    "overflow-none h-16 w-20 flex-none rounded border",
                                    shape.id === location.shapeId &&
                                        keyPoint.id === location.keyPointId
                                        ? "border-purple-500 bg-stone-50"
                                        : "border-stone-200 bg-stone-50/50",
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
                                    shapeVersion={document.getShapeVersion(keyPoint.id, shape.id)}
                                    document={document}
                                />
                            </button>
                        ))}
                        <button
                            className="h-16 w-20 flex-none rounded border border-stone-200 text-xl text-stone-400"
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
                style={buttonStyle}
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
    shapeVersion,
    document,
}: {
    width: number;
    height: number;
    shapeVersion: SplatShapeVersion | null;
    document: SplatDocModel;
}) {
    const padding = 4;

    if (!shapeVersion) {
        return null;
    }

    const centerPoints = document.getNormalizedCenterPointsForShapeVersion(shapeVersion.id);
    if (centerPoints.length < 2) {
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
