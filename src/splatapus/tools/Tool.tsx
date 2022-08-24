import { useEvent } from "@/lib/hooks/useEvent";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { has } from "@/lib/utils";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { EventContext, makeToolsByName } from "@/splatapus/tools/lib";
import { QuickPanTool } from "@/splatapus/tools/QuickPanTool";
import { PointerEvent, useMemo, useState } from "react";

const StandardTools = [DrawTool] as const;
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
                    console.log(event.key);
                    if (
                        matchesKeyDown(event, { key: " " }) &&
                        isStandardTool(tool) &&
                        tool.isIdle()
                    ) {
                        return new QuickPanTool({ type: "idle", previousTool: tool });
                    }

                    return tool.onKeyDown();
                }),
            onKeyUp: (event: KeyboardEvent) =>
                setTool((tool) => {
                    if (tool instanceof QuickPanTool && matchesKey(event, { key: " " })) {
                        console.log("UP", event);
                        return tool.state.previousTool;
                    }

                    return tool.onKeyUp();
                }),
            onPointerDown: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerDown(makeEventContext(event))),
            onPointerMove: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerMove(makeEventContext(event))),
            onPointerUp: (event: PointerEvent) =>
                setTool((tool) => tool.onPointerUp(makeEventContext(event))),
        }),
        [makeEventContext],
    );

    return { events, tool };
}
