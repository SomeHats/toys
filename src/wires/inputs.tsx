import { Vector2 } from "@/lib/geom/Vector2";
import { atom } from "@/wires/Model";

export class Inputs {
    @atom accessor pointer = Vector2.ZERO;

    events = {
        onPointerMove: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer = Vector2.fromEvent(e);
            }
        },
        onPointerDown: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer = Vector2.fromEvent(e);
            }
        },
        onPointerUp: (e: React.PointerEvent) => {
            if (e.isPrimary) {
                this.pointer = Vector2.fromEvent(e);
            }
        },
    };
}
