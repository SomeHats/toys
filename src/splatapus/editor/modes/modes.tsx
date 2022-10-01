import { debugStateToString } from "@/lib/debugPropsToString";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { DrawMode } from "@/splatapus/editor/modes/DrawMode";
import { RigMode } from "@/splatapus/editor/modes/RigMode";
import { ModeMethods } from "@/splatapus/editor/lib/createMode";
import { KeyboardEventContext, PointerEventContext } from "@/splatapus/editor/lib/EventContext";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
import { PlayMode } from "@/splatapus/editor/modes/PlayMode";

const modesByType = {
    [ModeType.Draw]: DrawMode,
    [ModeType.Rig]: RigMode,
    [ModeType.Play]: PlayMode,
};
export type SelectedMode = DrawMode | RigMode | PlayMode;

export function getModeByType<Mode extends SelectedMode>(type: Mode["type"]) {
    // @ts-expect-error contain the badness in this unsound fn:
    return modesByType[type] as Required<ModeMethods<Mode>>;
}

export const SelectedMode = {
    initialize: (modeType: ModeType): SelectedMode => {
        return getModeByType<SelectedMode>(modeType).initialize();
    },
    initializeForKeyDown: ({ event }: KeyboardEventContext): SelectedMode | null => {
        if (matchesKeyDown(event, "d")) {
            return DrawMode.initialize();
        }
        if (matchesKeyDown(event, "r")) {
            return RigMode.initialize();
        }
        if (matchesKeyDown(event, "p")) {
            return PlayMode.initialize();
        }
        return null;
    },
    isIdle: (mode: SelectedMode) => {
        return getModeByType(mode.type).isIdle(mode);
    },
    getCanvasClassName: (mode: SelectedMode): string =>
        getModeByType(mode.type).getCanvasClassName(mode),
    getPreviewPosition: (mode: SelectedMode, selectedShapeId: SplatShapeId) => {
        return getModeByType(mode.type).getPreviewPosition(mode, selectedShapeId);
    },
    toDebugString: (mode: SelectedMode) => {
        return debugStateToString(mode.type, getModeByType(mode.type).getDebugProperties(mode));
    },
    onPointerEvent: (ctx: PointerEventContext, mode: SelectedMode): SelectedMode => {
        switch (mode.type) {
            case ModeType.Draw:
                return DrawMode.onPointerEvent(ctx, mode);
            case ModeType.Rig:
                return RigMode.onPointerEvent(ctx, mode);
            case ModeType.Play:
                return PlayMode.onPointerEvent(ctx, mode);
            default:
                exhaustiveSwitchError(mode);
        }
    },
};
