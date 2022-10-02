import { Vector2 } from "@/lib/geom/Vector2";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { entries, exhaustiveSwitchError } from "@/lib/utils";
import { MultiTouchPan } from "@/splatapus/editor/MultiTouchPan";
import { DrawMode } from "@/splatapus/editor/modes/DrawMode";
import { RigMode } from "@/splatapus/editor/modes/RigMode";
import {
    applyPointerEvent,
    KeyboardEventContext,
    PointerEventContext,
} from "@/splatapus/editor/EventContext";
import { QuickPan } from "@/splatapus/editor/QuickPan";
import { ModeType } from "@/splatapus/editor/modes/Mode";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { PlayMode } from "@/splatapus/editor/modes/PlayMode";
import React from "react";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { LiveValue, runOnce, useLive } from "@/lib/live";

type SpecificMode = DrawMode | RigMode | PlayMode;

function initializeModeForType(type: ModeType) {
    switch (type) {
        case ModeType.Draw:
            return new DrawMode();
        case ModeType.Rig:
            return new RigMode();
        case ModeType.Play:
            return new PlayMode();
        default:
            exhaustiveSwitchError(type);
    }
}
const keyForModeType = {
    [ModeType.Draw]: "d",
    [ModeType.Rig]: "r",
    [ModeType.Play]: "p",
} as const;

export class Interaction {
    private readonly multiTouchPan = new MultiTouchPan();
    readonly quickPan = new QuickPan();
    readonly activeMode: LiveValue<SpecificMode>;

    constructor(modeType: ModeType) {
        this.activeMode = new LiveValue(initializeModeForType(modeType));

        // hack: force evaluation of effects
        this.activeMode.addBatchInvalidateListener(() => this.activeMode.getOnce());
    }
    toDebugStringLive(): string {
        return this.quickPan.toDebugStringLive() ?? this.activeMode.live().toDebugStringLive();
    }
    getCanvasClassNameLive(): string | null {
        return this.quickPan.getCanvasClassNameLive();
    }
    getPreviewPositionLive(): Vector2 | null {
        return this.activeMode.live().getPreviewPositionLive();
    }
    isSidebarOpenLive(): boolean {
        return this.activeMode.live().type !== ModeType.Play;
    }
    requestSetActiveMode(modeType: ModeType) {
        if (this.quickPan.isKeyDown.getOnce()) {
            return;
        }
        this.activeMode.update((activeMode) => {
            if (runOnce(() => !activeMode.isIdleLive())) {
                return activeMode;
            }
            return initializeModeForType(modeType);
        });
    }
    onKeyDown(ctx: KeyboardEventContext) {
        const activeMode = this.activeMode.getOnce();
        if (runOnce(() => activeMode.isIdleLive())) {
            if (this.quickPan.onKeyDown(ctx)) {
                return;
            }

            if (this.quickPan.isKeyDown.getOnce()) {
                return;
            }

            for (const [type, key] of entries(keyForModeType)) {
                if (matchesKeyDown(ctx.event, key)) {
                    const newActiveMode = initializeModeForType(type);
                    ctx.splatapus.vfx.triggerAnimation(type);
                    this.activeMode.update(newActiveMode);
                    return;
                }
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true })) {
                ctx.splatapus.undoStack.update((undoStack) =>
                    UndoStack.undo(undoStack, ctx.splatapus.vfx),
                );
                return;
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true, shift: true })) {
                ctx.splatapus.undoStack.update((undoStack) =>
                    UndoStack.redo(undoStack, ctx.splatapus.vfx),
                );
                return;
            }
        }

        if (matchesKeyDown(ctx.event, { key: "0", command: true })) {
            ctx.splatapus.viewport.pan.update(Vector2.ZERO);
            ctx.splatapus.viewport.zoom.update(1);
            return;
        }

        for (let i = 0; i < 9; i++) {
            if (matchesKeyDown(ctx.event, `${i + 1}`)) {
                const keyPointId = [...ctx.splatapus.document.getOnce().keyPoints][i]?.id;
                if (keyPointId) {
                    ctx.splatapus.location.update((location) => ({ ...location, keyPointId }));
                    return;
                }
            }
        }
    }
    onKeyUp(ctx: KeyboardEventContext) {
        this.quickPan.onKeyUp(ctx);
    }
    onPointerEvent(_ctx: PointerEventContext) {
        const ctx = applyPointerEvent(this.multiTouchPan, _ctx);
        if (!ctx) {
            // multi-touch pan handled the event so we don't need to
            return;
        }

        if (this.quickPan.isKeyDown.getOnce()) {
            this.quickPan.onPointerEvent(ctx);
        } else {
            this.activeMode.getOnce().onPointerEvent(ctx);
        }
    }

    static Overlay = React.memo(function InteractionOverlay({
        splatapus,
    }: {
        splatapus: Splatapus;
    }) {
        const activeMode = useLive(() => splatapus.interaction.activeMode.live(), [splatapus]);
        return <>{activeMode.renderOverlay(splatapus)}</>;
    });
}
