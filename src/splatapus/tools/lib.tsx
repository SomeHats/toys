import { entries, get, has, ObjectMap, UpdateAction } from "@/lib/utils";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { OpOptions } from "@/splatapus/useUndoStack";
import { PointerEvent } from "react";
import { Tool } from "@/splatapus/tools/Tool";
import { assert } from "@/lib/assert";
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
}

export abstract class AbstractTool<Name extends string, State> {
    constructor(readonly name: Name, readonly state: State) {}

    abstract isIdle(): boolean;
    abstract canvasClassName(): string;

    abstract onKeyDown(ctx: EventContext<KeyboardEvent>): Tool;
    abstract onKeyUp(ctx: EventContext<KeyboardEvent>): Tool;
    abstract onPointerDown(ctx: EventContext<PointerEvent>): Tool;
    abstract onPointerMove(ctx: EventContext<PointerEvent>): Tool;
    abstract onPointerUp(ctx: EventContext<PointerEvent>): Tool;

    abstract debugProperties(): Record<string, string>;
    toDebugString(): string {
        const props = entries(this.debugProperties())
            .map(([k, v]) => (k.startsWith("_") ? v : `${k} = ${v}`))
            .join(", ");
        return `${this.name}(${props})`;
    }
}

export function createTool<Name extends string, State>(name: Name) {
    abstract class AbstractTool_ extends AbstractTool<Name, State> {
        constructor(state: State) {
            super(name, state);
        }
    }

    return AbstractTool_;
}

export function makeToolsByName<
    Tools extends ReadonlyArray<Class<Tool> & { readonly toolName: string }>,
>(tools: Tools): { readonly [Tool in Tools[number] as InstanceType<Tool>["name"]]: Tool } {
    const result: ObjectMap<string, Class<Tool>> = {};
    for (const tool of tools) {
        assert(!has(result, tool.toolName), `tool ${tool.toolName} already exists`);
        result[tool.toolName] = tool;
    }
    return result as { [Tool in Tools[number] as InstanceType<Tool>["name"]]: Tool };
}
