import { Button } from "@/splatapus/ui/Button";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { useEditorEvents, useEditorState } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { useVfxAnimation } from "@/splatapus/editor/Vfx";
import { tailwindEasings } from "@/lib/theme";

export function UndoRedoButtons() {
    const canUndo = useEditorState(({ undoStack }) => UndoStack.canUndo(undoStack));
    const canRedo = useEditorState(({ undoStack }) => UndoStack.canRedo(undoStack));
    const { updateUndoStack } = useEditorEvents();

    const undoAnimationRef = useVfxAnimation<HTMLDivElement>("undo", () => ({
        keyFrames: { transform: ["rotate(0)", "rotate(-360deg)"] },
        duration: 300,
        easing: tailwindEasings.DEFAULT,
    }));

    const redoAnimationRef = useVfxAnimation<HTMLDivElement>("redo", () => ({
        keyFrames: { transform: ["rotate(0)", "rotate(360deg)"] },
        duration: 300,
        easing: tailwindEasings.DEFAULT,
    }));

    return (
        <div className="pointer-events-auto pb-2 pl-3">
            <Button
                disabled={!canUndo}
                className={classNames(
                    "transition-all duration-300",
                    canUndo
                        ? "pointer-events-auto ease-out-back"
                        : canRedo
                        ? "pointer-events-none opacity-50"
                        : "pointer-events-none scale-0 opacity-0 ease-in-back",
                )}
                onClick={() => updateUndoStack((ctx, stack) => UndoStack.undo(stack, ctx.vfx))}
                iconLeft={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        ref={undoAnimationRef}
                    >
                        <FaUndoAlt size={12} />
                    </div>
                }
            >
                undo
            </Button>
            <Button
                disabled={!canRedo}
                className={classNames(
                    "transition-all duration-300",
                    canRedo
                        ? "pointer-events-auto ease-out-back-md"
                        : "scale-0 opacity-0 ease-in-back-md",
                )}
                onClick={() => updateUndoStack((ctx, stack) => UndoStack.redo(stack, ctx.vfx))}
                iconRight={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        ref={redoAnimationRef}
                    >
                        <FaRedoAlt size={12} />
                    </div>
                }
            >
                redo
            </Button>
        </div>
    );
}
