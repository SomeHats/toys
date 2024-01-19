import { assertExists } from "@/lib/assert";
import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { useMergedRefs } from "@/lib/hooks/useMergedRefs";
import {
    sizeFromContentRect,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import {
    ComponentProps,
    ForwardedRef,
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const SvgScaleContext = createContext<number>(1);
export function useSvgScale() {
    return useContext(SvgScaleContext);
}

export const Svg = forwardRef(function Svg(
    {
        viewBox,
        ...props
    }: Omit<ComponentProps<"svg">, "viewBox"> & { viewBox: AABB },
    ref: ForwardedRef<SVGSVGElement>,
) {
    const [svg, setSvg] = useState<SVGSVGElement | null>(null);
    const size = useResizeObserver(svg, sizeFromContentRect);

    const scale = size ? size.x / viewBox.width : 1;

    return (
        <SvgScaleContext.Provider value={scale}>
            <svg
                {...props}
                ref={useMergedRefs(setSvg, ref)}
                viewBox={`${viewBox.left} ${viewBox.top} ${viewBox.right} ${viewBox.bottom}`}
            />
        </SvgScaleContext.Provider>
    );
});

export function SvgApp({
    viewBox,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    ...props
}: Omit<
    ComponentProps<typeof Svg>,
    "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
> & {
    onPointerDown?: (point: Vector2, e: PointerEvent) => void;
    onPointerMove?: (point: Vector2, e: PointerEvent) => void;
    onPointerUp?: (point: Vector2, e: PointerEvent) => void;
    onPointerCancel?: (point: Vector2, e: PointerEvent) => void;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    function getPointInSvgSpace(e: PointerEvent) {
        const svgRect = AABB.from(
            assertExists(svgRef.current).getBoundingClientRect(),
        );
        return Vector2.fromEvent(e).mapRange(svgRect, viewBox);
    }

    const handlePointerDown = useEvent((e: PointerEvent) => {
        onPointerDown?.(getPointInSvgSpace(e), e);
    });
    const handlePointerMove = useEvent((e: PointerEvent) => {
        onPointerMove?.(getPointInSvgSpace(e), e);
    });
    const handlePointerUp = useEvent((e: PointerEvent) => {
        onPointerUp?.(getPointInSvgSpace(e), e);
    });
    const handlePointerCancel = useEvent((e: PointerEvent) => {
        onPointerCancel?.(getPointInSvgSpace(e), e);
    });

    useEffect(() => {
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerCancel);
        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerCancel);
        };
    }, [
        handlePointerCancel,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    ]);

    return <Svg ref={svgRef} viewBox={viewBox} {...props} />;
}
