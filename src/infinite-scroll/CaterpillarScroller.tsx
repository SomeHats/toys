import { targetHeightPx, targetWidthPx } from "@/infinite-scroll/contants";
import { DummyContent, H1, Lead } from "@/infinite-scroll/content";
import { DeviceContainer, DeviceContent } from "@/infinite-scroll/device";
import { assertExists } from "@/lib/assert";
import { inOutSin } from "@/lib/easings";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import {
    constrainWrapped,
    exhaustiveSwitchError,
    frameLoop,
    invLerp,
    lerp,
    mapRange,
    noop,
} from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function CaterpillarScroller() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [contentHeightPx, setContentHeightPx] = useState(1);
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const scrollContainer = assertExists(scrollContainerRef.current);

        let lastScrollTop = scrollContainer.scrollTop;
        return frameLoop(() => {
            const delta = scrollContainer.scrollTop - lastScrollTop;
            if (delta === 0) return;

            setScrollTop(scrollContainer.scrollTop);
            lastScrollTop = scrollContainer.scrollTop;
        });
    }, []);

    return (
        <DeviceContainer>
            {(scale) => {
                const squelchDistancePx = 200 * scale;
                const containerWidthPx = targetWidthPx * scale;
                const containerHeightPx = targetHeightPx * scale;
                const scrollHeightPx =
                    Math.ceil((contentHeightPx - containerHeightPx) / squelchDistancePx) *
                        squelchDistancePx +
                    containerHeightPx;

                let transform: string[] = [];
                // each squelch is made up of 2 parts:
                // growing out from the bottom of the screen, then shrinking back in to the top.
                const baseDistance = Math.floor(scrollTop / squelchDistancePx) * squelchDistancePx;
                const wrappedDistance = scrollTop - baseDistance;

                const scrollBarBaseHeightPx = Math.max(
                    12,
                    (containerHeightPx / contentHeightPx) * containerHeightPx,
                );
                let scrollBarActualHeightPx: number;
                let scrollBarTopPx: number;

                if (wrappedDistance < squelchDistancePx / 2) {
                    // we're in the first part of the squelch, growing out from the bottom:

                    const easedDistance = lerp(
                        0,
                        squelchDistancePx,
                        inOutSin(invLerp(0, squelchDistancePx / 2, wrappedDistance)),
                    );

                    const scrollScaleFactor =
                        containerHeightPx / (containerHeightPx - easedDistance);

                    scrollBarActualHeightPx = scrollBarBaseHeightPx / scrollScaleFactor;
                    scrollBarTopPx = mapRange(
                        0,
                        scrollHeightPx,
                        0,
                        containerHeightPx,
                        baseDistance + easedDistance,
                    );

                    transform = [
                        `translate(${containerWidthPx / 2}px, ${containerHeightPx}px)`,
                        `scale(${
                            1 / mapRange(1, 2, 1, 1.5, scrollScaleFactor)
                        }, ${scrollScaleFactor})`,
                        `translate(${-containerWidthPx / 2}px, ${
                            -containerHeightPx - baseDistance
                        }px)`,
                    ];
                } else {
                    // we're in the second part of the squelch, shrinking back in to the top:
                    const easedDistance = lerp(
                        squelchDistancePx,
                        0,
                        inOutSin(
                            invLerp(squelchDistancePx / 2, squelchDistancePx, wrappedDistance),
                        ),
                    );

                    const scrollScaleFactor =
                        containerHeightPx / (containerHeightPx - easedDistance);

                    scrollBarActualHeightPx = scrollBarBaseHeightPx / scrollScaleFactor;
                    scrollBarTopPx = mapRange(
                        0,
                        scrollHeightPx,
                        0,
                        containerHeightPx,
                        baseDistance + squelchDistancePx,
                    );

                    transform = [
                        `translate(${containerWidthPx / 2}px, ${
                            -squelchDistancePx * scrollScaleFactor
                        }px)`,
                        `scale(${
                            1 / mapRange(1, 2, 1, 1.5, scrollScaleFactor)
                        }, ${scrollScaleFactor})`,
                        `translate(${-containerWidthPx / 2}px, ${-baseDistance}px)`,
                    ];
                }
                return (
                    <>
                        <div
                            className="absolute top-0"
                            style={{
                                transform: transform.join(" "),
                            }}
                        >
                            <DeviceContent
                                scale={scale}
                                className="p-6"
                                onSizeChange={(size) => setContentHeightPx(size.y)}
                            >
                                <H1>Wormy Scroll</H1>
                                <Lead>Hey babe would you still scroll me if I were a worm?</Lead>
                                <DummyContent />
                            </DeviceContent>
                        </div>
                        <div
                            ref={scrollContainerRef}
                            className="hide-scrollbar absolute inset-0 top-0 overflow-y-auto overflow-x-hidden"
                        >
                            <div style={{ height: scrollHeightPx }} />
                        </div>
                        <WormyScrollbar
                            scrollBarActualHeightPx={scrollBarActualHeightPx}
                            scrollBarBaseHeightPx={scrollBarBaseHeightPx}
                            scrollBarTopPx={scrollBarTopPx}
                            scale={scale}
                            contentHeightPx={contentHeightPx}
                            containerHeightPx={containerHeightPx}
                            onScroll={(newScrollTop) => {
                                assertExists(scrollContainerRef.current).scrollTop = newScrollTop;
                            }}
                        />
                    </>
                );
            }}
        </DeviceContainer>
    );
}

const curvyness = 0.2;
const curveOut = 60;

function WormyScrollbar({
    scrollBarActualHeightPx,
    scrollBarBaseHeightPx,
    scale,
    scrollBarTopPx,
    contentHeightPx,
    containerHeightPx,
    onScroll = noop,
}: {
    scrollBarActualHeightPx: number;
    scrollBarBaseHeightPx: number;
    scale: number;
    scrollBarTopPx: number;
    contentHeightPx: number;
    containerHeightPx: number;
    onScroll?: (scrollTop: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useEvent((yPosition: number) => {
        const container = assertExists(containerRef.current);
        const bounds = container.getBoundingClientRect();
        const relativePosition = invLerp(
            bounds.top,
            bounds.bottom,
            yPosition - scrollBarBaseHeightPx / 2,
        );
        onScroll(relativePosition * contentHeightPx);
    });

    const gesture = useGestureDetector({
        onDragStart: (startEvent) => {
            startEvent.preventDefault();

            const container = assertExists(containerRef.current);
            container.setPointerCapture(startEvent.pointerId);

            handleScroll(startEvent.clientY);

            return {
                couldBeTap: false,
                onMove(event) {
                    handleScroll(event.clientY);
                },
                onEnd() {
                    container.releasePointerCapture(startEvent.pointerId);
                },
                onCancel() {
                    container.releasePointerCapture(startEvent.pointerId);
                },
            };
        },
    });

    const svgWidth = (curveOut + 10) * scale;
    const lineBasePx = svgWidth - 6;
    const effectiveTopPx = scrollBarTopPx + 6;
    const effectiveHeightPx = scrollBarActualHeightPx - 24;
    const squishProportion = scrollBarActualHeightPx / scrollBarBaseHeightPx;
    const squishAmountPx = curveOut * scale * (1 - squishProportion);

    return (
        <div
            className="absolute top-0 right-0 h-full w-5 touch-none"
            ref={containerRef}
            {...gesture.events}
        >
            <svg
                className="absolute right-0 top-0"
                viewBox={`0 0 ${svgWidth} ${containerHeightPx}`}
                width={svgWidth}
                height={containerHeightPx}
            >
                <path
                    d={new SvgPathBuilder()
                        .moveTo(lineBasePx, effectiveTopPx)
                        .bezierCurveTo(
                            [lineBasePx, effectiveTopPx + effectiveHeightPx * curvyness],
                            [
                                lineBasePx - squishAmountPx,
                                effectiveTopPx + effectiveHeightPx * (0.5 - curvyness),
                            ],
                            [lineBasePx - squishAmountPx, effectiveTopPx + effectiveHeightPx * 0.5],
                        )
                        .smoothBezierCurveTo(
                            [lineBasePx, effectiveTopPx + effectiveHeightPx * (1 - curvyness)],
                            [lineBasePx, effectiveTopPx + effectiveHeightPx],
                        )
                        .toString()}
                    //     [
                    //     `M ${lineBasePx},${scrollBarTopPx}`,
                    //     `Q ${lineBasePx},${scrollBarTopPx + effectiveHeightPx * 0.25}`,
                    //     `L ${lineBasePx},${scrollBarTopPx + effectiveHeightPx}`,
                    // ].join(" ")}
                    fill="none"
                    strokeWidth={8}
                    className="stroke-stone-400"
                    strokeLinecap="round"
                />
                <circle
                    r={6}
                    cx={lineBasePx - 2}
                    cy={effectiveTopPx + effectiveHeightPx}
                    className="fill-stone-400"
                />
                <circle
                    r={1.5}
                    cx={lineBasePx - 5}
                    cy={effectiveTopPx + effectiveHeightPx - 1.5}
                    className="fill-stone-700"
                />
                <circle
                    r={1.5}
                    cx={lineBasePx + 1}
                    cy={effectiveTopPx + effectiveHeightPx - 1.5}
                    className="fill-stone-700"
                />
                <path
                    strokeWidth={2}
                    className="stroke-stone-700"
                    fill="none"
                    strokeLinecap="round"
                    d={new SvgPathBuilder()
                        .moveTo(lineBasePx - 5, effectiveTopPx + effectiveHeightPx + 2)
                        .arcTo(
                            3.5,
                            2,
                            0,
                            0,
                            0,
                            lineBasePx + 1,
                            effectiveTopPx + effectiveHeightPx + 2,
                        )
                        .toString()}
                />
            </svg>
            {/* <div
                className="absolute right-0.5 top-0 w-2 rounded-full bg-stone-400"
                style={{
                    height: `${scrollBarActualHeightPx - 14 * scale}px`,
                    transform: `translateY(${scrollBarTopPx + 2 * scale}px)`,
                }}
            /> */}
        </div>
    );
}
