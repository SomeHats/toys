import { TxBoxShapeUtil } from "@/txdraw/shapes/BoxShape";
import { snapPxHeightToTexel, snapPxWidthToTexel } from "@/txdraw/utils/texel";
import {
    ContextMenu,
    EraserTool,
    HandTool,
    LaserTool,
    SelectTool,
    TldrawEditor,
    TldrawHandles,
    TldrawOverlays,
    TldrawScribble,
    TldrawSelectionForeground,
    TldrawShapeIndicators,
    TldrawUi,
    ZoomTool,
    defaultEditorAssetUrls,
} from "tldraw";
import "tldraw/tldraw.css";

const defaultComponents = {
    Scribble: TldrawScribble,
    ShapeIndicators: TldrawShapeIndicators,
    CollaboratorScribble: TldrawScribble,
    SelectionForeground: TldrawSelectionForeground,
    Handles: TldrawHandles,
    Overlays: TldrawOverlays,
};

const tools = [EraserTool, HandTool, LaserTool, ZoomTool, SelectTool];
const shapeUtils = [TxBoxShapeUtil];

export function TxdrawApp() {
    return (
        <div className="absolute inset-0 w-full h-full">
            <TldrawEditor
                initialState="select"
                shapeUtils={shapeUtils}
                tools={tools}
                components={defaultComponents}
                // persistenceKey="exploded-example"
                assetUrls={defaultEditorAssetUrls}
                onMount={(editor) => {
                    editor.sideEffects.registerBeforeCreateHandler(
                        "shape",
                        (shape) => {
                            const snappedX = snapPxWidthToTexel(
                                editor,
                                shape.x,
                            );
                            const snappedY = snapPxHeightToTexel(
                                editor,
                                shape.y,
                            );
                            if (snappedX !== shape.x || snappedY !== shape.y) {
                                return {
                                    ...shape,
                                    x: snappedX,
                                    y: snappedY,
                                };
                            }

                            return shape;
                        },
                    );

                    editor.sideEffects.registerBeforeChangeHandler(
                        "shape",
                        (prevShape, nextShape) => {
                            if (
                                prevShape.x !== nextShape.x ||
                                prevShape.y !== nextShape.y
                            ) {
                                return {
                                    ...nextShape,
                                    x: snapPxWidthToTexel(editor, nextShape.x),
                                    y: snapPxHeightToTexel(editor, nextShape.y),
                                };
                            }

                            return nextShape;
                        },
                    );

                    editor.createShape({
                        type: "tx-box",
                        x: 100,
                        y: 100,
                    });
                }}
            >
                <TldrawUi>
                    <InsideEditorAndUiContext />
                </TldrawUi>
            </TldrawEditor>
        </div>
    );
}

function InsideEditorAndUiContext() {
    return <ContextMenu>{/* <DefaultContextMenuContent /> */}</ContextMenu>;
}
