import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { Tool } from "@/splatapus/tools/Tool";

export function DocumentRenderer({
    document,
    keyPointId,
    tool,
}: {
    document: SplatDocModel;
    keyPointId: SplatKeypointId;
    tool: Tool;
}) {
    const shapeVersion = document.getShapeVersionForKeyPoint(keyPointId);
    return <StrokeRenderer centerPoints={tool.getPointsForShapeVersion(document, shapeVersion)} />;
}
