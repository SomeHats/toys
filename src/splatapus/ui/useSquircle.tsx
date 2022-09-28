import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useMemo } from "react";

export function useSquircleClipPath(element: Element | null, maxRadius = Infinity): string {
    const size = useResizeObserver(element, sizeFromBorderBox) ?? Vector2.ZERO;
    return useMemo(() => {
        if (!size) {
            return "none";
        }
        const rounding = Math.min(size.x * 0.5, size.y * 0.5, maxRadius);
        const clipPath = [
            `M 0,${rounding}`,
            `Q 0,0 ${rounding},0`,
            `T ${size.x - rounding},0`,
            `Q ${size.x},0 ${size.x},${rounding}`,
            `T ${size.x},${size.y - rounding}`,
            `Q ${size.x},${size.y} ${size.x - rounding},${size.y}`,
            `T ${rounding},${size.y}`,
            `Q 0,${size.y} 0,${size.y - rounding}`,
            "Z",
        ].join(" ");

        return `path('${clipPath}')`;
    }, [size, maxRadius]);
}
