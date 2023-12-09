import { Unsubscribe } from "@/lib/EventEmitter";
import { LiveComputation } from "@/lib/live/LiveComputation";
import { noop } from "@/lib/utils";

export type LiveEffectScheduleFn = (callback: () => void) => Unsubscribe;

const requestIdleCallback =
    globalThis.requestIdleCallback ?? globalThis.requestAnimationFrame;
const cancelIdleCallback =
    globalThis.cancelIdleCallback ?? globalThis.cancelAnimationFrame;

export class LiveEffect {
    private readonly computation: LiveComputation<void>;
    private cancelScheduledCallback: Unsubscribe | null = null;
    private unsubscribe: Unsubscribe | null = null;

    static eager: LiveEffectScheduleFn = (cb) => {
        cb();
        return noop;
    };
    static frame: LiveEffectScheduleFn = (cb) => {
        const id = requestAnimationFrame(cb);
        return () => cancelAnimationFrame(id);
    };
    static idle: LiveEffectScheduleFn = (cb) => {
        const id = requestIdleCallback(cb);
        return () => cancelIdleCallback(id);
    };

    constructor(
        run: () => void,
        private readonly schedule: LiveEffectScheduleFn,
        debugName?: string,
    ) {
        this.computation = new LiveComputation(run, debugName, "LiveEffect");
        this.cancelScheduledCallback = schedule(() => {
            this.cancelScheduledCallback = null;
            this.unsubscribe = this.computation.addEagerInvalidateListener(
                this.invalidate,
            );
        });
    }

    private invalidate = () => {
        this.cancelScheduledCallback = this.schedule(this.recompute);
    };

    private recompute = () => {
        this.cancelScheduledCallback = null;
        this.computation.computeIfNeeded();
    };

    cancel() {
        this.cancelScheduledCallback?.();
        this.unsubscribe?.();
    }
}
