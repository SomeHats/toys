import Vector2 from "@/lib/geom/Vector2";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { ReactNode } from "react";

const rightBarStyle = {
    width: SIDEBAR_WIDTH_PX,
};

export function UiOverlayFrame({
    topBarRight,
    topBarLeft,
    rightBar,
    leftBar,
    size,
}: {
    topBarRight: ReactNode;
    topBarLeft: ReactNode;
    rightBar: ReactNode;
    leftBar: ReactNode;
    size: Vector2;
}) {
    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-stretch">
            <div className="pointer-events-auto flex flex-none items-center justify-between gap-3 bg-stone-100 px-3 py-2">
                <div className="flex items-center justify-start">{topBarLeft}</div>
                <div className="flex items-center justify-end">{topBarRight}</div>
            </div>
            <div className="flex flex-auto items-stretch justify-between">
                {leftBar}
                <div className="pointer-events-auto h-full bg-stone-100" style={rightBarStyle}>
                    {rightBar}
                </div>
            </div>
        </div>
    );
}
