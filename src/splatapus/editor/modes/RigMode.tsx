import { Vector2 } from "@/lib/geom/Vector2";
import { SplatKeyPoint, SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { Mode, ModeType } from "@/splatapus/editor/modes/Mode";
import classNames from "classnames";
import { LiveValue, runOnce, useLive } from "@/lib/live";
import {
    PointerEventContext,
    PointerEventType,
    SplatapusGestureDetector,
} from "@/splatapus/editor/EventContext";
import { debugStateToString } from "@/lib/debugPropsToString";
import { PointerEvent, PointerEventHandler, ReactNode, useState } from "react";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { mapRange } from "@/lib/utils";
import { Viewport } from "@/splatapus/editor/Viewport";
import { assert, assertExists } from "@/lib/assert";
import { Transition } from "@headlessui/react";
import { KeyPointPreview } from "@/splatapus/ui/KeyPointPreview";
import { useKeepNonNull } from "@/lib/hooks/useNonNull";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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
        const { points, pointsInDock, size, isAnyDragging, maxScreenProgress, minScreenProgress } =
            useLive(() => {
                const size = splatapus.viewport.screenSizeWithSidebarOpenLive();
                const previewMovement = mode?.previewMovement.live();
                const selectedKeyPointId = splatapus.location.keyPointId.live();

                let dockIndex = 0;
                let minScreenProgress = Infinity;
                let maxScreenProgress = -Infinity;

                const points = Array.from(
                    splatapus.document.live().keyPoints,
                    (keyPoint, overallIndex) => {
                        const draggingPosition =
                            previewMovement?.keyPointId === keyPoint.id
                                ? splatapus.viewport.sceneToScreenLive(
                                      previewMovement.scenePosition,
                                  )
                                : null;

                        const keypointPosition = keyPoint.position
                            ? splatapus.viewport.sceneToScreenLive(keyPoint.position)
                            : null;

                        const isInDock = draggingPosition
                            ? isPointInDockLive(splatapus.viewport, draggingPosition)
                            : !keyPoint.position;

                        let screenProgress = null;
                        if (keypointPosition) {
                            screenProgress = keypointPosition.dot(size) / size.dot(size);
                            minScreenProgress = Math.min(minScreenProgress, screenProgress);
                            maxScreenProgress = Math.max(maxScreenProgress, screenProgress);
                        }

                        return {
                            dockIndex: isInDock ? dockIndex++ : null,
                            keyPoint,
                            overallIndex,
                            isSelected: keyPoint.id === selectedKeyPointId,
                            screenPosition: draggingPosition ?? keypointPosition,
                            isDragging: !!draggingPosition,
                            screenProgress,
                        };
                    },
                );

                return {
                    points,
                    pointsInDock: dockIndex,
                    size,
                    isAnyDragging: !!previewMovement,
                    minScreenProgress,
                    maxScreenProgress,
                };
            }, [splatapus, mode]);

        const shouldShow = !!mode;
        const [shouldShowDock, setShouldShowDock] = useState(shouldShow);
        const exitPosition = new Vector2(size.x / 2, size.y + 50);

        const [hoveredId, setHoveredId] = useState<SplatKeyPointId | null>(null);
        const dockedHovered = points.find(
            (point) => point.dockIndex !== null && point.keyPoint.id === hoveredId,
        );
        const prevDockedHovered = useKeepNonNull(dockedHovered);
        console.log({ dockedHovered, prevDockedHovered });

        console.log("render");
        return (
            <>
                <Transition
                    show={shouldShow}
                    className="absolute left-0 right-0 bottom-0 z-10 h-24 bg-white/50 backdrop-blur-md "
                    enter="transition duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    beforeEnter={() => requestAnimationFrame(() => setShouldShowDock(true))}
                    beforeLeave={() => setShouldShowDock(false)}
                />
                {points.map((props) => {
                    return (
                        <RigMode.KeyPoint
                            key={props.keyPoint.id}
                            shouldShow={shouldShow}
                            shouldShowDock={shouldShowDock}
                            splatapus={splatapus}
                            mode={mode}
                            screenSize={size}
                            pointsInDock={pointsInDock}
                            exitPosition={exitPosition}
                            isAnyDragging={isAnyDragging}
                            minScreenProgress={minScreenProgress}
                            maxScreenProgress={maxScreenProgress}
                            onPointerEnter={() => setHoveredId(props.keyPoint.id)}
                            onPointerLeave={() => setHoveredId(null)}
                            {...props}
                        />
                    );
                })}
                <Transition
                    show={shouldShow}
                    className="duration pointer-events-none absolute bottom-2 z-10 text-center font-semibold text-stone-400"
                    enter="transition duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition duration-75"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    style={{
                        width: size.x,
                        transitionDelay: shouldShow ? `${pointsInDock * 30 + 400}ms` : "0ms",
                    }}
                >
                    drag each key point into the canvas
                </Transition>
                {prevDockedHovered && (
                    <Transition
                        show={!isAnyDragging && !!dockedHovered}
                        className="pointer-events-none absolute bottom-24 z-10 -mt-16 -ml-10 h-16 w-20 origin-bottom overflow-hidden rounded border border-stone-300 bg-stone-50 shadow-md transition"
                        enter="ease-out"
                        enterFrom="translate-y-4 opacity-0 scale-75"
                        enterTo="translate-y-0 opacity-100 scale-100"
                        leave="ease-in"
                        leaveFrom="translate-y-0 opacity-100 scale-100"
                        leaveTo="translate-y-4 opacity-0 scale-75"
                        style={{
                            left: size.x / 2,
                            transform: `translateX(${
                                (assertExists((dockedHovered ?? prevDockedHovered).dockIndex) -
                                    (pointsInDock - 1) / 2) *
                                56
                            }px) translateY(var(--tw-translate-y)) scale(var(--tw-scale-x), var(--tw-scale-y))`,
                        }}
                    >
                        <TransitionGroup>
                            <CSSTransition
                                key={prevDockedHovered.keyPoint.id}
                                timeout={300}
                                classNames={{
                                    // ew gross i hate this
                                    enter: "transition-opacity bg-stone-50 absolute",
                                    enterActive: "transition-opacity bg-stone-50 absolute",
                                    enterDone: "transition-opacity bg-stone-50 absolute",
                                    exit: "transition-opacity opacity-0 bg-stone-50 absolute",
                                    exitActive: "transition-opacity opacity-0 bg-stone-50 absolute",
                                    exitDone: "transition-opacity opacity-0 bg-stone-50 absolute",
                                }}
                            >
                                <KeyPointPreview
                                    width={78}
                                    height={62}
                                    keyPointId={prevDockedHovered.keyPoint.id}
                                    splatapus={splatapus}
                                />
                            </CSSTransition>
                        </TransitionGroup>
                    </Transition>
                )}
            </>
        );
    };

    private static KeyPoint = function RigMoreKeyPoint({
        dockIndex,
        screenPosition,
        shouldShowDock,
        shouldShow,
        screenSize,
        pointsInDock,
        keyPoint,
        exitPosition,
        isDragging,
        mode,
        splatapus,
        isSelected,
        isAnyDragging,
        overallIndex,
        screenProgress,
        minScreenProgress,
        maxScreenProgress,
        onPointerEnter,
        onPointerLeave,
    }: {
        dockIndex: number | null;
        screenPosition: Vector2 | null;
        shouldShowDock: boolean;
        shouldShow: boolean;
        screenSize: Vector2;
        pointsInDock: number;
        keyPoint: SplatKeyPoint;
        exitPosition: Vector2;
        isDragging: boolean;
        mode: RigMode | null;
        splatapus: Splatapus;
        isSelected: boolean;
        isAnyDragging: boolean;
        overallIndex: number;
        screenProgress: number | null;
        minScreenProgress: number;
        maxScreenProgress: number;
        onPointerEnter: PointerEventHandler;
        onPointerLeave: PointerEventHandler;
    }) {
        const [isTransitionedIn, setIsTransitionedIn] = useState(!!mode);
        const isDocked = dockIndex !== null;
        if (!screenPosition) {
            assert(dockIndex !== null);
            screenPosition = shouldShowDock
                ? new Vector2(
                      screenSize.x / 2 + (dockIndex - (pointsInDock - 1) / 2) * 56,
                      screenSize.y - DOCK_CENTER_LINE_PX,
                  )
                : exitPosition;
        }

        const [isHovered, setIsHovered] = useState(false);

        return (
            <>
                <Transition
                    key={keyPoint.id}
                    show={shouldShow}
                    className={classNames(
                        "absolute top-0 left-0 flex cursor-move items-center justify-center",
                        isDocked ? "-mt-7 -ml-7 h-14 w-14" : "-mt-5 -ml-5 h-10 w-10 rounded-full",
                        isDragging ? "z-20" : isDocked ? "z-10" : "z-[5]",
                        !isDragging &&
                            (shouldShow
                                ? dockIndex !== null && "transition duration-300 ease-out-back"
                                : dockIndex !== null && "transition duration-200 ease-in"),
                    )}
                    enter={
                        isDocked
                            ? "transition-transform duration-300 ease-out-back"
                            : "transition-transform duration-200 ease-out-back"
                    }
                    enterFrom={isDocked ? "scale-50" : "scale-0"}
                    enterTo="scale-100"
                    leave={
                        isDocked
                            ? "transition-transform duration-200 ease-in"
                            : "transition-transform duration-200 ease-in-back"
                    }
                    leaveFrom="scale-100"
                    leaveTo={isDocked ? "scale-50" : "scale-0"}
                    afterEnter={() => setIsTransitionedIn(true)}
                    beforeLeave={() => setIsTransitionedIn(false)}
                    onPointerEnter={(event: PointerEvent) => {
                        setIsHovered(true);
                        onPointerEnter(event);
                    }}
                    onPointerLeave={(event: PointerEvent) => {
                        setIsHovered(false);
                        onPointerLeave(event);
                    }}
                    onPointerDown={(event: PointerEvent) => {
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
                        transform: `translate(${screenPosition.x}px, ${screenPosition.y}px) scale(var(--tw-scale-x), var(--tw-scale-y))`,
                        transitionDelay: isAnyDragging
                            ? "0ms"
                            : isDocked
                            ? `${dockIndex * 25}ms`
                            : isTransitionedIn
                            ? "0ms"
                            : `${mapRange(
                                  minScreenProgress,
                                  maxScreenProgress,
                                  0,
                                  200,
                                  assertExists(screenProgress),
                              )}ms`,
                    }}
                >
                    <div
                        className={classNames(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform duration-200 ease-out-back-md",
                            isDocked ? "scale-150" : "scale-100",
                            isSelected
                                ? "bg-gradient-to-br from-cyan-400 to-blue-400 text-white"
                                : "border border-stone-200 bg-white text-stone-400",
                        )}
                    >
                        {overallIndex + 1}
                    </div>
                </Transition>
                <Transition
                    show={isHovered && !isDocked && !isAnyDragging}
                    className="pointer-events-none absolute top-0 left-0 z-[4]"
                    style={{
                        transform: `translate(${screenPosition.x}px, ${screenPosition.y - 24}px)`,
                    }}
                >
                    <Transition.Child
                        className="-mt-16 -ml-10 h-16 w-20 origin-bottom rounded border border-stone-300 bg-stone-50 shadow-md"
                        enter="transition ease-out"
                        enterFrom="translate-y-4 opacity-0 scale-75"
                        enterTo="translate-y-0 opacity-100 scale-100"
                        leave="transition ease-in"
                        leaveFrom="translate-y-0 opacity-100 scale-100"
                        leaveTo="translate-y-4 opacity-0 scale-75"
                    >
                        <KeyPointPreview
                            width={78}
                            height={62}
                            keyPointId={keyPoint.id}
                            splatapus={splatapus}
                        />
                    </Transition.Child>
                </Transition>
            </>
        );
    };
}
