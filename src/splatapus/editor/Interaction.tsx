import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { exhaustiveSwitchError, UpdateAction } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { MultiTouchPan } from "@/splatapus/editor/MultiTouchPan";
import { DrawMode } from "@/splatapus/editor/modes/DrawMode";
import { RigMode } from "@/splatapus/editor/modes/RigMode";
import {
    applyPointerEvent,
    KeyboardEventContext,
    PointerEventContext,
} from "@/splatapus/editor/lib/EventContext";
import { QuickPan } from "@/splatapus/editor/QuickPan";
import { SelectedMode } from "@/splatapus/editor/modes/modes";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { PlayMode } from "@/splatapus/editor/modes/PlayMode";
import React from "react";
import { useEvent } from "@/lib/hooks/useEvent";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { LiveValue, useLive } from "@/lib/live";

export class Interaction {
    private readonly multiTouchPan = new MultiTouchPan();
    readonly quickPan = new QuickPan();
    readonly activeMode: LiveValue<SelectedMode>;

    constructor(modeType: ModeType) {
        this.activeMode = new LiveValue(SelectedMode.initialize(modeType));

        // hack: force evaluation of effects
        this.activeMode.addBatchInvalidateListener(() => this.activeMode.getOnce());
    }
    toDebugStringLive(): string {
        return (
            this.quickPan.toDebugStringLive() ?? SelectedMode.toDebugString(this.activeMode.live())
        );
    }
    getCanvasClassNameLive(): string | null {
        return (
            this.quickPan.getCanvasClassNameLive() ??
            SelectedMode.getCanvasClassName(this.activeMode.live())
        );
    }
    getPreviewPositionLive(selectedShapeId: SplatShapeId): PreviewPosition | null {
        return SelectedMode.getPreviewPosition(this.activeMode.live(), selectedShapeId);
    }
    isSidebarOpenLive(): boolean {
        return this.activeMode.live().type !== ModeType.Play;
    }
    requestSetActiveMode(modeType: ModeType) {
        if (this.quickPan.isKeyDown.getOnce()) {
            return;
        }
        this.activeMode.update((activeMode) => {
            if (!SelectedMode.isIdle(activeMode)) {
                return activeMode;
            }
            return SelectedMode.initialize(modeType);
        });
    }
    onKeyDown(ctx: KeyboardEventContext) {
        const activeMode = this.activeMode.getOnce();
        if (SelectedMode.isIdle(activeMode)) {
            if (this.quickPan.onKeyDown(ctx)) {
                return;
            }

            if (this.quickPan.isKeyDown.getOnce()) {
                return;
            }

            const newActiveMode = SelectedMode.initializeForKeyDown(ctx);
            if (newActiveMode) {
                ctx.splatapus.vfx.triggerAnimation(newActiveMode.type);
                this.activeMode.update(newActiveMode);
                return;
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
            this.activeMode.update((mode) => SelectedMode.onPointerEvent(ctx, mode));
        }
    }

    static Overlay = React.memo(function InteractionOverlay({
        splatapus,
    }: {
        splatapus: Splatapus;
    }) {
        const activeMode = useLive(() => splatapus.interaction.activeMode.live(), [splatapus]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onUpdateMode = useEvent((update: UpdateAction<any>) =>
            splatapus.interaction.activeMode.update((mode) => {
                assert(mode.type === activeMode.type);
                return update(mode);
            }),
        );

        switch (activeMode.type) {
            case ModeType.Draw:
                return (
                    <DrawMode.Overlay
                        mode={activeMode}
                        onUpdateMode={onUpdateMode}
                        splatapus={splatapus}
                    />
                );
            case ModeType.Rig:
                return (
                    <RigMode.Overlay
                        mode={activeMode}
                        onUpdateMode={onUpdateMode}
                        splatapus={splatapus}
                    />
                );
            case ModeType.Play:
                return (
                    <PlayMode.Overlay
                        mode={activeMode}
                        onUpdateMode={onUpdateMode}
                        splatapus={splatapus}
                    />
                );
            default:
                exhaustiveSwitchError(activeMode);
        }
    });
}
