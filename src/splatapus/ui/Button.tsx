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
                "group rounded px-3 py-1 text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500",
            )}
            style={style}
            disabled={disabled}
        >
            <span className="inline-block transition-transform ease-out-back-xl group-hover:scale-110 group-active:scale-90">
                {children}
            </span>
        </button>
    );
}
