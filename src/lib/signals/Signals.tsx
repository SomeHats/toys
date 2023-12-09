import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import RingBuffer from "@/lib/RingBuffer";
import { assert } from "@/lib/assert";
import {
    getLocalStorageItemUnchecked,
    setLocalStorageItemUnchecked,
} from "@/lib/storage";
import {
    ReadonlyRecord,
    clamp,
    debounce,
    has,
    lerp,
    mapRange,
} from "@/lib/utils";

export abstract class Signal {
    private currentValue: number | null = null;

    constructor(public readonly manager: SignalManager) {}

    protected abstract update(): number;

    debug(name: string | null): this {
        if (name !== null) {
            this.manager.debug(name, this);
        }
        return this;
    }

    clear() {
        this.currentValue = null;
    }

    read(): number {
        if (this.currentValue === null) {
            this.currentValue = this.update();
        }
        return this.currentValue;
    }
}

export class ControlledSignal extends Signal {
    constructor(
        manager: SignalManager,
        private value: number,
    ) {
        super(manager);
    }

    protected update() {
        return this.value;
    }

    set(newValue: number) {
        this.value = newValue;
    }
}

function _clamp(
    value: number,
    range: [number, number] | null | undefined,
): number {
    if (range) {
        return clamp(range[0], range[1], value);
    }
    return value;
}
export class ControllableSignal extends ControlledSignal {
    public readonly range: [number, number] | null;
    constructor(
        manager: SignalManager,
        private readonly key: string,
        initialValue: number,
        range?: [number, number],
    ) {
        super(
            manager,
            _clamp(
                getLocalStorageItemUnchecked(
                    `signalSetting.${key}`,
                    initialValue,
                ) as number,
                range,
            ),
        );

        this.range = range || null;
    }

    override set(newValue: number) {
        newValue = _clamp(newValue, this.range);
        super.set(newValue);
        this.saveDebounced(newValue);
    }

    private saveDebounced = debounce(200, (newValue: number) =>
        setLocalStorageItemUnchecked(`signalSetting.${this.key}`, newValue),
    );
}

export class ComputedSignal extends Signal {
    constructor(
        manager: SignalManager,
        private compute: () => number,
    ) {
        super(manager);
    }

    protected update() {
        return this.compute();
    }
}

export class SignalManager {
    public debugSignalsByName: ReadonlyRecord<string, ReadonlyArray<Signal>> =
        {};
    private readonly debugSignalsChangeEvent = new EventEmitter();
    private readonly updateEvent = new EventEmitter();
    private readonly signals = new Set<Signal>();

    private readonly driver: ControlledSignal;

    constructor() {
        this.driver = this.controlled(0).debug("internal.driver");
    }

    onDebugSignalsChange(cb: () => void): Unsubscribe {
        return this.debugSignalsChangeEvent.listen(cb);
    }

    onUpdate(cb: () => void): Unsubscribe {
        return this.updateEvent.listen(cb);
    }

    update(dt: number) {
        this.driver.set(Math.min(dt, 0.03));
        for (const signal of this.signals) {
            signal.clear();
        }
        for (const signal of this.signals) {
            signal.read();
        }

        this.updateEvent.emit();
        // this.reboundLooper.step(dt);
    }

    controlled(initialValue: number): ControlledSignal {
        return this.addSignal(new ControlledSignal(this, initialValue));
    }

    computed(compute: () => number): ComputedSignal {
        return this.addSignal(new ComputedSignal(this, compute));
    }

    input(name: string, value: number, range?: [number, number]): Signal {
        return this.addSignal(
            new ControllableSignal(this, name, value, range),
        ).debug(name);
    }

    sin({
        min = 0,
        max = 1,
        frequency = 1,
        driver = this.driver,
        offset = 0,
    }: {
        min?: Signal | number;
        max?: Signal | number;
        frequency?: Signal | number;
        driver?: Signal;
        offset?: Signal | number;
    } = {}): Signal {
        const minSignal = this.toSignal(min);
        const maxSignal = this.toSignal(max);
        const frequencySignal = this.toSignal(frequency);
        const offsetSignal = this.toSignal(offset);

        let accumulator = 0;
        return this.computed(() => {
            const frequency = frequencySignal.read();
            accumulator += driver.read() * frequency;
            return mapRange(
                -1,
                1,
                minSignal.read(),
                maxSignal.read(),
                Math.cos((offsetSignal.read() + accumulator) * Math.PI * 2),
            );
        });
    }

    spring(opts: {
        target: Signal;
        tension?: Signal | number;
        friction?: Signal | number;
        driver?: Signal;
    }) {
        const targetSignal = opts.target;
        const driverSignal = opts.driver ?? this.driver;
        const tensionSignal = this.toSignal(opts.tension ?? 230);
        const frictionSignal = this.toSignal(opts.friction ?? 22);

        let currentPosition = targetSignal.read();
        let currentVelocity = 0;

        return this.computed(() => {
            const targetPosition = targetSignal.read();
            const timeStep = driverSignal.read();
            const tension = tensionSignal.read();
            const friction = frictionSignal.read();

            let tempPosition = currentPosition;
            let tempVelocity = currentVelocity;

            const aVelocity = currentVelocity;
            const aAcceleration =
                tension * (targetPosition - tempPosition) -
                friction * currentVelocity;

            tempPosition = currentPosition + aVelocity * timeStep * 0.5;
            tempVelocity = currentVelocity + aAcceleration * timeStep * 0.5;
            const bVelocity = tempVelocity;
            const bAcceleration =
                tension * (targetPosition - tempPosition) -
                friction * tempVelocity;

            tempPosition = currentPosition + bVelocity * timeStep * 0.5;
            tempVelocity = currentVelocity + bAcceleration * timeStep * 0.5;
            const cVelocity = tempVelocity;
            const cAcceleration =
                tension * (targetPosition - tempPosition) -
                friction * tempVelocity;

            tempPosition = currentPosition + cVelocity * timeStep;
            tempVelocity = currentVelocity + cAcceleration * timeStep;
            const dVelocity = tempVelocity;
            const dAcceleration =
                tension * (targetPosition - tempPosition) -
                friction * tempVelocity;

            const dxdt =
                (1.0 / 6.0) *
                (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
            const dvdt =
                (1.0 / 6.0) *
                (aAcceleration +
                    2.0 * (bAcceleration + cAcceleration) +
                    dAcceleration);

            currentPosition += dxdt * timeStep;
            currentVelocity += dvdt * timeStep;

            return currentPosition;
        });
    }

    add(a: Signal | number, b: Signal | number): Signal {
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        return this.computed(() => aSignal.read() + bSignal.read());
    }

    subtract(a: Signal | number, b: Signal | number): Signal {
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        return this.computed(() => aSignal.read() - bSignal.read());
    }

    multiply(a: Signal | number, b: Signal | number): Signal {
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        return this.computed(() => aSignal.read() * bSignal.read());
    }

    divide(a: Signal | number, b: Signal | number): Signal {
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        return this.computed(() => aSignal.read() / bSignal.read());
    }

    switch(
        control: Signal | number,
        a: Signal | number,
        b: Signal | number,
    ): Signal {
        const controlSignal = this.toSignal(control);
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        return this.computed(() => {
            if (controlSignal.read()) {
                return aSignal.read();
            } else {
                return bSignal.read();
            }
        });
    }

    adsr({
        target,
        attack = 0,
        delay = 0,
        sustain = 1,
        release = 0,
        driver = this.driver,
    }: {
        target: Signal;
        attack?: Signal | number;
        delay?: Signal | number;
        sustain?: Signal | number;
        release?: Signal | number;
        driver?: Signal;
    }): Signal {
        const attackSignal = this.toSignal(attack);
        const delaySignal = this.toSignal(delay);
        const sustainSignal = this.toSignal(sustain);
        const releaseSignal = this.toSignal(release);

        const enum AdsrState {
            Off,
            Attacking,
            Holding,
            Releasing,
        }

        let state = AdsrState.Off;
        let currentValue = 0;
        let releaseStartValue = 0;
        return this.computed(() => {
            const targetValue = target.read();
            const isOn = targetValue !== 0;

            if (isOn) {
                if (state === AdsrState.Off || state === AdsrState.Releasing) {
                    if (attackSignal.read() === 0) {
                        state = AdsrState.Holding;
                    } else {
                        state = AdsrState.Attacking;
                    }
                }

                if (state === AdsrState.Attacking) {
                    currentValue +=
                        (targetValue / attackSignal.read()) * driver.read();
                    if (currentValue >= targetValue) {
                        state = AdsrState.Holding;
                    }
                }

                if (state === AdsrState.Holding) {
                    const sustainTarget = targetValue * sustainSignal.read();
                    if (delaySignal.read() === 0) {
                        currentValue = sustainTarget;
                    } else {
                        currentValue = clamp(
                            sustainTarget,
                            targetValue,
                            currentValue +
                                ((sustainTarget - targetValue) /
                                    delaySignal.read()) *
                                    driver.read(),
                        );
                    }
                }
            } else {
                if (
                    state === AdsrState.Attacking ||
                    state === AdsrState.Holding
                ) {
                    if (currentValue === 0) {
                        state = AdsrState.Off;
                    } else {
                        releaseStartValue = currentValue;
                        state = AdsrState.Releasing;
                    }
                }

                if (state === AdsrState.Releasing) {
                    currentValue -=
                        (releaseStartValue / releaseSignal.read()) *
                        driver.read();
                    if (currentValue <= 0) {
                        currentValue = 0;
                        state = AdsrState.Off;
                    }
                }

                if (state === AdsrState.Off) {
                    currentValue = 0;
                }
            }

            return currentValue;
        });
    }

    easeExponential({
        target,
        rate = 0.1,
    }: {
        target: Signal;
        rate?: Signal | number;
    }): Signal {
        const rateSignal = this.toSignal(rate);
        let currentValue = target.read();
        return this.computed(() => {
            const difference = target.read() - currentValue;
            currentValue += difference * rateSignal.read();
            return currentValue;
        });
    }

    lerp(a: Signal | number, b: Signal | number, n: Signal | number): Signal {
        const aSignal = this.toSignal(a);
        const bSignal = this.toSignal(b);
        const nSignal = this.toSignal(n);
        return this.computed(() =>
            lerp(aSignal.read(), bSignal.read(), nSignal.read()),
        );
    }

    delay({
        target,
        amount = 0,
        driver = this.driver,
    }: {
        target: Signal;
        amount?: Signal | number;
        driver?: Signal;
    }) {
        const amountSignal = this.toSignal(amount);
        console.log(amountSignal.read());
        const buffer = new RingBuffer<{ time: number; value: number }>(
            (amountSignal.read() * 1.2) / (1 / 60),
        );
        let time = 0;
        let lastValue = target.read();

        return this.computed(() => {
            time += driver.read();
            const delayAmount = amountSignal.read();
            buffer.push({ time: time, value: target.read() });

            let next = null;
            while ((next = buffer.first())) {
                if (next.time + delayAmount <= time) {
                    lastValue = next.value;
                    buffer.shift();
                } else {
                    break;
                }
            }

            return lastValue;
        });
    }

    debug(name: string, signal: Signal) {
        assert(
            this.signals.has(signal),
            `signal called ${name} does not belong to this signal manager`,
        );
        const newArray =
            has(this.debugSignalsByName, name) ?
                [...this.debugSignalsByName[name], signal]
            :   [signal];
        this.debugSignalsByName = {
            ...this.debugSignalsByName,
            [name]: newArray,
        };
        this.debugSignalsChangeEvent.emit();
    }

    private addSignal<T extends Signal>(signal: T) {
        this.signals.add(signal);
        return signal;
    }

    private toSignal(source: Signal | number): Signal {
        if (typeof source === "number") {
            return this.controlled(source);
        }
        return source;
    }
}
