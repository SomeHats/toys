import { DebugArrow, DebugPointX } from "@/lib/DebugSvg";
import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgApp } from "@/lib/react/Svg";
import { clamp, mapRange } from "@/lib/utils";
import { useEffect, useState } from "react";
import * as easings from "@/lib/easings";
import { assert } from "@/lib/assert";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { degToRad } from "three/src/math/MathUtils";
import { useNoise4d } from "@/trees/TreesApp";
import { Ticker } from "@/lib/Ticker";
import { track } from "@tldraw/state";

const viewbox = AABB.fromLeftTopWidthHeight(0, 0, 100, 100);
const unitRange = AABB.fromLeftTopRightBottom(-1, -1, 1, 1);

const flavours = [
    new Vector2(1, 1),
    new Vector2(1, -1),
    new Vector2(-1, -1),
    new Vector2(-1, 1),
];

const triHeight = Math.sqrt(3) / 2;
const xStep = 10;
const yStep = xStep * triHeight;
const spacing = new Vector2(xStep, yStep);

export const LeafPatternApp = track(function LeafPatternApp() {
    const [xy, setXy] = useState(Vector2.ZERO);
    const relative = xy.mapRange(viewbox, unitRange).clamp(unitRange);
    const [t] = useState(() => new Ticker());

    useEffect(() => {
        t.start();
        return () => {
            t.stop();
        };
    }, [t]);

    const noiseX = useNoise4d(xy, t, { scaleT: 10 });
    const noiseY = useNoise4d(xy, t, { scaleT: 10 });

    const leafs = [];
    for (let iY = 0; iY < viewbox.height / yStep; iY++) {
        for (let iX = 0; iX < viewbox.width / xStep; iX++) {
            const relative = new Vector2(noiseX(iX / 8), noiseY(iY / 8))
                .scale(3)
                .clamp(unitRange);
            leafs.push(
                <Leaf
                    key={`${iX}-${iY}`}
                    weights={getWeightsFromPoint(relative)}
                    size={5}
                    strokeWeight={1}
                    originIdx={new Vector2(iX, iY)}
                    spacing={spacing}
                />,
            );
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
            <SvgApp
                className="bg-stone-200 w-[min(80vw,80vh)] overflow-visible"
                viewBox={viewbox}
                onPointerMove={(p) => setXy(p)}
            >
                <DebugPointX position={relative.mapRange(unitRange, viewbox)} />
                {/* {normalizedWeights.map((w, i) => {
                    const start = new Vector2(10, 10 + i * 10);

                    return (
                        <DebugArrow
                            key={i}
                            start={start}
                            end={start.add(w * 80, 0)}
                            label={`${i}: ${w.toFixed(2)}`}
                        />
                    );
                })} */}
                {leafs}
            </SvgApp>
        </div>
    );
});

interface LeafStructure {
    lines: [LeafLine, LeafLine, LeafLine, LeafLine];
    weight: number;
    origin: (idx: Vector2, spacing: Vector2) => Vector2;
}
interface LeafLine {
    start: Vector2;
    end: Vector2;
    c1: Vector2;
    c2: Vector2;
}

export function Leaf({
    weights,
    size,
    strokeWeight,
    originIdx,
}: {
    weights: number[];
    size: number;
    strokeWeight: number;
    originIdx: Vector2;
    spacing: Vector2;
}) {
    assert(weights.length === structureFlavours.length);

    const compositeFlavour = {
        weight: 0,
        origin: new Vector2(0, 0),
        lines: [
            straight(0, 0, 0, 0),
            straight(0, 0, 0, 0),
            straight(0, 0, 0, 0),
            straight(0, 0, 0, 0),
        ],
    };

    for (let i = 0; i < weights.length; i++) {
        const flavour = structureFlavours[i];
        const weight = weights[i];

        compositeFlavour.weight += weight * flavour.weight * strokeWeight;
        compositeFlavour.origin = compositeFlavour.origin.add(
            flavour.origin(originIdx, spacing).scale(weight),
        );
        compositeFlavour.lines.forEach((line, j) => {
            addLineInPlace(
                line,
                flavour.lines[j as any],
                weight * flavour.weight * size,
            );
        });
    }

    console.log(compositeFlavour);

    const path = new SvgPathBuilder();
    //     .moveTo(compositeFlavour.lines[0].start)
    //     .bezierCurveTo(
    //         compositeFlavour.lines[0].c1,
    //         compositeFlavour.lines[0].c2,
    //         compositeFlavour.lines[0].end,
    //     )
    //     .moveTo(compositeFlavour.lines[1].start)
    //     .bezierCurveTo(
    //         compositeFlavour.lines[1].c1,
    //         compositeFlavour.lines[1].c2,
    //         compositeFlavour.lines[1].end,
    //     );

    compositeFlavour.lines.forEach((line) => {
        path.moveTo(compositeFlavour.origin.add(line.start));
        path.bezierCurveTo(
            compositeFlavour.origin.add(line.c1),
            compositeFlavour.origin.add(line.c2),
            compositeFlavour.origin.add(line.end),
        );
    });

    return (
        <path
            d={path.toString()}
            fill="none"
            stroke="black"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={compositeFlavour.weight}
        />
    );
}

function getWeightsFromPoint(relative: Vector2) {
    const rawFlavourWeights = flavours.map((f) =>
        easings.inSin(
            clamp(0, 1, mapRange(0, 2, 1, 0, f.distanceTo(relative))),
        ),
    );
    const totalDistance = rawFlavourWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = rawFlavourWeights.map((w) => w / totalDistance);
    return normalizedWeights;
}

const grid = (idx: Vector2, spacing: Vector2) => {
    return idx.mul(spacing);
};
const staggered = (idx: Vector2, spacing: Vector2) => {
    const offsetX = idx.y % 2 === 0 ? -spacing.x / 4 : spacing.x / 4;
    return idx.mul(spacing).add(offsetX, 0);
};

const leafStrutures = {
    dashes: () => {
        return {
            weight: 1,
            origin: staggered,
            lines: [
                straight(0, -0.5, 0, 0),
                straight(0, 0, 0, 0.5),
                straight(0, -0.5, 0, 0),
                straight(0, 0, 0, 0.5),
            ],
        };
    },
    separatedPeaks: () => {
        const offset = 0.2;
        return {
            weight: 1,
            origin: grid,
            lines: [
                straight(-offset, -(0.5 - offset), -0.5, 0),
                straight(-0.5, 0, -(1 - offset), 0.5 - offset),
                straight(offset, -(0.5 - offset), 0.5, 0),
                straight(0.5, 0, 1 - offset, 0.5 - offset),
            ],
        };
    },
    ohs: () => {
        return {
            weight: 1,
            origin: staggered,
            lines: [
                arc(0, -0.5, -0.5, 0, 0, 0),
                arc(-0.5, 0, 0, 0.5, 0, 0),
                arc(0, -0.5, 0.5, 0, 0, 0),
                arc(0.5, 0, 0, 0.5, 0, 0),
            ],
        };
    },
    yous: () => {
        const origin = new Vector2(0, -0.25);
        const arcStart = origin.add(0, 0.5);
        const arcMidPoint = arcStart.rotateAround(origin, degToRad(45));
        const arcEnd = arcStart.rotateAround(origin, degToRad(90));

        return {
            weight: 1,
            origin: staggered,
            lines: [
                arc(
                    arcStart.x,
                    arcStart.y,
                    arcMidPoint.x,
                    arcMidPoint.y,
                    origin.x,
                    origin.y,
                ),
                arc(
                    arcMidPoint.x,
                    arcMidPoint.y,
                    arcEnd.x,
                    arcEnd.y,
                    origin.x,
                    origin.y,
                ),
                arc(
                    -arcStart.x,
                    arcStart.y,
                    -arcMidPoint.x,
                    arcMidPoint.y,
                    origin.x,
                    origin.y,
                ),
                arc(
                    -arcMidPoint.x,
                    arcMidPoint.y,
                    -arcEnd.x,
                    arcEnd.y,
                    origin.x,
                    origin.y,
                ),
            ],
        };
    },
} satisfies Record<string, () => LeafStructure>;

const structureFlavours = [
    leafStrutures.yous(),
    leafStrutures.ohs(),
    leafStrutures.dashes(),
    leafStrutures.separatedPeaks(),
];

function straight(x1: number, y1: number, x2: number, y2: number): LeafLine {
    const start = new Vector2(x1, y1);
    const end = new Vector2(x2, y2);
    const control = start.lerp(end, 0.5);
    return {
        start,
        end,
        c1: control,
        c2: control,
    };
}

function arc(
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    xCenter: number,
    yCenter: number,
): LeafLine {
    const ax = xFrom - xCenter;
    const ay = yFrom - yCenter;
    const bx = xTo - xCenter;
    const by = yTo - yCenter;
    const q1 = ax * ax + ay * ay;
    const q2 = q1 + ax * bx + ay * by;
    const k2 = ((4 / 3) * (Math.sqrt(2 * q1 * q2) - q2)) / (ax * by - ay * bx);

    const cx1 = xCenter + ax - k2 * ay;
    const cy1 = yCenter + ay + k2 * ax;
    const cx2 = xCenter + bx + k2 * by;
    const cy2 = yCenter + by - k2 * bx;

    return {
        start: new Vector2(xFrom, yFrom),
        end: new Vector2(xTo, yTo),
        c1: new Vector2(cx1, cy1),
        c2: new Vector2(cx2, cy2),
    };
}

function addLineInPlace(base: LeafLine, line: LeafLine, weight: number) {
    base.start = base.start.add(line.start.scale(weight));
    base.end = base.end.add(line.end.scale(weight));
    base.c1 = base.c1.add(line.c1.scale(weight));
    base.c2 = base.c2.add(line.c2.scale(weight));
}
