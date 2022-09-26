import { Interaction } from "@/splatapus/editor/Interaction";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";
import { useEditorKey, useEditorState } from "@/splatapus/editor/useEditorState";
import React from "react";
import classNames from "classnames";

export const DocumentRenderer = React.memo(function DocumentRenderer() {
    const viewport = useEditorState((state) => state.location.viewport);
    const canvasClassName = useEditorState((state) =>
        Interaction.getCanvasClassName(state.interaction),
    );

    return (
        <svg
            viewBox={`0 0 ${viewport.screenSize.x} ${viewport.screenSize.y}`}
            className={classNames("absolute top-0 left-0", canvasClassName)}
        >
            <g transform={viewport.getSceneTransform()}>
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
