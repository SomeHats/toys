import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import React, { useLayoutEffect, useState } from "react";
import classNames from "classnames";
import { usePrevious } from "@/lib/hooks/usePrevious";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { useLive, useLiveValue } from "@/lib/live";

export const DocumentRenderer = React.memo(function DocumentRenderer({
    splatapus,
}: {
    splatapus: Splatapus;
}) {
    const canvasClassName = useLive(
        () => splatapus.interaction.getCanvasClassNameLive(),
        [splatapus],
    );
    const isSidebarOpen = useLiveValue(splatapus.viewport.isSidebarOpen);
    const screenSize = useLiveValue(splatapus.viewport.screenSize);
    const sceneTransform = useLive(() => splatapus.viewport.getSceneTransformLive(), [splatapus]);

    const prevIsSidebarOpen = usePrevious(isSidebarOpen);
    const [isTransitioning, setIsTransitioning] = useState(false);
    useLayoutEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 400);
        return () => clearTimeout(timer);
    }, [isSidebarOpen]);

    return (
        <svg
            viewBox={`0 0 ${screenSize.x} ${screenSize.y}`}
            className={classNames("absolute top-0 left-0", canvasClassName)}
        >
            <g
                style={{ transform: sceneTransform }}
                className={classNames(
                    (isTransitioning || isSidebarOpen !== prevIsSidebarOpen) &&
                        "transition-transform",
                )}
            >
                <DocumentPathRenderer splatapus={splatapus} />
            </g>
        </svg>
    );
});

const DocumentPathRenderer = React.memo(function DocumentPathRenderer({
    splatapus,
}: {
    splatapus: Splatapus;
}) {
    return (
        <>
            {Array.from(
                useLive(() => splatapus.document.live().shapes, [splatapus]),
                (shape) => (
                    <StrokeRenderer key={shape.id} shapeId={shape.id} splatapus={splatapus} />
                ),
            )}
        </>
    );
});
