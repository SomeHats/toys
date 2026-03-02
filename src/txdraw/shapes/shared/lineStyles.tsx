import { assert, assertExists } from "@/lib/assert";
import { get } from "@/lib/utils";

type Style =
    | "Blank"
    | "single"
    | "thick"
    | "double"
    | "dashed-single"
    | "dashed-double";

enum LineStyle {
    Blank = 0b000,
    Single = 0b001,
    Thick = 0b010,
    Double = 0b011,
    DashedSingle = 0b100,
    DashedThick = 0b101,
    Ascii = 0b110,
    SPARE = 0b111,
}

const TOP = 0;
const RIGHT = 3;
const BOTTOM = 6;
const LEFT = 12;

const nToChar: Record<number, string> = {};
const charToN: Record<string, number> = {};

const chars = `
─ = _ s _ s
━ = _ t _ t
│ = s _ s _
┃ = t _ t _
┄ = _ d _ d
┅ = _ D _ D
┊ = d _ d _
┋ = D _ D _
┌ = _ s s _
┍ = _ t s _
┎ = _ s t _
┏ = _ t t _
┐ = _ _ s s
┑ = _ _ s t
┒ = _ _ t s
┓ = _ _ t t
└ = s s _ _
┕ = s t _ _
┖ = t s _ _
┗ = t t _ _
┘ = s _ _ s
┙ = s _ _ t
┚ = t _ _ s
┛ = t _ _ t
├ = s s s _
┝ = s t s _
┞ = t s s _
┟ = s s t _
┠ = t s t _
┡ = t t s _
┢ = s t t _
┣ = t t t _
┤ = s _ s s
┥ = s _ s t
┦ = t _ s s
┧ = s _ t s
┨ = t _ t s
┩ = t _ s t
┪ = s _ t t
┫ = t _ t t
┬ = _ s s s
┭ = _ s s t
┮ = _ t s s
┯ = _ t s t
┰ = _ s t s
┱ = _ s t t
┲ = _ t t s
┳ = _ t t t
┴ = s s _ s
┵ = s s _ t
┶ = s t _ s
┷ = s t _ t
┸ = t s _ s
┹ = t s _ t
┺ = t t _ s
┻ = t t _ t
┼ = s s s s
┽ = s s s t
┾ = s t s s
┿ = s t s t
╀ = t s s s
╁ = s s t s
╂ = t s t s
╃ = t s s t
╄ = t t s s
╅ = s s t t
╆ = s t t s
╇ = t t s t
╈ = s t t t
╉ = t s t t
╊ = t t t s
╋ = t t t t
═ = _ 2 _ 2
║ = 2 _ 2 _
╒ = _ 2 s _
╓ = _ s 2 _
╔ = _ 2 2 _
╕ = _ _ s 2
╖ = _ _ 2 s
╗ = _ _ 2 2
╘ = s 2 _ _
╙ = 2 s _ _
╚ = 2 2 _ _
╛ = s _ _ 2
╜ = 2 _ _ s
╝ = 2 _ _ 2
╞ = s 2 s _
╟ = 2 s 2 _
╠ = 2 2 2 _
╡ = s _ s 2
╢ = 2 _ 2 s
╣ = 2 _ 2 2
╤ = _ 2 s 2
╥ = _ s 2 s
╦ = _ 2 2 2
╧ = s 2 _ 2
╨ = 2 s _ s
╩ = 2 2 _ 2
╪ = s 2 s 2
╫ = 2 s 2 s
╬ = 2 2 2 2
`;

const charToStyle = {
    _: LineStyle.Blank,
    s: LineStyle.Single,
    t: LineStyle.Thick,
    d: LineStyle.DashedSingle,
    D: LineStyle.DashedThick,
    "2": LineStyle.Double,
};
for (const line of chars.split("\n")) {
    if (!line) continue;
    const parts = line.split(" ");
    assert(parts.length === 6);
    assert(parts[1] === "=");
    const char = parts[0];
    const top = getStyleFromChar(parts[2]);
    const right = getStyleFromChar(parts[3]);
    const bottom = getStyleFromChar(parts[4]);
    const left = getStyleFromChar(parts[5]);

    const n =
        (top << TOP) | (right << RIGHT) | (bottom << BOTTOM) | (left << LEFT);

    nToChar[n] = char;
    charToN[char] = n;
}

function getStyleFromChar(char: string) {
    return assertExists(get(charToStyle, char));
}

console.log({ nToChar, charToN });
