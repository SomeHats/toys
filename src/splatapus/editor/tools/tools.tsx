import { debugStateToString } from "@/lib/debugPropsToString";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { DrawTool } from "@/splatapus/editor/tools/DrawTool";
import { RigTool } from "@/splatapus/editor/tools/RigTool";
import { ToolMethods } from "@/splatapus/editor/lib/createTool";
import { KeyboardEventContext, PointerEventContext } from "@/splatapus/editor/lib/EventContext";
import { QuickPanTool } from "@/splatapus/editor/tools/QuickPanTool";
import { QuickToolType, ToolType } from "@/splatapus/editor/tools/ToolType";

const toolsByType = {
    [ToolType.Draw]: DrawTool,
    [ToolType.Rig]: RigTool,
    [QuickToolType.Pan]: QuickPanTool,
};

export function getToolByType<Tool extends QuickPanTool | SelectedTool>(type: Tool["type"]) {
    // @ts-expect-error contain the badness in this unsound fn:
    return toolsByType[type] as Required<ToolMethods<Tool>>;
}

export type SelectedTool = DrawTool | RigTool;

export const SelectedTool = {
    initialize: (toolType: ToolType): SelectedTool => {
        return getToolByType<SelectedTool>(toolType).initialize();
    },
    initializeForKeyDown: ({ event }: KeyboardEventContext): SelectedTool | null => {
        if (matchesKeyDown(event, "d")) {
            return DrawTool.initialize();
        }
        if (matchesKeyDown(event, "r")) {
            return RigTool.initialize();
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
            case ToolType.Rig:
                return RigTool.onPointerEvent(ctx, tool);
            default:
                exhaustiveSwitchError(tool);
        }
    },
};