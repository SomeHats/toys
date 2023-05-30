/**
 * Adapted from https://github.com/evilmartians/oklch-picker/blob/a8d6d42e68c9a6aed4f09a42dff469ce3836ba90/lib/colors.ts
 * Copyright 2022 Andrey Sitnik <andrey@sitnik.ru>, Roman Shamin <roma@evilmartians.com>.
 * @license MIT
 */
import { Color, Lch, Oklch, P3, Rec2020, Rgb, formatHex } from "culori/fn";

import {
    clampChroma,
    clampGamut,
    useMode as culoriUseMode,
    formatCss,
    formatRgb as formatRgbFast,
    modeHsl,
    modeLab,
    modeLch,
    modeLrgb,
    modeOklab,
    modeOklch,
    modeP3,
    modeRec2020,
    modeRgb,
    modeXyz65,
    parse as originParse,
} from "culori/fn";

export type { Rgb } from "culori/fn";

export type AnyLch = Lch | Oklch;
export type AnyRgb = Rgb | P3 | Rec2020;

export const rec2020 = culoriUseMode(modeRec2020);
export const oklch = culoriUseMode(modeOklch);
export const oklab = culoriUseMode(modeOklab);
export const xyz65 = culoriUseMode(modeXyz65);
export const rgb = culoriUseMode(modeRgb);
export const lrgb = culoriUseMode(modeLrgb);
export const lch = culoriUseMode(modeLch);
export const hsl = culoriUseMode(modeHsl);
export const lab = culoriUseMode(modeLab);
export const p3 = culoriUseMode(modeP3);

export const GAMUT_EPSILON = 1e-6;
export const COLOR_FN = "oklch";

export const L_MAX = 1;
export const L_STEP = 1;

export const C_MAX = 0.37;
export const C_MAX_REC2020 = 0.47;
export const C_STEP = 0.01;
export const C_RANDOM = 0.1;

export const H_MAX = 360;
export const H_STEP = 0.45;

export const ALPHA_MAX = 100;
export const ALPHA_STEP = 5;

const GAMUT_MIN = -GAMUT_EPSILON;
const GAMUT_MAX = 1 + GAMUT_EPSILON;

// export const clampRgb = toGamut("rgb");
// export const clampP3 = toGamut("p3");
// export const clampRec2020 = toGamut("rec2020");
export const clampRgb = clampGamut("rgb");
export const clampP3 = clampGamut("p3");
export const clampRec2020 = clampGamut("rec2020");

export function inRGB(color: Color): boolean {
    const { r, g, b } = rgb(color);
    return (
        r >= GAMUT_MIN &&
        r <= GAMUT_MAX &&
        g >= GAMUT_MIN &&
        g <= GAMUT_MAX &&
        b >= GAMUT_MIN &&
        b <= GAMUT_MAX
    );
}

export function inP3(color: Color): boolean {
    const { r, g, b } = p3(color);
    return (
        r >= GAMUT_MIN &&
        r <= GAMUT_MAX &&
        g >= GAMUT_MIN &&
        g <= GAMUT_MAX &&
        b >= GAMUT_MIN &&
        b <= GAMUT_MAX
    );
}

export function inRec2020(color: Color): boolean {
    const { r, g, b } = rec2020(color);
    return (
        r >= GAMUT_MIN &&
        r <= GAMUT_MAX &&
        g >= GAMUT_MIN &&
        g <= GAMUT_MAX &&
        b >= GAMUT_MIN &&
        b <= GAMUT_MAX
    );
}

export function build(l: number, c: number, h: number, alpha = 1): AnyLch {
    return { mode: COLOR_FN, l, c, h, alpha };
}

export const toTarget = oklch;

export const fastLchFormat: (c: AnyLch) => string = fastFormatToLch;

export const canvasFormat: (c: AnyLch) => string = formatRgbFast;

export function fastFormat(color: Color): string {
    if (color.mode === COLOR_FN) {
        return fastLchFormat(color);
    } else {
        return formatRgbFast(color);
    }
}
function formatP3Css(c: Color): string {
    return formatCss(p3(c));
}

function fastFormatToLch(color: AnyLch): string {
    const { l, c, h, alpha } = color;
    const a = alpha ?? 1;
    return `${COLOR_FN}(${(100 * l) / L_MAX}% ${c} ${h} / ${100 * a})`;
}

// support.subscribe((value) => {
//     fastLchFormat = value.oklch ? fastFormatToLch : formatRgbFast;
//     canvasFormat = value.p3 ? formatP3Css : formatRgbFast;
// });

export function parse(value: string): Color | undefined {
    return originParse(value.trim());
}

export function parseAnything(value: string): Color | undefined {
    value = value.replace(/\s*;\s*$/, "");
    if (/^[\w-]+:\s*(#\w+|\w+\([^)]+\))$/.test(value)) {
        value = value.replace(/^[\w-]+:\s*/, "");
    }
    return parse(value);
}

export function toRgb(color: Color): Rgb {
    return rgb(clampChroma(color, COLOR_FN));
}

export function toP3(color: Color): P3 {
    return p3(clampChroma(color, COLOR_FN));
}

export function toRec2020(color: Color): P3 {
    return p3(clampChroma(color, COLOR_FN));
}

export function formatRgb(color: Rgb): string {
    const r = Math.round(25500 * color.r) / 100;
    const g = Math.round(25500 * color.g) / 100;
    const b = Math.round(25500 * color.b) / 100;
    if (typeof color.alpha !== "undefined" && color.alpha < 1) {
        return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export function formatLch(color: AnyLch): string {
    const { l, c, h, alpha } = color;
    let postfix = "";
    if (typeof alpha !== "undefined" && alpha < 1) {
        postfix = ` / ${toPercent(alpha)}`;
    }
    return `${COLOR_FN}(${toPercent(l / L_MAX)} ${c} ${h}${postfix})`;
}

// Hack to avoid ,999999 because of float bug implementation
export function clean(value: number): number {
    return Math.round(parseFloat((value * 10 ** 4).toFixed(4))) / 10 ** 4;
}

export function toPercent(value: number): string {
    return `${clean(100 * value)}%`;
}

export enum Space {
    sRGB,
    P3,
    Rec2020,
    Out,
}

const getProxyColor = rgb;

export function getSpace(color: Color): Space {
    const proxyColor = getProxyColor(color);
    if (inRGB(proxyColor)) {
        return Space.sRGB;
    } else if (inP3(proxyColor)) {
        return Space.P3;
    } else if (inRec2020(proxyColor)) {
        return Space.Rec2020;
    } else {
        return Space.Out;
    }
}

export function formatRgbAsCss(color: Color): string {
    if (!inRGB(color)) return formatRgbAsCss(clampRgb(color));
    const asRgb = rgb(color);
    return formatHex(asRgb);
}

export function formatP3AsCss(color: Color): string {
    if (!inP3(color)) return formatP3AsCss(clampP3(color));
    const asP3 = p3(color);
    return formatCss({
        ...asP3,
        r: Number(asP3.r.toFixed(4)),
        g: Number(asP3.g.toFixed(4)),
        b: Number(asP3.b.toFixed(4)),
    });
}

export function formatRec2020AsCss(color: Color): string {
    if (!inRec2020(color)) return formatRec2020AsCss(clampRec2020(color));
    const asRec2020 = rec2020(color);
    return formatCss({
        ...asRec2020,
        r: Number(asRec2020.r.toFixed(4)),
        g: Number(asRec2020.g.toFixed(4)),
        b: Number(asRec2020.b.toFixed(4)),
    });
}
