import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { reactive } from "@/lib/signia";
import { frameLoop } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { generateUUID } from "three/src/math/MathUtils";

export class Ticker {
    id = generateUUID();
    private event = new EventEmitter<[ticker: Ticker]>();

    @reactive accessor elapsedMs = 0;
    @reactive accessor deltaMs = 1000 / 60;

    private _stop: Unsubscribe | null = null;
    start() {
        if (this._stop) return this;
        let lastT: number | null = null;
        this._stop = frameLoop((t) => {
            if (lastT !== null) {
                const delta = t - lastT;
                this.elapsedMs += delta;
                this.deltaMs = delta;
                this.event.emit(this);
            }
            lastT = t;
        });

        return this;
    }

    stop() {
        this._stop?.();
        this._stop = null;
        return this;
    }

    listen(cb: (ticker: Ticker) => void) {
        return this.event.listen(cb);
    }
}

const TickerContext = createContext<Ticker | null>(null);
export function TickerProvider({ children }: { children: React.ReactNode }) {
    const [ticker] = useState(() => new Ticker());

    useEffect(() => {
        ticker.start();
        return () => {
            ticker.stop();
        };
    }, [ticker]);

    return (
        <TickerContext.Provider value={ticker}>
            {children}
        </TickerContext.Provider>
    );
}

export function useTicker() {
    const ticker = useContext(TickerContext);
    if (!ticker) throw new Error("Ticker not found");
    return ticker;
}
