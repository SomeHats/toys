import { DebugArrow, DebugPolyline } from "@/lib/DebugSvg";
import { Vector2 } from "@/lib/geom/Vector2";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { tailwindColors } from "@/lib/theme";
import { exhaustiveSwitchError } from "@/lib/utils";
import { Button } from "@/splatapus/ui/Button";
import { WiresApp, Wire } from "@/wires/WiresApp";
import { useEffect, useId } from "react";
import { react } from "signia";
import { track, useComputed } from "signia-react";

const ACTION_GRADIENT = "action-gradient";

const app = getLocalStorageItem("wiresApp", WiresApp.schema, WiresApp.createEmpty);
react(
    "save",
    () => {
        setLocalStorageItem("wiresApp", WiresApp.schema, app);
    },
    {
        scheduleEffect(execute) {
            if (window.requestIdleCallback) {
                window.requestIdleCallback(() => {
                    console.log("idle");
                    execute();
                });
            } else {
                window.requestAnimationFrame(execute);
            }
        },
    },
);

export const WiresAppRenderer = track(function WiresAppRenderer() {
    useEffect(() => {
        (window as any).app = app;
        (window as any).reset = () => {
            app.wires = [];
        };
    });

    return (
        <>
            <svg className="absolute inset-0 isolate h-full w-full bg-white" {...app.events}>
                {app.wires.map((wire) => {
                    return <WireRenderer key={wire.id} wire={wire} app={app} />;
                })}
                <WireHoverOverlay app={app} />
            </svg>
            <div className="pointer-events-none absolute inset-0 bg-stone-100 mix-blend-darken" />
            <div
                className="pointer-events-none absolute inset-0 p-3"
                style={
                    {
                        // shitty fake dark mode:
                        // filter: "invert(1) hue-rotate(180deg)",
                    }
                }
            >
                <Button onClick={() => app.reset()} className="pointer-events-auto">
                    reset
                </Button>
                <div className="absolute bottom-3 left-3">{app.state.path}</div>
            </div>
        </>
    );
});

const WireRenderer = track(function WireRenderer({ wire, app }: { wire: Wire; app: WiresApp }) {
    return (
        <>
            <path
                d={wire.lineInfo.path}
                className="fill-none stroke-slate-800 opacity-30 mix-blend-color-burn"
                strokeWidth={20}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={wire.lineInfo.path}
                className="fill-none stroke-fuchsia-500"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    );
});

const WireHoverOverlay = track(function WireHoverOverlay({ app }: { app: WiresApp }) {
    const gradientId1 = useId().replace(/:/g, "_");
    const gradientId2 = useId().replace(/:/g, "_");

    const hovered = app.state.hovered;

    let wire;
    let pointOnWire;
    switch (hovered.type) {
        case "none":
            return null;
        case "handle":
            wire = hovered.wire;
            pointOnWire = wire[hovered.handle];
            break;
        case "middleSection":
            wire = hovered.wire;
            pointOnWire = app.inputs.pointer.nearestPointOnLineSegment(
                wire.lineInfo.middleSection[0],
                wire.lineInfo.middleSection[1],
            );
            break;
        default:
            exhaustiveSwitchError(hovered, "type");
    }

    return (
        <>
            <radialGradient
                id={gradientId1}
                cx={pointOnWire.x}
                cy={pointOnWire.y}
                r={24}
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0" stopColor={tailwindColors.cyan300} />
                <stop offset="30%" stopColor={tailwindColors.cyan300} />
                <stop offset="100%" stopColor={tailwindColors.cyan300} stopOpacity={0} />
            </radialGradient>
            <radialGradient
                id={gradientId2}
                cx={pointOnWire.x}
                cy={pointOnWire.y}
                r={8}
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0" stopColor={tailwindColors.cyan500} />
                <stop offset="50%" stopColor={tailwindColors.cyan500} />
                <stop offset="100%" stopColor={tailwindColors.fuchsia500} stopOpacity={0.5} />
                {/* <stop offset="100%" stopColor={tailwindColors.fuchsia600} /> */}
            </radialGradient>
            <path
                d={wire.lineInfo.path}
                className="fill-none"
                strokeWidth={16}
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={`url(#${gradientId1})`}
            />
            <path
                d={wire.lineInfo.path}
                className="fill-none"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={`url(#${gradientId2})`}
            />
        </>
    );
});
