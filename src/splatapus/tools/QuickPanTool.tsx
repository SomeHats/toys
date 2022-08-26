import { assert } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createTool, EventContext, ToolDragGesture } from "@/splatapus/tools/AbstractTool";
import { StandardTool } from "@/splatapus/tools/Tool";
import { PointerEvent } from "react";

export type QuickPanToolState =
    | {
          readonly type: "idle";
          readonly previousTool: StandardTool;
      }
    | {
          readonly type: "dragging";
          readonly previousTool: StandardTool;
          readonly initialPan: Vector2;
          readonly previousScreenPoint: Vector2;
      };

export class QuickPanTool extends createTool<"quickPan", QuickPanToolState>("quickPan") {
    static toolName = "quickPan" as const;
    getSelected() {
        return this.state.previousTool;
    }
    isIdle(): boolean {
        return true;
    }
    override canvasClassName(): string {
        return "cursor-grab";
    }
    override onDragStart({
        event,
        location,
    }: EventContext<PointerEvent<Element>>): ToolDragGesture<QuickPanToolState> {
        assert(this.state.type === "idle");
        return {
            state: {
                type: "dragging",
                previousTool: this.state.previousTool,
                initialPan: location.viewportState.pan,
                previousScreenPoint: Vector2.fromEvent(event),
            },
            gesture: {
                couldBeTap: false,
                onMove(state, { updateViewport, event }) {
                    assert(state.type === "dragging");
                    const screenPoint = Vector2.fromEvent(event);
                    updateViewport(({ pan, zoom }) => ({
                        pan: pan.add(state.previousScreenPoint.sub(screenPoint).scale(zoom)),
                        zoom,
                    }));
                    return { ...state, previousScreenPoint: screenPoint };
                },
                onEnd(state) {
                    assert(state.type === "dragging");
                    return { type: "idle", previousTool: state.previousTool };
                },
                onCancel(state, { updateViewport }) {
                    assert(state.type === "dragging");
                    updateViewport(({ zoom }) => ({ zoom, pan: state.initialPan }));
                    return { type: "idle", previousTool: state.previousTool };
                },
            },
        };
    }
    debugProperties(): Record<string, string> {
        switch (this.state.type) {
            case "idle":
                return { _: this.state.type, prev: this.state.previousTool.toDebugString() };
            case "dragging":
                return {
                    _: this.state.type,
                    point: this.state.previousScreenPoint.toString(2),
                    prev: this.state.previousTool.toDebugString(),
                };
            default:
                exhaustiveSwitchError(this.state);
        }
    }
}
