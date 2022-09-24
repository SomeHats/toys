import { Interaction } from "@/splatapus/editor/Interaction";
import { toolClassNames } from "@/splatapus/editor/toolClassNames";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { UpdateInteraction } from "@/splatapus/editor/useEditorState";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";
import { ReactNode } from "react";

export function ModePicker({
    selectedToolType,
    updateInteraction,
}: {
    selectedToolType: ToolType;
    updateInteraction: UpdateInteraction;
}) {
    return (
        <>
            <ModeButton
                selectedToolType={selectedToolType}
                updateInteraction={updateInteraction}
                toolType={ToolType.Draw}
            >
                draw
            </ModeButton>
            <ModeButton
                selectedToolType={selectedToolType}
                updateInteraction={updateInteraction}
                toolType={ToolType.Rig}
            >
                rig
            </ModeButton>
            <ModeButton
                selectedToolType={selectedToolType}
                updateInteraction={updateInteraction}
                toolType={ToolType.Play}
            >
                play
            </ModeButton>
        </>
    );
}

function ModeButton({
    selectedToolType,
    updateInteraction,
    toolType,
    children,
}: {
    selectedToolType: ToolType;
    updateInteraction: UpdateInteraction;
    toolType: ToolType;
    children: ReactNode;
}) {
    const isActive = selectedToolType === toolType;
    return (
        <Button
            onClick={() =>
                updateInteraction((ctx, interaction) =>
                    Interaction.requestSetSelectedTool(interaction, toolType),
                )
            }
            className={classNames(
                isActive &&
                    `pointer-events-none bg-gradient-to-br ${toolClassNames[toolType].gradient500} !text-white`,
            )}
            disabled={isActive}
        >
            {children}
        </Button>
    );
}
