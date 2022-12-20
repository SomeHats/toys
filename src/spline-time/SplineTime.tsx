import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { ANY, useIsKeyDown } from "@/lib/hooks/useKeyPress";
import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useSessionStorageState } from "@/lib/hooks/useStoredState";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { UpdateAction, windows } from "@/lib/utils";
import { Button } from "@/splatapus/ui/Button";
import { SplineTimeLine } from "@/spline-time/SplineTimeLine";
import classNames from "classnames";
import { Fragment, PointerEvent, ReactNode, useState } from "react";
import { createPortal } from "react-dom";

const HOVER_RADIUS_PX = 10;
const MID_POINT_MARKER_SIZE_PX = 8;

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
                <h1 className="flex-none font-bold tracking-wide text-stone-600">spline time</h1>
                <div className="text-stone-500">
                    click/drag to create/move points. hold shift to hide annotations.
                </div>
                <Button onClick={() => setLine(new SplineTimeLine([]))}>reset</Button>
            </div>
            <div className="relative flex-auto" ref={setContainer}>
                {size && <SplineTimeMain size={size} line={line} setLine={setLine} />}
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
        return line.getClosestPointIndexWithinRadius(coordsFromEvent(event), HOVER_RADIUS_PX);
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
                    setLine((line) => line.updatePointAtIndex(pointIndex, cursor.add(offset)));
                },
                onEnd: (event) => {
                    const cursor = coordsFromEvent(event);
                    setLine((line) => line.updatePointAtIndex(pointIndex, cursor.add(offset)));
                    setActivePointIdx(null);
                },
                onCancel: () => {
                    setActivePointIdx(null);
                },
            };
        },
    });

    const [rawHoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
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
                annotations={[straightLineThroughPointsAnnotation, midPointMarkersAnnotation]}
                location={AABB.fromLeftTopWidthHeight(paddingPx, 0, previewWidth, previewHeight)}
            />
            <RenderWindow
                {...renderWindowProps}
                annotations={[
                    showExtras && straightLineThroughPointsAnnotation,
                    midPointBezierAnnotation,
                    midPointMarkersAnnotation,
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
                annotations={[
                    showExtras && straightLineThroughPointsAnnotation,
                    catmullRomAnnotation,
                ]}
                location={AABB.fromLeftTopWidthHeight(
                    paddingPx,
                    previewHeight + paddingPx,
                    previewWidth,
                    previewHeight,
                )}
            />
            <RenderWindow
                {...renderWindowProps}
                annotations={[
                    showExtras && straightLineThroughPointsAnnotation,
                    quadBezierAnnotation,
                ]}
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

type LineAnnotationProps = { line: SplineTimeLine; showExtras: boolean; uiTarget: HTMLDivElement };
type LineAnnotation = (props: LineAnnotationProps) => ReactNode;

function RenderWindow({
    location,
    line,
    hoveredPointIdx,
    activePointIdx,
    annotations = [],
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
    annotations?: Array<LineAnnotation | null | false>;
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
                    <g transform={`translate(${location.width / 2}, ${location.height / 2})`}>
                        {annotations.map(
                            (annotation, i) =>
                                annotation &&
                                uiTarget && (
                                    <Fragment key={i}>
                                        {annotation({ line, showExtras, uiTarget })}
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
                                        i === activePointIdx
                                            ? "fill-blue-600"
                                            : i === hoveredPointIdx
                                            ? "fill-blue-300"
                                            : "fill-white",
                                    )}
                                />
                            ))}
                    </g>
                </svg>
            </div>
            <div className="pointer-events-auto absolute z-10 w-full" ref={setUiTarget} />
        </div>
    );
}

function straightLineThroughPointsAnnotation({ line }: LineAnnotationProps) {
    const segments = windows(line.points, 2).map(([p1, p2], i) => {
        const distance = p1.distanceTo(p2);

        const idealStrokeSpace = 5;
        let strokeCount = Math.ceil(distance / idealStrokeSpace);
        if (strokeCount % 2 === 1) strokeCount += 1;
        const strokeSpace = distance / strokeCount;

        return (
            <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className="stroke-purple-300"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`0 ${strokeSpace}`}
            />
        );
    });

    return <>{segments}</>;
}

function midPointBezierAnnotation({ line, uiTarget }: LineAnnotationProps) {
    const path = new SvgPathBuilder();
    switch (line.points.length) {
        case 0:
        case 1:
            return null;
        case 2: {
            path.moveTo(line.points[0]);
            path.lineTo(line.points[1]);
            break;
        }
        default:
            path.moveTo(line.points[0]);
            path.lineTo(line.points[0].lerp(line.points[1], 0.5));
            for (let i = 1; i < line.points.length - 1; i++) {
                path.quadraticCurveTo(line.points[i], line.points[i].lerp(line.points[i + 1], 0.5));
            }
            path.lineTo(line.points[line.points.length - 1]);
    }

    return (
        <>
            <path
                d={path.toString()}
                className="stroke-fuchsia-500"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <AnnotationUi uiTarget={uiTarget} label={"midpoint quadratic"} />
        </>
    );
}

function midPointMarkersAnnotation({ line, showExtras }: LineAnnotationProps) {
    if (!showExtras) return null;

    const midpoints = windows(line.points, 2).map(([p1, p2], i) => {
        const lineNormal = p2.sub(p1).normalize().perpendicular();
        const midPoint = p1.lerp(p2, 0.5);

        const midPointMarkerStart = midPoint.add(lineNormal.scale(MID_POINT_MARKER_SIZE_PX / 2));
        const midPointMarkerEnd = midPoint.add(lineNormal.scale(-MID_POINT_MARKER_SIZE_PX / 2));
        return (
            <line
                key={i}
                x1={midPointMarkerStart.x}
                y1={midPointMarkerStart.y}
                x2={midPointMarkerEnd.x}
                y2={midPointMarkerEnd.y}
                className="stroke-purple-500"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        );
    });

    return <>{midpoints}</>;
}

function quadBezierAnnotation(props: LineAnnotationProps) {
    return <QuadBezierAnnotation {...props} />;
}
function QuadBezierAnnotation({ line, showExtras, uiTarget }: LineAnnotationProps) {
    const [slop, setSlop] = useState(0.333);
    const controlPoints: Array<{ target: Vector2; control: Vector2 }> = [];
    const path = new SvgPathBuilder();

    switch (line.points.length) {
        case 0:
        case 1:
            return null;
        case 2:
            path.moveTo(line.points[0]);
            path.lineTo(line.points[1]);
            break;
        default: {
            path.moveTo(line.points[0]);
            const controlPointDirection = line.points[2].sub(line.points[0]).normalize();
            let distance = line.points[0].distanceTo(line.points[1]);
            const controlPointRelative = controlPointDirection.scale(distance * slop);
            const controlPointBefore = line.points[1].sub(controlPointRelative);
            controlPoints.push({ target: line.points[1], control: controlPointBefore });
            path.quadraticCurveTo(controlPointBefore, line.points[1]);

            let prevControlPointDirection = controlPointDirection;
            for (let i = 1; i < line.points.length - 2; i++) {
                const controlPointDirection = line.points[i + 2].sub(line.points[i]).normalize();
                distance = line.points[i].distanceTo(line.points[i + 1]);
                const controlPointBefore = line.points[i].add(
                    prevControlPointDirection.scale(distance * slop),
                );
                const controlPointAfter = line.points[i + 1].sub(
                    controlPointDirection.scale(distance * slop),
                );
                controlPoints.push({ target: line.points[i], control: controlPointBefore });
                controlPoints.push({ target: line.points[i + 1], control: controlPointAfter });
                path.bezierCurveTo(controlPointBefore, controlPointAfter, line.points[i + 1]);
                prevControlPointDirection = controlPointDirection;
            }

            distance = line.points[line.points.length - 2].distanceTo(
                line.points[line.points.length - 1],
            );
            const controlPointAfter = line.points[line.points.length - 2].add(
                prevControlPointDirection.scale(distance * slop),
            );
            controlPoints.push({
                target: line.points[line.points.length - 2],
                control: controlPointAfter,
            });
            path.quadraticCurveTo(controlPointAfter, line.points[line.points.length - 1]);
            break;
        }
    }

    return (
        <>
            {showExtras &&
                controlPoints.map(({ target, control }, i) => (
                    <Fragment key={i}>
                        <line
                            x1={target.x}
                            y1={target.y}
                            x2={control.x}
                            y2={control.y}
                            className="stroke-purple-400"
                            fill="none"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx={control.x}
                            cy={control.y}
                            r={4}
                            strokeWidth={2}
                            className="fill-white stroke-purple-400"
                        />
                    </Fragment>
                ))}
            <path
                d={path.toString()}
                className="stroke-fuchsia-500"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <AnnotationUi label="naive tangents" uiTarget={uiTarget}>
                slop:
                <input
                    type="range"
                    value={slop}
                    onChange={(e) => setSlop(e.currentTarget.valueAsNumber)}
                    min={0}
                    max={1}
                    step={0.001}
                />
                <span className="tabular-nums">{slop.toFixed(2)}</span>
            </AnnotationUi>
        </>
    );
}

function catmullRomAnnotation(props: LineAnnotationProps) {
    return <CatmullRomAnnotation {...props} />;
}
function CatmullRomAnnotation({ line, showExtras, uiTarget }: LineAnnotationProps) {
    const [alpha, setAlpha] = useState(0.5);

    if (line.points.length < 2) {
        return null;
    }

    const controlPoints: Array<{ target: Vector2; control: Vector2 }> = [];
    const path = new SvgPathBuilder();

    path.moveTo(line.points[0]);

    for (let i = 0; i < line.points.length - 1; i++) {
        const p0 = i == 0 ? line.points[0] : line.points[i - 1];
        const p1 = line.points[i];
        const p2 = line.points[i + 1];
        const p3 = i + 2 < line.points.length ? line.points[i + 2] : p2;

        const d1 = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
        const d2 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        const d3 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));

        // Catmull-Rom to Cubic Bezier conversion matrix

        // A = 2d1^2a + 3d1^a * d2^a + d3^2a
        // B = 2d3^2a + 3d3^a * d2^a + d2^2a

        // [   0             1            0          0          ]
        // [   -d2^2a /N     A/N          d1^2a /N   0          ]
        // [   0             d3^2a /M     B/M        -d2^2a /M  ]
        // [   0             0            1          0          ]

        const d3powA = Math.pow(d3, alpha);
        const d3pow2A = Math.pow(d3, 2 * alpha);
        const d2powA = Math.pow(d2, alpha);
        const d2pow2A = Math.pow(d2, 2 * alpha);
        const d1powA = Math.pow(d1, alpha);
        const d1pow2A = Math.pow(d1, 2 * alpha);

        const A = 2 * d1pow2A + 3 * d1powA * d2powA + d2pow2A;
        const B = 2 * d3pow2A + 3 * d3powA * d2powA + d2pow2A;
        let N = 3 * d1powA * (d1powA + d2powA);
        if (N > 0) {
            N = 1 / N;
        }
        let M = 3 * d3powA * (d3powA + d2powA);
        if (M > 0) {
            M = 1 / M;
        }

        let bp1 = new Vector2(
            (-d2pow2A * p0.x + A * p1.x + d1pow2A * p2.x) * N,
            (-d2pow2A * p0.y + A * p1.y + d1pow2A * p2.y) * N,
        );

        let bp2 = new Vector2(
            (d3pow2A * p1.x + B * p2.x - d2pow2A * p3.x) * M,
            (d3pow2A * p1.y + B * p2.y - d2pow2A * p3.y) * M,
        );

        if (bp1.x == 0 && bp1.y == 0) {
            bp1 = p1;
        }
        if (bp2.x == 0 && bp2.y == 0) {
            bp2 = p2;
        }

        controlPoints.push({ target: p1, control: bp1 });
        controlPoints.push({ target: p2, control: bp2 });
        path.bezierCurveTo(bp1, bp2, p2);
    }

    return (
        <>
            {showExtras &&
                controlPoints.map(({ target, control }, i) => (
                    <Fragment key={i}>
                        <line
                            x1={target.x}
                            y1={target.y}
                            x2={control.x}
                            y2={control.y}
                            className="stroke-purple-400"
                            fill="none"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx={control.x}
                            cy={control.y}
                            r={4}
                            strokeWidth={2}
                            className="fill-white stroke-purple-400"
                        />
                    </Fragment>
                ))}{" "}
            <path
                d={path.toString()}
                className="stroke-fuchsia-500"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <AnnotationUi label="catmull-rom" uiTarget={uiTarget}>
                alpha:
                <input
                    type="range"
                    value={alpha}
                    onChange={(e) => setAlpha(e.currentTarget.valueAsNumber)}
                    min={0.001}
                    max={1}
                    step={0.001}
                />
                <span className="tabular-nums">{alpha.toFixed(2)}</span>
            </AnnotationUi>
        </>
    );
}

function AnnotationUi({
    label,
    uiTarget,
    children,
}: {
    label: string;
    uiTarget: HTMLElement;
    children?: ReactNode;
}) {
    return createPortal(
        <div
            className="flex items-baseline justify-between gap-3"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerCancel={(e) => e.stopPropagation()}
        >
            <div className="flex-auto p-3 font-semibold text-stone-500">{label}</div>
            <div className="flex flex-none items-center justify-center gap-3 p-3">{children}</div>
        </div>,
        uiTarget,
    );
}
