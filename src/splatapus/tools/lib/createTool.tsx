import { ObjectMap } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { PreviewPosition } from "@/splatapus/PreviewPosition";
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
    getPreviewPosition?: (state: Tool, selectedShapeId: SplatShapeId) => PreviewPosition | null;
    Overlay?: ComponentType<OverlayProps<Tool>>;
};

function DefaultOverlay(props: OverlayProps<unknown>) {
    return null;
}

export function createTool<Tool>() {
    return function make<T extends ToolMethods<Tool>>(tool: T) {
        return {
            getCanvasClassName: (state: T) => "",
            getPreviewPosition: (state: T) => null,
            Overlay: DefaultOverlay,
            ...tool,
        };
    };
}
