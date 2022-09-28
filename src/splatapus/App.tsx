import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LOAD_FROM_AUTOSAVE_ENABLED } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/model/store";
import { ModePicker } from "@/splatapus/ui/ModePicker";
import { DocumentRenderer } from "@/splatapus/renderer/DocumentRenderer";
import {
    EditorState,
    EditorStateProvider,
    useEditorEvents,
    useEditorKey,
} from "@/splatapus/editor/useEditorState";
import { Interaction } from "@/splatapus/editor/Interaction";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { RightBar } from "@/splatapus/ui/RightBar";
import { assertExists } from "@/lib/assert";
import { UiOverlayFrame } from "@/splatapus/ui/UiOverlayFrame";
import { ImportExportButtons } from "@/splatapus/ui/ImportExportButtons";
import { UndoRedoButtons } from "@/splatapus/ui/UndoRedoButtons";
import { DebugSettingsMenu } from "@/splatapus/DebugSettings";

function getInitialEditorState() {
    const screenSize = Vector2.UNIT;
    if (LOAD_FROM_AUTOSAVE_ENABLED) {
        const save = loadSaved("autosave", screenSize);
        if (save.isOk()) {
            return EditorState.initialize(save.value);
        }
        console.error(`Error loading autosave: ${save.error}`);
    }

    return EditorState.initialize(makeEmptySaveState(screenSize));
}

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none overflow-hidden">
            {size && (
                <EditorStateProvider size={size} initialize={getInitialEditorState}>
                    <Splatapus size={size} />
                </EditorStateProvider>
            )}
        </div>
    );
}

function Splatapus({ size }: { size: Vector2 }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        onKeyDown,
        onKeyUp,
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
    } = useEditorEvents();

    useEffect(() => {
        const canvas = assertExists(canvasRef.current);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            canvas.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [onKeyDown, onKeyUp, onWheel]);

    return (
        <>
            <div
                className="absolute inset-0"
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
            >
                <DocumentRenderer />
                <Interaction.Overlay />
            </div>
            <UiOverlayFrame
                topBarLeft={<ModePicker />}
                topBarRight={<ImportExportButtons />}
                rightBar={<RightBar />}
                bottomBarLeft={<UndoRedoButtons />}
                bottomBarRight={<DebugSettingsMenu />}
            />
            {process.env.NODE_ENV === "development" && <DebugInfo />}
            <Updater size={size} />
        </>
    );
}

const Updater = React.memo(function Updater({ size }: { size: Vector2 }) {
    const document = useEditorKey("document");
    const location = useEditorKey("location");
    const { updateViewport } = useEditorEvents();
    useEffect(() => {
        writeSavedDebounced("autosave", { document, location });
    }, [document, location]);

    const viewportSize = location.viewport.screenSize;
    useLayoutEffect(() => {
        if (viewportSize !== size) {
            updateViewport((ctx, viewport) => viewport.with({ screenSize: size }));
        }
    }, [size, updateViewport, viewportSize]);

    return null;
});

function DebugInfo() {
    const previewPosition = useEditorKey("previewPosition");
    const interaction = useEditorKey("interaction");
    return (
        <div className="pointer-events-none absolute top-14 left-3 text-xs">
            {PreviewPosition.toDebugString(previewPosition)} |{" "}
            {Interaction.toDebugString(interaction)}
        </div>
    );
}
