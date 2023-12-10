import { DebugLabel } from "@/lib/DebugSvg";
import { Spring } from "@/lib/Spring";
import { Ticker } from "@/lib/Ticker";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { constrain, lerp, mapRange, noop, times } from "@/lib/utils";
import { track } from "@tldraw/state";
import { makeNoise3D, makeNoise4D } from "open-simplex-noise";
import { useEffect, useRef, useState } from "react";
import { x } from "vitest/dist/reporters-OH1c16Kq";

const SCALE_T = 0.0001;
const SCALE_XY = 0.003;

type NoiseOpts = {
    scaleT?: number;
    scaleXy?: number;
};

interface Tree {
    x: number;
    height: number;
    width: number;
}

function useNoise3d(
    position: Vector2,
    t: Ticker,
    { scaleT = 1, scaleXy = 1 }: NoiseOpts = {},
) {
    const [noise] = useState(() => makeNoise3D(Math.random() * 100000));
    return noise(
        position.x * SCALE_XY * scaleXy,
        position.y * SCALE_XY * scaleXy,
        t.elapsedMs * SCALE_T * scaleT,
    );
}

function useNoise4d(
    position: Vector2,
    ticker: Ticker,
    { scaleT = 1, scaleXy = 1 }: NoiseOpts = {},
) {
    const [noise] = useState(() => makeNoise4D(Math.random() * 100000));
    return (p: number) =>
        noise(
            position.x * SCALE_XY * scaleXy,
            position.y * SCALE_XY * scaleXy,
            ticker.elapsedMs * SCALE_T * scaleT,
            p,
        );
}

export function TreesApp() {
    const [xy, setPosition] = useState(Vector2.ZERO);
    const [t, setT] = useState(() => new Ticker());

    useEffect(() => {
        t.start();
        return () => {
            t.stop();
        };
    }, [t]);

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-stone-200"
            onPointerMove={(e) => {
                if (e.isPrimary) setPosition(Vector2.fromEvent(e));
            }}
        >
            <svg
                className="bg-stone-200 w-[min(80vw,80vh)] overflow-visible"
                viewBox="0 0 100 100"
            >
                <g className="stroke-stone-600">
                    <line x1={0} y1={100} x2={100} y2={100} strokeWidth={3} />
                    <Trees2 xy={xy} t={t} />
                    <line
                        x1={0}
                        y1={103}
                        x2={100}
                        y2={103}
                        className="stroke-stone-200"
                        strokeWidth={3}
                    />
                </g>
            </svg>
        </div>
    );
}

const Trees2 = track(function Trees2({ xy, t }: { xy: Vector2; t: Ticker }) {
    const treeCount = 7;
    const treePosition = useNoise4d(xy, t);
    const gaps = times(treeCount, (i) =>
        mapRange(-1, 1, 0.1, 3, treePosition(i)),
    );
    const totalGap = gaps.reduce((a, b) => a + b, 0);
    const proportion = 100 / totalGap;

    const trees: Tree[] = [];
    let x = 0;
    for (let i = 0; i < gaps.length - 1; i++) {
        x += gaps[i] * proportion;

        const seed = i * 100;

        const height = mapRange(
            -1,
            1,
            -200,
            200,
            treePosition(seed + 1000 + x / 20),
        );

        trees.push({
            x,
            height: height,
            width: mapRange(
                -1,
                1,
                2,
                mapRange(0, 200, 0, 20, constrain(0, 200, height)),
                treePosition(seed + x / 20),
            ),
        });
    }

    return trees.map((tree, i) => (
        <Tree key={i} tree={tree} xy={xy} t={t} baseY={100} />
    ));
});

function Tree({
    tree,
    xy,
    t,
    baseY,
}: {
    tree: Tree;
    xy: Vector2;
    t: Ticker;
    baseY: number;
}) {
    const splitPoint = constrain(
        5,
        100,
        mapRange(
            -1,
            1,
            tree.height * 0.1,
            Math.sqrt(tree.height) * 5,
            useNoise4d(xy, t, { scaleT: 1.5 })(tree.height / 10),
        ),
    );

    const splitLeft = useNoise3d(xy, t, { scaleT: 2 });
    const splitRight = useNoise3d(xy, t, { scaleT: 2 });

    if (tree.height < 0) return null;

    const trunk = (
        <line
            x1={tree.x}
            y1={baseY}
            x2={tree.x}
            y2={baseY - Math.min(splitPoint, tree.height)}
            strokeWidth={tree.width}
            strokeLinecap="round"
        />
    );

    let left = null;
    let right = null;

    if (splitPoint < tree.height) {
        const leanLeft = Math.sqrt(constrain(0, 1, splitLeft));
        const leanRight = Math.sqrt(constrain(0, 1, splitRight));

        const leftWidth = lerp(tree.width, tree.width * 0.3, leanLeft);
        const rightWidth = lerp(tree.width, tree.width * 0.3, leanRight);

        const leftX = tree.x - tree.width / 2 + leftWidth / 2;
        const rightX = tree.x + tree.width / 2 - rightWidth / 2;

        left = (
            <g
                transform={`translate(${leftX} ${baseY - splitPoint}) rotate(${
                    -45 * leanLeft
                })`}
            >
                <Tree
                    tree={{
                        x: 0,
                        height: tree.height - splitPoint,
                        width: leftWidth,
                    }}
                    xy={xy}
                    t={t}
                    baseY={0}
                />
            </g>
        );

        right = (
            <g
                transform={`translate(${rightX} ${baseY - splitPoint}) rotate(${
                    45 * leanRight
                })`}
            >
                <Tree
                    tree={{
                        x: 0,
                        height: tree.height - splitPoint,
                        width: rightWidth,
                    }}
                    xy={xy}
                    t={t}
                    baseY={0}
                />
            </g>
        );
    }

    return (
        <>
            {trunk}
            {left}
            {right}
            {/* <line
                x1={tree.x - 5}
                y1={baseY - splitPoint}
                x2={tree.x + 5}
                y2={baseY - splitPoint}
                strokeWidth={2}
                className="stroke-red-500"
            /> */}
        </>
    );
}

function useSpring(
    ticker: Ticker,
    target: number,
    { tension = 200, friction = 20, start = target } = {},
) {
    const [spring, setSpring] = useState(
        () => new Spring({ ticker, target, value: start, shouldStart: false }),
    );

    spring.target = target;
    spring.tension = tension;
    spring.friction = friction;

    useEffect(() => {
        setSpring((spring) => {
            return new Spring({
                ticker,
                value: spring.value,
                target: spring.target,
                tension: spring.tension,
                friction: spring.friction,
                shouldStart: false,
            });
        });
    }, [ticker]);

    useEffect(() => {
        spring.start();
        return () => spring.destroy();
    }, [spring]);

    return spring.value;
}
