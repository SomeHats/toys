import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { Interaction } from "@/splatapus/Interaction";
import { interpolationCache } from "@/splatapus/InterpolationCache";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { getStrokeCenterPoints, getStrokePoints } from "@/splatapus/perfectFreehand";
import { PreviewPosition } from "@/splatapus/PreviewPosition";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { ToolType } from "@/splatapus/tools/ToolType";

export function DocumentRenderer({
    document,
    previewPosition,
    interaction,
}: {
    document: SplatDocModel;
    previewPosition: PreviewPosition;
    interaction: Interaction;
}) {
    let centerPoints = null;
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
    if (!centerPoints) {
        centerPoints = interpolationCache.getCenterPointsAtPosition(document, previewPosition);
    }
    return <StrokeRenderer centerPoints={centerPoints} />;
}
