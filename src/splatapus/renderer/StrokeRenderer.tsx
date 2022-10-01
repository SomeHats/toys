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
import { DrawTool } from "@/splatapus/editor/tools/DrawTool";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
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
    const toolPoints = useLive(() => {
        if (splatapus.previewPosition.live().selectedShapeId === shapeId) {
            const selectedTool = splatapus.interaction.selectedTool.live();
            switch (selectedTool.type) {
                case ToolType.Draw: {
                    const state = DrawTool.getState(selectedTool);
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
                case ToolType.Rig:
                case ToolType.Play:
                    return null;
                default:
                    throw exhaustiveSwitchError(selectedTool);
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
                    toolPoints
                        ? "fill-stone-300"
                        : isSelected
                        ? "fill-stone-800"
                        : "fill-stone-600",
                )}
            />
            {toolPoints && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(toolPoints))}
                    className={classNames(isSelected ? "fill-stone-800" : "fill-stone-600")}
                />
            )}
            {shouldShowPoints &&
                (toolPoints || centerPoints).map((point, i) => (
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
