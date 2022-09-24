import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import classNames from "classnames";
import { CSSProperties, MouseEventHandler, ReactNode, useState } from "react";

export function Button({
    children,
    className,
    onClick,
    style,
    disabled,
    pressed,
    iconLeft,
    iconRight,
}: {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
    disabled?: boolean;
    pressed?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
}) {
    const [element, setElement] = useState<null | HTMLButtonElement>(null);
    const clipPath = useSquircleClipPath(element);

    return (
        <button
            ref={setElement}
            onClick={onClick}
            className={classNames(
                className,
                "group inline-flex items-center justify-center gap-2 rounded px-4 py-1 text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500",
            )}
            style={{
                ...(style ?? {}),
                clipPath,
            }}
            disabled={disabled}
        >
            {iconLeft}
            <span
                className={classNames(
                    "inline-block transition-transform duration-200 ease-out-back-xl group-hover:scale-110 group-active:scale-90",
                    pressed && "scale-90",
                )}
            >
                {children}
            </span>
            {iconRight}
        </button>
    );
}
