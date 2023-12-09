import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { ANY, useIsKeyDown } from "@/lib/hooks/useKeyPress";
import {
    sizeFromBorderBox,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import { useSessionStorageState } from "@/lib/hooks/useStoredState";
import { UpdateAction } from "@/lib/utils";
import { Button } from "@/splatapus/ui/Button";
import { SplineTimeLine } from "@/spline-time/SplineTimeLine";
import { Layer } from "@/spline-time/layers/Layer";
import { alexModeLayer } from "@/spline-time/layers/alexModeLayer";
import { arcLayer } from "@/spline-time/layers/arcLayer";
import { catmullRomLayer } from "@/spline-time/layers/catmullRomLayer";
import { midPointBezierLayer } from "@/spline-time/layers/midPointBezierLayer";
import { midPointMarkerLayer } from "@/spline-time/layers/midPointMarkerLayer";
import { straightLineThroughPointsLayer } from "@/spline-time/layers/straightLineThroughPointsLayer";
import classNames from "classnames";
import { Fragment, PointerEvent, useState } from "react";

const HOVER_RADIUS_PX = 20;

const sampleLine = [
    [-150, 75],
    [0, -50],
    [0, 50],
    [150, -75],
].map(([x, y]) => new Vector2(x, y));

export function SplineTime() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(container, sizeFromBorderBox);
    const [line, setLine] = useSessionStorageState(
        "splineTime.line",
        SplineTimeLine.schema,
        () => new SplineTimeLine(sampleLine),
    );

    return (
        <div className="absolute inset-0 flex flex-col bg-stone-100">
            <div className="flex flex-none items-center justify-between gap-3 bg-stone-100 px-4 py-3">
                <h1 className="flex-none font-bold tracking-wide text-stone-600">
                    spline time
                </h1>
                <div className="text-stone-500">
                    click/drag to create/move points. hold shift to hide
                    annotations.
                </div>
                <Button onClick={() => setLine(new SplineTimeLine([]))}>
                    reset
                </Button>
            </div>
            <div className="relative flex-auto touch-none" ref={setContainer}>
                {size && (
                    <SplineTimeMain size={size} line={line} setLine={setLine} />
                )}
            </div>
        </div>
    );
}

function SplineTimeMain({
    size,
    line,
    setLine,
}: {
    size: Vector2;
    line: SplineTimeLine;
    setLine: (update: UpdateAction<SplineTimeLine>) => void;
}) {
    const paddingPx = 16;
    const previewWidth = (size.x - paddingPx * 3) / 2;
    const previewHeight = (size.y - paddingPx * 2) / 2;
    const showExtras = !useIsKeyDown({ key: "Shift", shift: ANY });

    const coordsFromEvent = useEvent((event: PointerEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return new Vector2(
            event.clientX - rect.left - previewWidth / 2,
            event.clientY - rect.top - previewHeight / 2,
        );
    });

    const getHoveredIndex = useEvent((event: PointerEvent) => {
        return line.getClosestPointIndexWithinRadius(
            coordsFromEvent(event),
            HOVER_RADIUS_PX,
        );
    });

    const [activePointIdx, setActivePointIdx] = useState<number | null>(null);
    const { events: gestureEvents, isGestureInProgress } = useGestureDetector({
        onDragStart: (event) => {
            event.preventDefault();
            const cursor = coordsFromEvent(event);

            const { pointIndex, offset } = (() => {
                const hoveredIndex = getHoveredIndex(event);
                if (hoveredIndex !== null) {
                    return {
                        pointIndex: hoveredIndex,
                        offset: line.points[hoveredIndex].sub(cursor),
                    };
                }

                const pointIndex = line.points.length;
                setLine((line) => line.insertPointAtIndex(pointIndex, cursor));
                return {
                    pointIndex,
                    offset: Vector2.ZERO,
                };
            })();

            setActivePointIdx(pointIndex);

            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove: (event) => {
                    const cursor = coordsFromEvent(event);
                    setLine((line) =>
                        line.updatePointAtIndex(pointIndex, cursor.add(offset)),
                    );
                },
                onEnd: (event) => {
                    const cursor = coordsFromEvent(event);
                    setLine((line) =>
                        line.updatePointAtIndex(pointIndex, cursor.add(offset)),
                    );
                    setActivePointIdx(null);
                },
                onCancel: () => {
                    setActivePointIdx(null);
                },
            };
        },
    });

    const [rawHoveredPointIdx, setHoveredPointIdx] = useState<number | null>(
        null,
    );
    const hoveredPointIdx = isGestureInProgress ? null : rawHoveredPointIdx;

    const renderWindowProps = {
        line,
        hoveredPointIdx,
        activePointIdx,
        showExtras,
        onPointerDown: gestureEvents.onPointerDown,
        onPointerMove: (event: PointerEvent) => {
            if (!isGestureInProgress) {
                setHoveredPointIdx(getHoveredIndex(event));
            }
            gestureEvents.onPointerMove(event);
        },
        onPointerUp: gestureEvents.onPointerUp,
        onPointerCancel: gestureEvents.onPointerCancel,
    };

    return (
        <>
            <RenderWindow
                {...renderWindowProps}
                layers={[
                    showExtras &&
                        straightLineThroughPointsLayer({ style: "dotted" }),
                    arcLayer,
                ]}
                location={AABB.fromLeftTopWidthHeight(
                    paddingPx,
                    0,
                    previewWidth,
                    previewHeight,
                )}
            />
            <RenderWindow
                {...renderWindowProps}
                layers={[
                    showExtras &&
                        straightLineThroughPointsLayer({ style: "dotted" }),
                    midPointBezierLayer,
                    midPointMarkerLayer,
                ]}
                location={AABB.fromLeftTopWidthHeight(
                    previewWidth + paddingPx * 2,
                    0,
                    previewWidth,
                    previewHeight,
                )}
            />
            <RenderWindow
                {...renderWindowProps}
                layers={[catmullRomLayer]}
                location={AABB.fromLeftTopWidthHeight(
                    paddingPx,
                    previewHeight + paddingPx,
                    previewWidth,
                    previewHeight,
                )}
            />
            <RenderWindow
                {...renderWindowProps}
                layers={[alexModeLayer]}
                location={AABB.fromLeftTopWidthHeight(
                    previewWidth + paddingPx * 2,
                    previewHeight + paddingPx,
                    previewWidth,
                    previewHeight,
                )}
            />
        </>
    );
}

function RenderWindow({
    location,
    line,
    hoveredPointIdx,
    activePointIdx,
    layers = [],
    showExtras,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
}: {
    location: AABB;
    line: SplineTimeLine;
    hoveredPointIdx: number | null;
    activePointIdx: number | null;
    layers?: Array<Layer | null | false>;
    showExtras: boolean;
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: (event: PointerEvent) => void;
}) {
    const [uiTarget, setUiTarget] = useState<HTMLDivElement | null>(null);
    return (
        <div
            className="absolute overflow-hidden rounded-lg bg-white"
            style={{
                left: location.left,
                top: location.top,
                width: location.width,
                height: location.height,
            }}
        >
            <div
                className="absolute inset-0 "
                onPointerDown={(e) => {
                    console.log("a", e.currentTarget);
                    onPointerDown(e);
                }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
            >
                <svg className="absolute inset-0 h-full w-full">
                    <g
                        transform={`translate(${location.width / 2}, ${
                            location.height / 2
                        })`}
                    >
                        {layers.map(
                            (annotation, i) =>
                                annotation &&
                                uiTarget && (
                                    <Fragment key={i}>
                                        {annotation({
                                            line,
                                            showExtras,
                                            uiTarget,
                                        })}
                                    </Fragment>
                                ),
                        )}
                        {showExtras &&
                            line.points.map((point, i) => (
                                <circle
                                    key={i}
                                    cx={point.x}
                                    cy={point.y}
                                    r={6}
                                    strokeWidth={2}
                                    className={classNames(
                                        "stroke-blue-600",
                                        i === activePointIdx ? "fill-blue-600"
                                        : i === hoveredPointIdx ?
                                            "fill-blue-300"
                                        :   "fill-white",
                                    )}
                                />
                            ))}
                    </g>
                </svg>
            </div>
            <div
                className="pointer-events-auto absolute z-10 w-full"
                ref={setUiTarget}
            />
        </div>
    );
}
