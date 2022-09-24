import classNames from "classnames";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

export function Button({
    children,
    className,
    onClick,
    style,
    disabled,
}: {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={classNames(
                className,
                "rounded px-3 py-1 text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500",
            )}
            style={style}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
