import { findDataElementParent } from "@/lib/findDataElement";
import Vector2 from "@/lib/geom/Vector2";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import {
    createTool,
    EventContext,
    ToolDragGesture,
    ToolRenderComponent,
    ToolRenderProps,
} from "@/splatapus/tools/AbstractTool";
import classNames from "classnames";
import { PointerEvent } from "react";

export type KeypointToolState =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "draggingKeyPoint";
          readonly keypointId: SplatKeypointId;
          readonly delta: Vector2;
      };

export class KeypointTool extends createTool<"keypoint", KeypointToolState>("keypoint") {
    static readonly toolName = "keypoint" as const;
    getSelected() {
        return this;
    }
    isIdle(): boolean {
        return this.state.type === "idle";
    }
    override onTap({ event, updateLocation }: EventContext<PointerEvent>) {
        const target = findDataElementParent(event.target, { keyPointId: SplatKeypointId.parse });

        if (target) {
            updateLocation((location) => location.with({ keyPointId: target.data.keyPointId }));
        }

        return this;
    }
    override onDragStart({
        event,
        document,
        viewport,
        updateLocation,
    }: EventContext<PointerEvent<Element>>): ToolDragGesture<KeypointToolState> | null {
        const target = findDataElementParent(event.target, { keyPointId: SplatKeypointId.parse });
        if (!target) {
            return null;
        }

        event.preventDefault();
        const keypoint = document.keyPoints.get(target.data.keyPointId);
        updateLocation((location) => location.with({ keyPointId: keypoint.id }));
        const startingPosition = viewport.screenToScene(Vector2.fromEvent(event));
        return {
            state: {
                type: "draggingKeyPoint",
                keypointId: keypoint.id,
                delta: Vector2.ZERO,
            },
            gesture: {
                couldBeTap: true,
                onMove: (state, { event }) => ({
                    type: "draggingKeyPoint",
                    keypointId: keypoint.id,
                    delta: viewport.screenToScene(Vector2.fromEvent(event)).sub(startingPosition),
                }),
                onEnd: (state, { event, updateDocument }) => {
                    const delta = viewport
                        .screenToScene(Vector2.fromEvent(event))
                        .sub(startingPosition);
                    updateDocument((document) =>
                        document.updateKeypoint(keypoint.id, (keypoint) => ({
                            ...keypoint,
                            position: keypoint.position.add(delta),
                        })),
                    );
                    return { type: "idle" };
                },
                onCancel: () => ({
                    type: "idle",
                }),
            },
        };
    }
    override getScreenHtmlComponent() {
        return KeyPointToolOverlay;
    }
    debugProperties(): Record<string, string> {
        return { _: this.state.type };
    }
}

const keypointOffset = new Vector2(-12, -12);
function KeyPointToolOverlay({
    viewport,
    document,
    location,
    updateTool,
    state,
}: ToolRenderProps<KeypointToolState>) {
    return (
        <>
            {Array.from(document.data.keyPoints, (keyPoint, i) => {
                const position =
                    state.type === "draggingKeyPoint" && state.keypointId === keyPoint.id
                        ? keyPoint.position.add(state.delta)
                        : keyPoint.position;
                return (
                    <ScenePositionedDiv
                        key={keyPoint.id}
                        position={position}
                        screenOffset={keypointOffset}
                        viewport={viewport}
                        className={classNames(
                            "flex h-6 w-6 cursor-move items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-400 shadow-md",
                            keyPoint.id === location.keyPointId
                                ? "text-stone-500 ring-2 ring-inset ring-purple-400"
                                : "text-stone-400",
                        )}
                        data-key-point-id={keyPoint.id}
                    >
                        {i + 1}
                    </ScenePositionedDiv>
                );
            })}
        </>
    );
}
