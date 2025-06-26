import { Emoji } from "@/emoji/Emoji";
import { Post } from "@/emoji/Post";
import PointerDragCover from "@/lib/PointerDragCover";
import { Spring } from "@/lib/Spring";
import { Ticker } from "@/lib/Ticker";
import { assertExists } from "@/lib/assert";
import { inOutSin, inSin, outSin } from "@/lib/easings";
import AABB from "@/lib/geom/AABB";
import Circle from "@/lib/geom/Circle";
import { Vector2 } from "@/lib/geom/Vector2";
import { delay, memo, reactive } from "@/lib/signia";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import {
    angleDistance,
    clamp,
    clamp01,
    exhaustiveSwitchError,
    invLerp,
    lazy,
    lerp,
    minBy,
} from "@/lib/utils";
import { computed } from "@tldraw/state";
import { track } from "@tldraw/state-react";
import classNames from "classnames";
import { PointerEvent, useLayoutEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const TRIGGER_SIZE = 32;
const PICKER_SIZE = 160;

const CHARACTERS = [
    { character: "yeti", emotion: 0 },
    { character: "yeti", emotion: 1 },
    { character: "yeti", emotion: 2 },
    { character: "yeti", emotion: 3 },
    { character: "yeti", emotion: 4 },
    { character: "yeti", emotion: 5 },
    { character: "yeti", emotion: 6 },
    { character: "yeti", emotion: 7 },
] as const satisfies Emoji[];

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
        <div className="relative touch-none">
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
    @reactive accessor pickedCharacter: BlobCharacter | null = null;

    readonly ticker = new Ticker();
    readonly characters: readonly BlobCharacter[] = CHARACTERS.map(
        (emoji, i) => new BlobCharacter(this, emoji, i),
    );

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

    get isActive() {
        return this.isOpen || Math.abs(this.#pickerRadius.velocity) > 0;
    }

    get animationProgress() {
        return invLerp(
            TRIGGER_SIZE / 2,
            PICKER_SIZE / 2,
            this.#pickerRadius.value,
        );
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
                        return exhaustiveSwitchError(event.type);
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
                        return exhaustiveSwitchError(event.type);
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
                        return exhaustiveSwitchError(event.type);
                }
        }
    }

    updatePositionFromPointer(position: Vector2) {
        const target = this.triggerClientCenter;
        const relativeToTarget = position.sub(target);
        const distance = relativeToTarget.magnitude();

        const easeDist = 200;
        const easedRelative = Math.max(distance - 20, 0) / easeDist;
        const eased =
            easedRelative < 1 ?
                inSin(easedRelative)
            :   (easedRelative - 1) * (Math.PI / 2) + 1;
        const easedDistance = easeDist * eased;

        this.position = this.triggerOffsetCenter.add(
            relativeToTarget.withMagnitude(easedDistance ** 0.8),
        );

        if (distance > 20) {
            const angle = relativeToTarget.angle();
            const character = assertExists(
                minBy(this.characters, (c) => angleDistance(angle, c.angle)),
            );
            this.pickedCharacter = character;
        } else {
            this.pickedCharacter = null;
        }
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
class BlobCharacter {
    static readonly MAX_RADIUS = (PICKER_SIZE / 2) * 0.65;
    constructor(
        readonly parent: BlobThing,
        readonly emoji: Emoji,
        readonly i: number,
    ) {}

    #animationProgress = lazy(() =>
        delay(
            computed("delay", () =>
                this.parent.isOpen ? Math.ceil(this.i / 2) * 40 : 0,
            ),
            this.parent.ticker,
            computed("ap", () => this.parent.animationProgress),
        ),
    );
    #targetSize = lazy(
        () =>
            new Spring({
                target: computed("ts", () => (this.isPicked ? 38 : 30)),
                ticker: this.parent.ticker,
                tension: 300,
                friction: 22,
            }),
    );
    #targetRadius = lazy(
        () =>
            new Spring({
                target: computed("ts", () =>
                    this.isPicked ?
                        (PICKER_SIZE / 2) * 0.75
                    :   (PICKER_SIZE / 2) * 0.65,
                ),
                ticker: this.parent.ticker,
                tension: 300,
                friction: 22,
            }),
    );
    get animationProgress() {
        return this.#animationProgress().get();
    }

    get isPicked() {
        return this.parent.pickedCharacter === this;
    }

    @memo get angle() {
        const start = -Math.PI / 2;
        const offsetIdx = Math.ceil(this.i / 2);
        const offsetDirection = this.i % 2 === 0 ? 1 : -1;
        const maxOffset = Math.floor(this.parent.characters.length / 2);

        return start + ((offsetIdx * offsetDirection) / maxOffset) * Math.PI;
    }

    get radius() {
        return lerp(
            -TRIGGER_SIZE,
            this.#targetRadius().value,
            this.animationProgress,
        );
    }

    @memo get position() {
        const size = this.size;

        return this.parent.picker.center
            .add(Vector2.fromPolar(this.angle, this.radius))
            .sub(size * 0.5 - 3, size * 0.5 + 5);
    }

    get size() {
        const targetSize = this.#targetSize().value;
        return lerp(16, targetSize, this.animationProgress);
    }

    get opacity() {
        return clamp01(
            invLerp(TRIGGER_SIZE, BlobCharacter.MAX_RADIUS, this.radius),
        );
    }
}

const BlobRenderer = track(function BlobRenderer({
    blob,
}: {
    blob: BlobThing;
}) {
    const { picker, trigger, isActive, animationProgress } = blob;
    if (!isActive) return null;

    const filter = [
        `drop-shadow(0 1px 2px rgba(0, 0, 0, ${lerp(
            0,
            0.1,
            clamp01(animationProgress),
        )}))`,
        `drop-shadow(0 1px 1px rgba(0, 0, 0, ${lerp(
            0,
            0.06,
            clamp01(animationProgress),
        )}))`,
    ].join(" ");

    const triggerIconOpacityFromProgress = lerp(
        1,
        0,
        clamp01(animationProgress),
    );
    const triggerIconOpacityFromInnerPosition = clamp01(
        invLerp(
            trigger.radius + 16,
            trigger.radius,
            picker.center.distanceTo(trigger.center),
        ),
    );
    const triggerIconOpacityFromOuterPosition = clamp01(
        invLerp(
            picker.radius - trigger.radius + 8,
            picker.radius + trigger.radius - 8,
            picker.center.distanceTo(trigger.center),
        ),
    );
    const triggerIconOpacity = Math.max(
        triggerIconOpacityFromProgress,
        triggerIconOpacityFromInnerPosition,
        triggerIconOpacityFromOuterPosition,
    );

    // move the icon a little bit towards the the picker for some 3d goodness, but only when the
    // picker is small
    const iconOffsetProgress =
        picker.center.distanceTo(trigger.center) / (PICKER_SIZE / 2);
    const iconOffsetAmount = outSin(clamp01(iconOffsetProgress)) * 3;
    const iconOffset = Vector2.fromPolar(
        trigger.center.angleTo(picker.center),
        lerp(iconOffsetAmount * 1.5, iconOffsetAmount, animationProgress),
    );

    const goopPath = makeGoopPath(
        picker.withRadius(picker.radius - 0.5),
        new Circle(
            trigger.center.add(iconOffset.scale(0.5)),
            Math.min(trigger.radius - 0.5, picker.radius - 0.5),
        ),
    );

    return (
        <>
            <svg
                viewBox={`0 0 ${TRIGGER_SIZE} ${TRIGGER_SIZE}`}
                className="overflow-visible pointer-events-none absolute top-0 left-0 touch-none"
                style={{ filter }}
            >
                <path
                    d={goopPath}
                    className="fill-white stroke-1 stroke-gray-200"
                    strokeOpacity={clamp01(1 - animationProgress)}
                />
            </svg>
            <div
                className="absolute top-0 left-0 w-8 aspect-square flex items-center justify-center text-gray-500 pointer-events-none touch-none"
                style={{
                    opacity: triggerIconOpacity,
                    transform: `translate(${iconOffset.x}px, ${
                        iconOffset.y
                    }px) rotate(${animationProgress * 135}deg) scale(${lerp(
                        1,
                        1.2,
                        animationProgress,
                    )})`,
                }}
            >
                <FiPlus />
            </div>
            {blob.characters.map((character, i) => (
                <BlobCharacterRenderer key={i} character={character} />
            ))}
        </>
    );
});

const BlobCharacterRenderer = track(function BlobCharacterRenderer({
    character,
}: {
    character: BlobCharacter;
}) {
    const PX_SIZE = 48;
    const position = character.position;
    return (
        <Emoji
            sizePx={PX_SIZE}
            emoji={character.emoji}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
                transformOrigin: "top left",
                transform: `translate(${position.x}px, ${position.y}px) scale(${
                    character.size / PX_SIZE
                })`,
                opacity: character.opacity,
            }}
        />
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
    const size = lerp(sizeNear, sizeFar, inOutSin(clamp01(nearToFar)));

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
