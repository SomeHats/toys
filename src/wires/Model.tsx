import { assertExists } from "@/lib/assert";
import { Schema } from "@/lib/schema";
import { ReadonlyRecord, entries, keys } from "@/lib/utils";
import {
    Atom,
    Signal,
    atom as createAtom,
    computed as createComputed,
    transact,
} from "@tldraw/state";

export function memo<This extends object, Value>(
    compute: () => Value,
    context: ClassGetterDecoratorContext<This, Value>,
) {
    const computeds = new WeakMap<This, Signal<Value>>();
    context.addInitializer(function () {
        console.log("createComputed", { this: this, compute, context });
        computeds.set(
            this,
            createComputed(String(context.name), () => {
                return compute.call(this);
            }),
        );
    });
    return function (this: This) {
        return assertExists(computeds.get(this)).get();
    };
}

export function command<This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >,
) {
    return function (this: This, ...args: Args) {
        return transact(() => method.call(this, ...args));
    };
}

export function Model<Shape extends ReadonlyRecord<string, unknown>>(schema: {
    [K in keyof Shape]-?: Schema<Shape[K]>;
}) {
    class Model {
        static modelSchema: Schema<Shape>;

        readonly atoms: {
            readonly [K in keyof Shape]: Atom<Shape[K]>;
        };

        constructor(values: Shape) {
            const data = {} as { [K in keyof Shape]: Atom<Shape[K]> };
            for (const [key, value] of entries(values)) {
                // @ts-expect-error - we know that key is a key of Shape
                data[key] = createAtom(key, value);
            }
            this.atoms = data;
        }

        @memo get serialized(): Shape {
            const data = {} as Shape;
            for (const key of keys(schema)) {
                const value = this.atoms[key].get();
                if ((value as any).serialized) {
                    // @ts-expect-error - we know that key is a key of Shape
                    data[key] = (value as any).serialized();
                    continue;
                }
                // @ts-expect-error - we know that key is a key of Shape
                data[key] = value;
            }
            return data;
        }
    }

    for (const key of keys(schema)) {
        Object.defineProperty(Model.prototype, key, {
            get() {
                return this.atoms[key].value;
            },
            set(value: Shape[typeof key]) {
                this.atoms[key].set(value);
            },
        });
    }

    Model.modelSchema = Schema.object(schema);

    return Model as unknown as {
        modelSchema: Schema<Shape>;
        new (values: Shape): {
            readonly atoms: {
                readonly [K in keyof Shape]: Atom<Shape[K]>;
            };
            readonly serialized: Shape;
        } & {
            -readonly [K in keyof Shape]: Shape[K];
        };
    };
}
