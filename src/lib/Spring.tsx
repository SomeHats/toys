import { Ticker, useTicker } from "@/lib/Ticker";
import { assert, assertExists } from "@/lib/assert";
import { numberAsSignal, reactive } from "@/lib/signia";
import { TIME_MULTIPLIER } from "@/lib/time";
import { noop } from "@/lib/utils";
import { Atom, Signal, useValue } from "@tldraw/state";
import { useEffect, useState } from "react";

export class Spring {
    private readonly _target: Atom<number>;
    private readonly _tension: Atom<number>;
    private readonly _friction: Atom<number>;
    readonly ticker: Ticker;
    @reactive accessor value: number;
    @reactive accessor velocity = 0;

    constructor(opts: {
        target: number | Signal<number>;
        tension?: number | Signal<number>;
        friction?: number | Signal<number>;
        value?: number;
        ticker: Ticker;
        shouldStart?: boolean;
    }) {
        this._target = numberAsSignal(opts.target);
        this._tension = numberAsSignal(opts.tension ?? 230);
        this._friction = numberAsSignal(opts.friction ?? 22);
        this.value = opts.value ?? this._target.__unsafe__getWithoutCapture();
        this.ticker = opts.ticker;
        const shouldStart = opts.shouldStart ?? true;
        if (shouldStart) this.start();
    }

    reset() {
        this.value = this.target;
        this.velocity = 0;
    }

    start() {
        this.destroy = this.ticker.listen(({ deltaMs }) => {
            this.tick(deltaMs);
        });
    }
    destroy = noop;

    get target() {
        return this._target.value;
    }
    set target(value: number) {
        this._target.set(value);
    }

    get tension() {
        return this._tension.value;
    }
    set tension(value: number) {
        this._tension.set(value);
    }

    get friction() {
        return this._friction.value;
    }
    set friction(value: number) {
        this._friction.set(value);
    }

    private tick(deltaMs: number) {
        const timeStep = Math.min(deltaMs, 100) / (1000 * TIME_MULTIPLIER);
        const {
            target,
            tension,
            friction,
            value: currentValue,
            velocity: currentVelocity,
        } = this;

        let tempValue = currentValue;
        let tempVelocity = currentVelocity;

        const aVelocity = currentVelocity;
        const aAcceleration =
            tension * (target - tempValue) - friction * currentVelocity;

        tempValue = currentValue + aVelocity * timeStep * 0.5;
        tempVelocity = currentVelocity + aAcceleration * timeStep * 0.5;
        const bVelocity = tempVelocity;
        const bAcceleration =
            tension * (target - tempValue) - friction * tempVelocity;

        tempValue = currentValue + bVelocity * timeStep * 0.5;
        tempVelocity = currentVelocity + bAcceleration * timeStep * 0.5;
        const cVelocity = tempVelocity;
        const cAcceleration =
            tension * (target - tempValue) - friction * tempVelocity;

        tempValue = currentValue + cVelocity * timeStep;
        tempVelocity = currentVelocity + cAcceleration * timeStep;
        const dVelocity = tempVelocity;
        const dAcceleration =
            tension * (target - tempValue) - friction * tempVelocity;

        const dxdt =
            (1.0 / 6.0) *
            (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        const dvdt =
            (1.0 / 6.0) *
            (aAcceleration +
                2.0 * (bAcceleration + cAcceleration) +
                dAcceleration);

        if (Math.abs(dxdt) < 0.000001) {
            this.value = this.target;
        } else {
            this.value += dxdt * timeStep;
        }

        if (Math.abs(dvdt) < 0.000001) {
            this.velocity = 0;
        } else {
            this.velocity += dvdt * timeStep;
        }
    }
}

export function useSpring(opts: {
    target: number;
    tension?: number;
    friction?: number;
    value?: number;
}) {
    const ticker = useTicker();
    const [storedSpring, setSpring] = useState<Spring | null>(null);
    let spring = storedSpring;
    if (!storedSpring || storedSpring.ticker !== ticker) {
        if (storedSpring) storedSpring.destroy();
        spring = new Spring({ ...opts, ticker });
        setSpring(spring);
    }

    useEffect(() => {
        assert(spring);
        spring.target = opts.target;
        spring.tension = opts.tension ?? 230;
        spring.friction = opts.friction ?? 22;
    }, [spring, opts.target, opts.tension, opts.friction, opts.value]);

    useEffect(() => {
        console.log("start spring", spring);
        assertExists(spring).start();
        return () => {
            assertExists(spring).destroy();
        };
    }, [spring]);

    return useValue("spring", () => assertExists(spring).value, [spring]);
}
