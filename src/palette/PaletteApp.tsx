import { assertExists } from "@/lib/assert";
import { useUrlStorageState } from "@/lib/hooks/useStoredState";
import { Schema } from "@/lib/schema";
import { clamp, copyAndRemove, copyArrayAndReplace } from "@/lib/utils";
import { Controls } from "@/palette/Controls";
import { GamutPicker } from "@/palette/GamutPicker";
import { Swatch, XAxisName, YAxisName } from "@/palette/Swatches";
import { Palette, axisSchema, gamutSchema, paletteSchema } from "@/palette/schema";
import { useSupport } from "@/palette/support";
import classNames from "classnames";
import { oklch } from "culori";
import { FaPlus, FaSync, FaTrash } from "react-icons/fa";

const defaultPalette: Palette = {
    families: [
        "black",
        "grey",
        "white",
        "green",
        "light-green",
        "blue",
        "light-blue",
        "violet",
        "light-violet",
        "red",
        "light-red",
        "orange",
        "yellow",
    ],
    shades: ["light-mode", "dark-mode"],
    colors: [
        [assertExists(oklch("#1d1d1d")), assertExists(oklch("#e1e1e1"))],
        [assertExists(oklch("#adb5bd")), assertExists(oklch("#93989f"))],
        [assertExists(oklch("#ffffff")), assertExists(oklch("#1d1d1d"))],
        [assertExists(oklch("#099268")), assertExists(oklch("#3b7b5e"))],
        [assertExists(oklch("#40c057")), assertExists(oklch("#599f57"))],
        [assertExists(oklch("#4263eb")), assertExists(oklch("#4156be"))],
        [assertExists(oklch("#4dabf7")), assertExists(oklch("#588fc9"))],
        [assertExists(oklch("#ae3ec9")), assertExists(oklch("#873fa3"))],
        [assertExists(oklch("#e599f7")), assertExists(oklch("#b583c9"))],
        [assertExists(oklch("#e03131")), assertExists(oklch("#aa3c37"))],
        [assertExists(oklch("#ff8787")), assertExists(oklch("#c67877"))],
        [assertExists(oklch("#f76707")), assertExists(oklch("#bf612e"))],
        [assertExists(oklch("#ffc078")), assertExists(oklch("#cba371"))],
    ],
};

export function PaletteApp() {
    const support = useSupport();
    if (!support.oklchSyntax) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 text-2xl text-neutral-300">
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
    const [palette, setPalette] = useUrlStorageState("palette", paletteSchema, defaultPalette, {
        delayMs: 1000,
    });
    const [axis, setAxis] = useUrlStorageState("axis", axisSchema, "shades");
    const [rawSelectedIndex, setSelectedIndex] = useUrlStorageState("selected", Schema.number, 0);
    const selectedIndex = clamp(0, palette[axis].length - 1, rawSelectedIndex);

    const xAxis = axis;
    const yAxis = axis === "shades" ? "families" : "shades";

    const onClickXAxis = (index: number) => () => setSelectedIndex(index);

    function onAddFamily() {
        setPalette((p) => ({
            ...p,
            families: [...p.families, ""],
            colors: [...p.colors, p.colors[axis === "families" ? selectedIndex : 0]],
        }));
        if (axis === "families") setSelectedIndex(palette.families.length);
    }
    function onAddShade() {
        setPalette((p) => ({
            ...p,
            shades: [...p.shades, ""],
            colors: p.colors.map((row) => [...row, row[axis === "shades" ? selectedIndex : 0]]),
        }));
        if (axis === "shades") setSelectedIndex(palette.shades.length);
    }

    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="flex flex-none items-center justify-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4 py-2">
                <div className="mr-auto">Palette thingy</div>
                <GamutPicker value={gamut} onChange={setGamut} />
            </div>
            <div className="relative grid flex-auto grid-cols-[40px_max-content_minmax(40vw,500px)] grid-rows-[40px_max-content_40px] overflow-auto">
                {/* top-right button (1,1) */}
                <div className="sticky left-0 top-0 z-30 bg-neutral-800 p-1">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-neutral-700"
                        onClick={() => setAxis(yAxis)}
                    >
                        <FaSync />
                    </button>
                </div>
                {/* column names (2,1) */}
                <div className="sticky top-0 z-20 flex bg-neutral-800">
                    {palette[xAxis].map((_, xIndex) => (
                        <div
                            key={xIndex}
                            className={classNames(
                                "p-1",
                                xIndex === selectedIndex && "active group bg-neutral-600",
                            )}
                            onClick={onClickXAxis(xIndex)}
                        >
                            <XAxisName
                                key={xIndex}
                                palette={palette}
                                setPalette={setPalette}
                                axis={xAxis}
                                index={xIndex}
                            />
                        </div>
                    ))}
                </div>
                {/* details heading cover/add button (3,1) */}
                <div className="sticky right-0 top-0 z-20 bg-neutral-800 p-1">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-neutral-700"
                        onClick={axis === "shades" ? onAddShade : onAddFamily}
                    >
                        <FaPlus />
                    </button>
                </div>
                {/* row names (1,2) */}
                <div className="sticky left-0 z-20 flex flex-col gap-2 bg-neutral-800 p-1">
                    {palette[yAxis].map((_, yIndex) => (
                        <YAxisName
                            key={yIndex}
                            palette={palette}
                            setPalette={setPalette}
                            axis={yAxis}
                            index={yIndex}
                        />
                    ))}
                </div>
                {/* swatches table (2,2) */}
                <div className="flex items-start justify-start">
                    {palette[xAxis].map((_, xIndex) => (
                        <div
                            key={xIndex}
                            className={classNames(
                                "flex flex-col gap-2 p-1",
                                xIndex === selectedIndex && "bg-neutral-600",
                            )}
                            onClick={onClickXAxis(xIndex)}
                        >
                            {palette[yAxis].map((_, yIndex) => (
                                <Swatch
                                    key={yIndex}
                                    color={
                                        axis === "families"
                                            ? palette.colors[xIndex]?.[yIndex]
                                            : palette.colors[yIndex]?.[xIndex]
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
                {/* details (4,2) */}
                <div className="sticky right-0 z-10 flex flex-col items-start justify-start gap-2 bg-neutral-800">
                    {palette[yAxis].map((_, yIndex) => (
                        <Controls
                            key={yIndex}
                            gamut={gamut}
                            color={
                                axis === "families"
                                    ? palette.colors[selectedIndex][yIndex]
                                    : palette.colors[yIndex][selectedIndex]
                            }
                            onChange={(color) => {
                                setPalette((p) => ({
                                    ...p,
                                    colors: copyArrayAndReplace(
                                        p.colors,
                                        axis === "families" ? selectedIndex : yIndex,
                                        copyArrayAndReplace(
                                            p.colors[axis === "families" ? selectedIndex : yIndex],
                                            axis === "families" ? yIndex : selectedIndex,
                                            color,
                                        ),
                                    ),
                                }));
                            }}
                        />
                    ))}
                </div>
                {/* add row (1,3) */}
                <div className="sticky bottom-0 left-0 z-30 bg-neutral-800 p-1">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-neutral-700"
                        onClick={axis === "shades" ? onAddFamily : onAddShade}
                    >
                        <FaPlus />
                    </button>
                </div>
                {/* delete column (2,3) */}
                <div className="sticky bottom-0 z-30 flex gap-2 bg-neutral-800">
                    {palette[xAxis].map((_, xIndex) => (
                        <div
                            key={xIndex}
                            className={classNames(
                                "flex w-32  items-center justify-center p-1",
                                xIndex === selectedIndex && "bg-neutral-700",
                            )}
                            onClick={() => {
                                setPalette((p) => ({
                                    ...p,
                                    [xAxis]: copyAndRemove(p[xAxis], xIndex),
                                    colors:
                                        xAxis === "families"
                                            ? copyAndRemove(p.colors, xIndex)
                                            : p.colors.map((row) => copyAndRemove(row, xIndex)),
                                }));
                            }}
                        >
                            <FaTrash />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
