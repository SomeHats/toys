import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { Interaction } from "@/splatapus/editor/Interaction";
import { interpolationCache } from "@/splatapus/model/InterpolationCache";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/model/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
} from "@/splatapus/model/perfectFreehand";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { DrawTool } from "@/splatapus/editor/tools/DrawTool";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import classNames from "classnames";

export function StrokeRenderer({
    interaction,
    document,
    shapeId,
    previewPosition,
}: {
    interaction: Interaction;
    document: SplatDocModel;
    shapeId: SplatShapeId;
    previewPosition: PreviewPosition;
}) {
    let toolPoints = null;
    if (previewPosition.selectedShapeId === shapeId) {
        switch (interaction.selectedTool.type) {
            case ToolType.Draw: {
                const state = DrawTool.getState(interaction.selectedTool);
                switch (state.state) {
                    case "drawing":
                        toolPoints = normalizeCenterPointIntervalsQuadratic(
                            getStrokeCenterPoints(
                                getStrokePoints(state.points, perfectFreehandOpts),
                                perfectFreehandOpts,
                            ),
                            perfectFreehandOpts.size,
                        );
                        break;
                    case "idle":
                        break;
                    default:
                        exhaustiveSwitchError(state);
                }
                break;
            }
            case ToolType.Rig:
            case ToolType.Play:
                break;
            default:
                exhaustiveSwitchError(interaction.selectedTool);
        }
    }
    const centerPoints = interpolationCache.getCenterPointsAtPosition(
        document,
        shapeId,
        previewPosition,
    );

    return (
        <>
            <path
                d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))}
                className={classNames(
                    toolPoints
                        ? "fill-stone-300"
                        : previewPosition.selectedShapeId === shapeId
                        ? "fill-stone-800"
                        : "fill-stone-600",
                )}
            />
            {toolPoints && (
                <path
                    d={getSvgPathFromStroke(pathFromCenterPoints(toolPoints))}
                    className={classNames(
                        previewPosition.selectedShapeId === shapeId
                            ? "fill-stone-800"
                            : "fill-stone-600",
                    )}
                />
            )}
        </>
    );
}
