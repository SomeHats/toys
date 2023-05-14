import { Gamut, Palette } from "@/palette/schema";
import { useSupport } from "@/palette/support";
import { Oklch } from "culori";
import { useMemo } from "react";

export function Swatches({ palette, gamut }: { palette: Palette; gamut: Gamut }) {
    return (
        <div className="flex">
            {palette.families.map((family, familyIndex) => (
                <div key={familyIndex} className="flex flex-1 flex-col">
                    {palette.shades.map((shade, shadeIndex) => (
                        <Swatch
                            key={shadeIndex}
                            color={palette.colors[familyIndex][shadeIndex]}
                            familyIndex={familyIndex}
                            shadeIndex={shadeIndex}
                            gamut={gamut}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

const black: Oklch = { mode: "oklch", l: 0, c: 0, h: 0 };
function Swatch({
    color = black,
    familyIndex,
    shadeIndex,
    gamut,
}: {
    color?: Oklch;
    familyIndex: number;
    shadeIndex: number;
    gamut: Gamut;
}) {
    const support = useSupport();
    // const css = useMemo(() => {}, [color]);

    return <div className="flex flex-1 flex-col"></div>;
}
