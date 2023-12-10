import { Ticker } from "@/lib/Ticker";
import { reactive } from "@/lib/signia";
import { noop } from "@/lib/utils";
import { Atom, RESET_VALUE, Signal, atom as createAtom } from "@tldraw/state";

function asSignal(signal: number | Signal<number>): Atom<number> {
    const writeTarget = createAtom(
        "target",
        typeof signal === "number" ? createAtom("signal", signal) : null,
    );
    const self: Atom<number> = {
        name: "signal",
        get value() {
            return writeTarget.value ?
                    writeTarget.value.value
                :   (signal as Signal<number>).value;
        },
        get lastChangedEpoch() {
            return writeTarget.value ?
                    writeTarget.value.lastChangedEpoch
                :   (signal as Signal<number>).lastChangedEpoch;
        },
        getDiffSince() {
            return RESET_VALUE;
        },
        __unsafe__getWithoutCapture() {
            const t = writeTarget.__unsafe__getWithoutCapture();
            return t ?
                    t.__unsafe__getWithoutCapture()
                :   (signal as Signal<number>).__unsafe__getWithoutCapture();
        },
        set(value) {
            const t = writeTarget.value;
            if (!t) {
                writeTarget.set(createAtom("signal", value));
            } else {
                t.set(value);
            }
            return value;
        },
        update(updater) {
            return self.set(updater(self.value));
        },
    };
    return self;
}

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
        this._target = asSignal(opts.target);
        this._tension = asSignal(opts.tension ?? 230);
        this._friction = asSignal(opts.friction ?? 22);
        this.value = opts.value ?? this._target.__unsafe__getWithoutCapture();
        this.ticker = opts.ticker;
        const shouldStart = opts.shouldStart ?? true;
        if (shouldStart) this.start();
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
        const timeStep = Math.min(deltaMs, 100) / 1000;
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
