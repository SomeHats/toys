import { assert, assertExists } from "@/lib/assert";
import {
    Atom,
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
        return assertExists(computeds.get(this as This)).value;
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
