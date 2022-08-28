import Vector2 from "@/lib/geom/Vector2";
import { sizeFromEntry, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useCallback, useEffect, useMemo, useState } from "react";
import { applyUpdate, UpdateAction } from "@/lib/utils";
import classNames from "classnames";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { LOAD_FROM_AUTOSAVE_ENABLED } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/store";
import { useEvent } from "@/lib/hooks/useEvent";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { Toolbar } from "@/splatapus/Toolbar";
import { DocumentRenderer } from "@/splatapus/renderer/DocumentRenderer";
import { EditorState, useEditorState } from "@/splatapus/useEditorState";
import { Interaction } from "@/splatapus/Interaction";

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromEntry);
    console.log(size);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none">
            {size && <Splatapus size={size} />}
        </div>
    );
}

function Splatapus({ size }: { size: Vector2 }) {
    const {
        document,
        location,
        interaction,
        updateDocument,
        updateLocation,
        updateInteraction,
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
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [onKeyDown, onKeyUp, onWheel]);

    // const toolRenderProps: ToolRenderProps<Tool["state"]> = {
    //     viewport,
    //     document,
    //     location,
    //     updateTool,
    //     state: tool.state,
    // };
    // const ToolSceneSvgComponent = tool.getSceneSvgComponent() as ToolRenderComponent<Tool["state"]>;
    // const ToolScreenSvgComponent = tool.getScreenSvgComponent() as ToolRenderComponent<
    //     Tool["state"]
    // >;
    // const ToolScreenHtmlComponent = tool.getScreenHtmlComponent() as ToolRenderComponent<
    //     Tool["state"]
    // >;

    return (
        <>
            <div className="pointer-events-none absolute top-0">
                {Interaction.toDebugString(interaction)}
            </div>
            <div
                className="absolute inset-0"
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
                            keyPointId={location.keyPointId}
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
            <Toolbar
                selectedToolType={interaction.selectedTool.type}
                updateInteraction={updateInteraction}
            />
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-3 p-3">
                <div className="flex min-w-0 flex-auto items-center justify-center gap-3">
                    {Array.from(document.keyPoints, (keyPoint, i) => (
                        <button
                            key={keyPoint.id}
                            className={classNames(
                                "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
                                keyPoint.id === location.keyPointId
                                    ? "text-stone-500 ring-2 ring-inset ring-purple-400"
                                    : "text-stone-400",
                            )}
                            onClick={() => {
                                updateLocation((ctx, location) =>
                                    location.with({ keyPointId: keyPoint.id }),
                                );
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className={classNames(
                            "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
                        )}
                        onClick={() => {
                            const keyPointId = SplatKeypointId.generate();
                            updateDocument((ctx, document) => document.addKeyPoint(keyPointId), {
                                lockstepLocation: (location) => location.with({ keyPointId }),
                            });
                        }}
                    >
                        +
                    </button>
                </div>
                <button
                    className={classNames(
                        "absolute right-3 flex h-10 flex-none items-center justify-center justify-self-end rounded-full border border-stone-200 px-3 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
                    )}
                    onClick={() => {
                        const { doc, location } = makeEmptySaveState();
                        updateDocument(() => doc, { lockstepLocation: location });
                    }}
                >
                    reset
                </button>
            </div>
        </>
    );
}
