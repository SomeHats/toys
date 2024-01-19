import { scale } from "@/blob-tree/canvas";
import {
    DebugDraw,
    FillOptions,
    StrokeAndFillOptions,
    StrokeOptions,
} from "@/lib/DebugDraw";
import { Vector2, Vector2Ish } from "@/lib/geom/Vector2";
import { useSvgScale } from "@/lib/react/Svg";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { ComponentProps } from "react";

function asProps<El extends keyof JSX.IntrinsicElements>() {
    return <T extends ComponentProps<El>>(props: T) => props;
}

function useStrokeProps({
    strokeWidth = 1,
    stroke = "transparent",
    strokeCap = "butt",
    strokeDash = [],
    strokeDashOffset = 0,
    strokeJoin = "round",
}: StrokeOptions = {}) {
    const scale = useSvgScale();
    return asProps<"path">()({
        stroke: stroke,
        strokeWidth: strokeWidth / scale,
        strokeLinecap: strokeCap,
        strokeLinejoin: strokeJoin,
        strokeDasharray: strokeDash.map((dash) => dash / scale).join(" "),
        strokeDashoffset: strokeDashOffset / scale,
    });
}

function getFillProps({ fill = "transparent" }: FillOptions = {}) {
    return asProps<"path">()({
        fill,
    });
}

function useStrokeAndFillProps(options: StrokeAndFillOptions) {
    return {
        ...useStrokeProps(options),
        ...getFillProps(options),
    };
}

function getDebugStrokeOptions(
    color: string = DebugDraw.DEFAULT_DEBUG_COLOR,
): StrokeOptions {
    return { stroke: color, strokeWidth: DebugDraw.HAIRLINE };
}

export function DebugLabel({
    label,
    position,
    color,
}: {
    label?: string;
    position: Vector2Ish;
    color?: string;
}) {
    const scale = useSvgScale();
    if (!label) return null;

    const adjustedPosition = Vector2.from(position).add(
        DebugDraw.LABEL_OFFSET.scale(1 / scale),
    );
    return (
        <text
            x={adjustedPosition.x}
            y={adjustedPosition.y}
            className="font-sans"
            textAnchor="left"
            fontSize={8 / scale}
            {...getFillProps({ fill: color ?? DebugDraw.DEFAULT_DEBUG_COLOR })}
        >
            {label}
        </text>
    );
}

interface DebugOptions {
    color?: string;
    label?: string;
}

export function DebugSvgPath({
    color,
    path,
}: {
    color?: string;
    path: string;
}) {
    return (
        <path
            d={path}
            {...useStrokeProps(getDebugStrokeOptions(color))}
            fill="transparent"
        />
    );
}

export function DebugPointX({
    position,
    ...debugOpts
}: { position: Vector2Ish } & DebugOptions) {
    const scale = useSvgScale();
    const { x, y } = Vector2.from(position);
    return (
        <>
            <DebugSvgPath
                {...debugOpts}
                path={new SvgPathBuilder()
                    .moveTo(
                        x - DebugDraw.DEBUG_POINT_SIZE / scale,
                        y - DebugDraw.DEBUG_POINT_SIZE / scale,
                    )
                    .lineTo(
                        x + DebugDraw.DEBUG_POINT_SIZE / scale,
                        y + DebugDraw.DEBUG_POINT_SIZE / scale,
                    )
                    .moveTo(
                        x - DebugDraw.DEBUG_POINT_SIZE / scale,
                        y + DebugDraw.DEBUG_POINT_SIZE / scale,
                    )
                    .lineTo(
                        x + DebugDraw.DEBUG_POINT_SIZE / scale,
                        y - DebugDraw.DEBUG_POINT_SIZE / scale,
                    )
                    .toString()}
            />
            <DebugLabel {...debugOpts} position={position} />
        </>
    );
}

export function DebugPointO({
    position,
    ...debugOpts
}: { position: Vector2Ish } & DebugOptions) {
    const scale = useSvgScale();
    const { x, y } = Vector2.from(position);
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={DebugDraw.DEBUG_POINT_SIZE / scale}
                {...useStrokeProps(getDebugStrokeOptions(debugOpts.color))}
            />
            <DebugLabel {...debugOpts} position={position} />
        </>
    );
}

export function DebugArrow({
    start: _start,
    end: _end,
    ...debugOpts
}: { start: Vector2Ish; end: Vector2Ish } & DebugOptions) {
    const scale = useSvgScale();
    const start = Vector2.from(_start);
    const end = Vector2.from(_end);

    const vector = end.sub(start);
    const arrowLeftPoint = vector
        .rotate(-DebugDraw.DEBUG_ARROW_ANGLE)
        .withMagnitude(DebugDraw.DEBUG_ARROW_SIZE / scale)
        .add(end);
    const arrowRightPoint = vector
        .rotate(+DebugDraw.DEBUG_ARROW_ANGLE)
        .withMagnitude(DebugDraw.DEBUG_ARROW_SIZE / scale)
        .add(end);

    return (
        <>
            <DebugSvgPath
                {...debugOpts}
                path={new SvgPathBuilder()
                    .moveTo(start)
                    .lineTo(end)
                    .moveTo(arrowLeftPoint)
                    .lineTo(end)
                    .lineTo(arrowRightPoint)
                    .toString()}
            />
            <DebugLabel
                {...debugOpts}
                position={Vector2.average([start, end])}
            />
        </>
    );
}

export function DebugVectorAtPoint({
    vector,
    base,
    ...debugOpts
}: { vector: Vector2Ish; base: Vector2Ish } & DebugOptions) {
    return (
        <DebugArrow
            {...debugOpts}
            start={base}
            end={Vector2.from(base).add(vector)}
        />
    );
}

export function DebugCircle({
    center,
    radius,
    ...debugOpts
}: { center: Vector2Ish; radius: number } & DebugOptions) {
    const { x, y } = Vector2.from(center);
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={radius}
                {...useStrokeAndFillProps(
                    getDebugStrokeOptions(debugOpts.color),
                )}
            />
            <DebugLabel {...debugOpts} position={center} />
        </>
    );
}

export function DebugPolyline({
    points,
    ...debugOpts
}: { points: readonly Vector2Ish[] } & DebugOptions) {
    const path = new SvgPathBuilder();
    if (points.length > 1) path.moveTo(points[0]);
    for (let i = 1; i < points.length; i++) {
        path.lineTo(points[i]);
    }

    return <DebugSvgPath {...debugOpts} path={path.toString()} />;
}
