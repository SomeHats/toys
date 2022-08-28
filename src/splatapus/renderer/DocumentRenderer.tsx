import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { Interaction } from "@/splatapus/Interaction";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { getStrokeCenterPoints, getStrokePoints } from "@/splatapus/perfectFreehand";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { ToolType } from "@/splatapus/tools/ToolType";

export function DocumentRenderer({
    document,
    keyPointId,
    interaction,
}: {
    document: SplatDocModel;
    keyPointId: SplatKeypointId;
    interaction: Interaction;
}) {
    const shapeVersion = document.getShapeVersionForKeyPoint(keyPointId);
    let centerPoints = document.data.normalizedShapeVersions.get(
        shapeVersion.id,
    ).normalizedCenterPoints;
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
    return <StrokeRenderer centerPoints={centerPoints} />;
}
