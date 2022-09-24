import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createTool } from "@/splatapus/editor/lib/createTool";
import { PointerEventContext } from "@/splatapus/editor/lib/EventContext";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";

export type PlayTool = {
    readonly type: ToolType.Play;
    readonly previewPosition: Vector2 | null;
};

export const PlayTool = createTool<PlayTool>()({
    initialize: (): PlayTool => ({
        type: ToolType.Play,
        previewPosition: null,
    }),
    isIdle: (tool: PlayTool) => true,
    getDebugProperties: (tool: PlayTool) => ({ _: tool.previewPosition?.toString(2) ?? null }),
    getPreviewPosition: (tool: PlayTool, selectedShapeId: SplatShapeId): PreviewPosition | null =>
        tool.previewPosition
            ? PreviewPosition.interpolated(tool.previewPosition, selectedShapeId)
            : null,
    onPointerEvent: (
        { event, eventType, viewport }: PointerEventContext,
        tool: PlayTool,
    ): PlayTool => {
        switch (eventType) {
            case "move":
            case "down":
                if (event.isPrimary) {
                    return { ...tool, previewPosition: viewport.eventSceneCoords(event) };
                }
                return tool;
            case "cancel":
            case "up":
                return tool;
            default:
                exhaustiveSwitchError(eventType);
        }
    },
});
