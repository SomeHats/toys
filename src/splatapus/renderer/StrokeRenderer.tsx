import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { interpolationCache } from "@/splatapus/model/InterpolationCache";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/model/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
} from "@/splatapus/model/perfectFreehand";
import { ModeType } from "@/splatapus/editor/modes/Mode";
import classNames from "classnames";
import React from "react";
import { useDebugSetting } from "@/splatapus/DebugSettings";
import { useLive } from "@/lib/live";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { Vector2 } from "@/lib/geom/Vector2";
import { DebugCircle, DebugPointX } from "@/lib/DebugSvg";

export const StrokeRenderer = React.memo(function StrokeRenderer({
    shapeId,
    splatapus,
}: {
    shapeId: SplatShapeId;
    splatapus: Splatapus;
}) {
    const shouldShowPoints = useDebugSetting("shouldShowPoints");
    const shouldShowRawPoints = useDebugSetting("shouldShowRawPoints");

    const previewPoints = useLive(() => {
        if (splatapus.location.shapeId.live() === shapeId) {
            const activeMode = splatapus.interaction.activeMode.live();
            switch (activeMode.type) {
                case ModeType.Draw: {
                    const previewPoints = activeMode.previewPoints.live();
                    if (previewPoints.length) {
                        return {
                            normalized: normalizeCenterPointIntervalsQuadratic(
                                getStrokeCenterPoints(
                                    getStrokePoints(previewPoints, perfectFreehandOpts),
                                    perfectFreehandOpts,
                                ),
                                perfectFreehandOpts.size,
                            ),
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

        let rawPoints: ReadonlyArray<Vector2>;
        switch (previewPosition.type) {
            case "interpolated":
                rawPoints = [];
                break;
            case "keyPointId": {
                const shapeVersion = document.getShapeVersion(previewPosition.keyPointId, shapeId);
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
            return { normalized: actualCenterPoints, raw: rawPoints };
        }

        const keyPointIdHistory = splatapus.keyPointIdHistory.live();
        for (let i = keyPointIdHistory.length - 1; i >= 0; i--) {
            const previousShapeVersion = document.getShapeVersion(keyPointIdHistory[i], shapeId);
            if (previousShapeVersion) {
                return {
                    normalized: document.getNormalizedCenterPointsForShapeVersion(
                        previousShapeVersion.id,
                    ),
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

    const actualPoints = previewPoints || centerPoints;

    return (
        <>
            {centerPoints.normalized && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints.normalized))}
                    className={classNames(
                        previewPoints
                            ? "fill-stone-300"
                            : isSelected
                            ? "fill-stone-800"
                            : "fill-stone-600",
                    )}
                />
            )}
            {previewPoints && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(previewPoints.normalized))}
                    className={classNames(isSelected ? "fill-stone-800" : "fill-stone-600")}
                />
            )}
            {shouldShowPoints &&
                actualPoints.normalized &&
                actualPoints.normalized.map((point, i) => (
                    <DebugCircle center={point.center} radius={point.radius} key={i} />
                ))}
            {shouldShowRawPoints &&
                actualPoints.raw &&
                actualPoints.raw.map((point, i) => (
                    <DebugPointX position={point} key={i} color="lime" />
                ))}
        </>
    );
});
