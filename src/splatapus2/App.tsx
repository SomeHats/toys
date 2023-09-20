import { assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { pathFromCenterPoints } from "@/splatapus/model/pathFromCenterPoints";
import {
    StrokeCenterPoint,
    getStrokeCenterPoints,
    getStrokePoints,
    getSvgPathFromStroke,
} from "@/splatapus/model/perfectFreehand";
import { Splat } from "@/splatapus2/app/Splat";
import { Shape } from "@/splatapus2/store/Records";
import { idleScheduler } from "@/splatapus2/store/Signia";
import { react, track } from "@tldraw/state";
import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";

export const App = track(function App() {
    const [splat] = useState(() =>
        getLocalStorageItem("splatapus2", Splat.schema, () => Splat.empty()),
    );

    useEffect(() => {
        (window as any).splat = splat;
        return react(
            "autosave",
            () => {
                console.log("history", Splat.schema.serialize(splat));
                setLocalStorageItem("splatapus2", Splat.schema, splat);
            },
            { scheduleEffect: idleScheduler(1000) },
        );
    }, [splat]);

    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, (entry) => {
        const nextSize = sizeFromContentRect(entry);
        // splatapus.screenSize.update(nextSize);
        return nextSize;
    });

    return (
        <div
            ref={setContainer}
            className="absolute inset-0 touch-none overflow-hidden"
            onPointerDown={(event) => splat.onPointerDown(event)}
            onPointerMove={(event) => splat.onPointerMove(event)}
            onPointerUp={(event) => splat.onPointerUp(event)}
            onPointerCancel={(event) => splat.onPointerCancel(event)}
        >
            {size && <Canvas splat={splat} screenSize={size} />}
        </div>
    );
});

const Canvas = track(function Canvas({ splat, screenSize }: { splat: Splat; screenSize: Vector2 }) {
    return (
        <svg
            viewBox={`0 0 ${screenSize.x} ${screenSize.y}`}
            className={classNames("absolute left-0 top-0")}
        >
            {Array.from(splat.shapes, ([shapeId, shape]) => (
                <ShapeRenderer key={shapeId} splat={splat} shape={shape} />
            ))}
        </svg>
    );
});

const ShapeRenderer = track(function ShapeRenderer({
    splat,
    shape,
}: {
    splat: Splat;
    shape: Shape;
}) {
    const shapeVersion = splat.shapeVersionsByShapeId.getOne(shape.id);
    const [reduced, dbg] = magicLineReduction(shapeVersion.rawPoints);

    const path = getSvgPathFromStroke(pathFromCenterPoints(reduced));

    return (
        <g>
            <path
                d={SvgPathBuilder.midpointQuadraticViaPoints(shapeVersion.rawPoints).toString()}
                fill="none"
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="stroke-cyan-400"
            />
            <path
                d={path}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="fill-red-400"
            />
            {/* {shapeVersion.rawPoints.map((point, index) => (
                <DebugPointX key={index} position={point} />
            ))} */}
            {/* {reduced.map((point, index) => (
                <DebugPointX key={index} position={point} color="black" />
            ))} */}
            {dbg}
        </g>
    );
});

function magicLineReduction(
    rawPoints: readonly Vector2[],
): [readonly StrokeCenterPoint[], ReactNode[]] {
    if (rawPoints.length < 2) return [[], []];

    const strokePoints = getStrokeCenterPoints(
        getStrokePoints(rawPoints, perfectFreehandOpts),
        perfectFreehandOpts,
    );
    const { retainedPoints, dbg } = reducePointsBasedOnCost(strokePoints);

    return [retainedPoints, dbg];

    // const targetCost = 0.5;
    // let accumulatedCost = 0;
    // const dbg: JSX.Element[] = [];

    // const retainedPoints: Vector2[] = [rawPoints[0]];

    // for (let i = 1; i < rawPoints.length - 1; i++) {
    //     const prevPoint = rawPoints[i - 1];
    //     const currentPoint = rawPoints[i];
    //     const nextPoint = rawPoints[i + 1];

    //     const deltaBefore = currentPoint.sub(prevPoint).normalize();
    //     const deltaAfter = nextPoint.sub(currentPoint).normalize();
    //     const dpr = deltaBefore.dot(deltaAfter);
    //     accumulatedCost += mapRange(-1, 1, 1, 0, dpr) * 50;
    //     // dbg.push(
    //     //     <DebugPointX key={i} position={currentPoint} label={accumulatedCost.toFixed(2)} />,
    //     // );
    //     if (accumulatedCost >= targetCost) {
    //         retainedPoints.push(currentPoint);
    //         accumulatedCost -= targetCost;
    //     }
    // }

    // retainedPoints.push(rawPoints[rawPoints.length - 1]);

    // return [retainedPoints, dbg];
}

const bendWeight = 10;
const sizeWeight = 10;

function getCostAtIndex(points: ReadonlyArray<StrokeCenterPoint>, index: number): number | null {
    if (index === 0 || index === points.length - 1) {
        return null;
    }

    const previousPoint = points[index - 1];
    const currentPoint = points[index];
    const nextPoint = points[index + 1];

    const bendFactor =
        (Math.abs(
            currentPoint.center
                .sub(previousPoint.center)
                .angleBetween(nextPoint.center.sub(currentPoint.center)),
        ) /
            Math.PI) *
        bendWeight;

    const sizeFactor =
        (1 -
            (currentPoint.radius < previousPoint.radius
                ? currentPoint.radius / previousPoint.radius
                : previousPoint.radius / currentPoint.radius)) *
        sizeWeight;

    return bendFactor + sizeFactor;
}

function reducePointsBasedOnCost(points: ReadonlyArray<StrokeCenterPoint>) {
    const dbg: React.ReactNode[] = [];

    let costRemaining = 1;
    let totalCost = 0;
    const retainedPoints = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const cost = assertExists(getCostAtIndex(points, i));
        costRemaining -= cost;
        totalCost += cost;

        if (costRemaining < 0) {
            retainedPoints.push(points[i]);
            costRemaining = 1;
        }
    }

    retainedPoints.push(points[points.length - 1]);

    return {
        retainedPoints,
        totalCost,
        dbg,
    };
}
