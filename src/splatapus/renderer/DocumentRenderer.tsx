import { Interaction } from "@/splatapus/editor/Interaction";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import { useEditorKey, useEditorState } from "@/splatapus/editor/useEditorState";
import React, { useLayoutEffect, useState } from "react";
import classNames from "classnames";
import { usePrevious } from "@/lib/hooks/usePrevious";

export const DocumentRenderer = React.memo(function DocumentRenderer() {
    const viewport = useEditorState((state) => state.location.viewport);
    const canvasClassName = useEditorState((state) =>
        Interaction.getCanvasClassName(state.interaction),
    );
    const isSidebarOpen = useEditorState((state) => state.location.viewport.isSidebarOpen);
    const prevIsSidebarOpen = usePrevious(isSidebarOpen);
    const [isTransitioning, setIsTransitioning] = useState(false);
    useLayoutEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 400);
        return () => clearTimeout(timer);
    }, [isSidebarOpen]);

    console.log({ isTransitioning, isSidebarOpen, prevIsSidebarOpen });

    return (
        <svg
            viewBox={`0 0 ${viewport.screenSize.x} ${viewport.screenSize.y}`}
            className={classNames("absolute top-0 left-0", canvasClassName)}
        >
            <g
                style={{ transform: viewport.getSceneTransform() }}
                className={classNames(
                    (isTransitioning || isSidebarOpen !== prevIsSidebarOpen) &&
                        "transition-transform",
                )}
            >
                <DocumentPathRenderer />
            </g>
        </svg>
    );
});

const DocumentPathRenderer = React.memo(function DocumentPathRenderer() {
    const document = useEditorKey("document");
    return (
        <>
            {Array.from(document.shapes, (shape) => (
                <StrokeRenderer key={shape.id} shapeId={shape.id} />
            ))}
        </>
    );
});
