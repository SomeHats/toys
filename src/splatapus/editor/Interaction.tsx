import { assert, assertExists } from "@/lib/assert";
import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { applyUpdateWithin, exhaustiveSwitchError, UpdateAction } from "@/lib/utils";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { MultiTouchPan } from "@/splatapus/editor/MultiTouchPan";
import { DrawTool } from "@/splatapus/editor/tools/DrawTool";
import { RigTool } from "@/splatapus/editor/tools/RigTool";
import { KeyboardEventContext, PointerEventContext } from "@/splatapus/editor/lib/EventContext";
import { QuickPanTool } from "@/splatapus/editor/tools/QuickPanTool";
import { SelectedTool } from "@/splatapus/editor/tools/tools";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { PlayTool } from "@/splatapus/editor/tools/PlayTool";
import React from "react";
import { useEvent } from "@/lib/hooks/useEvent";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { useLive } from "@/lib/live";

export type Interaction = {
    multiTouchPan: MultiTouchPan;
    quickPanTool: QuickPanTool | null;
    selectedTool: SelectedTool;
};

export const Interaction = {
    initialize: (toolType: ToolType): Interaction => ({
        multiTouchPan: MultiTouchPan.initialize(),
        quickPanTool: null,
        selectedTool: SelectedTool.initialize(toolType),
    }),
    toDebugString: (interaction: Interaction): string => {
        if (interaction.quickPanTool) {
            return debugStateToString(
                interaction.quickPanTool.type,
                QuickPanTool.getDebugProperties(interaction.quickPanTool),
            );
        }
        return SelectedTool.toDebugString(interaction.selectedTool);
    },
    getCanvasClassName: (interaction: Interaction) => {
        if (interaction.quickPanTool) {
            return QuickPanTool.getCanvasClassName(interaction.quickPanTool);
        }
        return SelectedTool.getCanvasClassName(interaction.selectedTool);
    },
    getPreviewPosition: (
        interaction: Interaction,
        selectedShapeId: SplatShapeId,
    ): PreviewPosition | null => {
        return SelectedTool.getPreviewPosition(interaction.selectedTool, selectedShapeId);
    },
    isSidebarOpen: (interaction: Interaction): boolean => {
        return interaction.selectedTool.type !== ToolType.Play;
    },

    updateSelectedTool: (
        interaction: Interaction,
        update: UpdateAction<SelectedTool>,
    ): Interaction => applyUpdateWithin(interaction, "selectedTool", update),
    updateQuickPanTool: (
        interaction: Interaction,
        update: UpdateAction<QuickPanTool | null>,
    ): Interaction => applyUpdateWithin(interaction, "quickPanTool", update),

    requestSetSelectedTool: (interaction: Interaction, toolType: ToolType): Interaction => {
        if (interaction.quickPanTool || !SelectedTool.isIdle(interaction.selectedTool)) {
            return interaction;
        }
        return { ...interaction, selectedTool: SelectedTool.initialize(toolType) };
    },

    onKeyDown: (ctx: KeyboardEventContext, interaction: Interaction): Interaction => {
        if (SelectedTool.isIdle(interaction.selectedTool)) {
            if (!interaction.quickPanTool && matchesKeyDown(ctx.event, " ")) {
                return { ...interaction, quickPanTool: QuickPanTool.initialize() };
            }
            const activatedSelectedTool = SelectedTool.initializeForKeyDown(ctx);
            if (activatedSelectedTool && !interaction.quickPanTool) {
                ctx.splatapus.vfx.triggerAnimation(activatedSelectedTool.type);
                return { ...interaction, selectedTool: activatedSelectedTool };
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true })) {
                ctx.splatapus.undoStack.update((undoStack) =>
                    UndoStack.undo(undoStack, ctx.splatapus.vfx),
                );
                return interaction;
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true, shift: true })) {
                ctx.splatapus.undoStack.update((undoStack) =>
                    UndoStack.redo(undoStack, ctx.splatapus.vfx),
                );
                return interaction;
            }
        }

        if (matchesKeyDown(ctx.event, { key: "0", command: true })) {
            ctx.splatapus.viewport.state.update({ pan: Vector2.ZERO, zoom: 1 });
            return interaction;
        }
        const goToIdx = (idx: number) => {
            const keyPointId = [...ctx.splatapus.document.getWithoutListening().keyPoints][idx]?.id;
            if (keyPointId) {
                ctx.splatapus.location.update((location) => ({ ...location, keyPointId }));
            }
        };
        if (matchesKeyDown(ctx.event, "1")) {
            goToIdx(0);
        }
        if (matchesKeyDown(ctx.event, "2")) {
            goToIdx(1);
        }
        if (matchesKeyDown(ctx.event, "3")) {
            goToIdx(2);
        }
        if (matchesKeyDown(ctx.event, "4")) {
            goToIdx(3);
        }
        if (matchesKeyDown(ctx.event, "5")) {
            goToIdx(4);
        }
        if (matchesKeyDown(ctx.event, "6")) {
            goToIdx(5);
        }
        if (matchesKeyDown(ctx.event, "7")) {
            goToIdx(6);
        }
        if (matchesKeyDown(ctx.event, "8")) {
            goToIdx(7);
        }
        if (matchesKeyDown(ctx.event, "9")) {
            goToIdx(8);
        }

        return interaction;
    },
    onKeyUp: (ctx: KeyboardEventContext, interaction: Interaction): Interaction => {
        if (interaction.quickPanTool && matchesKey(ctx.event, " ")) {
            return { ...interaction, quickPanTool: null };
        }
        return interaction;
    },

    onPointerEvent: (_ctx: PointerEventContext, interaction: Interaction): Interaction => {
        const { pan, passthroughContext: ctx } = MultiTouchPan.onPointerEvent(
            _ctx,
            interaction.multiTouchPan,
        );
        if (pan !== interaction.multiTouchPan) {
            interaction = { ...interaction, multiTouchPan: pan };
        }
        if (!ctx) {
            return interaction;
        }

        if (interaction.quickPanTool) {
            return Interaction.updateQuickPanTool(interaction, (quickTool) =>
                QuickPanTool.onPointerEvent(ctx, assertExists(quickTool)),
            );
        }

        return Interaction.updateSelectedTool(interaction, (tool) =>
            SelectedTool.onPointerEvent(ctx, tool),
        );
    },

    Overlay: React.memo(function InteractionOverlay({ splatapus }: { splatapus: Splatapus }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onUpdateTool = useEvent((update: UpdateAction<any>) =>
            splatapus.interaction.update((interaction) => {
                return Interaction.updateSelectedTool(interaction, (selectedTool) => {
                    assert(selectedTool.type === interaction.selectedTool.type);
                    return update(selectedTool);
                });
            }),
        );

        const selectedTool = useLive(() => splatapus.interaction.live().selectedTool, [splatapus]);
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
    }),
};
