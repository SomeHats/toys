import { Vector2 } from "@/lib/geom/Vector2";
import { createEnumParser } from "@/lib/objectParser";
import { PointerEventContext } from "@/splatapus/editor/EventContext";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { ReactNode } from "react";

export enum ModeType {
    Draw = "draw",
    Rig = "rig",
    Play = "play",
}

export const parseModeType = createEnumParser(ModeType);

export interface Mode<Type extends ModeType> {
    readonly type: Type;

    isIdleLive(): boolean;
    toDebugStringLive(): string;
    onPointerEvent(ctx: PointerEventContext): void;
    getPreviewPositionLive(): Vector2 | null;
    renderOverlay(splatapus: Splatapus): ReactNode;
}
