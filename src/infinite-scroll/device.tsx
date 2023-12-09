import { targetHeightPx, targetWidthPx } from "@/infinite-scroll/contants";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import {
    sizeFromBorderBox,
    sizeFromContentRect,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import { noop } from "@/lib/utils";
import { ReactNode, useLayoutEffect, useState } from "react";

export function DeviceContent({
    scale,
    children,
    className,
    onSizeChange = noop,
}: {
    scale: number;
    children: ReactNode;
    className?: string;
    onSizeChange?: (size: Vector2) => void;
}) {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(element, sizeFromBorderBox);

    const sizeChangeEvent = useEvent(onSizeChange);
    useLayoutEffect(() => {
        if (size) {
            sizeChangeEvent(size.scale(scale));
        }
    }, [size, sizeChangeEvent, scale]);

    return (
        <div
            ref={setElement}
            className={className}
            style={{
                transform: `scale(${scale})`,
                width: targetWidthPx,
                transformOrigin: "top left",
                position: "absolute",
            }}
        >
            {children}
        </div>
    );
}

export function DeviceContainer({
    children,
}: {
    children: (scale: number) => ReactNode;
}) {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    let scale = 1;
    if (size) {
        scale = Math.min(size.x / targetWidthPx, size.y / targetHeightPx);
    }

    return (
        <div
            className="relative flex min-h-0 min-w-0 flex-auto items-center justify-center"
            ref={setContainer}
        >
            <div
                className="relative overflow-hidden rounded-md border border-stone-200 shadow-lg"
                style={{
                    width: targetWidthPx * scale,
                    height: targetHeightPx * scale,
                }}
            >
                <div className="absolute inset-0 h-full w-full">
                    {children(scale)}
                </div>
            </div>
        </div>
    );
}
