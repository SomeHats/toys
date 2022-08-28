import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createTool } from "@/splatapus/tools/lib/createTool";
import { createGestureDetector, GestureType } from "@/splatapus/tools/lib/GestureDetection";
import { ToolType } from "@/splatapus/tools/ToolType";

export type IdleDrawTool = {
    readonly state: "idle";
};
export type DrawingDrawTool = {
    readonly state: "drawing";
    readonly points: ReadonlyArray<Vector2>;
};

const DrawGesture = createGestureDetector<IdleDrawTool, DrawingDrawTool>({
    onDragStart: ({ event, viewport }) => ({
        state: "drawing",
        points: [viewport.eventSceneCoords(event)],
    }),
    onDragMove: ({ event, viewport }, state) => ({
        state: "drawing",
        points: [...state.points, viewport.eventSceneCoords(event)],
    }),
    onDragEnd: ({ updateDocument, location }, state) => {
        updateDocument((document) =>
            document.replaceShapeVersionPoints(
                document.getShapeVersionForKeyPoint(location.keyPointId).id,
                state.points,
            ),
        );
        return { state: "idle" };
    },
    onDragCancel: (ctx, state) => ({ state: "idle" }),
});

export type DrawTool = {
    readonly type: ToolType.Draw;
    readonly gesture: GestureType<typeof DrawGesture>;
};

export const DrawTool = createTool<DrawTool>()({
    initialize: (): DrawTool => ({
        type: ToolType.Draw,
        gesture: DrawGesture.initialize({ state: "idle" }),
    }),
    isIdle: (tool: DrawTool) => DrawGesture.isIdle(tool.gesture),
    getDebugProperties: (tool: DrawTool) => {
        const state = DrawGesture.getState(tool.gesture);
        switch (state.state) {
            case "idle":
                return { _: "idle" };
            case "drawing":
                return { _: "drawing", points: String(state.points.length) };
            default:
                exhaustiveSwitchError(state);
        }
    },
    getState: (tool: DrawTool) => DrawGesture.getState(tool.gesture),
    onPointerEvent: DrawGesture.createOnPointerEvent<"gesture", DrawTool>("gesture"),
});
