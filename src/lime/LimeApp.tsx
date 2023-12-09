import { Vector2 } from "@/lib/geom/Vector2";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { debounce } from "@/lib/utils";
import { Lime } from "@/lime/Lime";
import { LIME_FREEHAND, LIME_SLIDE_SIZE_PX } from "@/lime/LimeConfig";
import {
    LimeSerializedStore,
    LimeSerializedStoreSchema,
    LimeStore,
    SlideId,
} from "@/lime/LimeStore";
import {
    getStrokeOutlinePoints,
    getStrokePoints,
    getSvgPathFromStroke,
} from "@/splatapus/model/perfectFreehand";
import { Button } from "@/splatapus/ui/Button";
import { track } from "@tldraw/state";
import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";

export function LimeApp() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);
    const [lime, setLime] = useState<Lime | null>(null);

    useEffect(() => {
        const initialValue = getLocalStorageItem(
            "lime.doc",
            LimeSerializedStoreSchema,
            () => ({} as LimeSerializedStore),
        );
        const store = new LimeStore(initialValue);
        const lime = new Lime(store);
        lime.ticker.start();
        setLime(lime);

        const saveDebounced = debounce(1000, () => {
            setLocalStorageItem("lime.doc", LimeSerializedStoreSchema, store.serialize("all"));
        });

        const unsubscribe = store.listen(() => {
            saveDebounced();
        });

        return () => {
            unsubscribe();
            saveDebounced.cancel();
            lime.ticker.stop();
        };
    }, []);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none select-none overflow-hidden">
            {size && lime && <LimeMain size={size} lime={lime} />}
        </div>
    );
}

const LimeMain = track(function LimeMain({ size, lime }: { size: Vector2; lime: Lime }) {
    useEffect(() => {
        lime.viewport.screenSize = size;
    }, [size, lime]);

    return (
        <>
            <div className="absolute top-0 left-0 h-full w-[200px] bg-stone-50 flex p-4 gap-4 flex-col overflow-auto shadow-lg">
                {lime.state.toDebugString()}
                {lime.document.slideIds.map((slideId) => (
                    <SlideThumbnail
                        key={slideId}
                        lime={lime}
                        slideId={slideId}
                        isActive={lime.session.slideId === slideId}
                    />
                ))}
                <Button className="flex-none" onClick={() => lime.newSlide()}>
                    +
                </Button>
                <Button onClick={() => lime.clearDocument()} className="mt-auto flex-none">
                    reset
                </Button>
            </div>
            <Canvas lime={lime} />
            <div className="absolute top-0 left-[200px] flex gap-4">
                <label className="gap-2 flex">
                    slop
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={lime.session.tweenBezierControl}
                        onChange={(e) =>
                            lime.updateSession((s) => ({
                                ...s,
                                tweenBezierControl: e.currentTarget.valueAsNumber,
                            }))
                        }
                    />
                    {lime.session.tweenBezierControl}
                </label>
                <label className="gap-2 flex">
                    speed
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="1"
                        value={lime.session.speed}
                        onChange={(e) =>
                            lime.updateSession((s) => ({
                                ...s,
                                speed: e.currentTarget.valueAsNumber,
                            }))
                        }
                    />
                    {lime.session.speed}
                </label>
            </div>
        </>
    );
});

const SlideThumbnail = track(function SlideThumbnail({
    lime,
    slideId,
    isActive,
}: {
    lime: Lime;
    slideId: SlideId;
    isActive: boolean;
}) {
    return (
        <div
            className={classNames(
                "w-full aspect-video ring-1 rounded relative ring-stone-200 flex-none ",
                isActive && "ring-blue-500 ring-2",
            )}
            onClick={() => lime.changeSlide(slideId)}
        >
            <div className="absolute inset-0 rounded overflow-hidden">
                <SlideContainer scale={168 / LIME_SLIDE_SIZE_PX.x}>
                    <SlideRenderer lime={lime} slideId={slideId} />
                </SlideContainer>
            </div>
        </div>
    );
});

const Canvas = track(function Canvas({ lime }: { lime: Lime }) {
    const { canvasSize, canvasOffset, slideSize, slideOffset, scaleFactor } = lime.viewport;
    const { slideId } = lime.session;
    const _nextSlideId =
        lime.document.slideIds[
            (lime.document.slideIds.indexOf(slideId) + 1) % lime.document.slideIds.length
        ];
    return (
        <div
            className="absolute bg-stone-100"
            style={{
                width: canvasSize.x,
                height: canvasSize.y,
                left: canvasOffset.x,
                top: canvasOffset.y,
            }}
            onPointerDown={(event) => lime.onPointerDown(event.nativeEvent)}
            onPointerMove={(event) => lime.onPointerMove(event.nativeEvent)}
            onPointerUp={(event) => lime.onPointerUp(event.nativeEvent)}
        >
            <div
                className="absolute rounded-lg shadow-md overflow-hidden"
                style={{
                    width: slideSize.x,
                    height: slideSize.y,
                    left: slideOffset.x,
                    top: slideOffset.y,
                }}
            >
                <SlideContainer scale={scaleFactor}>
                    {lime.state.child.name === "drawing" ? (
                        <SlideRenderer lime={lime} slideId={lime.session.slideId} />
                    ) : (
                        <PlayheadRenderer lime={lime} />
                    )}
                </SlideContainer>
            </div>
        </div>
    );
});

const SlideContainer = track(function SlideContainer({
    scale,
    children,
}: {
    scale: number;
    children: ReactNode;
}) {
    return (
        <div
            style={{
                width: LIME_SLIDE_SIZE_PX.x,
                height: LIME_SLIDE_SIZE_PX.y,
                transform: `scale(${scale})`,
            }}
            className="absolute origin-top-left bg-white overflow-hidden"
        >
            {children}
        </div>
    );
});

const SlideRenderer = track(function SlideRenderer({
    lime,
    slideId,
}: {
    lime: Lime;
    slideId: SlideId;
}) {
    const strokePoints = lime.getSlideStrokePoints(slideId);
    if (!strokePoints.length) return null;

    const outline = getStrokeOutlinePoints(strokePoints, LIME_FREEHAND);

    return (
        <svg
            className="absolute inset-0"
            viewBox={`0 0 ${LIME_SLIDE_SIZE_PX.x} ${LIME_SLIDE_SIZE_PX.y}`}
            width={LIME_SLIDE_SIZE_PX.x}
            height={LIME_SLIDE_SIZE_PX.y}
        >
            <path d={getSvgPathFromStroke(outline)} className="fill-stone-600" />
            {/* <DebugPolyline points={strokePoints.map((p) => p.point)} color="cyan" /> */}
        </svg>
    );
});

const PlayheadRenderer = track(function PlayheadRenderer({ lime }: { lime: Lime }) {
    const points = lime.getPlayheadPoints();
    const strokePoints = getStrokePoints(points, LIME_FREEHAND);
    const outline = getStrokeOutlinePoints(strokePoints, LIME_FREEHAND);

    return (
        <svg
            className="absolute inset-0"
            viewBox={`0 0 ${LIME_SLIDE_SIZE_PX.x} ${LIME_SLIDE_SIZE_PX.y}`}
            width={LIME_SLIDE_SIZE_PX.x}
            height={LIME_SLIDE_SIZE_PX.y}
        >
            <path d={getSvgPathFromStroke(outline)} className="fill-stone-600" />
        </svg>
    );
});
