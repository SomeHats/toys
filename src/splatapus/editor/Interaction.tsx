import { assert } from "@/lib/assert";
import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { exhaustiveSwitchError, UpdateAction } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { MultiTouchPan } from "@/splatapus/editor/MultiTouchPan";
import { DrawTool } from "@/splatapus/editor/tools/DrawTool";
import { RigTool } from "@/splatapus/editor/tools/RigTool";
import {
    applyPointerEvent,
    KeyboardEventContext,
    PointerEventContext,
} from "@/splatapus/editor/lib/EventContext";
import { QuickPanTool } from "@/splatapus/editor/tools/QuickPanTool";
import { SelectedTool } from "@/splatapus/editor/tools/tools";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { PlayTool } from "@/splatapus/editor/tools/PlayTool";
import React from "react";
import { useEvent } from "@/lib/hooks/useEvent";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { LiveValue, useLive } from "@/lib/live";

export class Interaction {
    private readonly multiTouchPan = new MultiTouchPan();
    readonly quickPanTool = new LiveValue<QuickPanTool | null>(null);
    readonly selectedTool: LiveValue<SelectedTool>;

    constructor(toolType: ToolType) {
        this.selectedTool = new LiveValue(SelectedTool.initialize(toolType));

        // hack: force evaluation of effects
        this.quickPanTool.addBatchInvalidateListener(() => this.quickPanTool.getWithoutListening());
        this.selectedTool.addBatchInvalidateListener(() => this.selectedTool.getWithoutListening());
    }
    toDebugStringLive(): string {
        const quickPanTool = this.quickPanTool.live();
        if (quickPanTool) {
            return debugStateToString(
                quickPanTool.type,
                QuickPanTool.getDebugProperties(quickPanTool),
            );
        }
        return SelectedTool.toDebugString(this.selectedTool.live());
    }
    getCanvasClassNameLive(): string {
        const quickPanTool = this.quickPanTool.live();
        if (quickPanTool) {
            return QuickPanTool.getCanvasClassName(quickPanTool);
        }
        return SelectedTool.getCanvasClassName(this.selectedTool.live());
    }
    getPreviewPositionLive(selectedShapeId: SplatShapeId): PreviewPosition | null {
        return SelectedTool.getPreviewPosition(this.selectedTool.live(), selectedShapeId);
    }
    isSidebarOpenLive(): boolean {
        return this.selectedTool.live().type !== ToolType.Play;
    }
    requestSetSelectedTool(toolType: ToolType) {
        this.selectedTool.update((selectedTool) => {
            if (this.quickPanTool.getWithoutListening() || !SelectedTool.isIdle(selectedTool)) {
                return selectedTool;
            }
            return SelectedTool.initialize(toolType);
        });
    }
    onKeyDown(ctx: KeyboardEventContext) {
        const selectedTool = this.selectedTool.getWithoutListening();
        const quickPanTool = this.quickPanTool.getWithoutListening();
        if (SelectedTool.isIdle(selectedTool)) {
            if (!quickPanTool && matchesKeyDown(ctx.event, " ")) {
                this.quickPanTool.update(QuickPanTool.initialize());
                return;
            }

            const activatedSelectedTool = SelectedTool.initializeForKeyDown(ctx);
            if (activatedSelectedTool && !quickPanTool) {
                ctx.splatapus.vfx.triggerAnimation(activatedSelectedTool.type);
                this.selectedTool.update(activatedSelectedTool);
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
            ctx.splatapus.viewport.state.update({ pan: Vector2.ZERO, zoom: 1 });
            return;
        }

        for (let i = 0; i < 9; i++) {
            if (matchesKeyDown(ctx.event, `${i + 1}`)) {
                const keyPointId = [...ctx.splatapus.document.getWithoutListening().keyPoints][i]
                    ?.id;
                if (keyPointId) {
                    ctx.splatapus.location.update((location) => ({ ...location, keyPointId }));
                    return;
                }
            }
        }
    }
    onKeyUp(ctx: KeyboardEventContext) {
        const quickPanTool = this.quickPanTool.getWithoutListening();
        if (quickPanTool && matchesKey(ctx.event, " ")) {
            this.quickPanTool.update(null);
            return;
        }
    }
    onPointerEvent(_ctx: PointerEventContext) {
        const ctx = applyPointerEvent(this.multiTouchPan, _ctx);
        if (!ctx) {
            // multi-touch pan handled the event so we don't need to
            return;
        }

        const quickPanTool = this.quickPanTool.getWithoutListening();
        if (quickPanTool) {
            console.log(ctx.eventType, { quickPanTool });
            this.quickPanTool.update(QuickPanTool.onPointerEvent(ctx, quickPanTool));
        } else {
            this.selectedTool.update((tool) => SelectedTool.onPointerEvent(ctx, tool));
        }
    }

    static Overlay = React.memo(function InteractionOverlay({
        splatapus,
    }: {
        splatapus: Splatapus;
    }) {
        const selectedTool = useLive(() => splatapus.interaction.selectedTool.live(), [splatapus]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onUpdateTool = useEvent((update: UpdateAction<any>) =>
            splatapus.interaction.selectedTool.update((tool) => {
                assert(tool.type === selectedTool.type);
                return update(tool);
            }),
        );

        switch (selectedTool.type) {
            case ToolType.Draw:
                return (
                    <DrawTool.Overlay
                        tool={selectedTool}
                        onUpdateTool={onUpdateTool}
                        splatapus={splatapus}
                    />
                );
            case ToolType.Rig:
                return (
                    <RigTool.Overlay
                        tool={selectedTool}
                        onUpdateTool={onUpdateTool}
                        splatapus={splatapus}
                    />
                );
            case ToolType.Play:
                return (
                    <PlayTool.Overlay
                        tool={selectedTool}
                        onUpdateTool={onUpdateTool}
                        splatapus={splatapus}
                    />
                );
            default:
                exhaustiveSwitchError(selectedTool);
        }
    });
}
