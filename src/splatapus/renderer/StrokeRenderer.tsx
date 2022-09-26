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
import { useEditorState } from "@/splatapus/editor/useEditorState";

export const StrokeRenderer = React.memo(function StrokeRenderer({
    shapeId,
}: {
    shapeId: SplatShapeId;
}) {
    const toolPoints = useEditorState(({ previewPosition, interaction }) => {
        if (previewPosition.selectedShapeId === shapeId) {
            switch (interaction.selectedTool.type) {
                case ToolType.Draw: {
                    const state = DrawTool.getState(interaction.selectedTool);
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
                    throw exhaustiveSwitchError(interaction.selectedTool);
            }
        }
        return null;
    });

    const centerPoints = useEditorState(({ document, previewPosition }) =>
        interpolationCache.getCenterPointsAtPosition(document, shapeId, previewPosition),
    );

    const isSelected = useEditorState(
        ({ previewPosition }) => previewPosition.selectedShapeId === shapeId,
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
        </>
    );
});
