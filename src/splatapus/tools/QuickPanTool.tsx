import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createTool, EventContext } from "@/splatapus/tools/lib";
import { StandardTool, Tool } from "@/splatapus/tools/Tool";
import { PointerEvent } from "react";

export type QuickPanToolState =
    | {
          readonly type: "idle";
          readonly previousTool: StandardTool;
      }
    | {
          readonly type: "dragging";
          readonly previousTool: StandardTool;
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
    canvasClassName(): string {
        return "cursor-grab";
    }
    onKeyDown() {
        return this;
    }
    onKeyUp() {
        return this;
    }
    onPointerDown({ viewport, event }: EventContext<PointerEvent>) {
        const state = this.state;
        switch (state.type) {
            case "idle":
                return new QuickPanTool({
                    type: "dragging",
                    previousScreenPoint: Vector2.fromEvent(event),
                    previousTool: state.previousTool,
                });
            case "dragging":
                return this;
            default:
                exhaustiveSwitchError(state);
        }
    }
    onPointerMove({ viewport, event, updateViewport }: EventContext<PointerEvent>) {
        const state = this.state;
        switch (state.type) {
            case "idle":
                return this;
            case "dragging": {
                const screenPoint = Vector2.fromEvent(event);
                updateViewport(({ pan, zoom }) => ({
                    pan: pan.add(state.previousScreenPoint.sub(screenPoint).scale(zoom)),
                    zoom,
                }));
                return new QuickPanTool({ ...state, previousScreenPoint: screenPoint });
            }
            default:
                exhaustiveSwitchError(state);
        }
    }
    onPointerUp() {
        const state = this.state;
        switch (state.type) {
            case "idle":
                return this;
            case "dragging":
                return new QuickPanTool({ type: "idle", previousTool: state.previousTool });
            default:
                exhaustiveSwitchError(state);
        }
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
