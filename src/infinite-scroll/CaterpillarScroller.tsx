import { targetHeightPx, targetWidthPx } from "@/infinite-scroll/contants";
import { DummyContent, H1, Lead } from "@/infinite-scroll/content";
import { DeviceContainer, DeviceContent } from "@/infinite-scroll/device";
import { assertExists } from "@/lib/assert";
import { inOutSin } from "@/lib/easings";
import {
    constrainWrapped,
    exhaustiveSwitchError,
    frameLoop,
    invLerp,
    lerp,
    mapRange,
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
                const squelchDistancePx = 300 * scale;
                const containerWidthPx = targetWidthPx * scale;
                const containerHeightPx = targetHeightPx * scale;
                const heightAdjust =
                    Math.ceil((contentHeightPx - containerHeightPx) / squelchDistancePx) *
                        squelchDistancePx +
                    containerHeightPx;

                let transform: string[] = [];
                // each squelch is made up of 2 parts:
                // growing out from the bottom of the screen, then shrinking back in to the top.
                const baseDistance = Math.floor(scrollTop / squelchDistancePx) * squelchDistancePx;
                const wrappedDistance = scrollTop - baseDistance;

                if (wrappedDistance < squelchDistancePx / 2) {
                    // we're in the first part of the squelch, growing out from the bottom:

                    const easedDistance = lerp(
                        0,
                        squelchDistancePx,
                        inOutSin(invLerp(0, squelchDistancePx / 2, wrappedDistance)),
                    );

                    const scrollScaleFactor =
                        containerHeightPx / (containerHeightPx - easedDistance);

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
                            className="absolute inset-0 top-0 overflow-y-auto overflow-x-hidden"
                        >
                            <div style={{ height: heightAdjust }} />
                        </div>
                    </>
                );
            }}
        </DeviceContainer>
    );
}
