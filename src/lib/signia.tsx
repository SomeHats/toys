import RingBuffer from "@/lib/RingBuffer";
import { Ticker } from "@/lib/Ticker";
import { assert, assertExists } from "@/lib/assert";
import { TIME_MULTIPLIER } from "@/lib/time";
import {
    Atom,
    RESET_VALUE,
    Signal,
    atom,
    computed as createComputed,
    transact,
} from "@tldraw/state";

export function memo<This extends object, Value>(
    compute: () => Value,
    context: ClassGetterDecoratorContext<This, Value>,
) {
    const computeds = new WeakMap<This, Signal<Value>>();
    context.addInitializer(function () {
        computeds.set(
            this,
            createComputed(String(context.name), () => {
                return compute.call(this);
            }),
        );
    });
    return function (this: This) {
        return assertExists(computeds.get(this)).value;
    };
}

export function reactive<This, Value>(
    { get }: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
): ClassAccessorDecoratorResult<This, Value> {
    assert(ctx.kind === "accessor");
    return {
        get() {
            return (get.call(this) as Atom<Value>).value;
        },
        set(newValue) {
            (get.call(this) as Atom<Value>).set(newValue);
        },
        init(initialValue) {
            return atom(String(ctx.name), initialValue) as any;
        },
    };
}

export function action<This, Value extends (this: This, ...args: any) => any>(
    value: Value,
    context: ClassMethodDecoratorContext<This, Value>,
) {
    return function (this: This, ...args: Parameters<Value>) {
        return transact(() => {
            return value.apply(this, args);
        });
    };
}

export function delay<T>(
    ms: number | Signal<number>,
    ticker: Ticker,
    signal: Signal<T>,
): Signal<T> {
    const delayMsSignal = numberAsSignal(ms);
    const result = atom("delay", signal.value);
    const buffer = new RingBuffer<{ at: number; value: T }>();

    ticker.listen(() => {
        const delayMs = delayMsSignal.value * TIME_MULTIPLIER;
        buffer.push({ at: performance.now(), value: signal.value });
        while (true) {
            const first = buffer.first();
            if (!first) break;
            if (first.at + delayMs < performance.now()) {
                result.set(first.value);
                buffer.shift();
            } else {
                break;
            }
        }
    });

    return result;
}

export function numberAsSignal(signal: number | Signal<number>): Atom<number> {
    const writeTarget = atom(
        "target",
        typeof signal === "number" ? atom("signal", signal) : null,
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
                writeTarget.set(atom("signal", value));
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
