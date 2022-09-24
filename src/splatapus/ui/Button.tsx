import Vector2 from "@/lib/geom/Vector2";
import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { invLerp, lerp, mapRange } from "@/lib/utils";
import classNames from "classnames";
import { CSSProperties, MouseEventHandler, ReactNode, useMemo, useState } from "react";

export function Button({
    children,
    className,
    onClick,
    style,
    disabled,
    pressed,
}: {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
    disabled?: boolean;
    pressed?: boolean;
}) {
    const [element, setElement] = useState<null | HTMLButtonElement>(null);
    const size = useResizeObserver(element, sizeFromBorderBox) ?? Vector2.ZERO;
    const clipPath = useMemo(() => {
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
    }, [size.x, size.y]);

    console.log({ clipPath });
    return (
        <button
            ref={setElement}
            onClick={onClick}
            className={classNames(
                className,
                "group rounded px-4 py-1 text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500",
            )}
            style={{
                ...(style ?? {}),
                clipPath,
            }}
            disabled={disabled}
        >
            <span
                className={classNames(
                    "inline-block transition-transform duration-200 ease-out-back-xl group-hover:scale-110 group-active:scale-90",
                    pressed && "scale-90",
                )}
            >
                {children}
            </span>
        </button>
    );
}
