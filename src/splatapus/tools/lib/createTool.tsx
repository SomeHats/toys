import { ObjectMap } from "@/lib/utils";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { CtxAction } from "@/splatapus/useEditorState";
import { Viewport } from "@/splatapus/Viewport";
import { ComponentType } from "react";

export type OverlayProps<Tool> = {
    readonly document: SplatDocModel;
    readonly location: SplatLocation;
    readonly viewport: Viewport;
    readonly tool: Tool;
    readonly onUpdateTool: (update: CtxAction<Tool>) => void;
};

export type ToolMethods<Tool> = {
    initialize: () => Tool;
    isIdle: (state: Tool) => boolean;
    getDebugProperties: (state: Tool) => ObjectMap<string, string | number | boolean | null>;
    getCanvasClassName?: (state: Tool) => string;
    Overlay?: ComponentType<OverlayProps<Tool>>;
};

function DefaultOverlay(props: OverlayProps<unknown>) {
    return null;
}

export function createTool<Tool>() {
    return function make<T extends ToolMethods<Tool>>(tool: T) {
        return {
            getCanvasClassName: (state: T) => "",
            Overlay: DefaultOverlay,
            ...tool,
        };
    };
}
