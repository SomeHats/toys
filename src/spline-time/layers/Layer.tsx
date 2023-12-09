import { SplineTimeLine } from "@/spline-time/SplineTimeLine";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

export type LayerProps = {
    line: SplineTimeLine;
    showExtras: boolean;
    uiTarget: HTMLDivElement;
};
export type Layer = (props: LayerProps) => ReactNode;

export function LayerUi({
    label,
    uiTarget,
    children,
}: {
    label: string;
    uiTarget: HTMLElement;
    children?: ReactNode;
}) {
    return createPortal(
        <div
            className="flex items-baseline justify-between gap-3"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerCancel={(e) => e.stopPropagation()}
        >
            <div className="flex-auto p-3 font-semibold text-stone-500">
                {label}
            </div>
            <div className="flex flex-none items-center justify-center gap-3 p-3">
                {children}
            </div>
        </div>,
        uiTarget,
    );
}
