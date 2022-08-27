import { entries, UpdateAction } from "@/lib/utils";
import { SplatShapeVersion } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { StrokeCenterPoint } from "@/splatapus/perfectFreehand";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { StandardTool, Tool } from "@/splatapus/tools/Tool";
import { OpOptions } from "@/splatapus/useUndoStack";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { ComponentType, PointerEvent, ReactNode } from "react";
import { Class } from "utility-types";

export interface EventContext<Event> {
    readonly event: Event;
    readonly viewport: Viewport;
    readonly document: SplatDocModel;
    readonly location: SplatLocation;
    readonly updateViewport: (update: UpdateAction<ViewportState>) => void;
    readonly updateDocument: (
        action: UpdateAction<SplatDocModel>,
        options?: OpOptions<SplatLocation>,
    ) => void;
    readonly updateLocation: (action: UpdateAction<SplatLocation>) => void;
    readonly undo: () => void;
    readonly redo: () => void;
}

export function createTool<Name extends string, State>(name: Name) {
    abstract class AbstractTool_ extends AbstractTool<Name, State> {
        constructor(state: State) {
            super(name, state);
        }
    }

    return AbstractTool_;
}

export type ToolRenderProps<State> = {
    viewport: Viewport;
    location: SplatLocation;
    document: SplatDocModel;
    updateTool: (update: UpdateAction<Tool>) => void;
    state: State;
};
export type ToolRenderComponent<State> = ComponentType<ToolRenderProps<State>>;
function DefaultToolRenderComponent() {
    return null;
}

export type ToolDragGestureHandler<State> = {
    couldBeTap: boolean;
    onCancel: (state: State, event: EventContext<PointerEvent>) => State;
    onMove: (state: State, event: EventContext<PointerEvent>) => State;
    onEnd: (state: State, event: EventContext<PointerEvent>) => State;
};
export type ToolDragGesture<State> = {
    state: State;
    gesture: ToolDragGestureHandler<State>;
};

export abstract class AbstractTool<Name extends string, State> {
    constructor(readonly name: Name, readonly state: State) {}

    abstract getSelected(): StandardTool;
    abstract isIdle(): boolean;

    with<T extends Tool>(this: T, state: State): T {
        const Ctor = this.constructor as { new (state: State): T };
        return new Ctor(state);
    }

    canvasClassName(): string {
        return "";
    }
    onKeyDown(this: Tool, ctx: EventContext<KeyboardEvent>): Tool {
        return this;
    }
    onKeyUp(this: Tool, ctx: EventContext<KeyboardEvent>): Tool {
        return this;
    }
    onTap(this: Tool, ctx: EventContext<PointerEvent>): Tool {
        return this;
    }
    onDragStart(ctx: EventContext<PointerEvent>): ToolDragGesture<State> | null {
        return {
            state: this.state,
            gesture: {
                couldBeTap: true,
                onCancel: (tool) => tool,
                onMove: (tool) => tool,
                onEnd: (tool) => tool,
            },
        };
    }
    getPointsForShapeVersion(
        document: SplatDocModel,
        shapeVersion: SplatShapeVersion,
    ): ReadonlyArray<StrokeCenterPoint> {
        return document.data.normalizedShapeVersions.get(shapeVersion.id).normalizedCenterPoints;
    }

    getSceneSvgComponent(): ToolRenderComponent<State> {
        return DefaultToolRenderComponent;
    }
    getScreenSvgComponent(): ToolRenderComponent<State> {
        return DefaultToolRenderComponent;
    }
    getScreenHtmlComponent(): ToolRenderComponent<State> {
        return DefaultToolRenderComponent;
    }

    abstract debugProperties(): Record<string, string>;
    toDebugString(): string {
        const props = entries(this.debugProperties())
            .map(([k, v]) => (k.startsWith("_") ? v : `${k} = ${v}`))
            .join(", ");
        return `${this.name}(${props})`;
    }
}
