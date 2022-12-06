import {
    sizeFromBorderBox,
    sizeFromContentRect,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import foxUrl from "@/infinite-scroll/assets/fox.jpg";
import frogUrl from "@/infinite-scroll/assets/frog.jpg";
import { assertExists } from "@/lib/assert";
import { constrainWrapped, debounce, invLerp, mapRange, noop } from "@/lib/utils";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { useGestureDetector } from "@/lib/hooks/useGestureDetector";

const targetWidthPx = 375;
const targetHeightPx = 667;

export function App() {
    return (
        <div className="absolute inset-0 flex h-full w-full items-stretch justify-evenly gap-12 overflow-hidden p-4 md:p-12">
            <InfiniteScroller />
        </div>
    );
}

const scrollCaptureHeightPx = 100000;
const scrollBasePx = scrollCaptureHeightPx / 2;
function InfiniteScroller() {
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
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>

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
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollBarHeightPx = Math.max(
        12,
        ((targetHeightPx * scale) / contentHeightPx) * targetHeightPx,
    );

    const scrollBarTopPx = mapRange(0, contentHeightPx, 0, targetHeightPx * scale, scrollAmount);

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

const DummyContent = React.memo(function DummyContent() {
    return (
        <>
            <P>
                A spectre is haunting Europe — the spectre of communism. All the powers of old
                Europe have entered into a holy alliance to exorcise this spectre: Pope and Tsar,
                Metternich and Guizot, French Radicals and German police-spies.
            </P>
            <P>
                Where is the party in opposition that has not been decried as communistic by its
                opponents in power? Where is the opposition that has not hurled back the branding
                reproach of communism, against the more advanced opposition parties, as well as
                against its reactionary adversaries?
            </P>
            <P>Unrelated to communism, here is a picture of a fox who lives near me:</P>
            <Img src={foxUrl} caption="Doesn't he look great?" />
            <P>Two things result from this fact:</P>
            <Ol>
                <Li>
                    Communism is already acknowledged by all European powers to be itself a power.
                </Li>
                <Li>
                    It is high time that Communists should openly, in the face of the whole world,
                    publish their views, their aims, their tendencies, and meet this nursery tale of
                    the Spectre of Communism with a manifesto of the party itself.
                </Li>
            </Ol>
            <P>
                To this end, Communists of various nationalities have assembled in London and
                sketched the following manifesto, to be published in the English, French, German,
                Italian, Flemish and Danish languages.
            </P>
            <H2>Bourgeois and Proletarians</H2>
            <P>The history of all hitherto existing society is the history of class struggles.</P>
            <P>
                Freeman and slave, patrician and plebeian, lord and serf, guild-master and
                journeyman, in a word, oppressor and oppressed, stood in constant opposition to one
                another, carried on an uninterrupted, now hidden, now open fight, a fight that each
                time ended, either in a revolutionary reconstitution of society at large, or in the
                common ruin of the contending classes.
            </P>
            <P>A while ago I went to Costa Rica and saw this frog it was awesome:</P>
            <Img src={frogUrl} caption="Isn't he cute?" />
            <P>
                In the earlier epochs of history, we find almost everywhere a complicated
                arrangement of society into various orders, a manifold gradation of social rank. In
                ancient Rome we have patricians, knights, plebeians, slaves; in the Middle Ages,
                feudal lords, vassals, guild-masters, journeymen, apprentices, serfs; in almost all
                of these classes, again, subordinate gradations.
            </P>
        </>
    );
});

function H1({ children }: { children: ReactNode }) {
    return <h1 className="pr-12 pt-6 text-5xl font-black tracking-wide">{children}</h1>;
}

function H2({ children }: { children: ReactNode }) {
    return <h2 className="pr-12 pt-6 text-3xl font-black tracking-wide">{children}</h2>;
}

function Lead({ children }: { children: ReactNode }) {
    return <p className="my-3 text-justify text-lg leading-6">{children}</p>;
}

function P({ children }: { children: ReactNode }) {
    return <p className="my-3 text-justify leading-6">{children}</p>;
}

function Ol({ children }: { children: ReactNode }) {
    return <ol className="list-outside list-decimal">{children}</ol>;
}

function Li({ children }: { children: ReactNode }) {
    return <li className="mb-3 ml-6 mr-4 text-justify">{children}</li>;
}

function Img({ src, caption }: { src: string; caption: string }) {
    return (
        <figure className="my-6">
            <img src={src} className="w-full rounded shadow-md" />
            <figcaption className="pt-3 text-center font-serif text-sm text-stone-600">
                {caption}
            </figcaption>
        </figure>
    );
}

function DeviceContent({
    scale,
    children,
    className,
    onSizeChange = noop,
}: {
    scale: number;
    children: ReactNode;
    className?: string;
    onSizeChange?: (size: Vector2) => void;
}) {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(element, sizeFromBorderBox);

    const sizeChangeEvent = useEvent(onSizeChange);
    useLayoutEffect(() => {
        if (size) {
            sizeChangeEvent(size.scale(scale));
        }
    }, [size, sizeChangeEvent, scale]);

    return (
        <div
            ref={setElement}
            className={className}
            style={{
                transform: `scale(${scale})`,
                width: targetWidthPx,
                transformOrigin: "top left",
                position: "absolute",
            }}
        >
            {children}
        </div>
    );
}

function DeviceContainer({ children }: { children: (scale: number) => ReactNode }) {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    let scale = 1;
    if (size) {
        scale = Math.min(size.x / targetWidthPx, size.y / targetHeightPx);
    }

    return (
        <div
            className="relative flex min-h-0 min-w-0 flex-auto items-center justify-center"
            ref={setContainer}
        >
            <div
                className="relative overflow-hidden rounded-md border border-stone-200 shadow-lg"
                style={{ width: targetWidthPx * scale, height: targetHeightPx * scale }}
            >
                <div className="absolute inset-0 h-full w-full">{children(scale)}</div>
            </div>
        </div>
    );
}
