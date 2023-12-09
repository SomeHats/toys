import { assertExists } from "@/lib/assert";
import { DebugCircle, DebugPointX } from "@/lib/DebugSvg";
import { Vector2 } from "@/lib/geom/Vector2";
import { useLive } from "@/lib/live";
import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { useDebugSetting } from "@/splatapus/DebugSettings";
import { ModeType } from "@/splatapus/editor/modes/Mode";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { interpolationCache } from "@/splatapus/model/InterpolationCache";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/model/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
    StrokeCenterPoint,
} from "@/splatapus/model/perfectFreehand";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import classNames from "classnames";
import React from "react";

export const StrokeRenderer = React.memo(function StrokeRenderer({
    shapeId,
    splatapus,
}: {
    shapeId: SplatShapeId;
    splatapus: Splatapus;
}) {
    const shouldShowPoints = useDebugSetting("shouldShowPoints");
    const shouldShowSmoothPoints = useDebugSetting("shouldShowSmoothPoints");
    const shouldShowRawPoints = useDebugSetting("shouldShowRawPoints");

    const previewPoints = useLive(() => {
        if (splatapus.location.shapeId.live() === shapeId) {
            const activeMode = splatapus.interaction.activeMode.live();
            switch (activeMode.type) {
                case ModeType.Draw: {
                    const previewPoints = activeMode.previewPoints.live();
                    if (previewPoints.length) {
                        const smoothed = getStrokeCenterPoints(
                            getStrokePoints(previewPoints, perfectFreehandOpts),
                            perfectFreehandOpts,
                        );
                        return {
                            normalized: normalizeCenterPointIntervalsQuadratic(
                                smoothed,
                                perfectFreehandOpts.size,
                            ),
                            reduced: reducePointsBasedOnCost(smoothed),
                            smoothed,
                            raw: previewPoints,
                        };
                    }
                    return null;
                }
                case ModeType.Rig:
                case ModeType.Play:
                    return null;
                default:
                    throw exhaustiveSwitchError(activeMode);
            }
        }
        return null;
    }, [splatapus, shapeId]);

    const centerPoints = useLive(() => {
        const document = splatapus.document.live();
        const previewPosition = splatapus.previewPosition.live();

        let rawPoints: readonly Vector2[];
        switch (previewPosition.type) {
            case "interpolated":
                rawPoints = [];
                break;
            case "keyPointId": {
                const shapeVersion = document.getShapeVersion(
                    previewPosition.keyPointId,
                    shapeId,
                );
                rawPoints = shapeVersion ? shapeVersion.rawPoints : [];
                break;
            }
            default:
                exhaustiveSwitchError(previewPosition);
        }

        const actualCenterPoints = interpolationCache.getCenterPointsAtPosition(
            document,
            shapeId,
            previewPosition,
        );
        if (actualCenterPoints) {
            return {
                normalized: actualCenterPoints.normalized,
                smoothed: actualCenterPoints.smoothed,
                reduced:
                    actualCenterPoints.smoothed ?
                        reducePointsBasedOnCost(actualCenterPoints.smoothed)
                    :   null,
                raw: rawPoints,
            };
        }

        const keyPointIdHistory = splatapus.keyPointIdHistory.live();
        for (let i = keyPointIdHistory.length - 1; i >= 0; i--) {
            const previousShapeVersion = document.getShapeVersion(
                keyPointIdHistory[i],
                shapeId,
            );
            if (previousShapeVersion) {
                const { normalizedCenterPoints, smoothedCenterPoints } =
                    document.getNormalizedCenterPointsForShapeVersion(
                        previousShapeVersion.id,
                    );
                return {
                    normalized: normalizedCenterPoints,
                    smoothed: smoothedCenterPoints,
                    reduced: reducePointsBasedOnCost(smoothedCenterPoints),
                    raw: rawPoints,
                };
            }
        }
        return { normalized: null, raw: rawPoints };
    }, [shapeId, splatapus]);

    const isSelected = useLive(
        () => splatapus.location.shapeId.live() === shapeId,
        [splatapus, shapeId],
    );

    const actualPoints = previewPoints ?? centerPoints;

    return (
        <>
            {centerPoints.normalized && (
                <path
                    d={getSvgPathFromStroke(
                        pathFromCenterPoints(centerPoints.normalized),
                    )}
                    className={classNames(
                        previewPoints ? "fill-stone-300"
                        : isSelected ? "fill-stone-800"
                        : "fill-stone-600",
                    )}
                />
            )}
            {/* {centerPoints.reduced &&
                pathFromCenterPoints(centerPoints.reduced.retainedPoints).map((point, i) => (
                    <DebugPointX key={i} position={point} />
                ))} */}
            {/* {centerPoints.normalized && (
                <path
                    d={getSvgPathFromStroke(
                        pathFromCenterPoints(
                            centerPoints.normalized.map(({ center, radius }) => ({
                                center: center.add(0, 100),
                                radius,
                            })),
                        ),
                    )}
                    className={classNames(
                        previewPoints
                            ? "fill-stone-300"
                            : isSelected
                            ? "fill-stone-800"
                            : "fill-stone-600",
                    )}
                />
            )} */}
            {previewPoints && (
                <path
                    d={getSvgPathFromStroke(
                        pathFromCenterPoints(
                            previewPoints.reduced.retainedPoints,
                        ),
                    )}
                    className={classNames(
                        isSelected ? "fill-stone-800" : "fill-stone-600",
                    )}
                />
            )}
            {shouldShowPoints &&
                actualPoints.normalized?.map((point, i) => (
                    <DebugCircle
                        center={point.center}
                        radius={point.radius}
                        key={i}
                    />
                ))}
            {shouldShowRawPoints &&
                actualPoints.raw?.map((point, i) => (
                    <DebugPointX position={point} key={i} color="lime" />
                ))}
            {shouldShowSmoothPoints &&
                actualPoints.reduced?.retainedPoints.map((point, i) => (
                    <DebugCircle
                        center={point.center}
                        radius={point.radius}
                        key={i}
                        color="skyblue"
                    />
                ))}
        </>
    );
});

const bendWeight = 10;
const sizeWeight = 10;

function getCostAtIndex(
    points: readonly StrokeCenterPoint[],
    index: number,
): number | null {
    if (index === 0 || index === points.length - 1) {
        return null;
    }

    const previousPoint = points[index - 1];
    const currentPoint = points[index];
    const nextPoint = points[index + 1];

    const bendFactor =
        (Math.abs(
            currentPoint.center
                .sub(previousPoint.center)
                .angleBetween(nextPoint.center.sub(currentPoint.center)),
        ) /
            Math.PI) *
        bendWeight;

    const sizeFactor =
        (1 -
            (currentPoint.radius < previousPoint.radius ?
                currentPoint.radius / previousPoint.radius
            :   previousPoint.radius / currentPoint.radius)) *
        sizeWeight;

    return bendFactor + sizeFactor;
}

function reducePointsBasedOnCost(points: readonly StrokeCenterPoint[]) {
    const dbg: React.ReactNode[] = [];

    let costRemaining = 1;
    let totalCost = 0;
    const retainedPoints = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const cost = assertExists(getCostAtIndex(points, i));
        costRemaining -= cost;
        totalCost += cost;

        if (costRemaining < 0) {
            retainedPoints.push(points[i]);
            costRemaining = 1;
        }
    }

    retainedPoints.push(points[points.length - 1]);

    return {
        retainedPoints,
        totalCost,
        dbg,
    };
}

// function reducePointsForTargetCost(
//     points: ReadonlyArray<StrokeCenterPoint>,
//     naturalCost: number,
//     costMultiplier: number,
// ) {
//     const dbg: React.ReactNode[] = [];
//     const retainedPoints = [points[0]];

//     let accumulatedCost = 0;
//     let prevTracker = points[0];

//     for (let i = 1; i < points.length - 1; i++) {
//         const cost = assertExists(getCostAtIndex(points, i)) * costMultiplier;

//         const trackerStart = prevTracker.center;
//         const trackerEnd =
//     }
// }
