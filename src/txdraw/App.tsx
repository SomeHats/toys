import { Grid } from "@/txdraw/components/Grid";
import { Renderer } from "@/txdraw/components/Renderer";
import { TxBoxShapeUtil } from "@/txdraw/shapes/BoxShape";
import { snapShapesToGrid } from "@/txdraw/shapes/shared/snapShapesToGrid";
import { TextGrid } from "@/txdraw/TextGrid";
import { getAssetUrlsByImport } from "@tldraw/assets/imports.vite";
import {
    ContextMenu,
    EraserTool,
    HandTool,
    LaserTool,
    SelectTool,
    TLComponents,
    TldrawEditor,
    TldrawHandles,
    TldrawOptions,
    TldrawOverlays,
    TldrawScribble,
    TldrawSelectionForeground,
    TldrawShapeIndicators,
    TldrawUi,
    TLUnknownShape,
    ZoomTool,
} from "tldraw";
import "tldraw/tldraw.css";

declare module "@tldraw/editor" {
    export interface ShapeUtil<Shape extends TLUnknownShape = TLUnknownShape> {
        renderText?(shape: Shape): TextGrid;
    }
}

const assetUrls = getAssetUrlsByImport();
console.log(assetUrls);

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

const components: TLComponents = {
    ...defaultComponents,
    Grid: Grid,
    OnTheCanvas: Renderer,
};

const options: Partial<TldrawOptions> = {
    gridSteps: [
        { min: 0.6, mid: 0.9, step: 1 },
        // { min: -1, mid: 0.15, step: 64 },
        // { min: 0.05, mid: 0.375, step: 16 },
        // { min: 0.15, mid: 1, step: 4 },
        // { min: 0.7, mid: 2.5, step: 1 },
    ],
};

export function TxdrawApp() {
    return (
        <div className="absolute inset-0 w-full h-full">
            <TldrawEditor
                initialState="select"
                shapeUtils={shapeUtils}
                tools={tools}
                components={components}
                persistenceKey="txdraw"
                assetUrls={assetUrls}
                options={options}
                onMount={(editor) => {
                    snapShapesToGrid(editor);
                    editor.updateInstanceState({ isGridMode: true });
                    // basically disable the grid and rely on our own snapping:
                    editor.updateDocumentSettings({ gridSize: 1 });

                    if (editor.getCurrentPageShapeIds().size === 0) {
                        editor.createShape({
                            type: "tx-box",
                            x: 100,
                            y: 100,
                        });
                    }
                }}
            >
                <TldrawUi assetUrls={assetUrls}>
                    <InsideEditorAndUiContext />
                </TldrawUi>
            </TldrawEditor>
        </div>
    );
}

function InsideEditorAndUiContext() {
    return <ContextMenu>{/* <DefaultContextMenuContent /> */}</ContextMenu>;
}
