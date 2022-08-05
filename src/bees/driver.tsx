import { Ticker } from "pixi.js";

interface OnDestroyed {
    on(event: "destroyed", callback: () => void): void;
}

interface FixedUpdater extends OnDestroyed {
    fixedUpdateTick(): void;
}

interface Updater extends OnDestroyed {
    updateTick(elapsedTimeMs: number, deltaTimeMs: number): void;
}

export class Driver {
    public readonly ticker = new Ticker();
    private readonly fixedUpdaters = new Set<FixedUpdater>();
    private readonly updaters = new Set<Updater>();
    private elapsedTimeMs = 0;

    constructor() {
        this.ticker.add(() => this.tick(this.ticker.deltaMS));
        this.ticker.start();
    }

    private tick(dtMs: number) {
        this.elapsedTimeMs += dtMs;
        for (const fixedUpdater of this.fixedUpdaters) {
            fixedUpdater.fixedUpdateTick();
        }
        for (const updater of this.updaters) {
            updater.updateTick(this.elapsedTimeMs, dtMs);
        }
    }

    addFixedUpdate(updater: FixedUpdater) {
        this.fixedUpdaters.add(updater);
        updater.on("destroyed", () => this.fixedUpdaters.delete(updater));
    }

    addUpdate(updater: Updater) {
        this.updaters.add(updater);
        updater.on("destroyed", () => this.updaters.delete(updater));
    }
}

export const driver = new Driver();
