import { entries } from "@/lib/utils";
import { Grid } from "@/txdraw/components/Grid";
import { Renderer } from "@/txdraw/components/Renderer";
import { Toolbar } from "@/txdraw/components/Toolbar";
import { TxBoxShapeUtil } from "@/txdraw/shapes/BoxShape";
import "@/txdraw/shapes/shared/lineStyles";
import { snapShapesToGrid } from "@/txdraw/shapes/shared/snapShapesToGrid";
import { TextGrid } from "@/txdraw/TextGrid";
import { BoxShapeTool } from "@/txdraw/tools/BoxTool";
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
    TLUiOverrides,
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

const tools = [
    EraserTool,
    HandTool,
    LaserTool,
    ZoomTool,
    SelectTool,
    BoxShapeTool,
];
const shapeUtils = [TxBoxShapeUtil];

const components: TLComponents = {
    ...defaultComponents,
    Grid,
    OnTheCanvas: Renderer,
    Toolbar,
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

const allowedDefaultTools = new Set(["select", "hand", "eraser"]);
const overrides: TLUiOverrides = {
    tools(editor, tools, helpers) {
        tools = Object.fromEntries(
            entries(tools).filter(([id, _]) => allowedDefaultTools.has(id)),
        );
        tools["tx-box"] = {
            id: "tx-box",
            label: "Rectangle",
            icon: "geo-rectangle",
            onSelect() {
                editor.setCurrentTool("tx-box");
            },
            kbd: "r",
        };
        return tools;
    },
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
                <TldrawUi
                    assetUrls={assetUrls}
                    components={components}
                    overrides={overrides}
                >
                    <InsideEditorAndUiContext />
                </TldrawUi>
            </TldrawEditor>
        </div>
    );
}

function InsideEditorAndUiContext() {
    return <ContextMenu>{/* <DefaultContextMenuContent /> */}</ContextMenu>;
}
