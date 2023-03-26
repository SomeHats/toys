import { Vector2 } from "@/lib/geom/Vector2";
import { atom } from "signia";

export class Inputs {
    pointer = atom("Inputs.pointer", Vector2.ZERO);

    events = {
        onPointerMove: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer.set(Vector2.fromEvent(e));
            }
        },
        onPointerDown: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer.set(Vector2.fromEvent(e));
            }
        },
        onPointerUp: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer.set(Vector2.fromEvent(e));
            }
        },
    };
}
