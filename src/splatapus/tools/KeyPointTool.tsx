import Vector2 from "@/lib/geom/Vector2";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import { createTool, OverlayProps } from "@/splatapus/tools/lib/createTool";
import { createGestureDetector, GestureType } from "@/splatapus/tools/lib/GestureDetection";
import { ToolType } from "@/splatapus/tools/ToolType";
import classNames from "classnames";

export type IdleKeyPointToolState = {
    readonly state: "idle";
};
export type MovingKeyPointToolState = {
    readonly state: "moving";
    readonly keyPointId: SplatKeypointId;
    readonly delta: Vector2;
    readonly startingPosition: Vector2;
};

const MoveGesture = createGestureDetector<
    IdleKeyPointToolState,
    MovingKeyPointToolState,
    SplatKeypointId
>({
    onTap: ({ updateLocation }, state, keyPointId) => {
        if (keyPointId) {
            updateLocation((location) => location.with({ keyPointId }));
        }
        return state;
    },
    onDragStart: ({ updateLocation, viewport, event }, state, keyPointId) => {
        if (!keyPointId) {
            return null;
        }
        updateLocation((location) => location.with({ keyPointId }));
        return {
            state: "moving",
            keyPointId,
            delta: Vector2.ZERO,
            startingPosition: viewport.eventSceneCoords(event),
        };
    },
    onDragMove: ({ viewport, event }, state) => ({
        ...state,
        delta: viewport.eventSceneCoords(event).sub(state.startingPosition),
    }),
    onDragEnd: ({ event, viewport, updateDocument }, state) => {
        const delta = viewport.eventSceneCoords(event).sub(state.startingPosition);
        updateDocument((document) =>
            document.updateKeypoint(state.keyPointId, (keyPoint) => ({
                ...keyPoint,
                position: keyPoint.position.add(delta),
            })),
        );
        return { state: "idle" };
    },
    onDragCancel: () => ({ state: "idle" }),
});

export type KeyPointTool = {
    readonly type: ToolType.KeyPoint;
    readonly gesture: GestureType<typeof MoveGesture>;
};

const keyPointOffset = new Vector2(-12, -12);
export const KeyPointTool = createTool<KeyPointTool>()({
    initialize: () => ({
        type: ToolType.KeyPoint,
        gesture: MoveGesture.initialize({ state: "idle" }),
    }),
    isIdle: (tool: KeyPointTool) => true,
    getDebugProperties: (tool) => {
        const state = MoveGesture.getState(tool.gesture);
        switch (state.state) {
            case "idle":
                return { _: state.state };
            case "moving":
                return {
                    _: state.state,
                    keyPointId: state.keyPointId,
                    delta: state.delta.toString(2),
                };
        }
    },
    onPointerEvent: MoveGesture.createOnPointerEvent<"gesture", KeyPointTool>("gesture"),
    Overlay: ({ tool, document, viewport, location, onUpdateTool }: OverlayProps<KeyPointTool>) => {
        const state = MoveGesture.getState(tool.gesture);
        return (
            <>
                {Array.from(document.data.keyPoints, (keyPoint, i) => {
                    const position =
                        state.state === "moving" && state.keyPointId === keyPoint.id
                            ? keyPoint.position.add(state.delta)
                            : keyPoint.position;

                    return (
                        <ScenePositionedDiv
                            key={keyPoint.id}
                            position={position}
                            screenOffset={keyPointOffset}
                            viewport={viewport}
                            className={classNames(
                                "flex h-6 w-6 cursor-move items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-400 shadow-md",
                                keyPoint.id === location.keyPointId
                                    ? "text-stone-500 ring-2 ring-inset ring-purple-400"
                                    : "text-stone-400",
                            )}
                            onPointerDown={(event) => {
                                onUpdateTool((ctx, tool) =>
                                    KeyPointTool.onPointerEvent(
                                        { ...ctx, event, eventType: "down" },
                                        tool,
                                        keyPoint.id,
                                    ),
                                );
                            }}
                        >
                            {i + 1}
                        </ScenePositionedDiv>
                    );
                })}
            </>
        );
    },
});