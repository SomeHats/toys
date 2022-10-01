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
import { DrawMode } from "@/splatapus/editor/modes/DrawMode";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
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
        if (splatapus.previewPosition.live().selectedShapeId === shapeId) {
            const activeMode = splatapus.interaction.activeMode.live();
            switch (activeMode.type) {
                case ModeType.Draw: {
                    const state = DrawMode.getState(activeMode);
                    switch (state.state) {
                        case "drawing":
                            return normalizeCenterPointIntervalsQuadratic(
                                getStrokeCenterPoints(
                                    getStrokePoints(state.points, perfectFreehandOpts),
                                    perfectFreehandOpts,
                                ),
                                perfectFreehandOpts.size,
                            );
                        case "idle":
                            return null;
                        default:
                            throw exhaustiveSwitchError(state);
                    }
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

    const centerPoints = useLive(
        () =>
            interpolationCache.getCenterPointsAtPosition(
                splatapus.document.live(),
                shapeId,
                splatapus.previewPosition.live(),
            ),
        [shapeId, splatapus],
    );

    const isSelected = useLive(
        () => splatapus.previewPosition.live().selectedShapeId === shapeId,
        [splatapus, shapeId],
    );

    return (
        <>
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
            {previewPoints && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(previewPoints))}
                    className={classNames(isSelected ? "fill-stone-800" : "fill-stone-600")}
                />
            )}
            {shouldShowPoints &&
                (previewPoints || centerPoints).map((point, i) => (
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
