import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useEffect, useRef, useState } from "react";
import { LOAD_FROM_AUTOSAVE_ENABLED } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/model/store";
import { ModePicker } from "@/splatapus/ui/ModePicker";
import { DocumentRenderer } from "@/splatapus/renderer/DocumentRenderer";
import { Splatapus, useSplatapus } from "@/splatapus/editor/useEditor";
import { Interaction } from "@/splatapus/editor/Interaction";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { RightBar } from "@/splatapus/ui/RightBar";
import { assertExists } from "@/lib/assert";
import { UiOverlayFrame } from "@/splatapus/ui/UiOverlayFrame";
import { ImportExportButtons } from "@/splatapus/ui/ImportExportButtons";
import { UndoRedoButtons } from "@/splatapus/ui/UndoRedoButtons";
import { DebugSettingsMenu } from "@/splatapus/DebugSettings";
import { LiveEffect, runLive, useLive } from "@/lib/live";

function getInitialEditorState() {
    const screenSize = Vector2.UNIT;
    if (LOAD_FROM_AUTOSAVE_ENABLED) {
        const save = loadSaved("autosave");
        if (save.isOk()) {
            return save.value;
        }
        console.error(`Error loading autosave: ${save.error}`);
    }

    return makeEmptySaveState(screenSize);
}

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const splatapus = useSplatapus(getInitialEditorState);
    const size = useResizeObserver(container, (entry) => {
        const nextSize = sizeFromContentRect(entry);
        splatapus.screenSize.update(nextSize);
        return nextSize;
    });

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none overflow-hidden">
            {size && <AppMain splatapus={splatapus} />}
        </div>
    );
}

function AppMain({ splatapus }: { splatapus: Splatapus }) {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = assertExists(canvasRef.current);
        canvas.addEventListener("wheel", splatapus.onWheel, { passive: false });
        window.addEventListener("keydown", splatapus.onKeyDown);
        window.addEventListener("keyup", splatapus.onKeyUp);
        return () => {
            canvas.removeEventListener("wheel", splatapus.onWheel);
            window.removeEventListener("keydown", splatapus.onKeyDown);
            window.removeEventListener("keyup", splatapus.onKeyUp);
        };
    }, [splatapus]);

    useEffect(() => {
        return runLive(LiveEffect.idle, () => {
            writeSavedDebounced("autosave", {
                document: splatapus.document.live(),
                location: splatapus.location.state.live(),
            });
        });
    }, [splatapus]);

    return (
        <>
            <div
                className="absolute inset-0"
                ref={canvasRef}
                onPointerDown={splatapus.onPointerDown}
                onPointerMove={splatapus.onPointerMove}
                onPointerUp={splatapus.onPointerUp}
                onPointerCancel={splatapus.onPointerCancel}
            >
                <DocumentRenderer splatapus={splatapus} />
                <Interaction.Overlay splatapus={splatapus} />
            </div>
            <UiOverlayFrame
                topBarLeft={<ModePicker splatapus={splatapus} />}
                topBarRight={<ImportExportButtons splatapus={splatapus} />}
                rightBar={<RightBar splatapus={splatapus} />}
                bottomBarLeft={<UndoRedoButtons splatapus={splatapus} />}
                bottomBarRight={<DebugSettingsMenu />}
                splatapus={splatapus}
            />
            {process.env.NODE_ENV === "development" && <DebugInfo splatapus={splatapus} />}
        </>
    );
}

function DebugInfo({ splatapus }: { splatapus: Splatapus }) {
    return (
        <div className="pointer-events-none absolute top-14 left-3 text-xs">
            {useLive(
                () => PreviewPosition.toDebugString(splatapus.previewPosition.live()),
                [splatapus],
            )}
            <br />
            {useLive(() => splatapus.interaction.toDebugStringLive(), [splatapus])}
        </div>
    );
}
