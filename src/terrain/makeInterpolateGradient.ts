import { invLerp } from "@/lib/utils";
import { interpolate } from "d3-interpolate";

export default function makeInterpolateGradient(
    stops: { color: string; stop: number }[],
) {
    return (n: number): string => {
        if (n <= 0) {
            return stops[0].color;
        }
        if (n >= 1) {
            return stops[stops.length - 1].color;
        }

        const startIndex = stops.findIndex(({ stop }) => stop >= n);
        const start = stops[startIndex - 1];
        const end = stops[startIndex];

        return interpolate(
            start.color,
            end.color,
        )(invLerp(start.stop, end.stop, n));
    };
}
