import { assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { clamp, invLerp, mapRange } from "@/lib/utils";
import { inP3, inRGB, inRec2020, p3 } from "@/palette/colors";
import { Gamut } from "@/palette/schema";
import classNames from "classnames";
import { Color, Oklch, formatCss, formatHex8 } from "culori";
import { memo, useMemo, useRef, useState } from "react";

export const Controls = memo(function Controls({
    color,
    onChange,
    gamut,
}: {
    color: Oklch;
    onChange: (color: Oklch) => void;
    gamut: Gamut;
}) {
    return (
        <div className="grid h-32 w-full grid-cols-2 grid-rows-2 gap-1 p-1">
            <Slider
                color={color}
                onChange={onChange}
                label="Lightness"
                property="l"
                min={0}
                max={1}
                resolution={3}
                gamut={gamut}
            />
            <Slider
                color={color}
                onChange={onChange}
                label="Chroma"
                property="c"
                min={0}
                max={0.48}
                resolution={3}
                gamut={gamut}
            />
            <Slider
                color={color}
                onChange={onChange}
                label="Hue"
                property="h"
                min={0}
                max={360}
                resolution={1}
                gamut={gamut}
            />
        </div>
    );
});

function format(color: Color) {
    if (inRGB(color)) {
        return formatHex8(color);
    } else if (inP3(color)) {
        return formatCss(p3(color));
    } else {
        return formatCss(color);
    }
}

function Slider({
    color,
    onChange,
    label,
    property,
    resolution,
    min,
    max,
    gamut,
}: {
    color: Oklch;
    onChange: (newValue: Oklch) => void;
    label: string;
    property: "l" | "c" | "h";
    resolution: number;
    min: number;
    max: number;
    gamut: Gamut;
}) {
    const threshold = 0.6;
    const { gradient, transitionPoints } = useMemo(() => {
        const stops = [];
        const transitionPoints = [];
        let wasInRgb = null;
        let wasInP3 = null;
        let wasInGamut = null;

        let idx = 0;

        for (let i = min; i <= max; i += (max - min) / 200) {
            const value = { ...color, [property]: i };

            const isInRgb = inRGB(value);
            const isInP3 = inP3(value);
            const isInRec2020 = inRec2020(value);
            const isInGamut = gamut === "srgb" ? isInRgb : gamut === "p3" ? isInP3 : isInRec2020;

            if (wasInRgb !== null && isInRgb !== wasInRgb && gamut !== "srgb") {
                transitionPoints.push(invLerp(min, max, i));
            } else if (wasInP3 !== null && isInP3 !== wasInP3 && gamut === "rec2020") {
                transitionPoints.push(invLerp(min, max, i));
            }

            if (isInGamut !== wasInGamut) {
                if (isInGamut) {
                    stops.push(`${format({ ...value, alpha: 0 })} ${invLerp(min, max, i) * 100}%`);
                    stops.push(`${format(value)} ${invLerp(min, max, i) * 100}%`);
                } else {
                    stops.push(`${format(value)} ${invLerp(min, max, i) * 100}%`);
                    stops.push(`${format({ ...value, alpha: 0 })} ${invLerp(min, max, i) * 100}%`);
                }
            } else if (isInGamut) {
                if (idx % 5 === 0) {
                    stops.push(`${format(value)} ${invLerp(min, max, i) * 100}%`);
                }
            }

            wasInRgb = isInRgb;
            wasInP3 = isInP3;
            wasInGamut = isInGamut;
            idx++;
        }
        return { gradient: `linear-gradient(to right, ${stops.join(", ")})`, transitionPoints };
    }, [color, gamut, max, min, property]);

    const [dragState, setDragState] = useState<{
        pointerId: number;
        startPoint: Vector2;
        offset: number;
        couldBeClick: boolean;
    } | null>(null);

    const sliderRef = useRef<HTMLDivElement>(null);
    function pointToValue(point: Vector2) {
        const rect = assertExists(sliderRef.current).getBoundingClientRect();
        return mapRange(rect.left, rect.right, min, max, point.x);
    }

    function onPointerDown(e: React.PointerEvent) {
        if (dragState !== null || !e.isPrimary) return;
        setDragState({
            pointerId: e.pointerId,
            startPoint: Vector2.fromEvent(e),
            offset: pointToValue(Vector2.fromEvent(e)) - (color[property] ?? 0),
            couldBeClick: true,
        });
        assertExists(sliderRef.current).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: React.PointerEvent) {
        if (dragState === null || e.pointerId !== dragState.pointerId) return;
        const point = Vector2.fromEvent(e);
        if (dragState.couldBeClick && point.distanceTo(dragState.startPoint) > 3) {
            setDragState({ ...dragState, couldBeClick: false });
        }
        onChange({ ...color, [property]: clamp(min, max, pointToValue(point) - dragState.offset) });
    }

    function onPointerUp(e: React.PointerEvent) {
        if (dragState === null || e.pointerId !== dragState.pointerId) return;
        if (dragState.couldBeClick) {
            const point = Vector2.fromEvent(e);
            onChange({ ...color, [property]: clamp(min, max, pointToValue(point)) });
        }
        setDragState(null);
        assertExists(sliderRef.current).releasePointerCapture(e.pointerId);
    }

    return (
        <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
                <label className="flex-auto text-neutral-300">{label}</label>
                <input
                    className="h-6 w-24 flex-none rounded bg-neutral-700 px-2 leading-6"
                    value={(color[property] ?? 0).toFixed(resolution)}
                    type="number"
                    min={min}
                    max={max}
                    step={1 / 10 ** resolution}
                    onChange={(e) => {
                        const value = parseFloat(e.currentTarget.value);
                        if (!isNaN(value)) {
                            onChange({ ...color, [property]: value });
                        }
                    }}
                />
            </div>
            <div
                style={{ backgroundImage: gradient }}
                className="relative h-6 w-full touch-none overflow-hidden rounded bg-neutral-700"
                ref={sliderRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                {transitionPoints.map((t) => (
                    <div
                        key={t}
                        className="absolute bottom-0 top-0 h-full w-[2px] border-l border-black bg-white opacity-50"
                        style={{ left: t * 100 + "%" }}
                    />
                ))}
                <div
                    className={classNames(
                        "absolute left-0 top-0 -ml-px h-full w-[2px] pl-px",
                        color.l < threshold ? "bg-white" : "bg-black",
                    )}
                    style={{
                        left: `${invLerp(min, max, color[property] ?? 0) * 100}%`,
                    }}
                >
                    <div
                        className={classNames(
                            "absolute h-2 w-2 -translate-x-1 -translate-y-1 rotate-45",
                            color.l < threshold ? "bg-white" : "bg-black",
                        )}
                    />
                    <div
                        className={classNames(
                            "absolute bottom-0 h-2 w-2 -translate-x-1 translate-y-1 rotate-45",
                            color.l < threshold ? "bg-white" : "bg-black",
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
