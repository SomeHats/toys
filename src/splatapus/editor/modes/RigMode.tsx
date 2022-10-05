import { Vector2 } from "@/lib/geom/Vector2";
import { SplatKeyPoint, SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import { Mode, ModeType } from "@/splatapus/editor/modes/Mode";
import classNames from "classnames";
import { LiveValue, runOnce, useLive, useLiveValue } from "@/lib/live";
import {
    PointerEventContext,
    PointerEventType,
    SplatapusGestureDetector,
} from "@/splatapus/editor/EventContext";
import { debugStateToString } from "@/lib/debugPropsToString";
import { ReactNode } from "react";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { partition } from "@/lib/utils";
import { Viewport } from "@/splatapus/editor/Viewport";
import { assert, assertExists } from "@/lib/assert";
import { should } from "vitest";

type GestureArgs = [keyPoint?: { id: SplatKeyPointId; initialScenePosition: Vector2 }];

const DOCK_THRESHOLD_PX = 80;
const DOCK_CENTER_LINE_PX = 64;

function isPointInDockLive(viewport: Viewport, screenPosition: Vector2) {
    return screenPosition.y > viewport.screenSize.live().y - DOCK_THRESHOLD_PX;
}

export class RigMode implements Mode<ModeType.Rig> {
    readonly type = ModeType.Rig;

    private readonly previewMovement = new LiveValue<null | {
        readonly keyPointId: SplatKeyPointId;
        readonly scenePosition: Vector2;
    }>(null, "RigMode.previewMovement");
    private readonly previewPosition = new LiveValue<null | Vector2>(
        null,
        "RigMode.previewPosition",
    );

    private readonly gesture = new SplatapusGestureDetector<GestureArgs>({
        onTap: (event, { location }, keyPoint) => {
            if (!keyPoint) {
                return;
            }
            location.keyPointId.update(keyPoint.id);
        },
        onDragStart: (event, { viewport, document, location }, keyPoint) => {
            event.preventDefault();
            if (!keyPoint) {
                this.previewPosition.update(viewport.eventSceneCoords(event));
                return {
                    couldBeTap: false,
                    onMove: (event) =>
                        this.previewPosition.update(viewport.eventSceneCoords(event)),
                    onEnd: () => this.previewPosition.update(null),
                    onCancel: () => this.previewPosition.update(null),
                };
            }

            location.keyPointId.update(keyPoint.id);
            const startingPointerScenePosition = viewport.eventSceneCoords(event);
            const startingKeyPointScenePosition = keyPoint.initialScenePosition;
            return {
                couldBeTap: true,
                onMove: (event) => {
                    this.previewMovement.update({
                        keyPointId: keyPoint.id,
                        scenePosition: viewport
                            .eventSceneCoords(event)
                            .sub(startingPointerScenePosition)
                            .add(startingKeyPointScenePosition),
                    });
                },
                onEnd: (event) => {
                    const newPosition = viewport
                        .eventSceneCoords(event)
                        .sub(startingPointerScenePosition)
                        .add(startingKeyPointScenePosition);
                    const isInDock = runOnce(() =>
                        isPointInDockLive(viewport, viewport.sceneToScreenLive(newPosition)),
                    );
                    this.previewMovement.update(null);
                    document.update((doc) =>
                        doc.updateKeyPoint(keyPoint.id, (point) => ({
                            ...point,
                            position: isInDock ? null : newPosition,
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
        const previewPosition = this.previewPosition.live();
        return debugStateToString(
            "rig",
            previewPosition
                ? { _: "preview", position: previewPosition.toString(2) }
                : previewMovement
                ? {
                      _: "moving",
                      keyPointId: previewMovement.keyPointId,
                      delta: previewMovement.scenePosition.toString(2),
                  }
                : { _: "idle" },
        );
    }
    onPointerEvent(ctx: PointerEventContext<PointerEventType>): void {
        this.gesture.onPointerEvent(ctx);
    }
    getPreviewPositionLive(): Vector2 | null {
        return this.previewPosition.live();
    }
    renderOverlay(splatapus: Splatapus): ReactNode {
        return <RigMode.Overlay splatapus={splatapus} mode={this} />;
    }

    static Overlay = function Overlay({
        splatapus,
        mode,
    }: {
        splatapus: Splatapus;
        mode: RigMode | null;
    }) {
        const { points, pointsInDock, size, isAnyDragging } = useLive(() => {
            const size = splatapus.viewport.screenSizeWithSidebarOpenLive();
            const previewMovement = mode?.previewMovement.live();
            const selectedKeyPointId = splatapus.location.keyPointId.live();

            let dockIndex = 0;
            const points = Array.from(
                splatapus.document.live().keyPoints,
                (keyPoint, overallIndex) => {
                    const draggingPosition =
                        previewMovement?.keyPointId === keyPoint.id
                            ? splatapus.viewport.sceneToScreenLive(previewMovement.scenePosition)
                            : null;

                    const keypointPosition = keyPoint.position
                        ? splatapus.viewport.sceneToScreenLive(keyPoint.position)
                        : null;

                    const isInDock = draggingPosition
                        ? isPointInDockLive(splatapus.viewport, draggingPosition)
                        : !keyPoint.position;

                    return {
                        dockIndex: isInDock ? dockIndex++ : null,
                        keyPoint,
                        overallIndex,
                        isSelected: keyPoint.id === selectedKeyPointId,
                        screenPosition: draggingPosition ?? keypointPosition,
                        isDragging: !!draggingPosition,
                    };
                },
            );

            return { points, pointsInDock: dockIndex, size, isAnyDragging: !!previewMovement };
        }, [splatapus, mode]);

        const shouldShow = !!mode;
        const exitPosition = new Vector2(size.x / 2, size.y + 50);

        return (
            <>
                <div
                    className={classNames(
                        "absolute left-0 right-0 bottom-0 z-10 h-24 bg-white/50 backdrop-blur-md transition duration-200",
                        shouldShow ? "opacity-100" : "opacity-0",
                    )}
                />
                {points.map(
                    ({
                        dockIndex,
                        keyPoint,
                        overallIndex,
                        isSelected,
                        screenPosition,
                        isDragging,
                    }) => {
                        if (!screenPosition) {
                            assert(dockIndex !== null);
                            screenPosition = shouldShow
                                ? new Vector2(
                                      size.x / 2 + (dockIndex - (pointsInDock - 1) / 2) * 56,
                                      size.y - DOCK_CENTER_LINE_PX,
                                  )
                                : exitPosition;
                        }
                        return (
                            <div
                                key={keyPoint.id}
                                className={classNames(
                                    "absolute top-0 left-0 flex cursor-move items-center justify-center",
                                    dockIndex === null
                                        ? "-mt-5 -ml-5 h-10 w-10 rounded-full"
                                        : "-mt-7 -ml-7 h-14 w-14",
                                    isDragging ? "z-20" : dockIndex !== null && "z-10",
                                    !isDragging &&
                                        (shouldShow
                                            ? dockIndex !== null &&
                                              "transition duration-300 ease-out-back"
                                            : dockIndex !== null &&
                                              "transition duration-200 ease-in"),
                                )}
                                onPointerDown={(event) => {
                                    if (!mode) return;
                                    mode.gesture.onPointerEvent(
                                        { event, eventType: "down", splatapus },
                                        {
                                            id: keyPoint.id,
                                            initialScenePosition: runOnce(() =>
                                                splatapus.viewport.screenToSceneLive(
                                                    assertExists(screenPosition),
                                                ),
                                            ),
                                        },
                                    );
                                }}
                                style={{
                                    transform: `translate(${screenPosition.x}px, ${screenPosition.y}px)`,
                                    transitionDelay:
                                        dockIndex === null || isAnyDragging
                                            ? "0ms"
                                            : `${dockIndex * 30}ms`,
                                }}
                            >
                                <div
                                    className={classNames(
                                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform duration-200",
                                        shouldShow
                                            ? dockIndex === null
                                                ? "scale-100 ease-out-back-md"
                                                : "scale-150 ease-out-back-md"
                                            : dockIndex === null
                                            ? "scale-0 ease-in-back-md"
                                            : "scale-100",
                                        isSelected
                                            ? "bg-gradient-to-br from-cyan-400 to-blue-400 text-white"
                                            : "border border-stone-200 bg-white text-stone-400",
                                    )}
                                >
                                    {overallIndex + 1}
                                </div>
                            </div>
                        );
                    },
                )}
                <div
                    className={classNames(
                        "duration pointer-events-none absolute bottom-2 z-10 text-center font-semibold text-stone-400 transition",
                        shouldShow && pointsInDock
                            ? "opacity-100 duration-500"
                            : "opacity-0 duration-75",
                    )}
                    style={{
                        width: size.x,
                        transitionDelay: shouldShow ? `${pointsInDock * 30 + 400}ms` : "0ms",
                    }}
                >
                    drag each key point into the canvas
                </div>
            </>
        );
    };

    // private static PendingKeyPoints = function PendingKeyPoints({
    //     splatapus,
    //     mode,
    // }: {
    //     splatapus: Splatapus;
    //     mode: RigMode | null;
    // }) {
    //     const selectedKeyPointId = useLiveValue(splatapus.location.keyPointId);
    //     const keyPoints = Array.from(
    //         useLive(() => splatapus.document.live().keyPoints, [splatapus]),
    //         (keyPoint, i): [SplatKeyPoint, number] => [keyPoint, i + 1],
    //     ).filter(([kp]) => kp.position === null);
    //     const size = useLive(() => splatapus.viewport.screenSizeWithSidebarOpenLive(), [splatapus]);
    //     const previewMovement = useLive(() => {
    //         const previewMovement = mode?.previewMovement.live();
    //         if (!previewMovement) {
    //             return null;
    //         }
    //         return {
    //             keyPointId: previewMovement.keyPointId,
    //             screenPosition: splatapus.viewport.sceneToScreenLive(previewMovement.scenePosition),
    //         };
    //     }, [mode, splatapus.viewport]);

    //     const exitPosition = new Vector2(size.x / 2, size.y + 50);
    //     const show = !!mode;

    //     return (
    //         <>
    //             {keyPoints.map(([keyPoint, num], i) => {
    //                 const isDragging = previewMovement?.keyPointId === keyPoint.id;
    //                 const position = isDragging
    //                     ? previewMovement.screenPosition
    //                     : ;
    //                 return (
    //                     <div
    //                         key={keyPoint.id}
    //                         className={classNames(
    //                             "absolute top-0 left-0 -mt-4 -ml-4 flex h-8 w-8 cursor-move items-center justify-center outline-1",
    //                             isDragging
    //                                 ? ""
    //                                 : show
    //                                 ? "transition duration-200 ease-out-back"
    //                                 : "transition ease-in",
    //                         )}
    //                         style={{
    //                             transform: `translate(${position.x}px, ${position.y}px) scale(${
    //                                 show ? 1.5 : 1
    //                             })`,
    //                             transitionDelay: `${i * 30}ms`,
    //                         }}
    //                         onPointerDown={(event) => {
    //                             if (!mode) return;
    //                             mode.gesture.onPointerEvent(
    //                                 { event, eventType: "down", splatapus },
    //                                 {
    //                                     id: keyPoint.id,
    //                                     initialPosition: runOnce(() =>
    //                                         splatapus.viewport.screenToSceneLive(position),
    //                                     ),
    //                                 },
    //                             );
    //                         }}
    //                     >
    //                         <div
    //                             className={classNames(
    //                                 "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md",
    //                                 keyPoint.id === selectedKeyPointId
    //                                     ? "bg-gradient-to-br from-cyan-400 to-blue-400 text-white"
    //                                     : "border border-stone-200 bg-white text-stone-400",
    //                             )}
    //                         >
    //                             {num}
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //
    //         </>
    //     );
    // };
}
