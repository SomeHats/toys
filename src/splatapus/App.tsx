import Vector2 from "@/lib/geom/Vector2";
import { sizeFromEntry, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
    StrokeCenterPoint,
} from "@/splatapus/perfectFreehand";
import { exhaustiveSwitchError, frameLoop, invLerp, lerp, times } from "@/lib/utils";
import classNames from "classnames";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { pathFromCenterPoints } from "@/splatapus/pathFromCenterPoints";
import * as easings from "@/lib/easings";
import { useUndoStack } from "@/splatapus/useUndoStack";
import { useKeyPress } from "@/lib/hooks/useKeyPress";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatKeypointId, SplatShapeVersionId } from "@/splatapus/model/SplatDoc";
import { perfectFreehandOpts } from "@/splatapus/constants";

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

// type DocumentState = {
//     frames: FramesState[];
// };
type LocationState = {
    keyPointId: SplatKeypointId;
};

function Splatapus({ size }: { size: Vector2 }) {
    const [action, setAction] = useState<ActionState>({ type: "idle" });
    const { document, location, updateDocument, updateLocation, undo, redo } = useUndoStack<
        SplatDocModel,
        LocationState
    >(() => {
        const keyPointId = SplatKeypointId.generate();
        return { doc: SplatDocModel.create().addKeyPoint(keyPointId), location: { keyPointId } };
    });

    useKeyPress({ key: "z", command: true }, undo);
    useKeyPress({ key: "z", command: true, shift: true }, redo);

    useEffect(() => {
        let isCancelled = false;
        frameLoop((t, cancel) => {
            if (isCancelled) {
                cancel();
                return;
            }

            setAction((action) => {
                switch (action.type) {
                    case "idle":
                    case "drawing":
                        return action;
                    case "lerp": {
                        const progress = invLerp(
                            action.startedAtMs,
                            action.startedAtMs + LERP_DURATION_MS,
                            t,
                        );
                        if (progress > 1) {
                            return { type: "idle" };
                        }
                        return {
                            ...action,
                            progress,
                        };
                    }
                    default:
                        exhaustiveSwitchError(action);
                }
            });
        });
        return () => {
            isCancelled = true;
        };
    });

    const onPointerDown = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setAction((action) => {
            switch (action.type) {
                case "lerp":
                    return action;
                case "idle":
                    return { type: "drawing", points: [Vector2.fromEvent(e)] };
                case "drawing":
                    return action;
                default:
                    exhaustiveSwitchError(action);
            }
        });
    }, []);
    const onPointerMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setAction((action) => {
            switch (action.type) {
                case "idle":
                case "lerp":
                    return action;
                case "drawing":
                    return {
                        ...action,
                        points: [...action.points, Vector2.fromEvent(e)],
                    };
                default:
                    exhaustiveSwitchError(action);
            }
        });
    }, []);
    const onPointerUp = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            setAction((action) => {
                switch (action.type) {
                    case "idle":
                    case "lerp":
                        return action;
                    case "drawing": {
                        updateDocument((document) => {
                            return document.replaceShapeVersionPoints(
                                document.getShapeVersionForKeyPoint(location.keyPointId).id,
                                action.points,
                            );
                        });
                        return { type: "idle" };
                    }
                    default:
                        exhaustiveSwitchError(action);
                }
            });
        },
        [location.keyPointId, updateDocument],
    );

    const centerPoints = useMemo(() => {
        switch (action.type) {
            case "idle":
                return document.data.normalizedShapeVersions.get(
                    document.getShapeVersionForKeyPoint(location.keyPointId).id,
                ).normalizedCenterPoints;
            case "drawing":
                return normalizeCenterPointIntervalsQuadratic(
                    getStrokeCenterPoints(
                        getStrokePoints(action.points, perfectFreehandOpts),
                        perfectFreehandOpts,
                    ),
                    perfectFreehandOpts.size,
                );
            case "lerp": {
                const fromVersion = document.getShapeVersionForKeyPoint(action.from);
                const toVersion = document.getShapeVersionForKeyPoint(action.to);
                const fromPoints = document.data.normalizedShapeVersions.get(
                    fromVersion.id,
                ).normalizedCenterPoints;
                const toPoints = document.data.normalizedShapeVersions.get(
                    toVersion.id,
                ).normalizedCenterPoints;
                const progress = easings.inOutSine(action.progress);
                return times(
                    Math.max(fromPoints.length, toPoints.length),
                    (idx): StrokeCenterPoint => {
                        const p1 = fromPoints[Math.min(idx, fromPoints.length - 1)];
                        const p2 = toPoints[Math.min(idx, toPoints.length - 1)];
                        return {
                            center: p1.center.lerp(p2.center, progress),
                            radius: lerp(p1.radius, p2.radius, progress),
                        };
                    },
                );
            }
            default:
                exhaustiveSwitchError(action);
        }
    }, [action, document, location.keyPointId]);

    return (
        <>
            <div className="pointer-events-none absolute top-0">{actionToString(action)}</div>
            <svg
                viewBox={`0 0 ${size.x} ${size.y}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <path d={getSvgPathFromStroke(pathFromCenterPoints(centerPoints))} />
                {/* {centerPoints.map(({ center, radius }, i) => (
                    <circle
                        key={i}
                        cx={center.x}
                        cy={center.y}
                        r={radius}
                        className="fill-transparent stroke-lime-500 stroke-1"
                    />
                ))} */}
            </svg>
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-3 p-3">
                {Array.from(document.keyPoints, (keyPoint, i) => (
                    <button
                        key={keyPoint.id}
                        className={classNames(
                            "flex h-10 w-10 items-center justify-center rounded border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
                            keyPoint.id === location.keyPointId
                                ? " text-stone-500 ring-2 ring-inset ring-purple-400"
                                : "text-stone-400",
                        )}
                        onClick={() => {
                            updateLocation({ keyPointId: keyPoint.id });
                            setAction({
                                type: "lerp",
                                from: location.keyPointId,
                                to: keyPoint.id,
                                startedAtMs: performance.now(),
                                progress: 0,
                            });
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className={classNames(
                        "flex h-10 w-10 items-center justify-center rounded border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",
                    )}
                    onClick={() => {
                        const keyPointId = SplatKeypointId.generate();
                        updateDocument((document) => document.addKeyPoint(keyPointId));
                        updateLocation({ keyPointId });
                    }}
                >
                    +
                </button>
            </div>
        </>
    );
}

function calculateFramesStateFromRawPoints(rawFramePoints: Vector2[][]): FramesState[] {
    if (rawFramePoints.length === 0) return [];

    const pointsWithStrokes = [];
    let longestLength = 0;
    for (const rawPoints of rawFramePoints) {
        const strokePoints = getStrokePoints(rawPoints);
        const length = strokePoints[strokePoints.length - 1]?.runningLength ?? 0;
        pointsWithStrokes.push({ rawPoints, strokePoints, length });
        if (length > longestLength) {
            longestLength = length;
        }
    }

    const targetPoints = Math.floor(longestLength / perfectFreehandOpts.size);

    return pointsWithStrokes.map(({ rawPoints, strokePoints, length }) => {
        return {
            rawPoints,
            length,
            normalizedCenterPoints: normalizeCenterPointIntervalsQuadratic(
                getStrokeCenterPoints(strokePoints, perfectFreehandOpts),
                length / targetPoints,
            ),
        };
    });
}

// function SplatPath({ points, animateChanges }: { points: Vector2[]; animateChanges: boolean }) {
//     const [state, setState] = useState(() => {
//         const strokePoints = getStrokePoints(points, perfectFreehandOpts);
//         const strokeCenterPoints = getStrokeCenterPoints()
//     })
//     // const strokePoints = getStrokePoints(points, perfectFreehandOpts);
//     // const strokeCenterPoints = getStrokeCenterPoints(strokePoints, perfectFreehandOpts);
//     // const normalizedCenterPoints = normalizeCenterPointIntervalsQuadratic(
//     //     strokeCenterPoints,
//     //     perfectFreehandOpts.size,
//     // );

//     return (
//         <path
//         style={{path}}
//             d={getSvgPathFromStroke(pathFromCenterPoints(normalizedCenterPoints))}
//             className="fill-stone-300"
//         />
//     );
// }

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
