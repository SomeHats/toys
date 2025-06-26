import { Vector2 } from "@/lib/geom/Vector2";
import { atom } from "@tldraw/state";

export class Inputs {
    private readonly _pointer = atom("Inputs.pointer", Vector2.ZERO);

    onPointerMove(e: React.PointerEvent) {
        if (e.isPrimary) {
            this._pointer.set(Vector2.fromEvent(e));
        }
    }
    onPointerDown(e: React.PointerEvent) {
        if (e.isPrimary) {
            this._pointer.set(Vector2.fromEvent(e));
        }
    }
    onPointerUp(e: React.PointerEvent) {
        if (e.isPrimary) {
            this._pointer.set(Vector2.fromEvent(e));
        }
    }

    get pointer() {
        return this._pointer.get();
    }
}
