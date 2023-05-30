import { UpdateFn, copyArrayAndReplace } from "@/lib/utils";
import {
    clampP3,
    clampRec2020,
    clampRgb,
    formatP3AsCss,
    formatRec2020AsCss,
    formatRgbAsCss,
    inP3,
    inRGB,
    inRec2020,
    lrgb,
} from "@/palette/colors";
import { Axis, Palette } from "@/palette/schema";
import { useSupport } from "@/palette/support";
import classNames from "classnames";
import { Oklch, formatCss, wcagContrast } from "culori/fn";
import { CSSProperties, memo, useMemo, useState } from "react";
import { FaCompressAlt, FaExclamationTriangle } from "react-icons/fa";

export const YAxisName = memo(function YAxisName({
    palette,
    setPalette,
    index,
    axis,
}: {
    palette: Palette;
    setPalette: UpdateFn<Palette>;
    index: number;
    axis: Axis;
}) {
    const value = palette[axis][index] ?? "";
    return (
        <div className="flex h-32 w-8 flex-none flex-col items-end justify-end">
            <input
                className="h-8 w-32 flex-none origin-top-left translate-y-8 -rotate-90 self-start rounded bg-transparent text-center text-stone-300 hover:bg-neutral-700 focus:bg-neutral-700"
                value={value}
                onChange={(e) => {
                    setPalette((p) => ({
                        ...p,
                        [axis]: copyArrayAndReplace(p[axis], index, e.currentTarget.value),
                    }));
                }}
                autoFocus={value === ""}
            />
        </div>
    );
});

export const XAxisName = memo(function XAxisName({
    palette,
    setPalette,
    index,
    axis,
}: {
    palette: Palette;
    setPalette: UpdateFn<Palette>;
    index: number;
    axis: Axis;
}) {
    const value = palette[axis][index] ?? "";
    return (
        <input
            className="sticky -top-2 z-10 h-8 w-32 flex-none rounded bg-neutral-800 text-center text-stone-300 hover:bg-neutral-700 focus:bg-neutral-700 group-hover:bg-neutral-700 group-[.active]:bg-neutral-600 group-[.active]:text-neutral-200"
            value={value}
            onChange={(e) => {
                setPalette((p) => ({
                    ...p,
                    [axis]: copyArrayAndReplace(p[axis], index, e.currentTarget.value),
                }));
            }}
            autoFocus={value === ""}
        />
    );
});

const black: Oklch = { mode: "oklch", l: 0, c: 0, h: 0 };
export const Swatch = memo(function Swatch({ color = black }: { color?: Oklch }) {
    const support = useSupport();

    const css = useMemo(() => {
        const isInRgb = inRGB(color);
        const isInP3 = inP3(color);
        const isInRec2020 = inRec2020(color);

        const asRgb = clampRgb(color);
        const asP3 = clampP3(color);
        const asRec2020 = clampRec2020(color);

        let bestSupportedColor;
        let isSupported;
        if (isInRgb) {
            bestSupportedColor = asRgb;
            isSupported = true;
        } else if (isInP3 && support.p3Gamut) {
            bestSupportedColor = asP3;
            isSupported = true;
        } else if (isInRec2020 && support.rec2020Gamut) {
            bestSupportedColor = asRec2020;
            isSupported = true;
        } else {
            bestSupportedColor = support.rec2020Gamut ? asRec2020 : support.p3Gamut ? asP3 : asRgb;
            isSupported = false;
        }

        const isLight =
            wcagContrast(lrgb(bestSupportedColor), "#000") >
            wcagContrast(lrgb(bestSupportedColor), "#FFF");

        const uiDark = formatCss({
            mode: "oklch",
            l: 0.45,
            c: color.c * 0.75,
            h: color.h,
        });
        const uiLight = formatCss({
            mode: "oklch",
            l: 0.85,
            c: color.c * 0.75,
            h: color.h,
        });

        return {
            uiFg: isLight ? uiDark : uiLight,
            uiBg: isLight ? uiLight : uiDark,
            uiLight,
            uiDark,
            isLight,
            bestSupportedColor,
            srgb: {
                color: formatRgbAsCss(color),
                isClamped: !isInRgb,
                isSupported: true,
            },
            p3: {
                color: formatP3AsCss(color),
                isClamped: !isInP3,
                isSupported: isSupported || support.p3Gamut,
            },
            rec2020: {
                color: formatRec2020AsCss(color),
                isClamped: !isInRec2020,
                isSupported: isSupported || support.rec2020Gamut,
            },
            raw: {
                color: formatCss(color),
                isClamped: false,
                isSupported: isSupported,
            },
        };
    }, [color, support]);

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group/swatch h-32 w-32 flex-none overflow-hidden rounded p-0.5"
            style={
                {
                    backgroundColor: css.uiLight,
                    "--swatch-fg": css.uiFg,
                    "--swatch-bg": css.uiBg,
                } as CSSProperties
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-sm"
                style={{
                    backgroundColor: isHovered ? css.uiFg : formatCss(css.bestSupportedColor),
                }}
            >
                <Subswatch color={css.raw} space="Raw" />
                <Subswatch color={css.rec2020} space="R2020" />
                <Subswatch color={css.p3} space="P3" />
                <Subswatch color={css.srgb} space="sRGB" />
            </div>
        </div>
    );
});

const Subswatch = memo(function Subswatch({
    className = "",
    color: { color, isSupported, isClamped },
    space,
}: {
    className?: string;
    color: { color: string; isSupported: boolean; isClamped: boolean };
    space: string;
}) {
    let title;
    if (isClamped) {
        title = `Clamped to the ${space} gamut.`;
        if (!isSupported) {
            title += " Your device cannot accurately display this color.";
        }
    } else if (!isSupported) {
        title = `${space} gamut. Your device cannot accurately display this color.`;
    } else {
        title = `This color is in the ${space} gamut.`;
    }

    return (
        <div
            title={title}
            className={`flex flex-1 items-start justify-start p-1 ${className}`}
            style={{
                backgroundColor: color,
                backgroundImage: isSupported ? undefined : crossHatchBg,
                color: "var(--swatch-fg)",
            }}
        >
            <div
                className={classNames(
                    "flex-wrap items-center justify-center rounded-lg px-1.5 text-center text-xs leading-4",
                    !isSupported || isClamped ? "flex" : "hidden group-hover/swatch:flex",
                )}
                style={{ background: "var(--swatch-bg)", fontSize: "10px" }}
            >
                {!isSupported && <FaExclamationTriangle className="mr-1" />}
                {isClamped && <FaCompressAlt className="mr-1" />}
                {space}
            </div>
        </div>
    );
});

const crossHatchBg = `repeating-linear-gradient(
    45deg,
    var(--swatch-fg) 0px,
    var(--swatch-fg) 1px,
    rgba(0, 0, 0, 0) 1px,
    rgba(0, 0, 0, 0) 9px
)`;
