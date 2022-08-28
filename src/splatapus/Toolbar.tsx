import { Interaction } from "@/splatapus/Interaction";
import { ToolType } from "@/splatapus/tools/ToolType";
import { CtxAction } from "@/splatapus/useEditorState";
import classNames from "classnames";
import { MouseEventHandler } from "react";

export function Toolbar({
    selectedToolType,
    updateInteraction,
}: {
    selectedToolType: ToolType;
    updateInteraction: (update: CtxAction<Interaction>) => void;
}) {
    const onChangeTool = (tool: ToolType) => () =>
        updateInteraction((ctx, interaction) =>
            Interaction.requestSetSelectedTool(interaction, tool),
        );
    return (
        <div className="pointer-events-none absolute top-0 bottom-0 flex cursor-wait flex-col items-center justify-center gap-3 p-3">
            <ToolbarButton
                letter="d"
                isSelected={selectedToolType === ToolType.Draw}
                onClick={onChangeTool(ToolType.Draw)}
            />
            <ToolbarButton
                letter="k"
                isSelected={selectedToolType === ToolType.KeyPoint}
                onClick={onChangeTool(ToolType.KeyPoint)}
            />
        </div>
    );
}

function ToolbarButton({
    letter,
    onClick,
    isSelected,
}: {
    letter: string;
    onClick?: MouseEventHandler;
    isSelected: boolean;
}) {
    return (
        <button
            className={classNames(
                "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white shadow-md",
                isSelected ? "text-stone-500 ring-2 ring-inset ring-purple-400" : "text-stone-400",
            )}
            onClick={onClick}
        >
            {letter}
        </button>
    );
}
