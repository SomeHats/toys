import Vector2 from "@/lib/geom/Vector2";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import { ReactNode, useState } from "react";

const rightBarStyle = {
    width: SIDEBAR_WIDTH_PX,
};

export function UiOverlayFrame({
    topBarRight,
    topBarLeft,
    rightBar,
    size,
}: {
    topBarRight: ReactNode;
    topBarLeft: ReactNode;
    rightBar: ReactNode;
    size: Vector2;
}) {
    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-stretch">
            <div className="pointer-events-auto flex flex-none items-center justify-between gap-3 bg-stone-100 px-3 py-2">
                <h1 className="order-1 flex-1 font-bold tracking-wide text-stone-600">splatapus</h1>
                <div className="order-2 flex flex-1 items-center justify-center gap-2">
                    {topBarLeft}
                </div>
                <div className="order-3 flex flex-1 items-center justify-end gap-2">
                    {topBarRight}
                </div>
            </div>
            <div className="flex flex-auto items-stretch justify-end">
                <div className="pointer-events-auto h-full bg-stone-100" style={rightBarStyle}>
                    {rightBar}
                </div>
            </div>
        </div>
    );
}
