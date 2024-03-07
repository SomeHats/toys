import { Gestureland } from "@/gestureland/Gestureland";
import { Stroke } from "@/gestureland/GesturelandStore";
import { DebugPointX } from "@/lib/DebugSvg";
import { Ticker } from "@/lib/Ticker";
import { Vector2 } from "@/lib/geom/Vector2";
import {
    sizeFromContentRect,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { compact } from "@/lib/utils";
import { track } from "@tldraw/state";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

export function AppWrapper() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    return (
        <div ref={setContainer} className="fixed inset-0 touch-none">
            {size && container && <App size={size} container={container} />}
        </div>
    );
}

const App = track(function App({
    size,
    container,
}: {
    size: Vector2;
    container: HTMLDivElement;
}) {
    const app = useMemo(() => new Gestureland(container), [container]);

    useLayoutEffect(() => {
        app.viewportSize = size;
    }, [app, size]);

    useEffect(() => {
        const ticker = new Ticker();
        const unsubscribeTicker = ticker.listen(() => app.onTick());
        ticker.start();
        container.addEventListener("wheel", app.onWheel, {
            passive: false,
            capture: true,
        });
        container.addEventListener("pointerdown", app.onPointerDown);
        container.addEventListener("pointermove", app.onPointerMove);
        container.addEventListener("pointerup", app.onPointerUp);
        container.addEventListener("pointercancel", app.onPointerCancel);

        return () => {
            unsubscribeTicker();
            ticker.stop();
            container.removeEventListener("wheel", app.onWheel, {
                capture: true,
            });
            container.removeEventListener("pointerdown", app.onPointerDown);
            container.removeEventListener("pointermove", app.onPointerMove);
            container.removeEventListener("pointerup", app.onPointerUp);
            container.removeEventListener("pointercancel", app.onPointerCancel);
        };
    }, [app, container]);

    return (
        <svg viewBox={`0 0 ${size.x} ${size.y}`} width={size.x} height={size.y}>
            <g transform={app.pageToViewport.toCss()}>
                {app.shapes.map((s) => (
                    <Shape key={s.id} shape={s} />
                ))}
            </g>
            {Array.from(app.pointers.values(), (p) => (
                <DebugPointX
                    key={p.pointerId}
                    position={p.viewportPosition}
                    label={compact([
                        p.pointerId,
                        p.type,
                        p.isDown ? "down" : null,
                    ]).join(", ")}
                />
            ))}
        </svg>
    );
});

const Shape = track(function Shape({ shape }: { shape: Stroke }) {
    if (!shape.points.length) return null;
    const path = new SvgPathBuilder().moveTo(shape.points[0]);
    for (const point of shape.points) {
        path.lineTo(point);
    }
    return (
        <path
            d={path.toString()}
            stroke="black"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    );
});
