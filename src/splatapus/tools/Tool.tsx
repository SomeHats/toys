import { assert } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { has, noop, ObjectMap } from "@/lib/utils";
import { EventContext, ToolDragGesture } from "@/splatapus/tools/AbstractTool";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { KeypointTool } from "@/splatapus/tools/KeypointTool";
import { QuickPanTool } from "@/splatapus/tools/QuickPanTool";
import { PointerEvent, useState } from "react";
import { Class } from "utility-types";

export function useTool(
    initialize: () => StandardTool,
    _makeEventContext: <Event>(event: Event) => EventContext<Event>,
) {
    const makeEventContext = useEvent(_makeEventContext);
    const [tool, setTool] = useState<Tool>(initialize);
    const gesture = useGestureDetector({
        onTap: (event) => setTool((tool) => tool.onTap(makeEventContext(event))),
        onDragStart: (event) => {
            const initialTool = tool;
            const handler = tool.onDragStart(makeEventContext(event)) as ToolDragGesture<
                Tool["state"]
            > | null;
            if (!handler) {
                return { couldBeTap: true, onMove: noop, onEnd: noop, onCancel: noop };
            }
            // @ts-expect-error state should match due to constraints on onDragStart
            setTool(initialTool.with(handler.state));
            return {
                couldBeTap: handler.gesture.couldBeTap,
                onMove: (event) =>
                    setTool((tool) => {
                        assert(
                            initialTool.name === tool.name,
                            "tool should not change during gesture",
                        );
                        const newState = handler.gesture.onMove(
                            tool.state,
                            makeEventContext(event),
                        );
                        // @ts-expect-error state should match due to constraints on onDragStart
                        return tool.with(newState);
                    }),
                onEnd: (event) =>
                    setTool((tool) => {
                        assert(
                            initialTool.name === tool.name,
                            "tool should not change during gesture",
                        );
                        const newState = handler.gesture.onEnd(tool.state, makeEventContext(event));
                        // @ts-expect-error state should match due to constraints on onDragStart
                        return tool.with(newState);
                    }),
                onCancel: (event) =>
                    setTool((tool) => {
                        assert(
                            initialTool.name === tool.name,
                            "tool should not change during gesture",
                        );
                        const newState = handler.gesture.onCancel(
                            tool.state,
                            makeEventContext(event),
                        );
                        // @ts-expect-error state should match due to constraints on onDragStart
                        return tool.with(newState);
                    }),
            };
        },
    });

    const onKeyDown = useEvent((event: KeyboardEvent) =>
        setTool((tool) => {
            const context = makeEventContext(event);
            if (isStandardTool(tool) && tool.isIdle() && !gesture.isGestureInProgress) {
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
    );

    const onKeyUp = useEvent((event: KeyboardEvent) =>
        setTool((tool) => {
            if (tool instanceof QuickPanTool && matchesKey(event, { key: " " })) {
                return tool.state.previousTool;
            }

            return tool.onKeyUp(makeEventContext(event));
        }),
    );

    const onPointerDown = useEvent((event: PointerEvent) => gesture.events.onPointerDown(event));
    const onPointerMove = useEvent((event: PointerEvent) => gesture.events.onPointerMove(event));
    const onPointerUp = useEvent((event: PointerEvent) => gesture.events.onPointerUp(event));
    const onPointerCancel = useEvent((event: PointerEvent) =>
        gesture.events.onPointerCancel(event),
    );

    const onSelectTool = useEvent((selectedTool: StandardTool) =>
        setTool((tool) => {
            if (tool.isIdle() && !gesture.isGestureInProgress) {
                return selectedTool;
            }
            return tool;
        }),
    );

    return {
        events: {
            onKeyDown,
            onKeyUp,
            onPointerCancel,
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onSelectTool,
        },
        tool,
        updateTool: setTool,
    };
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

function makeToolsByName<Tools extends ReadonlyArray<Class<Tool> & { readonly toolName: string }>>(
    tools: Tools,
): { readonly [Tool in Tools[number] as InstanceType<Tool>["name"]]: Tool } {
    const result: ObjectMap<string, Class<Tool>> = {};
    for (const tool of tools) {
        assert(!has(result, tool.toolName), `tool ${tool.toolName} already exists`);
        result[tool.toolName] = tool;
    }
    return result as { [Tool in Tools[number] as InstanceType<Tool>["name"]]: Tool };
}
