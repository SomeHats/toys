import Vector2 from "@/lib/geom/Vector2";
import { sizeFromEntry, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { getStroke } from "@/splatapus/perfectFreehand";

const lineSize = 20;
const streamline = 0.5;
const smoothing = 0.5;
const thinning = 0.5;
const simulatePressure = true;

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromEntry);

    return (
        <div ref={setContainer} className="absolute inset-0">
            {size && <Splatapus size={size} />}
        </div>
    );
}

function Splatapus({ size }: { size: Vector2 }) {
    const [isDragging, setIsDragging] = useState(false);
    const [points, setPoints] = useState<Vector2[]>([]);

    const onDragStart = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setPoints([Vector2.fromEvent(e)]);
        setIsDragging(true);
    }, []);
    const onDragMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setPoints((prev) => [...prev, Vector2.fromEvent(e)]);
    }, []);
    const onDragEnd = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const stroke = useMemo(
        () =>
            getStroke(points, {
                size: lineSize,
                streamline,
                smoothing,
                thinning,
                simulatePressure,
            }),
        [points],
    );

    const strokePath = useMemo(() => getSvgPathFromStroke(stroke), [stroke]);

    return (
        <svg
            viewBox={`0 0 ${size.x} ${size.y}`}
            onMouseDown={onDragStart}
            onMouseMove={isDragging ? onDragMove : undefined}
            onMouseUp={isDragging ? onDragEnd : undefined}
        >
            <path d={strokePath} className="fill-stone-600" />

            {stroke.map(({ x, y }, i) => (
                <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={1}
                    stroke="red"
                    strokeWidth={0.5}
                    fill="transparent"
                />
            ))}
        </svg>
    );
}

function getSvgPathFromStroke(stroke: Vector2[]) {
    if (!stroke.length) return "";

    const d = ["M", stroke[0].x, stroke[0].y, "Q"];
    for (let i = 0; i < stroke.length; i++) {
        const p0 = stroke[i];
        const p1 = stroke[(i + 1) % stroke.length];
        const midPoint = p0.add(p1).scale(0.5);
        d.push(p0.x, p0.y, midPoint.x, midPoint.y);
    }

    d.push("Z");
    return d.join(" ");
}
