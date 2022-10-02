import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { createMode } from "@/splatapus/editor/lib/createMode";
import { createGestureDetector, GestureType } from "@/splatapus/editor/lib/GestureDetection";
import { ModeType } from "@/splatapus/editor/modes/ModeType";

export type IdleDrawMode = {
    readonly state: "idle";
};
export type DrawingDrawMode = {
    readonly state: "drawing";
    readonly points: ReadonlyArray<Vector2>;
};

const DrawGesture = createGestureDetector<IdleDrawMode, DrawingDrawMode>({
    onDragStart: ({ event, splatapus }) => ({
        state: "drawing",
        points: [splatapus.viewport.eventSceneCoords(event)],
    }),
    onDragMove: ({ event, splatapus }, state) => ({
        state: "drawing",
        points: [...state.points, splatapus.viewport.eventSceneCoords(event)],
    }),
    onDragEnd: ({ splatapus }, state) => {
        const { shapeId, keyPointId } = splatapus.location.getOnce();
        splatapus.document.update((document) => {
            const shape = document.shapes.get(shapeId);
            return document.replacePointsForVersion(keyPointId, shape.id, state.points);
        });
        return { state: "idle" };
    },
    onDragCancel: (ctx, state) => ({ state: "idle" }),
});

export type DrawMode = {
    readonly type: ModeType.Draw;
    readonly gesture: GestureType<typeof DrawGesture>;
};

export const DrawMode = createMode<DrawMode>()({
    initialize: (): DrawMode => ({
        type: ModeType.Draw,
        gesture: DrawGesture.initialize({ state: "idle" }),
    }),
    isIdle: (mode: DrawMode) => DrawGesture.isIdle(mode.gesture),
    getDebugProperties: (mode: DrawMode) => {
        const state = DrawGesture.getState(mode.gesture);
        switch (state.state) {
            case "idle":
                return { _: "idle" };
            case "drawing":
                return { _: "drawing", points: String(state.points.length) };
            default:
                exhaustiveSwitchError(state);
        }
    },
    getState: (mode: DrawMode) => DrawGesture.getState(mode.gesture),
    onPointerEvent: DrawGesture.createOnPointerEvent<"gesture", DrawMode>("gesture"),
});
