import { assert, assertExists } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { applyUpdateWithin, exhaustiveSwitchError, UpdateAction } from "@/lib/utils";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { DrawTool } from "@/splatapus/tools/DrawTool";
import { KeyPointTool } from "@/splatapus/tools/KeyPointTool";
import { OverlayProps } from "@/splatapus/tools/lib/createTool";
import { KeyboardEventContext, PointerEventContext } from "@/splatapus/tools/lib/EventContext";
import { QuickTool, SelectedTool } from "@/splatapus/tools/tools";
import { ToolType } from "@/splatapus/tools/ToolType";
import { UndoStack } from "@/splatapus/UndoStack";
import { CtxAction } from "@/splatapus/useEditorState";
import { Viewport } from "@/splatapus/Viewport";

export type Interaction = {
    quickTool: QuickTool | null;
    selectedTool: SelectedTool;
};

export const Interaction = {
    initialize: (toolType: ToolType): Interaction => ({
        quickTool: null,
        selectedTool: SelectedTool.initialize(toolType),
    }),
    toDebugString: (interaction: Interaction): string => {
        if (interaction.quickTool) {
            return QuickTool.toDebugString(interaction.quickTool);
        }
        return SelectedTool.toDebugString(interaction.selectedTool);
    },
    getCanvasClassName: (interaction: Interaction) => {
        if (interaction.quickTool) {
            return QuickTool.getCanvasClassName(interaction.quickTool);
        }
        return SelectedTool.getCanvasClassName(interaction.selectedTool);
    },

    updateSelectedTool: (
        interaction: Interaction,
        update: UpdateAction<SelectedTool>,
    ): Interaction => applyUpdateWithin(interaction, "selectedTool", update),
    updateQuickTool: (
        interaction: Interaction,
        update: UpdateAction<QuickTool | null>,
    ): Interaction => applyUpdateWithin(interaction, "quickTool", update),

    requestSetSelectedTool: (interaction: Interaction, toolType: ToolType): Interaction => {
        if (interaction.quickTool || !SelectedTool.isIdle(interaction.selectedTool)) {
            return interaction;
        }
        return { ...interaction, selectedTool: SelectedTool.initialize(toolType) };
    },

    onKeyDown: (ctx: KeyboardEventContext, interaction: Interaction): Interaction => {
        if (SelectedTool.isIdle(interaction.selectedTool)) {
            if (!interaction.quickTool) {
                const activatedQuickTool = QuickTool.initializeForKeyDown(ctx);
                if (activatedQuickTool) {
                    return { ...interaction, quickTool: activatedQuickTool };
                }
            }
            const activatedSelectedTool = SelectedTool.initializeForKeyDown(ctx);
            if (activatedSelectedTool && !interaction.quickTool) {
                return { ...interaction, selectedTool: activatedSelectedTool };
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true })) {
                ctx.updateUndoStack((undoStack) => UndoStack.undo(undoStack));
                return interaction;
            }
            if (matchesKeyDown(ctx.event, { key: "z", command: true, shift: true })) {
                ctx.updateUndoStack((undoStack) => UndoStack.redo(undoStack));
                return interaction;
            }
        }

        if (matchesKeyDown(ctx.event, { key: "0", command: true })) {
            ctx.updateViewport({ pan: Vector2.ZERO, zoom: 1 });
            return interaction;
        }

        return interaction;
    },
    onKeyUp: (ctx: KeyboardEventContext, interaction: Interaction): Interaction => {
        if (interaction.quickTool) {
            const nextQuickTool = QuickTool.onKeyUp(ctx, interaction.quickTool);
            if (nextQuickTool !== interaction.quickTool) {
                return { ...interaction, quickTool: nextQuickTool };
            }
        }
        return interaction;
    },

    onPointerEvent: (ctx: PointerEventContext, interaction: Interaction): Interaction => {
        if (interaction.quickTool) {
            return Interaction.updateQuickTool(interaction, (quickTool) =>
                QuickTool.onPointerEvent(ctx, assertExists(quickTool)),
            );
        }

        return Interaction.updateSelectedTool(interaction, (tool) =>
            SelectedTool.onPointerEvent(ctx, tool),
        );
    },

    Overlay: ({
        interaction,
        onUpdateInteraction,
        ...props
    }: {
        document: SplatDocModel;
        location: SplatLocation;
        viewport: Viewport;
        interaction: Interaction;
        onUpdateInteraction: (update: CtxAction<Interaction>) => void;
    }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onUpdateTool = (update: CtxAction<any>) =>
            onUpdateInteraction((ctx, interaction) => {
                return Interaction.updateSelectedTool(interaction, (selectedTool) => {
                    assert(selectedTool.type === interaction.selectedTool.type);
                    return update(ctx, selectedTool);
                });
            });

        switch (interaction.selectedTool.type) {
            case ToolType.Draw:
                return (
                    <DrawTool.Overlay
                        tool={interaction.selectedTool}
                        onUpdateTool={onUpdateTool}
                        {...props}
                    />
                );
            case ToolType.KeyPoint:
                return (
                    <KeyPointTool.Overlay
                        tool={interaction.selectedTool}
                        onUpdateTool={onUpdateTool}
                        {...props}
                    />
                );
            default:
                exhaustiveSwitchError(interaction.selectedTool);
        }
    },
};
