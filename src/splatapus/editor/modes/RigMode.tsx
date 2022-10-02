import { Vector2 } from "@/lib/geom/Vector2";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import { Mode, ModeType } from "@/splatapus/editor/modes/Mode";
import classNames from "classnames";
import { LiveValue, useLive, useLiveValue } from "@/lib/live";
import {
    PointerEventContext,
    PointerEventType,
    SplatapusGestureDetector,
} from "@/splatapus/editor/EventContext";
import { debugStateToString } from "@/lib/debugPropsToString";
import { ReactNode } from "react";
import { Splatapus } from "@/splatapus/editor/useEditor";

export class RigMode implements Mode<ModeType.Rig> {
    readonly type = ModeType.Rig;
    private readonly previewMovement = new LiveValue<null | {
        readonly keyPointId: SplatKeyPointId;
        readonly delta: Vector2;
    }>(null);
    private readonly gesture = new SplatapusGestureDetector<[keyPointId?: SplatKeyPointId]>({
        onTap: (event, { location }, keyPointId) => {
            if (!keyPointId) {
                return;
            }
            location.keyPointId.update(keyPointId);
        },
        onDragStart: (event, { viewport, document, location }, keyPointId) => {
            if (!keyPointId) {
                return null;
            }

            location.keyPointId.update(keyPointId);
            const startingPosition = viewport.eventSceneCoords(event);
            return {
                couldBeTap: true,
                onMove: (event) => {
                    this.previewMovement.update({
                        keyPointId,
                        delta: viewport.eventSceneCoords(event).sub(startingPosition),
                    });
                },
                onEnd: (event) => {
                    const delta = viewport.eventSceneCoords(event).sub(startingPosition);
                    this.previewMovement.update(null);
                    document.update((doc) =>
                        doc.updateKeyPoint(keyPointId, (point) => ({
                            ...point,
                            position: point.position.add(delta),
                        })),
                    );
                },
                onCancel: (event) => {
                    this.previewMovement.update(null);
                },
            };
        },
    });
    isIdleLive(): boolean {
        return !this.gesture.isDragging.live();
    }
    toDebugStringLive(): string {
        const previewMovement = this.previewMovement.live();
        return debugStateToString(
            "rig",
            previewMovement
                ? {
                      _: "moving",
                      keyPointId: previewMovement.keyPointId,
                      delta: previewMovement.delta.toString(2),
                  }
                : { _: "idle" },
        );
    }
    onPointerEvent(ctx: PointerEventContext<PointerEventType>): void {
        this.gesture.onPointerEvent(ctx);
    }
    getPreviewPositionLive(): Vector2 | null {
        return null;
    }
    renderOverlay(splatapus: Splatapus): ReactNode {
        return <RigMode.Overlay splatapus={splatapus} mode={this} />;
    }

    private static Overlay = function Overlay({
        splatapus,
        mode,
    }: {
        splatapus: Splatapus;
        mode: RigMode;
    }) {
        const previewPosition = useLiveValue(mode.previewMovement);
        const keyPoints = useLive(() => splatapus.document.live().keyPoints, [splatapus]);
        const selectedKeyPointId = useLiveValue(splatapus.location.keyPointId);

        return (
            <>
                {Array.from(keyPoints, (keyPoint, i) => {
                    const position =
                        previewPosition?.keyPointId === keyPoint.id
                            ? keyPoint.position.add(previewPosition.delta)
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
                                mode.gesture.onPointerEvent(
                                    { event, eventType: "down", splatapus },
                                    keyPoint.id,
                                );
                            }}
                        >
                            <div
                                className={classNames(
                                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md",
                                    keyPoint.id === selectedKeyPointId
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
    };
}
