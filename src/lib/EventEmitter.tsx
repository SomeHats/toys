import { promiseWithResolve } from "@/lib/utils";
import { unstable_batchedUpdates } from "react-dom";

export type Unsubscribe = () => void;

type Listener<Args extends unknown[]> = (...args: Args) => void;

export default class EventEmitter<Args extends unknown[] = []>
    implements AsyncIterable<Args[0]>
{
    private handlers = new Set<Listener<Args>>();

    listen(listener: Listener<Args>) {
        const handler: Listener<Args> = (...args) => listener(...args);
        this.handlers.add(handler);
        return () => {
            this.handlers.delete(handler);
        };
    }

    emit(...args: Args) {
        unstable_batchedUpdates(() => {
            for (const handler of this.handlers) {
                handler(...args);
            }
        });
    }

    listenerCount(): number {
        return this.handlers.size;
    }

    hasListeners(): boolean {
        return this.handlers.size > 0;
    }

    async *[Symbol.asyncIterator]() {
        while (true) {
            const promise = promiseWithResolve<Args[0]>();
            const unsubscribe = this.listen((...args) => {
                promise.resolve(args[0]);
                unsubscribe();
            });
            yield await promise;
        }
    }
}
