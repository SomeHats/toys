import { DebugDraw, FillOptions, StrokeAndFillOptions, StrokeOptions } from "@/lib/DebugDraw";
import { Vector2, Vector2Ish } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { ComponentProps, ComponentType } from "react";

function asProps<El extends keyof JSX.IntrinsicElements>() {
    return <T extends ComponentProps<El>>(props: T) => props;
}

function getStrokeProps({
    strokeWidth = 1,
    stroke = "transparent",
    strokeCap = "butt",
    strokeDash = [],
    strokeDashOffset = 0,
    strokeJoin = "round",
}: StrokeOptions = {}) {
    return asProps<"path">()({
        stroke: stroke,
        strokeWidth,
        strokeLinecap: strokeCap,
        strokeLinejoin: strokeJoin,
        strokeDasharray: strokeDash.join(" "),
        strokeDashoffset: strokeDashOffset,
    });
}

function getFillProps({ fill = "transparent" }: FillOptions = {}) {
    return asProps<"path">()({
        fill,
    });
}

function getStrokeAndFillProps(options: StrokeAndFillOptions) {
    return {
        ...getStrokeProps(options),
        ...getFillProps(options),
    };
}

function getDebugStrokeOptions(color: string = DebugDraw.DEFAULT_DEBUG_COLOR): StrokeOptions {
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
    if (!label) return null;

    const adjustedPosition = Vector2.from(position).add(DebugDraw.LABEL_OFFSET);
    return (
        <text
            x={adjustedPosition.x}
            y={adjustedPosition.y}
            className="font-sans"
            textAnchor="middle"
            fontSize={4}
            {...getFillProps({ fill: color ?? DebugDraw.DEFAULT_DEBUG_COLOR })}
        >
            {label}
        </text>
    );
}

type DebugOptions = { color?: string; label?: string };

export function DebugSvgPath({ color, path }: { color?: string; path: string }) {
    return <path d={path} {...getStrokeProps(getDebugStrokeOptions(color))} fill="transparent" />;
}

export function DebugPointX({ position, ...debugOpts }: { position: Vector2Ish } & DebugOptions) {
    const { x, y } = Vector2.from(position);
    return (
        <>
            <DebugSvgPath
                {...debugOpts}
                path={new SvgPathBuilder()
                    .moveTo(x - DebugDraw.DEBUG_POINT_SIZE, y - DebugDraw.DEBUG_POINT_SIZE)
                    .lineTo(x + DebugDraw.DEBUG_POINT_SIZE, y + DebugDraw.DEBUG_POINT_SIZE)
                    .moveTo(x - DebugDraw.DEBUG_POINT_SIZE, y + DebugDraw.DEBUG_POINT_SIZE)
                    .lineTo(x + DebugDraw.DEBUG_POINT_SIZE, y - DebugDraw.DEBUG_POINT_SIZE)
                    .toString()}
            />
            <DebugLabel {...debugOpts} position={position} />
        </>
    );
}

export function DebugPointO({ position, ...debugOpts }: { position: Vector2Ish } & DebugOptions) {
    const { x, y } = Vector2.from(position);
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={DebugDraw.DEBUG_POINT_SIZE}
                {...getStrokeProps(getDebugStrokeOptions(debugOpts.color))}
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
    const start = Vector2.from(_start);
    const end = Vector2.from(_end);

    const vector = end.sub(start);
    const arrowLeftPoint = vector
        .rotate(-DebugDraw.DEBUG_ARROW_ANGLE)
        .withMagnitude(DebugDraw.DEBUG_ARROW_SIZE)
        .add(end);
    const arrowRightPoint = vector
        .rotate(+DebugDraw.DEBUG_ARROW_ANGLE)
        .withMagnitude(DebugDraw.DEBUG_ARROW_SIZE)
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
            <DebugLabel {...debugOpts} position={Vector2.average([start, end])} />
        </>
    );
}

export function DebugVectorAtPoint({
    vector,
    base,
    ...debugOpts
}: { vector: Vector2Ish; base: Vector2Ish } & DebugOptions) {
    return <DebugArrow {...debugOpts} start={base} end={Vector2.from(base).add(vector)} />;
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
                {...getStrokeAndFillProps(getDebugStrokeOptions(debugOpts.color))}
            />
            <DebugLabel {...debugOpts} position={center} />
        </>
    );
}
