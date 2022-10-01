import { ObjectMap, UpdateAction } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { ComponentType } from "react";

export type OverlayProps<Mode> = {
    readonly splatapus: Splatapus;
    readonly mode: Mode;
    readonly onUpdateMode: (update: UpdateAction<Mode>) => void;
};

export type ModeMethods<Mode> = {
    initialize: () => Mode;
    isIdle: (state: Mode) => boolean;
    getDebugProperties: (state: Mode) => ObjectMap<string, string | number | boolean | null>;
    getCanvasClassName?: (state: Mode) => string;
    getPreviewPosition?: (state: Mode, selectedShapeId: SplatShapeId) => PreviewPosition | null;
    Overlay?: ComponentType<OverlayProps<Mode>>;
};

function DefaultOverlay(props: OverlayProps<unknown>) {
    return null;
}

export function createMode<Mode>() {
    return function make<T extends ModeMethods<Mode>>(mode: T) {
        return {
            getCanvasClassName: (state: T) => "",
            getPreviewPosition: (state: T) => null,
            Overlay: DefaultOverlay,
            ...mode,
        };
    };
}
