import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { applyUpdateWithin, entries, exhaustiveSwitchError, ObjectMap } from "@/lib/utils";
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

function getToolByType<Tool extends QuickTool | SelectedTool>(type: Tool["type"]) {
    // @ts-expect-error contain the badness in this unsound fn:
    return toolsByType[type] as Required<ToolMethods<Tool>>;
}

function toDebugString(tool: QuickTool | SelectedTool) {
    const props: ObjectMap<string, string | number | boolean | null> = getToolByType(
        tool.type,
    ).getDebugProperties(tool);
    const formatted = entries(props)
        .map(([k, v]) => (k.startsWith("_") ? v : `${k} = ${v}`))
        .join(", ");
    return `${tool.type}(${formatted})`;
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
    toDebugString,
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

export type QuickTool = QuickPanTool;
export const QuickTool = {
    initializeForKeyDown: ({ event }: KeyboardEventContext): QuickTool | null => {
        if (matchesKeyDown(event, " ")) {
            return QuickPanTool.initialize();
        }
        return null;
    },
    toDebugString,
    getCanvasClassName: (tool: QuickTool): string =>
        toolsByType[tool.type].getCanvasClassName(tool),

    onPointerEvent: (ctx: PointerEventContext, tool: QuickTool): QuickTool => {
        switch (tool.type) {
            case QuickToolType.Pan:
                return applyUpdateWithin(tool, "gesture", (gesture) =>
                    QuickPanTool.gesture.onPointerEvent(ctx, gesture),
                );
        }
    },
    onKeyUp: ({ event }: KeyboardEventContext, tool: QuickTool): QuickTool | null => {
        switch (tool.type) {
            case QuickToolType.Pan:
                if (matchesKey(event, " ")) {
                    return null;
                }
                return tool;
            // default:
            //     exhaustiveSwitchError(tool);
        }
    },
};
