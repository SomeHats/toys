import { Post } from "@/emoji/Post";
import { EventIterator } from "@/lib/EventIterator";
import PointerDragCover from "@/lib/PointerDragCover";
import { Spring } from "@/lib/Spring";
import { Ticker } from "@/lib/Ticker";
import { assertExists } from "@/lib/assert";
import { inOutSin, outExpo } from "@/lib/easings";
import AABB from "@/lib/geom/AABB";
import Circle from "@/lib/geom/Circle";
import { Vector2 } from "@/lib/geom/Vector2";
import { reactive, memo } from "@/lib/signia";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { tailwindColors } from "@/lib/theme";
import { clamp, exhaustiveSwitchError, invLerp, lerp } from "@/lib/utils";
import { computed, track } from "@tldraw/state";
import classNames from "classnames";
import { useState, PointerEvent, useLayoutEffect } from "react";
import { FiPlus } from "react-icons/fi";

const TRIGGER_SIZE = 32;
const PICKER_SIZE = 160;

export function PostDemo() {
    return (
        <div className="absolute top-0 left-0 min-w-full min-h-full bg-gray-200">
            <div className="sticky top-0 w-full px-2 py-1 bg-white border-b border-gray-300">
                Posts demo
            </div>
            <div className="max-w-3xl p-4 flex flex-col gap-3 mx-auto">
                <Post funZone={<Blobbo />} />
                <Post funZone={<Blobbo />} />
                <Post funZone={<Blobbo />} />
                <Post funZone={<Blobbo />} />
                <Post funZone={<Blobbo />} />
                <Post funZone={<Blobbo />} />
            </div>
        </div>
    );
}

const Blobbo = track(function Blobbo() {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [blob, setBlob] = useState<BlobThing | null>(null);

    useLayoutEffect(() => {
        if (!ref) return;

        const blob = new BlobThing(ref);
        setBlob(blob);

        return () => {
            blob.stop();
            setBlob(null);
        };
    }, [ref]);

    return (
        <div className="relative">
            <button
                ref={setRef}
                className={classNames(
                    "w-8 aspect-square border rounded-full flex items-center justify-center text-gray-500 border-gray-200 touch-none",
                    blob && blob.isActive && "opacity-0",
                )}
                onPointerDown={(e) => blob?.dispatch("down", e)}
                onPointerMove={(e) => blob?.dispatch("move", e)}
                onPointerUp={(e) => blob?.dispatch("up", e)}
                onPointerCancel={(e) => blob?.dispatch("up", e)}
                onLostPointerCapture={(e) => blob?.dispatch("up", e)}
            >
                <FiPlus />
            </button>
            {blob && <BlobRenderer blob={blob} />}
        </div>
    );
});

const defaultPosition = new Vector2(TRIGGER_SIZE / 2, TRIGGER_SIZE / 2);
type BlobThingState =
    | { type: "idle" }
    | { type: "pointing"; pointerId: number; initial: Vector2 }
    | { type: "dragging"; pointerId: number }
    | { type: "clicked" };
interface BlobThingEvent {
    type: "down" | "move" | "up";
    preventDefault: () => void;
    pointerId: number;
    position: Vector2;
}

class BlobThing {
    @reactive accessor position = defaultPosition;
    @reactive accessor triggerOffsetCenter = defaultPosition;
    @reactive accessor triggerClientCenter = defaultPosition;
    @reactive accessor screenBounds = AABB.ZERO;
    @reactive accessor isOpen = false;

    private ticker = new Ticker();

    constructor(readonly triggerEl: HTMLElement) {
        this.ticker.start();
        this.ticker.listen(() => {
            if (this.isActive) this.measure();
        });
        this.measure();
        window.addEventListener("scroll", this.onScroll);
    }

    #radiusTension = computed("rt", () => (this.isOpen ? 300 : 160));
    #radiusFriction = computed("rf", () => (this.isOpen ? 22 : 18));
    #positionTension = computed("pt", () => (this.isOpen ? 300 : 200));
    #positionFriction = computed("pf", () => (this.isOpen ? 22 : 8));
    #screenPadding = 8;

    @memo get screenDelta() {
        return this.triggerClientCenter.sub(this.triggerOffsetCenter);
    }

    #pickerRadius = new Spring({
        target: computed("picker.r", () =>
            this.isOpen ? PICKER_SIZE / 2 : TRIGGER_SIZE / 2,
        ),
        ticker: this.ticker,
        tension: this.#radiusTension,
        friction: this.#radiusFriction,
    });
    #pickerCenter = {
        x: new Spring({
            target: computed("picker.cx", () => {
                if (!this.isOpen) return this.triggerOffsetCenter.x;

                const minX =
                    -this.screenDelta.x +
                    this.screenBounds.left +
                    this.#screenPadding +
                    this.#pickerRadius.target;
                const maxX =
                    -this.screenDelta.x +
                    this.screenBounds.right -
                    this.#screenPadding -
                    this.#pickerRadius.target;

                return clamp(minX, maxX, this.position.x);
            }),
            ticker: this.ticker,
            tension: this.#positionTension,
            friction: this.#positionFriction,
        }),
        y: new Spring({
            target: computed("picker.cy", () => {
                if (!this.isOpen) return this.triggerOffsetCenter.y;

                const minY =
                    -this.screenDelta.y +
                    this.screenBounds.top +
                    this.#screenPadding +
                    this.#pickerRadius.value;
                const maxY =
                    -this.screenDelta.y +
                    this.screenBounds.bottom -
                    this.#screenPadding -
                    this.#pickerRadius.value;

                return clamp(minY, maxY, this.position.y);
            }),
            ticker: this.ticker,
            tension: this.#positionTension,
            friction: this.#positionFriction,
        }),
    };

    @memo get picker() {
        return Circle.create(
            this.#pickerCenter.x.value,
            this.#pickerCenter.y.value,
            this.#pickerRadius.value,
        );
    }

    readonly trigger = Circle.create(
        TRIGGER_SIZE / 2,
        TRIGGER_SIZE / 2,
        TRIGGER_SIZE / 2,
    );

    @memo get isActive() {
        return this.isOpen || Math.abs(this.#pickerRadius.velocity) > 0;
    }

    stop() {
        this.ticker.stop();
        this.cover.remove();
        window.removeEventListener("scroll", this.onScroll);

        this.#pickerRadius.destroy();
        this.#pickerCenter.x.destroy();
        this.#pickerCenter.y.destroy();
    }

    private interactionState: BlobThingState = { type: "idle" };

    private update(
        event: BlobThingEvent,
        state: BlobThingState,
    ): BlobThingState {
        if (state.type === "idle") {
            switch (event.type) {
                case "down": {
                    event.preventDefault();
                    this.cover.attach();

                    this.triggerEl.setPointerCapture(event.pointerId);

                    const wasActive = this.isActive;
                    this.measure();
                    this.updatePositionFromPointer(event.position);

                    if (!wasActive) {
                        this.#pickerRadius.reset();
                        this.#pickerCenter.x.reset();
                        this.#pickerCenter.y.reset();
                    }
                    this.isOpen = true;

                    return {
                        type: "pointing",
                        pointerId: event.pointerId,
                        initial: event.position,
                    };
                }
                case "move":
                case "up":
                    return state;
            }
        }

        // we only care about the pointer that started the interaction:
        if ("pointerId" in state && event.pointerId !== state.pointerId)
            return state;

        // if we've moved more than a few px in a pointing state, this is a drag:
        if (
            state.type === "pointing" &&
            event.position.distanceTo(state.initial) > 10
        ) {
            state = {
                type: "dragging",
                pointerId: event.pointerId,
            };
        }

        this.updatePositionFromPointer(event.position);

        switch (state.type) {
            case "clicked":
                switch (event.type) {
                    case "down":
                        // we get another pointer down whilst we're clicked, close and return to idle
                        // TODO: handle this differently when you're touching the picker
                        this.isOpen = false;
                        this.cover.remove();
                        return { type: "idle" };
                    case "move":
                    case "up":
                        return state;
                    default:
                        throw exhaustiveSwitchError(event.type);
                }
            case "pointing":
                switch (event.type) {
                    case "down":
                    case "move":
                        return state;
                    case "up":
                        // if we're pointing and the pointer is released, we're clicked
                        return { type: "clicked" };
                    default:
                        throw exhaustiveSwitchError(event.type);
                }
            case "dragging":
                switch (event.type) {
                    case "down":
                    case "move":
                        return state;
                    case "up":
                        // if we're dragging and the pointer is released, we're idle
                        this.isOpen = false;
                        this.cover.remove();
                        return { type: "idle" };
                    default:
                        throw exhaustiveSwitchError(event.type);
                }
        }
    }

    updatePositionFromPointer(position: Vector2) {
        const target = this.triggerClientCenter;
        const relativeToTarget = position.sub(target);
        const distance = relativeToTarget.magnitude();
        const constrained = distance ** 0.8;

        this.position = this.triggerOffsetCenter.add(
            relativeToTarget.withMagnitude(constrained),
        );
    }

    measure() {
        const clientCenter = AABB.from(
            this.triggerEl.getBoundingClientRect(),
        ).getCenter();

        const offsetCenter = AABB.fromLeftTopWidthHeight(
            this.triggerEl.offsetLeft,
            this.triggerEl.offsetTop,
            this.triggerEl.offsetWidth,
            this.triggerEl.offsetHeight,
        ).getCenter();

        const container = AABB.fromLeftTopWidthHeight(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
        );

        if (!this.triggerOffsetCenter.equals(offsetCenter)) {
            this.triggerOffsetCenter = offsetCenter;
        }
        if (!this.triggerClientCenter.equals(clientCenter)) {
            this.triggerClientCenter = clientCenter;
        }
        if (!this.screenBounds.equals(container)) {
            this.screenBounds = container;
        }
    }

    lastRelevantEvent: BlobThingEvent | null = null;
    dispatch(
        type: "down" | "move" | "up",
        rawEvent: PointerEvent | PointerEvent["nativeEvent"],
    ) {
        if (type === "down") rawEvent.preventDefault();
        const event: BlobThingEvent = {
            type,
            preventDefault: () => rawEvent.preventDefault(),
            pointerId: rawEvent.pointerId,
            position: Vector2.fromEvent(rawEvent),
        };
        this.interactionState = this.update(event, this.interactionState);

        if ("pointerId" in this.interactionState) {
            if (event.pointerId === this.interactionState.pointerId) {
                this.lastRelevantEvent = event;
            }
        } else if (rawEvent.isPrimary) {
            this.lastRelevantEvent = event;
        }
    }
    private cover = new PointerDragCover({
        down: (e) => this.dispatch("down", e),
        move: (e) => this.dispatch("move", e),
        up: (e) => this.dispatch("up", e),
    });
    private onScroll = () => {
        if (this.lastRelevantEvent && this.isOpen) {
            this.interactionState = this.update(
                this.lastRelevantEvent,
                this.interactionState,
            );
        }
    };
}

const BlobRenderer = track(function BlobRenderer({
    blob,
}: {
    blob: BlobThing;
}) {
    const { picker, trigger, isActive } = blob;
    // if (!isActive) return null;
    // const isButtonVisible = !picker.containsCircle(trigger);
    const goopPath = makeGoopPath(
        picker.withRadius(picker.radius - 0.5),
        trigger.withRadius(Math.min(trigger.radius - 0.5, picker.radius - 0.5)),
    );

    const animationProgress = clamp(
        0,
        1,
        invLerp(TRIGGER_SIZE / 2, PICKER_SIZE / 2, picker.radius),
    );
    const filter = [
        `drop-shadow(0 1px 2px rgba(0, 0, 0, ${lerp(
            0,
            0.1,
            animationProgress,
        )}))`,
        `drop-shadow(0 1px 1px rgba(0, 0, 0, ${lerp(
            0,
            0.06,
            animationProgress,
        )}))`,
    ].join(" ");

    const triggerIconOpacityFromProgress = lerp(1, 0, animationProgress);
    const triggerIconOpacityFromPosition = clamp(
        0,
        1,
        invLerp(
            picker.radius - trigger.radius + 8,
            picker.radius + trigger.radius - 8,
            picker.center.distanceTo(trigger.center),
        ),
    );
    const triggerIconOpacity = Math.max(
        triggerIconOpacityFromProgress,
        triggerIconOpacityFromPosition,
    );

    return (
        <>
            <svg
                viewBox={`0 0 ${TRIGGER_SIZE} ${TRIGGER_SIZE}`}
                className="overflow-visible pointer-events-none absolute top-0 left-0"
                style={{ filter }}
            >
                <path
                    d={goopPath}
                    className="fill-white stroke-1 stroke-gray-200"
                    strokeOpacity={1 - animationProgress}
                />
            </svg>
            <div
                className="absolute top-0 left-0 w-8 aspect-square flex items-center justify-center text-gray-500 pointer-events-none"
                style={{ opacity: triggerIconOpacity }}
            >
                <FiPlus />
            </div>
        </>
    );
});

function makeGoopPath(a: Circle, b: Circle) {
    const distance = a.center.distanceTo(b.center);

    // The goop between two circles is formed by two arcs. We want these to be tangent to the
    // circles, so the center of each arc must be equidistant from the two circles.

    // To start finding this center, we first need to know how far away it is from the circles. The
    // bigger this number, the flatter the goop. If this number is two small, the two goop arcs can
    // cross over and sort of invert the goop which looks rubbish.

    // At near distances, we quite a large number for a smooth goop - so the goop is quite flat and
    // the circles look like a single shape:
    const sizeNear = distance + a.radius + b.radius;

    // At further distances, we want a goop that is more rounded, but doesn't cross and look
    // rubbish. Basing this on the square of the distance seems to do a good job here?
    const sizeFar = distance ** 2 / (a.radius + b.radius) / Math.PI;

    // We want rNear when our circles are close, and rFar when they're far away. We can interpolate
    // between the two with sin easing to get a smooth transition:
    const nearToFar =
        (distance - (a.radius + b.radius)) / ((a.radius + b.radius) * 1);
    const size = lerp(sizeNear, sizeFar, inOutSin(clamp(0, 1, nearToFar)));

    // Now we have our size, we can find the two points that are size away from the circles.
    const goopArcCenters = a
        .withRadius(a.radius + size)
        .intersectWithCircle(b.withRadius(b.radius + size));

    // if we don't have two points, it's because one circle contains the other. In this case, we can
    // just draw a single circle:
    if (!goopArcCenters || goopArcCenters.length !== 2) {
        const larger = a.radius > b.radius ? a : b;
        return new SvgPathBuilder().circle(larger).toString();
    }

    const [goop1Center, goop2Center] = goopArcCenters;

    // the start and end points of the goop are where each goop circle touches the original circles.
    // Because we know that goop is `size` away from the original circles, we can find these points
    // by moving towards the original circles by `size`:
    const goop1Start = goop1Center.moveToward(a.center, size);
    const goop1End = goop1Center.moveToward(b.center, size);
    const goop2Start = goop2Center.moveToward(a.center, size);
    const goop2End = goop2Center.moveToward(b.center, size);

    // Now we have the goops, we can trace around the final shape:
    return new SvgPathBuilder()
        .moveTo(goop1Start)
        .counterClockwiseArcTo(goop1Center, goop1End)
        .clockwiseArcTo(b.center, goop2End)
        .counterClockwiseArcTo(goop2Center, goop2Start)
        .clockwiseArcTo(a.center, goop1Start)
        .toString();
}
