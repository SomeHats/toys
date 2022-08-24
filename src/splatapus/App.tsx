import Vector2 from "@/lib/geom/Vector2";
import { sizeFromEntry, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
    StrokeCenterPoint,
} from "@/splatapus/perfectFreehand";
import {
    applyUpdate,
    exhaustiveSwitchError,
    frameLoop,
    invLerp,
    lerp,
    times,
    UpdateAction,
} from "@/lib/utils";
import classNames from "classnames";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/pathFromCenterPoints";
import * as easings from "@/lib/easings";
import { useUndoStack } from "@/splatapus/useUndoStack";
import { useKeyPress } from "@/lib/hooks/useKeyPress";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { LOAD_FROM_AUTOSAVE_ENABLED, perfectFreehandOpts } from "@/splatapus/constants";
import { loadSaved, makeEmptySaveState, writeSavedDebounced } from "@/splatapus/store";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { useEvent } from "@/lib/hooks/useEvent";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { Toolbar } from "@/splatapus/Toolbar";
import { useTool } from "@/splatapus/tools/Tool";
import { EventContext } from "@/splatapus/tools/lib";
import { DrawTool } from "@/splatapus/tools/DrawTool";

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromEntry);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none">
            {size && <Splatapus size={size} />}
        </div>
    );
}

const LERP_DURATION_MS = 1000;
type ActionState =
    | {
          type: "idle";
      }
    | {
          type: "drawing";
          points: Vector2[];
      }
    | {
          type: "lerp";
          startedAtMs: number;
          from: SplatKeypointId;
          to: SplatKeypointId;
          progress: number;
      };

type FramesState = {
    rawPoints: Vector2[];
    length: number;
    normalizedCenterPoints: StrokeCenterPoint[];
};

function Splatapus({ size }: { size: Vector2 }) {
    const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
    // const [action, setAction] = useState<ActionState>({ type: "idle" });
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

    const { tool, events } = useTool(
        () => new DrawTool({ type: "idle" }),
        (event) => ({
            event,
            viewport,
            document,
            location,
            updateDocument,
            updateLocation,
            updateViewport,
        }),
    );

    useKeyPress({ key: "z", command: true }, undo);
    useKeyPress({ key: "z", command: true, shift: true }, redo);

    // useEffect(() => {
    //     let isCancelled = false;
    //     frameLoop((t, cancel) => {
    //         if (isCancelled) {
    //             cancel();
    //             return;
    //         }

    //         setAction((action) => {
    //             switch (action.type) {
    //                 case "idle":
    //                 case "drawing":
    //                     return action;
    //                 case "lerp": {
    //                     const progress = invLerp(
    //                         action.startedAtMs,
    //                         action.startedAtMs + LERP_DURATION_MS,
    //                         t,
    //                     );
    //                     if (progress > 1) {
    //                         return { type: "idle" };
    //                     }
    //                     return {
    //                         ...action,
    //                         progress,
    //                     };
    //                 }
    //                 default:
    //                     exhaustiveSwitchError(action);
    //             }
    //         });
    //     });
    //     return () => {
    //         isCancelled = true;
    //     };
    // });

    // const onPointerDown = useEvent((e: MouseEvent) => {
    //     e.preventDefault();
    //     setAction((action) => {
    //         switch (action.type) {
    //             case "lerp":
    //                 return action;
    //             case "idle":
    //                 return {
    //                     r: "drawing",
    //                     points: [viewport.screenToScene(Vector2.fromEvent(e))],
    //                 };
    //             case "drawing":
    //                 return action;
    //             default:
    //                 exhaustiveSwitchError(action);
    //         }
    //     });
    // });
    // const onPointerMove = useEvent((e: MouseEvent) => {
    //     e.preventDefault();
    //     setAction((action) => {
    //         switch (action.type) {
    //             case "idle":
    //             case "lerp":
    //                 return action;
    //             case "drawing":
    //                 return {
    //                     ...action,
    //                     points: [...action.points, viewport.screenToScene(Vector2.fromEvent(e))],
    //                 };
    //             default:
    //                 exhaustiveSwitchError(action);
    //         }
    //     });
    // });
    // const onPointerUp = useEvent((e: MouseEvent) => {
    //     e.preventDefault();
    //     setAction((action) => {
    //         switch (action.type) {
    //             case "idle":
    //             case "lerp":
    //                 return action;
    //             case "drawing": {
    //                 updateDocument((document) => {
    //                     return document.replaceShapeVersionPoints(
    //                         document.getShapeVersionForKeyPoint(location.keyPointId).id,
    //                         action.points,
    //                     );
    //                 });
    //                 return { type: "idle" };
    //             }
    //             default:
    //                 exhaustiveSwitchError(action);
    //         }
    //     });
    // });
    const onWheel = useEvent((event: WheelEvent) => viewport.handleWheelEvent(event));

    useEffect(() => {
        if (!svgElement) {
            return;
        }

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", events.onKeyDown);
        window.addEventListener("keyup", events.onKeyUp);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", events.onKeyDown);
            window.removeEventListener("keyup", events.onKeyUp);
        };
    }, [onWheel, svgElement, events]);

    const centerPoints = useMemo(() => {
        switch (tool.name) {
            case "quickPan":
                return document.data.normalizedShapeVersions.get(
                    document.getShapeVersionForKeyPoint(location.keyPointId).id,
                ).normalizedCenterPoints;
            case "draw":
                switch (tool.state.type) {
                    case "idle":
                        return document.data.normalizedShapeVersions.get(
                            document.getShapeVersionForKeyPoint(location.keyPointId).id,
                        ).normalizedCenterPoints;
                    case "drawing":
                        return normalizeCenterPointIntervalsQuadratic(
                            getStrokeCenterPoints(
                                getStrokePoints(tool.state.points, perfectFreehandOpts),
                                perfectFreehandOpts,
                            ),
                            perfectFreehandOpts.size,
                        );
                    default:
                        return exhaustiveSwitchError(tool.state);
                }
            default:
                exhaustiveSwitchError(tool);
            // case "idle":
            //     return document.data.normalizedShapeVersions.get(
            //         document.getShapeVersionForKeyPoint(location.keyPointId).id,
            //     ).normalizedCenterPoints;
            // case "drawing":

            // case "lerp": {
            //     const fromVersion = document.getShapeVersionForKeyPoint(action.from);
            //     const toVersion = document.getShapeVersionForKeyPoint(action.to);
            //     const fromPoints = document.data.normalizedShapeVersions.get(
            //         fromVersion.id,
            //     ).normalizedCenterPoints;
            //     const toPoints = document.data.normalizedShapeVersions.get(
            //         toVersion.id,
            //     ).normalizedCenterPoints;
            //     const progress = easings.inOutSine(action.progress);
            //     return times(
            //         Math.max(fromPoints.length, toPoints.length),
            //         (idx): StrokeCenterPoint => {
            //             const p1 = fromPoints[Math.min(idx, fromPoints.length - 1)];
            //             const p2 = toPoints[Math.min(idx, toPoints.length - 1)];
            //             return {
            //                 center: p1.center.lerp(p2.center, progress),
            //                 radius: lerp(p1.radius, p2.radius, progress),
            //             };
            //         },
            //     );
            // }
            // default:
            //     exhaustiveSwitchError(action);
        }
    }, [document, location.keyPointId, tool]);

    return (
        <>
            <Toolbar />
            <div className="pointer-events-none absolute top-0">{tool.toDebugString()}</div>
            <svg
                ref={setSvgElement}
                viewBox={`0 0 ${size.x} ${size.y}`}
                onPointerDown={events.onPointerDown}
                onPointerMove={events.onPointerMove}
                onPointerUp={events.onPointerUp}
                className={tool.canvasClassName()}
            >
                <g transform={`translate(${-viewport.pan.x}, ${-viewport.pan.y})`}>
                    <path d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))} />
                </g>
            </svg>
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
                                // setAction({
                                //     type: "lerp",
                                //     from: location.keyPointId,
                                //     to: keyPoint.id,
                                //     startedAtMs: performance.now(),
                                //     progress: 0,
                                // });
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
                        "flex h-10 flex-none items-center justify-center justify-self-end rounded-full border border-stone-200 px-3 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
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

function actionToString(action: ActionState): string {
    switch (action.type) {
        case "idle":
            return "idle";
        case "lerp":
            return `lerp(from = ${action.from}, to = ${action.to}, progress = ${action.progress})`;
        case "drawing":
            return `drawing(points = ${action.points.length})`;
        default:
            exhaustiveSwitchError(action);
    }
}
