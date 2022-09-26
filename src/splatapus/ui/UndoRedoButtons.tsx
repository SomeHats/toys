import { Button } from "@/splatapus/ui/Button";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { useEditorEvents, useEditorState } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";

export function UndoRedoButtons() {
    const canUndo = useEditorState(({ undoStack }) => UndoStack.canUndo(undoStack));
    const canRedo = useEditorState(({ undoStack }) => UndoStack.canRedo(undoStack));
    const opCounts = useEditorState(({ undoStack }) => undoStack);
    const { updateUndoStack } = useEditorEvents();
    return (
        <div className="absolute bottom-2 left-3">
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
                onClick={() => updateUndoStack((_, stack) => UndoStack.undo(stack))}
                iconLeft={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        style={{ transform: `rotate(${-opCounts.undoOpCount}turn)` }}
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
                onClick={() => updateUndoStack((_, stack) => UndoStack.redo(stack))}
                iconRight={
                    <div
                        className="mt-[2px] h-3 w-3 transition-transform duration-300 ease-in-out"
                        style={{ transform: `rotate(${opCounts.redoOpCount}turn)` }}
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
