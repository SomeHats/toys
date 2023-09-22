import { Spring } from "@/lib/Spring";
import { Ticker } from "@/lib/Ticker";
import { assert, assertExists } from "@/lib/assert";
import { inOutSin } from "@/lib/easings";
import { interpolateCubicBezier } from "@/lib/geom/ApproxCubicBezierPathSegment";
import { action, memo } from "@/lib/signia";
import {
    UpdateAction,
    applyUpdate,
    binarySearch,
    constrainWrapped,
    invLerp,
    lerp,
} from "@/lib/utils";
import { Inputs } from "@/lime/Inputs";
import { LIME_FREEHAND } from "@/lime/LimeConfig";
import { LimeState } from "@/lime/LimeState";
import {
    LIME_DOC_ID,
    LimeDoc,
    LimeStore,
    SESSION_ID,
    Session,
    Slide,
    SlideId,
} from "@/lime/LimeStore";
import { Viewport } from "@/lime/Viewport";
import { getStrokePoints } from "@/splatapus/model/perfectFreehand";
import { computed } from "@tldraw/state";

export class Lime {
    constructor(readonly store: LimeStore) {
        this.ensureStoreIsReady();
    }

    readonly state = new LimeState(this);
    readonly viewport = new Viewport();
    readonly inputs = new Inputs(this);
    readonly ticker = new Ticker();

    ensureStoreIsReady() {
        const slides = this.store.query.records("slide").value;

        if (!slides.length) {
            const slide = Slide.create({});
            this.store.put([slide]);
            slides.push(slide);
        }

        if (!this.store.get(LIME_DOC_ID)) {
            this.store.put([
                LimeDoc.create({
                    id: LIME_DOC_ID,
                    slideIds: slides.map((slide) => slide.id),
                }),
            ]);
        }

        if (!this.store.get(SESSION_ID)) {
            this.store.put([
                Session.create({
                    id: SESSION_ID,
                    slideId: slides[0].id,
                }),
            ]);
        }
    }

    //#region ============ DOCUMENT ============
    @memo get document() {
        return assertExists(this.store.get(LIME_DOC_ID));
    }

    updateDocument(update: UpdateAction<LimeDoc>) {
        this.store.update(LIME_DOC_ID, (prev) => applyUpdate(prev, update));
    }
    //#endregion

    //#region ============ SESSION ============
    @memo get session() {
        return assertExists(this.store.get(SESSION_ID));
    }

    updateSession(update: UpdateAction<Session>) {
        this.store.update(SESSION_ID, (prev) => applyUpdate(prev, update));
    }
    //#endregion

    //#region ============ SLIDES ============
    getSlide(slideId: SlideId) {
        return assertExists(this.store.get(slideId));
    }
    getSlideIndex(slideId: SlideId) {
        const slideIndex = this.document.slideIds.indexOf(slideId);
        assert(slideIndex !== -1);
        return slideIndex;
    }
    getSlideByIndex(index: number) {
        const { slideIds } = this.document;
        return this.getSlide(slideIds[constrainWrapped(0, slideIds.length, index)]);
    }

    updateSlide(slideId: SlideId, update: UpdateAction<Slide>) {
        this.store.update(slideId, (prev) => applyUpdate(prev, update));
    }

    @memo private get _slideStrokePointsCache() {
        return this.store.createComputedCache("slideStrokePoints", (slide: Slide) => {
            return getStrokePoints(slide.rawPoints, LIME_FREEHAND);
        });
    }
    getSlideStrokePoints(slideId: SlideId) {
        return assertExists(this._slideStrokePointsCache.get(slideId));
    }
    //#endregion

    //#region ============ ANIMATION ============
    @memo private get playheadSpring() {
        return new Spring({
            target: computed("playheadTarget", () => this.getSlideIndex(this.session.slideId)),
            ticker: this.ticker,
            tension: 100,
            friction: 25,
        });
    }
    get playhead() {
        return this.playheadSpring.value;
    }
    @memo private get animationStepCache() {
        return this.store.createComputedCache("animationSteps", (currentSlide: Slide) => {
            const { tweenBezierControl, speed } = this.session;

            const nextSlide = this.getSlideByIndex(this.getSlideIndex(currentSlide.id) + 1);

            const currentRawPoints = currentSlide.rawPoints;
            const nextRawPoints = nextSlide.rawPoints;
            const currentStrokePoints = this.getSlideStrokePoints(currentSlide.id);
            const nextStrokePoints = this.getSlideStrokePoints(nextSlide.id);

            if (!currentRawPoints.length || !nextStrokePoints.length) return null;

            const origin = currentStrokePoints[currentStrokePoints.length - 1];
            const destination = nextStrokePoints[0];

            const distBetween = origin.point.distanceTo(destination.point);
            const bStart = origin.point;
            const bControl1 = origin.point.sub(
                origin.vector.scale(distBetween * tweenBezierControl),
            );
            const bControl2 = destination.point.add(
                destination.vector.scale(distBetween * tweenBezierControl),
            );
            const bEnd = destination.point;

            const middlePoints = [];
            for (let d = 0; d < distBetween; d += speed / 60) {
                const t = invLerp(0, distBetween, d);
                const p = interpolateCubicBezier(bStart, bControl1, bControl2, bEnd, t);
                middlePoints.push(p);
            }

            const runningLengths = [0];
            const allPoints = [];

            let runningLength = 0;
            let prevPoint = null;
            for (const point of currentRawPoints) {
                if (prevPoint) {
                    const distance = point.distanceTo(prevPoint);
                    runningLength += distance;
                    runningLengths.push(runningLength);
                }
                prevPoint = point;
                allPoints.push(point);
            }
            const lengthOfCurrentSection = runningLength;

            for (const point of middlePoints) {
                if (prevPoint) {
                    const distance = point.distanceTo(prevPoint);
                    runningLength += distance;
                    runningLengths.push(runningLength);
                }
                prevPoint = point;
                allPoints.push(point);
            }
            const lengthOfMiddleSection = runningLength - lengthOfCurrentSection;

            for (const point of nextRawPoints) {
                if (prevPoint) {
                    const distance = point.distanceTo(prevPoint);
                    runningLength += distance;
                    runningLengths.push(runningLength);
                }
                prevPoint = point;
                allPoints.push(point);
            }

            return {
                allPoints,
                runningLengths,
                initialWindowStart: 0,
                initialWindowEnd: lengthOfCurrentSection,
                finalWindowStart: lengthOfCurrentSection + lengthOfMiddleSection,
                finalWindowEnd: runningLength,
            };
        });
    }
    getPlayheadPoints() {
        const { playhead } = this;
        const slide = this.getSlideByIndex(Math.floor(playhead));

        const animationStep = this.animationStepCache.get(slide.id);
        if (!animationStep) return slide.rawPoints;

        const progress = inOutSin(playhead - Math.floor(playhead));

        const windowStart = lerp(
            animationStep.initialWindowStart,
            animationStep.finalWindowStart,
            progress,
        );
        const windowEnd = lerp(
            animationStep.initialWindowEnd,
            animationStep.finalWindowEnd,
            progress,
        );

        const windowStartIndex = binarySearch(animationStep.runningLengths, windowStart);
        const windowEndIndex = binarySearch(
            animationStep.runningLengths,
            windowEnd,
            windowStartIndex,
        );

        const afterWindowStartIndex = Math.min(
            windowStartIndex + 1,
            animationStep.allPoints.length,
        );
        const afterWindowEndIndex = Math.min(windowEndIndex + 1, animationStep.allPoints.length);
        const beforeWindowEndIndex = Math.max(windowEndIndex - 1, 0);

        const firstPoint = animationStep.allPoints[windowStartIndex].lerp(
            animationStep.allPoints[afterWindowStartIndex],
            invLerp(
                animationStep.runningLengths[windowStartIndex],
                animationStep.runningLengths[afterWindowStartIndex],
                windowStart,
            ),
        );

        const lastPoint = animationStep.allPoints[windowEndIndex].lerp(
            animationStep.allPoints[afterWindowEndIndex],
            invLerp(
                animationStep.runningLengths[windowEndIndex],
                animationStep.runningLengths[afterWindowEndIndex],
                windowEnd,
            ),
        );

        return [
            firstPoint,
            ...animationStep.allPoints.slice(afterWindowStartIndex, beforeWindowEndIndex),
            lastPoint,
        ];

        // return animationStep.allPoints.slice(
        //     Math.floor(
        //         lerp(animationStep.initialWindowStart, animationStep.finalWindowStart, progress),
        //     ),
        //     Math.floor(
        //         lerp(animationStep.initialWindowEnd, animationStep.finalWindowEnd, progress),
        //     ),
        // );
    }
    //#endregion

    //#region ============ ACTIONS ============
    @action clearDocument() {
        this.store.clear();
        this.ensureStoreIsReady();
    }

    @action newSlide() {
        const slide = Slide.create({});
        this.store.insert(slide);
        this.updateDocument((doc) => ({ ...doc, slideIds: [...doc.slideIds, slide.id] }));
        this.updateSession((session) => ({ ...session, slideId: slide.id }));
    }

    @action changeSlide(slideId: SlideId) {
        const slide = this.getSlide(slideId);
        this.updateSession((session) => ({ ...session, slideId: slide.id }));
    }
    //#endregion

    //#region ============ EVENTS ============
    @action onPointerDown(event: PointerEvent) {
        this.inputs.updateFromEvent(event);
        this.state.onPointerDown(event);
    }
    @action onPointerMove(event: PointerEvent) {
        this.inputs.updateFromEvent(event);
        this.state.onPointerMove(event);
    }
    @action onPointerUp(event: PointerEvent) {
        this.inputs.updateFromEvent(event);
        this.state.onPointerUp(event);
    }
    //#endregion
}
