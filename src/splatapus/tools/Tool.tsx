import Vector2 from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { has } from "@/lib/utils";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { KeypointTool } from "@/splatapus/tools/KeypointTool";
import { EventContext, makeToolsByName } from "@/splatapus/tools/lib";
import { QuickPanTool } from "@/splatapus/tools/QuickPanTool";
import { PointerEvent, useMemo, useState } from "react";

export function useTool(
    initialize: () => StandardTool,
    _makeEventContext: <Event>(event: Event) => EventContext<Event>,
) {
    const makeEventContext = useEvent(_makeEventContext);
    const [tool, setTool] = useState<Tool>(initialize);

    const events = useMemo(
        () => ({
            onKeyDown: (event: KeyboardEvent) =>
                setTool((tool) => {
                    const context = makeEventContext(event);
                    if (isStandardTool(tool) && tool.isIdle()) {
                        if (matchesKeyDown(event, " ")) {
                            return new QuickPanTool({ type: "idle", previousTool: tool });
                        }
                        if (matchesKeyDown(event, "d")) {
                            return new DrawTool({ type: "idle" });
                        }
                        if (matchesKeyDown(event, "k")) {
                            return new KeypointTool({ type: "idle" });
                        }
                        if (matchesKeyDown(event, { key: "z", command: true })) {
                            context.undo();
                            return tool;
                        }
                        if (matchesKeyDown(event, { key: "z", command: true, shift: true })) {
                            context.redo();
                        }
                    }
                    if (matchesKey(event, { key: "0", command: true })) {
                        context.updateViewport({ pan: Vector2.ZERO, zoom: 1 });
                        return tool;
                    }

                    return tool.onKeyDown(context);
                }),
            onKeyUp: (event: KeyboardEvent) =>
                setTool((tool) => {
                    if (tool instanceof QuickPanTool && matchesKey(event, { key: " " })) {
                        return tool.state.previousTool;
                    }

                    return tool.onKeyUp(makeEventContext(event));
                }),
            onPointerDown: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerDown(makeEventContext(event))),
            onPointerMove: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerMove(makeEventContext(event))),
            onPointerUp: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerUp(makeEventContext(event))),
            onSelectTool: (selectedTool: StandardTool) =>
                setTool((tool) => {
                    if (tool.isIdle()) {
                        return selectedTool;
                    }
                    return tool;
                }),
        }),
        [makeEventContext],
    );

    return { events, tool };
}

const StandardTools = [DrawTool, KeypointTool] as const;
export type StandardTool = InstanceType<typeof StandardTools[number]>;

const standardToolsByName = makeToolsByName(StandardTools);
export function isStandardTool(tool: Tool): tool is StandardTool {
    return has(standardToolsByName, tool.name);
}

export const QuickTools = [QuickPanTool] as const;
export type QuickTool = InstanceType<typeof QuickTools[number]>;

const quickToolsByName = makeToolsByName(QuickTools);
export function isQuickTool(tool: Tool): tool is QuickTool {
    return has(quickToolsByName, tool.name);
}

export type Tool = StandardTool | QuickTool;
// make sure tool names are unique
makeToolsByName([...StandardTools, ...QuickTools]);
