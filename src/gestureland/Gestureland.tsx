import {
    CAMERA_ID,
    Camera,
    GesturelandStore,
    Stroke,
} from "@/gestureland/GesturelandStore";
import { EXPIRE_POINTER_AFTER_MS } from "@/gestureland/constants";
import {
    drawOnCanvas,
    interactWithShapes,
} from "@/gestureland/interactions/interactions";
import {
    GLGestureType,
    GLPointer,
    GLPointerEvent,
    GLPointerId,
    GLTarget,
    GLTargetFn,
    PointerState,
} from "@/gestureland/types";
import { assert, assertExists } from "@/lib/assert";
import { Transform2d } from "@/lib/geom/Transform2d";
import { Vector2 } from "@/lib/geom/Vector2";
import { memo, reactive } from "@/lib/signia";
import { exhaustiveSwitchError, groupBy, sortBy } from "@/lib/utils";

export class Gestureland {
    readonly store: GesturelandStore;

    constructor(readonly container: HTMLElement) {
        this.store = new GesturelandStore();
        this.store.put1(Camera.create({ id: CAMERA_ID }));

        this.addTarget(drawOnCanvas);
        this.addTarget(interactWithShapes);
    }

    // #region ======== CAMERA & VIEWPORT ========
    @reactive accessor viewportSize: Vector2 = Vector2.UNIT;

    @memo get pageToViewport() {
        return Transform2d.translate(this.viewportSize.scale(0.5))
            .scaleUniform(this.camera.zoom)
            .translate(Vector2.from(this.camera.center).scale(-1));
    }
    @memo get viewportToPage() {
        return this.pageToViewport.invert();
    }

    @memo get camera() {
        return assertExists(this.store.get(CAMERA_ID));
    }
    set camera(newCamera: Camera) {
        assert(newCamera.id === CAMERA_ID);
        this.store.put([newCamera]);
    }
    // #endregion

    // #region ======== SHAPES ========
    @memo get shapes() {
        return this.store
            .allRecords()
            .filter((v): v is Stroke => v.typeName === "stroke");
    }
    // #endregion

    // #region ======== TARGETS ========
    @reactive private accessor targetFns: readonly GLTargetFn[] = [];
    addTarget(targetFn: GLTargetFn) {
        this.targetFns = [...this.targetFns, targetFn];
    }

    @memo get targets() {
        const result = [];
        for (const fn of this.targetFns) {
            const targets = fn(this);
            if (!targets) continue;
            if (Array.isArray(targets)) {
                result.push(...targets);
            } else {
                result.push(targets);
            }
        }
        return sortBy(result, (target) => target.index);
    }
    @memo get targetsByIndex() {
        return groupBy(this.targets, (target) => target.index);
    }

    getTargetAtPoint(
        pagePoint: Vector2,
        {
            sensitivity,
            filter = () => true,
        }: { sensitivity: number; filter?: (target: GLTarget) => boolean },
    ) {
        const hoverDistance = sensitivity * this.camera.zoom;

        for (const [_index, targets] of sortBy(
            [...this.targetsByIndex],
            ([index]) => index,
        ).reverse()) {
            let lowestDistance = hoverDistance;
            let found = null;

            for (const target of targets) {
                if (!filter(target)) continue;
                const distance = target.distanceTo(pagePoint);
                if (distance <= lowestDistance) {
                    lowestDistance = distance;
                    found = target;
                }
            }

            if (found) return found;
        }

        return null;
    }
    @memo get enabledGestures() {
        const enabled: Record<GLGestureType, boolean> = {
            drag: false,
            twoFingerDrag: false,
            tap: false,
            doubleTap: false,
        };

        for (const target of this.targets) {
            if (target.onDrag) enabled.drag = true;
            if (target.onTwoFingerDrag) enabled.twoFingerDrag = true;
            if (target.onTap) enabled.tap = true;
            if (target.onDoubleTap) enabled.doubleTap = true;
        }

        return enabled;
    }
    // #endregion

    // #region ======== EVENTS ========
    onWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (event.ctrlKey) {
            // const screenPosition = Vector2.fromEvent(event);
            // const newPan = screenPosition
            //     .add(pan)
            //     .scale(newZoom / zoom)
            //     .sub(screenPosition);
            this.camera = {
                ...this.camera,
                zoom: Math.exp(-event.deltaY / 100) * this.camera.zoom,
            };
        } else {
            this.camera = {
                ...this.camera,
                center: new Vector2(event.deltaX, event.deltaY)
                    .scale(1 / this.camera.zoom)
                    .add(this.camera.center),
            };
        }
    };

    @reactive accessor pointers: ReadonlyMap<GLPointerId, GLPointer> =
        new Map();
    getPointer(id: GLPointerId) {
        return this.pointers.get(id);
    }
    setPointer(pointer: GLPointer) {
        const map = new Map(this.pointers);
        map.set(pointer.pointerId, pointer);
        this.pointers = map;
    }
    setPointerState(pointer: GLPointer, state: PointerState) {
        this.setPointer({
            ...(this.getPointer(pointer.pointerId) ?? pointer),
            state,
        });
    }

    private updatePointerAndReturnEvent(
        event: PointerEvent,
        phase: "down" | "move" | "up" | "cancel",
    ): GLPointerEvent & GLPointer {
        const existingPointer = this.getPointer(event.pointerId);
        const pointer: GLPointer = {
            pointerId: event.pointerId,
            viewportPosition: Vector2.fromEvent(event),
            type: event.pointerType as GLPointer["type"],
            isDown:
                phase === "down" ? true
                : phase === "up" || phase === "cancel" ? false
                : existingPointer?.isDown ?? false,
            state: existingPointer?.state ?? { type: "idle" },
            lastUpdatedAt: Date.now(),
        };
        this.setPointer(pointer);
        return {
            ...pointer,
            pagePosition: this.viewportToPage.apply(pointer.viewportPosition),
        };
    }
    onPointerDown = (rawEvent: PointerEvent) => {
        rawEvent.preventDefault();
        this.container.setPointerCapture(rawEvent.pointerId);
        const event = this.updatePointerAndReturnEvent(rawEvent, "down");
        const enabledGestures = this.enabledGestures;

        const state = event.state;
        switch (state.type) {
            // 1: check if this could be a part of an existing gesture:
            case "drag": {
                // already dragging, how do pointer down???? do nothing
                return;
            }
            // 2: try and begin a new gesture
            case "idle": {
                // const target =
                // const drag = target.onDrag(event);
                // this.setPointerState(event, {
                //     type: "drag",
                //     isConfirmed: false,
                //     target,
                //     drag,
                // });

                return;
            }

            default:
                exhaustiveSwitchError(state);
        }
    };
    onPointerMove = (rawEvent: PointerEvent) => {
        const event = this.updatePointerAndReturnEvent(rawEvent, "move");
        const state = event.state;
        switch (state.type) {
            case "idle": {
                return;
            }
            case "drag": {
                state.drag.onUpdate(event);
                return;
            }
            default:
                exhaustiveSwitchError(state);
        }
    };
    onPointerUp = (rawEvent: PointerEvent) => {
        this.container.releasePointerCapture(rawEvent.pointerId);
        const event = this.updatePointerAndReturnEvent(rawEvent, "up");
        const state = event.state;
        switch (state.type) {
            case "idle": {
                return;
            }
            case "drag": {
                state.drag.onEnd?.(event);
                this.setPointerState(event, { type: "idle" });
                return;
            }
            default:
                exhaustiveSwitchError(state);
        }
    };
    onPointerCancel = (rawEvent: PointerEvent) => {
        this.container.releasePointerCapture(rawEvent.pointerId);
        const event = this.updatePointerAndReturnEvent(rawEvent, "cancel");
        const state = event.state;
        switch (state.type) {
            case "idle":
                return;
            case "drag":
                state.drag.onCancel?.(event);
                this.setPointerState(event, { type: "idle" });
                return;
            default:
                exhaustiveSwitchError(state);
        }
    };
    onTick = () => {
        const expireOlderThan = Date.now() - EXPIRE_POINTER_AFTER_MS;
        const nextPointers = new Map(this.pointers);
        for (const pointer of this.pointers.values()) {
            if (pointer.lastUpdatedAt < expireOlderThan) {
                nextPointers.delete(pointer.pointerId);
            }
        }
        this.pointers = nextPointers;
    };
    // #endregion
}
