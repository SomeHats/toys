import { Interaction } from "@/splatapus/editor/Interaction";
import { toolClassNames } from "@/splatapus/editor/toolClassNames";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { useEditorEvents, useEditorState } from "@/splatapus/editor/useEditorState";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";
import React, { ReactNode } from "react";

export const ModePicker = React.memo(function ModePicker() {
    return (
        <>
            <ModeButton toolType={ToolType.Draw}>draw</ModeButton>
            <ModeButton toolType={ToolType.Rig}>rig</ModeButton>
            <ModeButton toolType={ToolType.Play}>play</ModeButton>
        </>
    );
});

const ModeButton = function ModeButton({
    toolType,
    children,
}: {
    toolType: ToolType;
    children: ReactNode;
}) {
    const selectedToolType = useEditorState((state) => state.interaction.selectedTool.type);
    const { updateInteraction } = useEditorEvents();

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
};
