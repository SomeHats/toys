import { Interaction } from "@/splatapus/editor/Interaction";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { UpdateInteraction } from "@/splatapus/editor/useEditorState";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";

export function ModePicker({
    selectedToolType,
    updateInteraction,
}: {
    selectedToolType: ToolType;
    updateInteraction: UpdateInteraction;
}) {
    const onChangeTool = (tool: ToolType) => () =>
        updateInteraction((ctx, interaction) =>
            Interaction.requestSetSelectedTool(interaction, tool),
        );
    return (
        <>
            <Button
                onClick={onChangeTool(ToolType.Draw)}
                className={classNames(
                    selectedToolType === ToolType.Draw &&
                        "pointer-events-none bg-gradient-to-br from-fuchsia-500 to-violet-500 !text-white",
                )}
                disabled={selectedToolType === ToolType.Draw}
            >
                draw
            </Button>
            <Button
                onClick={onChangeTool(ToolType.Rig)}
                className={classNames(
                    selectedToolType === ToolType.Rig &&
                        "pointer-events-none bg-gradient-to-br from-lime-500 to-emerald-500 !text-white",
                )}
                disabled={selectedToolType === ToolType.Rig}
            >
                rig
            </Button>
        </>
    );
}
