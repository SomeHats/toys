import { inOutCubic } from "@/lib/easings";
import { times } from "@/lib/utils";
import Color from "color";

export function makeGradient(color: Color, direction: string, size: number, opacity: number) {
    const stopCount = 10;
    const colorStops = times(
        stopCount,
        (i) =>
            `rgba(${color.red()}, ${color.green()}, ${color.blue()}, ${
                inOutCubic(i / (stopCount - 1)) * opacity
            }) ${(size * (i / (stopCount - 1))).toFixed(2)}px`,
    );
    return `linear-gradient(${direction}, ${colorStops.join(",")})`;
}
