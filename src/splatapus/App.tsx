import Vector2 from "@/lib/geom/Vector2";
import { sizeFromEntry, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { applyUpdate, UpdateAction } from "@/lib/utils";
import classNames from "classnames";
import { useUndoStack } from "@/splatapus/useUndoStack";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { LOAD_FROM_AUTOSAVE_ENABLED, perfectFreehandOpts } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/store";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { useEvent } from "@/lib/hooks/useEvent";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { Toolbar } from "@/splatapus/Toolbar";
import { Tool, useTool } from "@/splatapus/tools/Tool";
import { DocumentRenderer } from "@/splatapus/renderer/DocumentRenderer";
import { ToolRenderComponent, ToolRenderProps } from "@/splatapus/tools/AbstractTool";

if (import.meta.hot) {
    import.meta.hot.accept(() => window.location.reload());
}

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
    const { document, location, updateDocument, updateLocation, undo, redo } = useUndoStack<
        SplatDocModel,
        SplatLocation
    >(() => {
        if (LOAD_FROM_AUTOSAVE_ENABLED) {
            const save = loadSaved("autosave");
            if (save.isOk()) {
                return save.value;
            }
            console.error(`Error loading autosave: ${save.error}`);
        }

        return makeEmptySaveState();
    });
    useEffect(() => {
        writeSavedDebounced("autosave", { doc: document, location });
    }, [document, location]);

    const updateViewport = useCallback(
        (update: UpdateAction<ViewportState>) =>
            updateLocation((location) =>
                location.with({ viewport: applyUpdate(location.viewportState, update) }),
            ),
        [updateLocation],
    );
    const viewport = useMemo(
        () => new Viewport(location.viewportState, size, updateViewport),
        [location.viewportState, size, updateViewport],
    );

    const {
        tool,
        events: toolEvents,
        updateTool,
    } = useTool(location.tool, (event) => ({
        event,
        viewport,
        document,
        location,
        updateDocument,
        updateLocation,
        updateViewport,
        undo,
        redo,
    }));
    useEffect(() => {
        const toolName = tool.getSelected().name;
        updateLocation((location) => {
            if (location.tool !== toolName) {
                return location.with({ tool: toolName });
            }
            return location;
        });
    }, [tool, updateLocation]);

    const onWheel = useEvent((event: WheelEvent) => viewport.handleWheelEvent(event));

    useEffect(() => {
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", toolEvents.onKeyDown);
        window.addEventListener("keyup", toolEvents.onKeyUp);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", toolEvents.onKeyDown);
            window.removeEventListener("keyup", toolEvents.onKeyUp);
        };
    }, [onWheel, toolEvents]);

    const toolRenderProps: ToolRenderProps<Tool["state"]> = {
        viewport,
        document,
        location,
        updateTool,
        state: tool.state,
    };
    const ToolSceneSvgComponent = tool.getSceneSvgComponent() as ToolRenderComponent<Tool["state"]>;
    const ToolScreenSvgComponent = tool.getScreenSvgComponent() as ToolRenderComponent<
        Tool["state"]
    >;
    const ToolScreenHtmlComponent = tool.getScreenHtmlComponent() as ToolRenderComponent<
        Tool["state"]
    >;

    return (
        <>
            <div className="pointer-events-none absolute top-0">{tool.toDebugString()}</div>
            <div
                className="absolute inset-0"
                onPointerDown={toolEvents.onPointerDown}
                onPointerMove={toolEvents.onPointerMove}
                onPointerUp={toolEvents.onPointerUp}
                onPointerCancel={toolEvents.onPointerCancel}
            >
                <svg
                    viewBox={`0 0 ${size.x} ${size.y}`}
                    className={classNames("absolute top-0 left-0", tool.canvasClassName())}
                >
                    <g transform={viewport.getSceneTransform()}>
                        <DocumentRenderer
                            document={document}
                            keyPointId={location.keyPointId}
                            tool={tool}
                        />
                    </g>
                </svg>
                <svg viewBox={`0 0 ${size.x} ${size.y}`} className="absolute top-0 left-0">
                    <g transform={viewport.getSceneTransform()}>
                        {<ToolSceneSvgComponent {...toolRenderProps} />}
                    </g>
                    {<ToolScreenSvgComponent {...toolRenderProps} />}
                </svg>
                <div className={classNames("absolute inset-0", tool.canvasClassName())}>
                    {<ToolScreenHtmlComponent {...toolRenderProps} />}
                </div>
            </div>
            <Toolbar tool={tool} onSelectTool={toolEvents.onSelectTool} />
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
                                updateLocation((location) =>
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
                            updateDocument((document) => document.addKeyPoint(keyPointId), {
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
                        updateDocument(doc, { lockstepLocation: location });
                    }}
                >
                    reset
                </button>
            </div>
        </>
    );
}
