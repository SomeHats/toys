import { Button } from "@/splatapus/ui/Button";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { UpdateUndoStack } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";

export function UndoRedoButtons({
    undoStack,
    updateUndoStack,
}: {
    undoStack: UndoStack;
    updateUndoStack: UpdateUndoStack;
}) {
    return (
        <div className="absolute bottom-2 left-3">
            <Button
                disabled={!UndoStack.canUndo(undoStack)}
                className={classNames(
                    "transition-all duration-300",
                    UndoStack.canUndo(undoStack)
                        ? "pointer-events-auto ease-out-back"
                        : UndoStack.canRedo(undoStack)
                        ? "pointer-events-none opacity-50"
                        : "pointer-events-none scale-0 opacity-0 ease-in-back",
                )}
                onClick={() => updateUndoStack((_, stack) => UndoStack.undo(stack))}
                iconLeft={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        style={{ transform: `rotate(${-undoStack.undoOpCount}turn)` }}
                    >
                        <FaUndoAlt size={12} />
                    </div>
                }
            >
                undo
            </Button>
            <Button
                disabled={!UndoStack.canRedo(undoStack)}
                className={classNames(
                    "transition-all duration-300",
                    UndoStack.canRedo(undoStack)
                        ? "pointer-events-auto ease-out-back-md"
                        : "scale-0 opacity-0 ease-in-back-md",
                )}
                onClick={() => updateUndoStack((_, stack) => UndoStack.redo(stack))}
                iconRight={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        style={{ transform: `rotate(${undoStack.redoOpCount}turn)` }}
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
