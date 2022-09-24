import Vector2 from "@/lib/geom/Vector2";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyUpdate, UpdateAction } from "@/lib/utils";
import classNames from "classnames";
import { LOAD_FROM_AUTOSAVE_ENABLED } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/model/store";
import { useEvent } from "@/lib/hooks/useEvent";
import { Viewport, ViewportState } from "@/splatapus/editor/Viewport";
import { Toolbar } from "@/splatapus/ui/Toolbar";
import { DocumentRenderer } from "@/splatapus/renderer/DocumentRenderer";
import { EditorState, useEditorState } from "@/splatapus/editor/useEditorState";
import { Interaction } from "@/splatapus/editor/Interaction";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { RightBar } from "@/splatapus/ui/RightBar";
import { assertExists } from "@/lib/assert";
import { Button } from "@/splatapus/ui/Button";
import { UiOverlayFrame } from "@/splatapus/ui/UiOverlayFrame";
import { ImportExportButtons } from "@/splatapus/ui/ImportExportButtons";
import { UndoRedoButtons } from "@/splatapus/ui/UndoRedoButtons";

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none">
            {size && <Splatapus size={size} />}
        </div>
    );
}

function Splatapus({ size }: { size: Vector2 }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        document,
        location,
        interaction,
        previewPosition,
        undoStack,
        updateDocument,
        updateLocation,
        updateInteraction,
        updateUndoStack,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onKeyDown,
        onKeyUp,
    } = useEditorState(
        () => {
            if (LOAD_FROM_AUTOSAVE_ENABLED) {
                const save = loadSaved("autosave");
                if (save.isOk()) {
                    return EditorState.initialize(save.value);
                }
                console.error(`Error loading autosave: ${save.error}`);
            }

            return EditorState.initialize(makeEmptySaveState());
        },
        () => ({
            viewport,
        }),
    );

    useEffect(() => {
        writeSavedDebounced("autosave", { doc: document, location });
    }, [document, location]);

    const updateViewport = useCallback(
        (update: UpdateAction<ViewportState>) =>
            updateLocation((ctx, location) =>
                location.with({ viewport: applyUpdate(location.viewportState, update) }),
            ),
        [updateLocation],
    );
    const viewport = useMemo(
        () => new Viewport(location.viewportState, size, updateViewport),
        [location.viewportState, size, updateViewport],
    );

    useEffect(() => {
        const toolType = interaction.selectedTool.type;
        updateLocation((ctx, location) => {
            if (location.tool !== toolType) {
                return location.with({ tool: toolType });
            }
            return location;
        });
    }, [interaction.selectedTool.type, updateLocation]);

    const onWheel = useEvent((event: WheelEvent) => viewport.handleWheelEvent(event));

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
            <div className="pointer-events-none absolute top-0">
                {PreviewPosition.toDebugString(previewPosition)} |{" "}
                {Interaction.toDebugString(interaction)}
            </div>
            <div
                className="absolute inset-0"
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
            >
                <svg
                    viewBox={`0 0 ${size.x} ${size.y}`}
                    className={classNames(
                        "absolute top-0 left-0",
                        Interaction.getCanvasClassName(interaction),
                    )}
                >
                    <g transform={viewport.getSceneTransform()}>
                        <DocumentRenderer
                            document={document}
                            previewPosition={previewPosition}
                            interaction={interaction}
                        />
                    </g>
                </svg>
                <Interaction.Overlay
                    interaction={interaction}
                    viewport={viewport}
                    document={document}
                    location={location}
                    onUpdateInteraction={updateInteraction}
                />
            </div>
            <UiOverlayFrame
                size={size}
                topBarLeft={
                    <>
                        <Button>draw</Button>
                        <Button>rig</Button>
                    </>
                }
                topBarRight={
                    <ImportExportButtons updateDocument={updateDocument} document={document} />
                }
                leftBar={
                    <Toolbar
                        selectedToolType={interaction.selectedTool.type}
                        updateInteraction={updateInteraction}
                    />
                }
                rightBar={
                    <RightBar
                        document={document}
                        location={location}
                        updateDocument={updateDocument}
                        updateLocation={updateLocation}
                    />
                }
            />
            <UndoRedoButtons undoStack={undoStack} updateUndoStack={updateUndoStack} />
        </>
    );
}
