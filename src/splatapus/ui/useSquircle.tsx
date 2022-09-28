import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useMemo } from "react";

export function useSquircleClipPath(element: Element | null): string {
    const size = useResizeObserver(element, sizeFromBorderBox) ?? Vector2.ZERO;
    return useMemo(() => {
        if (!size) {
            return "none";
        }
        const rounding = Math.min(size.x * 0.5, size.y * 0.5);
        const clipPath = [
            `M 0,${size.y / 2}`,
            `Q 0,0 ${rounding},0`,
            `T ${size.x - rounding},0`,
            `Q ${size.x},0 ${size.x},${size.y / 2}`,
            `Q ${size.x},${size.y} ${size.x - rounding},${size.y}`,
            `T ${rounding},${size.y}`,
            `Q 0,${size.y} 0,${size.y / 2}`,
            "Z",
        ].join(" ");

        return `path('${clipPath}')`;
    }, [size]);
}
