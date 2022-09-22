import Vector2 from "@/lib/geom/Vector2";
import { tailwindColors } from "@/lib/theme";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { makeGradient } from "@/splatapus/ui/makeGradient";
import Color from "color";
import { ReactNode, useId, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const rightBarMask = makeGradient(Color(tailwindColors.stone("50")), "to right", 60, 1);
console.log({ rightBarMask });
const rightBarStyle = {
    width: SIDEBAR_WIDTH_PX + 60,
    background: "rgba(250, 250, 249, 0.7)",
    WebkitMaskImage: rightBarMask,
    maskImage: rightBarMask,
};

export function UiOverlayFrame({
    bottomBar,
    rightBar,
    leftBar,
    size,
}: {
    bottomBar: ReactNode;
    rightBar: ReactNode;
    leftBar: ReactNode;
    size: Vector2;
}) {
    const id = useId();

    return (
        <>
            {/* <svg
                viewBox={`0 0 ${size.x} ${size.y}`}
                className="z1 pointer-events-none absolute top-0 opacity-50"
            >
                <defs>
                    <clipPath id="clipPath">
                        <circle cx={size.x / 2} cy={size.y / 2} r="600" fill="white" />
                    </clipPath>
                </defs>
            </svg> */}
            <div
                className="pointer-events-none absolute inset-0 flex flex-col items-stretch "
                // style={{ clipPath: `url('#clipPath')` }}
                // style={{ WebkitMaskImage: `url('#mask')`, maskImage: `url('#mask')` }}
            >
                <div className="flex flex-auto items-stretch justify-between">
                    {leftBar}
                    <div
                        className="pointer-events-auto h-full bg-stone-50/70 pl-8 backdrop-blur-md"
                        style={rightBarStyle}
                    >
                        {rightBar}
                    </div>
                </div>
                <div className="pointer-events-auto flex flex-none items-center justify-center">
                    <div className="overflow-hidden rounded-t-2xl">
                        <div className="flex items-center justify-center gap-3 bg-stone-50/70 p-3 backdrop-blur-md">
                            {bottomBar}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
