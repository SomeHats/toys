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
    return (
        <>
            {Array.from(document.shapes, (shape) => (
                <StrokeRenderer
                    key={shape.id}
                    document={document}
                    interaction={interaction}
                    shapeId={shape.id}
                    previewPosition={previewPosition}
                />
            ))}
        </>
    );
}
