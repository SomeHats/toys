import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { Interaction } from "@/splatapus/Interaction";
import { interpolationCache } from "@/splatapus/InterpolationCache";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/pathFromCenterPoints";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
} from "@/splatapus/perfectFreehand";
import { PreviewPosition } from "@/splatapus/PreviewPosition";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { ToolType } from "@/splatapus/tools/ToolType";
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
    let centerPoints = null;
    if (previewPosition.selectedShapeId === shapeId) {
        switch (interaction.selectedTool.type) {
            case ToolType.Draw: {
                const state = DrawTool.getState(interaction.selectedTool);
                switch (state.state) {
                    case "drawing":
                        centerPoints = normalizeCenterPointIntervalsQuadratic(
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
            case ToolType.KeyPoint:
                break;
            default:
                exhaustiveSwitchError(interaction.selectedTool);
        }
    }
    if (!centerPoints) {
        centerPoints = interpolationCache.getCenterPointsAtPosition(
            document,
            shapeId,
            previewPosition,
        );
    }

    return (
        <path
            d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))}
            className={classNames(
                previewPosition.selectedShapeId === shapeId ? "fill-stone-800" : "fill-stone-600",
            )}
        />
    );
}
