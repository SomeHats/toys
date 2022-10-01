import { Vector2 } from "@/lib/geom/Vector2";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import { createMode, OverlayProps } from "@/splatapus/editor/lib/createMode";
import { createGestureDetector, GestureType } from "@/splatapus/editor/lib/GestureDetection";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
import classNames from "classnames";
import { useLive } from "@/lib/live";

export type IdleRigModeState = {
    readonly state: "idle";
};
export type MovingRigModeState = {
    readonly state: "moving";
    readonly keyPointId: SplatKeyPointId;
    readonly delta: Vector2;
    readonly startingPosition: Vector2;
};

const MoveGesture = createGestureDetector<IdleRigModeState, MovingRigModeState, SplatKeyPointId>({
    onTap: ({ splatapus }, state, keyPointId) => {
        if (keyPointId) {
            splatapus.location.update((location) => ({ ...location, keyPointId }));
        }
        return state;
    },
    onDragStart: ({ splatapus, event }, state, keyPointId) => {
        if (!keyPointId) {
            return null;
        }
        splatapus.location.update((location) => ({ ...location, keyPointId }));
        return {
            state: "moving",
            keyPointId,
            delta: Vector2.ZERO,
            startingPosition: splatapus.viewport.eventSceneCoords(event),
        };
    },
    onDragMove: ({ splatapus, event }, state) => ({
        ...state,
        delta: splatapus.viewport.eventSceneCoords(event).sub(state.startingPosition),
    }),
    onDragEnd: ({ event, splatapus }, state) => {
        const delta = splatapus.viewport.eventSceneCoords(event).sub(state.startingPosition);
        splatapus.document.update((document) =>
            document.updateKeypoint(state.keyPointId, (keyPoint) => ({
                ...keyPoint,
                position: keyPoint.position.add(delta),
            })),
        );
        return { state: "idle" };
    },
    onDragCancel: () => ({ state: "idle" }),
});

export type RigMode = {
    readonly type: ModeType.Rig;
    readonly gesture: GestureType<typeof MoveGesture>;
};

export const RigMode = createMode<RigMode>()({
    initialize: () => ({
        type: ModeType.Rig,
        gesture: MoveGesture.initialize({ state: "idle" }),
        previewPosition: null,
    }),
    isIdle: (mode: RigMode) => true,
    getDebugProperties: (mode) => {
        const state = MoveGesture.getState(mode.gesture);
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
    onPointerEvent: MoveGesture.createOnPointerEvent<"gesture", RigMode>("gesture"),
    Overlay: ({ splatapus, mode, onUpdateMode }: OverlayProps<RigMode>) => {
        const state = MoveGesture.getState(mode.gesture);
        const keyPoints = useLive(() => splatapus.document.live().keyPoints, [splatapus]);
        const locationKeyPointId = useLive(() => splatapus.location.live().keyPointId, [splatapus]);
        return (
            <>
                {Array.from(keyPoints, (keyPoint, i) => {
                    const position =
                        state.state === "moving" && state.keyPointId === keyPoint.id
                            ? keyPoint.position.add(state.delta)
                            : keyPoint.position;

                    return (
                        <ScenePositionedDiv
                            key={keyPoint.id}
                            splatapus={splatapus}
                            position={position}
                            className={classNames(
                                "-mt-4 -ml-4 flex h-8 w-8 cursor-move items-center justify-center rounded-full",
                            )}
                            onPointerDown={(event) => {
                                onUpdateMode((mode) =>
                                    RigMode.onPointerEvent(
                                        { splatapus, event, eventType: "down" },
                                        mode,
                                        keyPoint.id,
                                    ),
                                );
                            }}
                        >
                            <div
                                className={classNames(
                                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md",
                                    keyPoint.id === locationKeyPointId
                                        ? "bg-gradient-to-br from-cyan-400 to-blue-400 text-white"
                                        : "border border-stone-200 bg-white text-stone-400",
                                )}
                            >
                                {i + 1}
                            </div>
                        </ScenePositionedDiv>
                    );
                })}
            </>
        );
    },
});
