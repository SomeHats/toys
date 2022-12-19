import { targetHeightPx } from "@/infinite-scroll/contants";
import { DummyContent, H1, Lead } from "@/infinite-scroll/content";
import { DeviceContainer, DeviceContent } from "@/infinite-scroll/device";
import { assertExists } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { constrainWrapped, debounce, invLerp, mapRange, noop } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const scrollCaptureHeightPx = 100000;
const scrollBasePx = scrollCaptureHeightPx / 2;
export function InfiniteScroller() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [contentHeightPx, setContentHeightPx] = useState(0);

    useEffect(() => {
        const scrollContainer = assertExists(scrollContainerRef.current);

        scrollContainer.scrollTop = scrollBasePx;

        const resetScrollDebounced = debounce(300, () => {
            const newScrollTop =
                scrollBasePx +
                constrainWrapped(0, contentHeightPx, scrollContainer.scrollTop - scrollBasePx);

            if (Math.abs(newScrollTop - scrollContainer.scrollTop) > 1) {
                scrollContainer.scrollTop = newScrollTop;
            }
        });

        const handler = (event: Event) => {
            if (event.target !== scrollContainer) return;
            setScrollTop(scrollContainer.scrollTop);
            resetScrollDebounced();
        };

        scrollContainer.addEventListener("scroll", handler, {
            capture: true,
            passive: false,
        });

        return () => {
            scrollContainer.removeEventListener("scroll", handler, {
                capture: true,
            });
            resetScrollDebounced.cancel();
        };
    }, [contentHeightPx]);

    const content = (
        <>
            <H1>Infinite Scroll</H1>
            <Lead>
                Scroll up, or scroll down. It doesn&apos;t really matter. Follow your heart!
            </Lead>
            <DummyContent />
        </>
    );

    const scrollDistance = scrollTop - scrollBasePx;
    const scrollDistanceNormalized = (scrollDistance + targetHeightPx / 2) / contentHeightPx - 0.5;
    const pageFloor = Math.floor(scrollDistanceNormalized);
    const pageCeil = Math.ceil(scrollDistanceNormalized);

    return (
        <DeviceContainer>
            {(scale) => (
                <>
                    <div
                        ref={scrollContainerRef}
                        className="hide-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden"
                    >
                        <div style={{ height: scrollCaptureHeightPx }} />
                        {/* main content */}
                        <div
                            className="absolute top-0"
                            style={{
                                transform: `translateY(${
                                    scrollBasePx + pageFloor * contentHeightPx
                                }px)`,
                            }}
                        >
                            <DeviceContent
                                scale={scale}
                                className="p-6"
                                onSizeChange={(size) => setContentHeightPx(size.y)}
                            >
                                {content}
                            </DeviceContent>
                        </div>
                        {/* dummy content */}
                        <div
                            className="absolute top-0"
                            style={{
                                transform: `translateY(${
                                    scrollBasePx + pageCeil * contentHeightPx
                                }px)`,
                            }}
                        >
                            <DeviceContent scale={scale} className="p-6">
                                {content}
                            </DeviceContent>
                        </div>
                    </div>

                    {contentHeightPx && (
                        <WrappingScrollBar
                            scale={scale}
                            contentHeightPx={contentHeightPx}
                            scrollAmount={constrainWrapped(
                                0,
                                contentHeightPx,
                                scrollTop - scrollBasePx,
                            )}
                            onScroll={(amount) => {
                                const container = assertExists(scrollContainerRef.current);
                                container.scrollTop = scrollBasePx + amount;
                            }}
                        />
                    )}
                </>
            )}
        </DeviceContainer>
    );
}

function WrappingScrollBar({
    scale,
    contentHeightPx,
    scrollAmount,
    onScroll = noop,
}: {
    scale: number;
    contentHeightPx: number;
    scrollAmount: number;
    onScroll?: (newPosition: number) => void;
}) {
    const containerHeightPx = targetHeightPx * scale;
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollBarHeightPx = Math.max(
        12,
        (containerHeightPx / contentHeightPx) * containerHeightPx,
    );

    const scrollBarTopPx = mapRange(0, contentHeightPx, 0, containerHeightPx, scrollAmount);

    const handleScroll = useEvent((yPosition: number) => {
        const container = assertExists(containerRef.current);
        const bounds = container.getBoundingClientRect();
        const relativePosition = invLerp(
            bounds.top,
            bounds.bottom,
            yPosition - scrollBarHeightPx / 2,
        );
        onScroll(relativePosition * contentHeightPx);
    });

    const gesture = useGestureDetector({
        onDragStart: (startEvent) => {
            startEvent.preventDefault();
            handleScroll(startEvent.clientY);

            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove(event) {
                    handleScroll(event.clientY);
                },
                onEnd() {},
                onCancel() {},
            };
        },
    });

    return (
        <div
            ref={containerRef}
            className="absolute right-0 top-0 h-full w-5 touch-none overflow-visible"
            {...gesture.events}
        >
            {/* main scroll bar */}
            <div
                className="absolute right-0.5 top-0 w-2 rounded-full bg-stone-400"
                style={{
                    height: `${scrollBarHeightPx}px`,
                    transform: `translateY(${scrollBarTopPx}px)`,
                }}
            />
            {/* wrap-around scroll bar */}
            <div
                className="absolute right-0.5 top-0 w-2 rounded-full bg-stone-400"
                style={{
                    height: `${scrollBarHeightPx}px`,
                    transform: `translateY(${scrollBarTopPx - targetHeightPx * scale}px)`,
                }}
            />
        </div>
    );
}
