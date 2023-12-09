import { useLiveValue } from "@/lib/live";
import { Transition } from "@/lib/react/Transition";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { ReactNode } from "react";

const rightBarStyle = {
    width: SIDEBAR_WIDTH_PX,
};

const CORNER_ROUNDING = 20;
const ROUNDED_CORNER = (
    <svg
        viewBox={`0 0 ${CORNER_ROUNDING} ${CORNER_ROUNDING}`}
        className="flex-none"
        style={{ width: CORNER_ROUNDING, height: CORNER_ROUNDING }}
    >
        <path
            className="fill-stone-100"
            d={[
                `M 0,0`,
                `L ${CORNER_ROUNDING},0`,
                `L ${CORNER_ROUNDING},${CORNER_ROUNDING}`,
                `Q ${CORNER_ROUNDING},0 0,0`,
                "Z",
            ].join(" ")}
        />
    </svg>
);

export function UiOverlayFrame({
    topBarRight,
    topBarLeft,
    rightBar,
    bottomBarLeft,
    bottomBarRight,
    splatapus,
}: {
    topBarRight: ReactNode;
    topBarLeft: ReactNode;
    bottomBarRight: ReactNode;
    bottomBarLeft: ReactNode;
    rightBar: ReactNode;
    splatapus: Splatapus;
}) {
    const isSidebarOpen = useLiveValue(splatapus.viewport.isSidebarOpen);

    return (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-stretch">
            <div className="pointer-events-auto flex flex-none items-center justify-between gap-3 bg-stone-100 px-3 py-2">
                <h1 className="order-1 flex-1 font-bold tracking-wide text-stone-600">
                    splatapus
                </h1>
                <div className="order-2 flex flex-1 items-center justify-center gap-2">
                    {topBarLeft}
                </div>
                <div className="order-3 flex flex-1 items-center justify-end gap-2">
                    {topBarRight}
                </div>
            </div>
            <Transition
                className="flex flex-auto items-start justify-end"
                show={isSidebarOpen}
                enter="transition"
                enterFrom="translate-x-80"
                enterTo="translate-x-0"
                leave="transition"
                leaveFrom="translate-0"
                leaveTo="translate-x-80"
            >
                {ROUNDED_CORNER}
                <div
                    className="pointer-events-auto flex h-full flex-col bg-stone-100"
                    style={rightBarStyle}
                >
                    {rightBar}
                </div>
            </Transition>
            <div className="absolute bottom-0 left-0">{bottomBarLeft}</div>
            <div
                className="absolute bottom-0 right-0 transition-transform"
                style={{ transform: `translateX(${-SIDEBAR_WIDTH_PX}px)` }}
            >
                {bottomBarRight}
            </div>
        </div>
    );
}
