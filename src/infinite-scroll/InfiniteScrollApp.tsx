import { sizeFromBorderBox, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { Fragment, useState } from "react";
import { Vector2 } from "@/lib/geom/Vector2";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";
import { InfiniteScroller } from "@/infinite-scroll/InfiniteScroller";
import { breakpointPx } from "@/infinite-scroll/contants";
import { entries } from "@/lib/utils";
import { CaterpillarScroller } from "@/infinite-scroll/CaterpillarScroller";

export function App() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(container, sizeFromBorderBox);

    return (
        <div ref={setContainer} className="absolute inset-0 h-full w-full">
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            {size && <AppContent size={size} />}
        </div>
    );
}

const screens = {
    Infinite: <InfiniteScroller />,
    Worm: <CaterpillarScroller />,
};
type ScreenName = keyof typeof screens;

function AppContent({ size }: { size: Vector2 }) {
    const isMobile = size.x < breakpointPx;

    const [activeScreen, setActiveScreen] = useState<ScreenName>("Infinite");

    if (isMobile) {
        return (
            <div className="absolute inset-0 flex h-full w-full flex-col items-stretch">
                <div className="flex flex-none items-center justify-center gap-4 p-4">
                    {entries(screens).map(([name, screen]) => (
                        <Button
                            key={name}
                            onClick={() => setActiveScreen(name)}
                            className={classNames(
                                name === activeScreen &&
                                    "pointer-events-none bg-gradient-to-br from-fuchsia-500 to-violet-500 !text-white",
                            )}
                        >
                            {name}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-auto items-stretch justify-center overflow-hidden px-4 pb-4">
                    {screens[activeScreen]}
                </div>
            </div>
        );
    } else {
        return (
            <div className="absolute inset-0 flex items-stretch justify-evenly gap-12 overflow-hidden p-4 md:p-12">
                {Object.values(screens).map((screen, i) => (
                    <Fragment key={i}>{screen}</Fragment>
                ))}
            </div>
        );
    }
}
