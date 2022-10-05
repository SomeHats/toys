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

export const StrokeRenderer = React.memo(function StrokeRenderer({
    shapeId,
    splatapus,
}: {
    shapeId: SplatShapeId;
    splatapus: Splatapus;
}) {
    const shouldShowPoints = useDebugSetting("shouldShowPoints");
    const previewPoints = useLive(() => {
        if (splatapus.location.shapeId.live() === shapeId) {
            const activeMode = splatapus.interaction.activeMode.live();
            switch (activeMode.type) {
                case ModeType.Draw: {
                    const previewPoints = activeMode.previewPoints.live();
                    if (previewPoints.length) {
                        return normalizeCenterPointIntervalsQuadratic(
                            getStrokeCenterPoints(
                                getStrokePoints(previewPoints, perfectFreehandOpts),
                                perfectFreehandOpts,
                            ),
                            perfectFreehandOpts.size,
                        );
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
        const actualCenterPoints = interpolationCache.getCenterPointsAtPosition(
            document,
            shapeId,
            previewPosition,
        );
        if (actualCenterPoints) {
            return actualCenterPoints;
        }

        const keyPointIdHistory = splatapus.keyPointIdHistory.live();
        for (let i = keyPointIdHistory.length - 1; i >= 0; i--) {
            const previousShapeVersion = document.getShapeVersion(keyPointIdHistory[i], shapeId);
            if (previousShapeVersion) {
                return document.getNormalizedCenterPointsForShapeVersion(previousShapeVersion.id);
            }
        }
        return null;
    }, [shapeId, splatapus]);

    const isSelected = useLive(
        () => splatapus.location.shapeId.live() === shapeId,
        [splatapus, shapeId],
    );

    const actualPoints = previewPoints || centerPoints;

    return (
        <>
            {centerPoints && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))}
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
                    d={getSvgPathFromStroke(pathFromCenterPoints(previewPoints))}
                    className={classNames(isSelected ? "fill-stone-800" : "fill-stone-600")}
                />
            )}
            {shouldShowPoints &&
                actualPoints &&
                actualPoints.map((point, i) => (
                    <circle
                        key={i}
                        cx={point.center.x}
                        cy={point.center.y}
                        r={point.radius}
                        className="fill-transparent stroke-cyan-400"
                    />
                ))}
        </>
    );
});
