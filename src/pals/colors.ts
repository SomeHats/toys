import { color, RGBColor, HSLColor, hsl } from "d3-color";
import { assert } from "../lib/assert";
import { constrain, constrainWrapped } from "../lib/utils";

export type Color = RGBColor | HSLColor;

function makeColor(hex: string): Color {
  const newColor = color(hex);
  assert(newColor);
  return Object.freeze(newColor);
}

// https://coolors.co/f8ffe5-06d6a0-1b9aaa-ef476f-ffc43d
export const LIGHT_BG = makeColor("#F8FFE5");
export const TEAL = makeColor("#06D6A0");
export const BLUE = makeColor("#1B9AAA");
export const RED = makeColor("#EF476F");
export const YELLOW = makeColor("#FFC43D");

export function rotate(color: Color, degrees: number): HSLColor {
  const hslColor = hsl(color);
  // hslColor.h = constrainWrapped(0, 36, hslColor.h + degrees);
  return hslColor;
}

export function saturate(color: Color, ratio: number): HSLColor {
  const hslColor = hsl(color);
  hslColor.s = constrain(0, 1, hslColor.s + hslColor.s * ratio);
  return hslColor;
}

export function darken(color: Color, ratio: number): HSLColor {
  const hslColor = hsl(color);
  hslColor.l = constrain(0, 1, hslColor.l - hslColor.l * ratio);
  return hslColor;
}
