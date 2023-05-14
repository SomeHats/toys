import { Result } from "@/lib/Result";
import { Schema, SchemaType } from "@/lib/schema";
import { Oklch } from "culori";

export const lchColorSchema = Schema.object({
    l: Schema.number,
    c: Schema.number,
    h: Schema.number.optional(),
})
    .indexed({ l: 0, c: 1, h: 2 })
    .transform<Oklch>(
        ({ l, c, h }) => Result.ok({ mode: "oklch", l, c, h }),
        ({ l, c, h }) => ({ l, c, h }),
    );

export const paletteSchema = Schema.object({
    families: Schema.arrayOf(Schema.string),
    shades: Schema.arrayOf(Schema.string),
    colors: Schema.arrayOf(Schema.arrayOf(lchColorSchema)),
});
export type Palette = SchemaType<typeof paletteSchema>;

export const gamutSchema = Schema.valueUnion("srgb", "p3", "rec2020");
export type Gamut = SchemaType<typeof gamutSchema>;
