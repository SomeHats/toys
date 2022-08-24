import { DrawTool } from "@/splatapus/tools/DrawTool";
import { KeypointTool } from "@/splatapus/tools/KeypointTool";
import { StandardTool, Tool } from "@/splatapus/tools/Tool";
import classNames from "classnames";
import { MouseEventHandler } from "react";

export function Toolbar({
    tool,
    onSelectTool,
}: {
    tool: Tool;
    onSelectTool: (tool: StandardTool) => void;
}) {
    const selectedTool = tool.getSelected();
    return (
        <div className="pointer-events-none absolute top-0 bottom-0 flex cursor-wait flex-col items-center justify-center gap-3 p-3">
            <ToolbarButton
                letter="d"
                isSelected={selectedTool.name === "draw"}
                onClick={() => onSelectTool(new DrawTool({ type: "idle" }))}
            />
            <ToolbarButton
                letter="k"
                isSelected={selectedTool.name === "keypoint"}
                onClick={() => onSelectTool(new KeypointTool({ type: "idle" }))}
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
                "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 shadow-md",
                isSelected ? "text-stone-500 ring-2 ring-inset ring-purple-400" : "text-stone-400",
            )}
            onClick={onClick}
        >
            {letter}
        </button>
    );
}
