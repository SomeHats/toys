import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createMode } from "@/splatapus/editor/lib/createMode";
import { PointerEventContext } from "@/splatapus/editor/lib/EventContext";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";

export type PlayMode = {
    readonly type: ModeType.Play;
    readonly previewPosition: Vector2 | null;
};

export const PlayMode = createMode<PlayMode>()({
    initialize: (): PlayMode => ({
        type: ModeType.Play,
        previewPosition: null,
    }),
    isIdle: (mode: PlayMode) => true,
    getDebugProperties: (mode: PlayMode) => ({ _: mode.previewPosition?.toString(2) ?? null }),
    getPreviewPosition: (mode: PlayMode, selectedShapeId: SplatShapeId): PreviewPosition | null =>
        mode.previewPosition
            ? PreviewPosition.interpolated(mode.previewPosition, selectedShapeId)
            : null,
    onPointerEvent: (
        { event, eventType, splatapus }: PointerEventContext,
        mode: PlayMode,
    ): PlayMode => {
        switch (eventType) {
            case "move":
            case "down":
                if (event.isPrimary) {
                    return { ...mode, previewPosition: splatapus.viewport.eventSceneCoords(event) };
                }
                return mode;
            case "cancel":
            case "up":
                return mode;
            default:
                exhaustiveSwitchError(eventType);
        }
    },
});
