import { ObjectMap } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { CtxAction } from "@/splatapus/editor/useEditorState";
import { ComponentType } from "react";

export type OverlayProps<Tool> = {
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
