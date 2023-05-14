import { Vector2 } from "@/lib/geom/Vector2";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { Button } from "@/splatapus/ui/Button";
import { Wire, WiresApp } from "@/wires/wiresModel2";
import { useEffect } from "react";
import { react } from "signia";
import { track } from "signia-react";

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
                <radialGradient id={ACTION_GRADIENT}></radialGradient>
                {app.wires.map((wire) => {
                    return <WireRenderer key={wire.id} wire={wire} />;
                })}
            </svg>
            <div className="pointer-events-none absolute inset-0 bg-stone-50 mix-blend-darken" />
            <div className="pointer-events-none absolute inset-0 p-3">
                <Button onClick={() => app.reset()} className="pointer-events-auto">
                    reset
                </Button>
                <div>{app.state.path}</div>
            </div>
        </>
    );
});

const WireRenderer = track(function WireRenderer({ wire }: { wire: Wire }) {
    const dragStartGesture = useGestureDetector({
        onDragStart: (event) => {
            event.stopPropagation();
            const originalStart = wire.start;
            const offset = Vector2.fromEvent(event).sub(wire.start);
            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove: (event) => {
                    wire.start = Vector2.fromEvent(event).sub(offset);
                },
                onEnd: (event) => {
                    wire.start = Vector2.fromEvent(event).sub(offset);
                },
                onCancel: () => {
                    wire.start = originalStart;
                },
            };
        },
    });

    const dragEndGesture = useGestureDetector({
        onDragStart: (event) => {
            event.stopPropagation();
            const originalEnd = wire.end;
            const offset = Vector2.fromEvent(event).sub(wire.end);
            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove: (event) => {
                    wire.end = Vector2.fromEvent(event).sub(offset);
                },
                onEnd: (event) => {
                    wire.end = Vector2.fromEvent(event).sub(offset);
                },
                onCancel: () => {
                    wire.end = originalEnd;
                },
            };
        },
    });

    return (
        <>
            <path
                d={SvgPathBuilder.straightThroughPoints(wire.segments).toString()}
                className="fill-none stroke-slate-800 opacity-30 mix-blend-color-burn"
                strokeWidth={20}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={SvgPathBuilder.straightThroughPoints(wire.segments).toString()}
                className="fill-none stroke-fuchsia-400"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                {...dragStartGesture.events}
                cx={wire.start.x}
                cy={wire.start.y}
                r={8}
                className="fill-transparent stroke-transparent stroke-1 hover:stroke-blue-500"
            />
            <circle
                {...dragEndGesture.events}
                cx={wire.end.x}
                cy={wire.end.y}
                r={8}
                className="fill-transparent stroke-transparent stroke-1 hover:stroke-blue-500"
            />
        </>
    );
});
