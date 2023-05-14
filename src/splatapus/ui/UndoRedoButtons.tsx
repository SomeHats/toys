import { useLive } from "@/lib/live";
import { tailwindEasings } from "@/lib/theme";
import { UndoStack } from "@/splatapus/editor/UndoStack";
import { useVfxAnimation } from "@/splatapus/editor/Vfx";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";

export function UndoRedoButtons({ splatapus }: { splatapus: Splatapus }) {
    const canUndo = useLive(() => UndoStack.canUndo(splatapus.undoStack.live()), [splatapus]);
    const canRedo = useLive(() => UndoStack.canRedo(splatapus.undoStack.live()), [splatapus]);

    const undoAnimationRef = useVfxAnimation<HTMLDivElement>(splatapus.vfx, "undo", () => ({
        keyFrames: { transform: ["rotate(0)", "rotate(-360deg)"] },
        duration: 300,
        easing: tailwindEasings.DEFAULT,
    }));

    const redoAnimationRef = useVfxAnimation<HTMLDivElement>(splatapus.vfx, "redo", () => ({
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
                onClick={() =>
                    splatapus.undoStack.update((stack) => UndoStack.undo(stack, splatapus.vfx))
                }
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
                onClick={() =>
                    splatapus.undoStack.update((stack) => UndoStack.redo(stack, splatapus.vfx))
                }
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
