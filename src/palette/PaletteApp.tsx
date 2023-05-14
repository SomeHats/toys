import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useStorageState, useUrlStorageState } from "@/lib/hooks/useStoredState";
import { Schema, SchemaType } from "@/lib/schema";
import { GamutPicker } from "@/palette/GamutPicker";
import { Swatches } from "@/palette/Swatches";
import { Palette, gamutSchema, paletteSchema } from "@/palette/schema";
import { useSupport } from "@/palette/support";
import { RadioGroup } from "@headlessui/react";
import { useEffect } from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

const defaultPalette: Palette = {
    families: ["red", "green", "blue"],
    shades: ["light", "medium", "dark"],
    colors: [
        [
            { mode: "oklch", l: 90, c: 50, h: 0 },
            { mode: "oklch", l: 90, c: 50, h: 120 },
            { mode: "oklch", l: 90, c: 50, h: 240 },
        ],
        [
            { mode: "oklch", l: 50, c: 50, h: 0 },
            { mode: "oklch", l: 50, c: 50, h: 120 },
            { mode: "oklch", l: 50, c: 50, h: 240 },
        ],
        [
            { mode: "oklch", l: 10, c: 50, h: 0 },
            { mode: "oklch", l: 10, c: 50, h: 120 },
            { mode: "oklch", l: 10, c: 50, h: 240 },
        ],
    ],
};

export function PaletteApp() {
    const support = useSupport();
    if (!support.oklchSyntax) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 text-2xl text-slate-300">
                    Your browser does not support oklch colors. Sorry! Try a recent Chrome or
                    Safari.
                </div>
            </div>
        );
    }

    return <PaletteAppInner />;
}

function PaletteAppInner() {
    const support = useSupport();
    const [gamut, setGamut] = useUrlStorageState("gamut", gamutSchema, () => {
        if (support.rec2020Gamut) return "rec2020";
        if (support.p3Gamut) return "p3";
        return "srgb";
    });
    const [palette, setPalette] = useUrlStorageState("palette", paletteSchema, defaultPalette);

    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="flex flex-none items-center justify-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
                <div className="mr-auto">Palette thingy</div>
                <GamutPicker value={gamut} onChange={setGamut} />
            </div>
            <Swatches palette={palette} gamut={gamut} />
        </div>
    );
}
