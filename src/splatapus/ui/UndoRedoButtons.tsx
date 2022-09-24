import { Button } from "@/splatapus/ui/Button";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { UpdateUndoStack } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";

export function UndoRedoButtons({
    undoStack,
    updateUndoStack,
}: {
    undoStack: UndoStack;
    updateUndoStack: UpdateUndoStack;
}) {
    return (
        <div className="pointer-events-none absolute bottom-2 left-3">
            <Button
                disabled={!UndoStack.canUndo(undoStack)}
                className={classNames(
                    "transition-all duration-300",
                    UndoStack.canUndo(undoStack)
                        ? "pointer-events-auto ease-out-back"
                        : UndoStack.canRedo(undoStack)
                        ? "opacity-50"
                        : "scale-0 opacity-0 ease-in-back",
                )}
                onClick={() => updateUndoStack((_, stack) => UndoStack.undo(stack))}
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
            >
                redo
            </Button>
        </div>
    );
}
