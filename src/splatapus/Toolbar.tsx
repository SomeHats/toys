import { MouseEventHandler } from "react";

export function Toolbar() {
    return (
        <div className="pointer-events-none absolute top-0 bottom-0 flex cursor-wait flex-col items-center justify-center gap-3 p-3">
            <ToolbarButton letter="d" />
            <ToolbarButton letter="k" />
        </div>
    );
}

function ToolbarButton({ letter, onClick }: { letter: string; onClick?: MouseEventHandler }) {
    return (
        <button className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 shadow-md">
            {letter}
        </button>
    );
}
