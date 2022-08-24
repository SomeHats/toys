import { DrawTool } from "@/splatapus/tools/DrawTool";
import { createTool, EventContext } from "@/splatapus/tools/lib";
import { Tool } from "@/splatapus/tools/Tool";
import { PointerEvent } from "react";

export type KeypointToolState = {
    readonly type: "idle";
};

export class KeypointTool extends createTool<"keypoint", KeypointToolState>("keypoint") {
    static readonly toolName = "keypoint" as const;

    getSelected() {
        return this;
    }
    isIdle(): boolean {
        return this.state.type === "idle";
    }
    canvasClassName(): string {
        return "";
    }
    onKeyDown(ctx: EventContext<KeyboardEvent>): Tool {
        return this;
    }
    onKeyUp(ctx: EventContext<KeyboardEvent>): Tool {
        return this;
    }
    onPointerDown(ctx: EventContext<PointerEvent<Element>>): Tool {
        return this;
    }
    onPointerMove(ctx: EventContext<PointerEvent<Element>>): Tool {
        return this;
    }
    onPointerUp(ctx: EventContext<PointerEvent<Element>>): Tool {
        return this;
    }
    debugProperties(): Record<string, string> {
        return { _: this.state.type };
    }
}
