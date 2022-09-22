import { debugStateToString } from "@/lib/debugPropsToString";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { KeyPointTool } from "@/splatapus/tools/KeyPointTool";
import { ToolMethods } from "@/splatapus/tools/lib/createTool";
import { KeyboardEventContext, PointerEventContext } from "@/splatapus/tools/lib/EventContext";
import { QuickPanTool } from "@/splatapus/tools/QuickPanTool";
import { QuickToolType, ToolType } from "@/splatapus/tools/ToolType";

const toolsByType = {
    [ToolType.Draw]: DrawTool,
    [ToolType.KeyPoint]: KeyPointTool,
    [QuickToolType.Pan]: QuickPanTool,
};

export function getToolByType<Tool extends QuickPanTool | SelectedTool>(type: Tool["type"]) {
    // @ts-expect-error contain the badness in this unsound fn:
    return toolsByType[type] as Required<ToolMethods<Tool>>;
}

export type SelectedTool = DrawTool | KeyPointTool;

export const SelectedTool = {
    initialize: (toolType: ToolType): SelectedTool => {
        return getToolByType<SelectedTool>(toolType).initialize();
    },
    initializeForKeyDown: ({ event }: KeyboardEventContext): SelectedTool | null => {
        if (matchesKeyDown(event, "d")) {
            return DrawTool.initialize();
        }
        if (matchesKeyDown(event, "k")) {
            return KeyPointTool.initialize();
        }
        return null;
    },
    isIdle: (tool: SelectedTool) => {
        return getToolByType(tool.type).isIdle(tool);
    },
    getCanvasClassName: (tool: SelectedTool): string =>
        getToolByType(tool.type).getCanvasClassName(tool),
    getPreviewPosition: (tool: SelectedTool, selectedShapeId: SplatShapeId) => {
        return getToolByType(tool.type).getPreviewPosition(tool, selectedShapeId);
    },
    toDebugString: (tool: QuickPanTool | SelectedTool) => {
        return debugStateToString(tool.type, getToolByType(tool.type).getDebugProperties(tool));
    },
    onPointerEvent: (ctx: PointerEventContext, tool: SelectedTool): SelectedTool => {
        switch (tool.type) {
            case ToolType.Draw:
                return DrawTool.onPointerEvent(ctx, tool);
            case ToolType.KeyPoint:
                return KeyPointTool.onPointerEvent(ctx, tool);
            default:
                exhaustiveSwitchError(tool);
        }
    },
};
