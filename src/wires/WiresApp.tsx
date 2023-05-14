import { assertExists } from "@/lib/assert";
import { Path } from "@/lib/geom/Path";
import { Vector2 } from "@/lib/geom/Vector2";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useSessionStorageState } from "@/lib/hooks/useStoredState";
import {
    UpdateAction,
    degreesToRadians,
    exhaustiveSwitchError,
    minBy,
    normalizeAngle,
    values,
    windows,
} from "@/lib/utils";
import { WiresModel, wiresModelSchema } from "@/wires/wiresModel";
import { Fragment, ReactNode, useMemo, useState } from "react";

export function WiresApp() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(container, sizeFromBorderBox);

    const [doc, setDoc] = useSessionStorageState(
        "wires.model",
        wiresModelSchema,
        (): WiresModel => ({
            nodes: {},
            wires: {},
        }),
    );

    return (
        <div ref={setContainer} className="absolute inset-0">
            {size && <WiresCanvas size={size} doc={doc} setDoc={setDoc} />}
        </div>
    );
}

const possibleDirections = [0, degreesToRadians(60), degreesToRadians(120)]
    .flatMap((angle) => [angle, angle + degreesToRadians(180)])
    .map((angle) => normalizeAngle(angle));

function WiresCanvas({
    size,
    doc,
    setDoc,
}: {
    size: Vector2;
    doc: WiresModel;
    setDoc: (update: UpdateAction<WiresModel>) => void;
}) {
    const [debugEls, setDebugEls] = useState<ReactNode[]>([]);
    const [previewLine, setPreviewLine] = useState<Vector2[] | null>(null);
    const [lines, setLines] = useState<Vector2[][]>([]);

    const gesture = useGestureDetector({
        onDragStart: (event) => {
            const points = [Vector2.fromEvent(event)];

            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove: (event) => {
                    points.push(Vector2.fromEvent(event));
                    setPreviewLine(segmentifyPoints(points));
                },
                onEnd: (event) => {
                    const segmentedPoints = segmentifyPoints(points);
                    setLines((prev) => [...prev, segmentedPoints]);
                    setPreviewLine(null);
                },
                onCancel: (event) => {
                    setDebugEls([]);
                    setPreviewLine(null);
                },
            };
        },
    });

    return (
        <svg className="absolute inset-0 h-full w-full" {...gesture.events}>
            {debugEls.map((el, i) => (
                <Fragment key={i}>{el}</Fragment>
            ))}
            {values(doc.nodes).map((node) => {
                if (!node) return null;
                switch (node.type) {
                    case "in":
                        return (
                            <circle
                                key={node.id}
                                x={node.position.x}
                                y={node.position.y}
                                r={6}
                                className="fill-green-500"
                            />
                        );
                    case "out":
                        return (
                            <circle
                                key={node.id}
                                x={node.position.x}
                                y={node.position.y}
                                r={6}
                                className="fill-red-500"
                            />
                        );
                    case "join":
                        return (
                            <circle
                                key={node.id}
                                x={node.position.x}
                                y={node.position.y}
                                r={10}
                                className="fill-transparent stroke-blue-200"
                                strokeWidth={3}
                            />
                        );
                    default:
                        exhaustiveSwitchError(node);
                }
            })}
            {lines.map((points, i) => (
                <LineRenderer key={i} points={points} />
            ))}
            {previewLine && <LineRenderer points={previewLine} />}
        </svg>
    );
}

const wireJoinRadius = 8;
function LineRenderer({ points }: { points: Vector2[] }) {
    const svgPath = useMemo(() => {
        const path = Path.straightThroughPoints(...points).autoRound(wireJoinRadius);
        return Path.segmentToSvgPath(path);
    }, [points]);

    return (
        <path
            d={svgPath}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-transparent stroke-blue-600"
        />
    );
}

const windowDistance = 15;
function segmentifyPoints(points: ReadonlyArray<Vector2>): Array<Vector2> {
    let windowStart = 0;
    let windowEnd = 1;
    let currentRun = null;
    const runs = [];
    while (windowEnd < points.length) {
        while (
            windowEnd < points.length &&
            points[windowStart].distanceTo(points[windowEnd]) < windowDistance
        ) {
            windowEnd++;
        }

        const start = points[windowStart];
        const end = points[Math.min(windowEnd, points.length - 1)];

        const direction = end.sub(start).normalize();
        const nearestDirection = assertExists(
            minBy(possibleDirections, (dir) => Math.abs(dir - direction.angle())),
        );

        if (!currentRun || nearestDirection !== currentRun.direction) {
            if (currentRun) {
                runs.push({
                    direction: Vector2.fromPolar(currentRun.direction, 1),
                    referencePoint: runs.length
                        ? currentRun.start.lerp(end, 0.5)
                        : currentRun.start,
                });
            }
            currentRun = { start, direction: nearestDirection };
        }

        windowStart = windowEnd;
        windowEnd++;
    }
    if (!currentRun) {
        return [];
    }

    runs.push({
        referencePoint: points[points.length - 1],
        direction: Vector2.fromPolar(currentRun.direction, 1),
    });

    const result: Array<Vector2> = [points[0]];
    for (const [prev, next] of windows(runs, 2)) {
        // intersect the lines from the two runs
        const denominator =
            next.direction.y * prev.direction.x - next.direction.x * prev.direction.y;

        // Lines are parallel
        if (denominator === 0) {
            console.log("parallel lines");
            continue;
        }

        const ua =
            (next.direction.x * (prev.referencePoint.y - next.referencePoint.y) -
                next.direction.y * (prev.referencePoint.x - next.referencePoint.x)) /
            denominator;

        result.push(
            new Vector2(
                prev.referencePoint.x + ua * prev.direction.x,
                prev.referencePoint.y + ua * prev.direction.y,
            ),
        );
    }
    result.push(points[points.length - 1]);

    return result;
}
