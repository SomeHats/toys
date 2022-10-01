import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createTool } from "@/splatapus/editor/lib/createTool";
import { createGestureDetector, GestureType } from "@/splatapus/editor/lib/GestureDetection";
import { ToolType } from "@/splatapus/editor/tools/ToolType";

export type IdleDrawTool = {
    readonly state: "idle";
};
export type DrawingDrawTool = {
    readonly state: "drawing";
    readonly points: ReadonlyArray<Vector2>;
};

const DrawGesture = createGestureDetector<IdleDrawTool, DrawingDrawTool>({
    onDragStart: ({ event, splatapus }) => ({
        state: "drawing",
        points: [splatapus.viewport.eventSceneCoords(event)],
    }),
    onDragMove: ({ event, splatapus }, state) => ({
        state: "drawing",
        points: [...state.points, splatapus.viewport.eventSceneCoords(event)],
    }),
    onDragEnd: ({ splatapus }, state) => {
        const { shapeId, keyPointId } = splatapus.location.getWithoutListening();
        splatapus.document.update((document) => {
            const shape = document.shapes.get(shapeId);
            return document.replacePointsForVersion(keyPointId, shape.id, state.points);
        });
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
