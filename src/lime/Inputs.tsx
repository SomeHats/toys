import { Vector2 } from "@/lib/geom/Vector2";
import { memo, reactive } from "@/lib/signia";
import { Lime } from "@/lime/Lime";

export class Inputs {
    constructor(private readonly lime: Lime) {}

    @reactive accessor screenPointer = Vector2.ZERO;

    @memo get scenePointer() {
        return this.lime.viewport.screenToSlide(this.screenPointer);
    }

    updateFromEvent(event: PointerEvent) {
        this.screenPointer = Vector2.fromEvent(event);
    }
}
