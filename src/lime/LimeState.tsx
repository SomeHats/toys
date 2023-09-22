import { reactive } from "@/lib/signia";
import { Lime } from "@/lime/Lime";
import { SlideId } from "@/lime/LimeStore";

export abstract class StateNode<Parent extends { readonly lime: Lime }> {
    abstract name: string;
    child?: { toDebugString(): string };
    readonly lime: Lime;

    constructor(readonly parent: Parent) {
        this.lime = parent.lime;
    }

    toDebugString() {
        if (this.child) {
            return `${this.name}.${this.child.toDebugString()}`;
        } else {
            return this.name;
        }
    }

    onPointerDown?(event: PointerEvent): void;
    onPointerMove?(event: PointerEvent): void;
    onPointerUp?(event: PointerEvent): void;
}

export class LimeState {
    constructor(readonly lime: Lime) {}
    @reactive accessor child: Idle | Drawing = new Idle(this);

    toDebugString() {
        return `lime.${this.child.toDebugString()}`;
    }

    onPointerDown = (event: PointerEvent) => {
        this.child.onPointerDown?.(event);
    };
    onPointerMove = (event: PointerEvent) => {
        this.child.onPointerMove?.(event);
    };
    onPointerUp = (event: PointerEvent) => {
        this.child.onPointerUp?.(event);
    };
}

export class Idle extends StateNode<LimeState> {
    override name = "idle";

    override onPointerDown(event: PointerEvent) {
        const slideId = this.lime.session.slideId;
        this.lime.updateSlide(slideId, (slide) => ({
            ...slide,
            rawPoints: [this.lime.inputs.scenePointer],
        }));
        this.parent.child = new Drawing(this.parent, slideId);
    }
}

export class Drawing extends StateNode<LimeState> {
    override name = "drawing";
    constructor(parent: LimeState, private readonly slideId: SlideId) {
        super(parent);
    }

    override onPointerMove(event: PointerEvent): void {
        this.lime.updateSlide(this.slideId, (slide) => ({
            ...slide,
            rawPoints: [...slide.rawPoints, this.lime.inputs.scenePointer],
        }));
    }

    override onPointerUp(event: PointerEvent): void {
        this.parent.child = new Idle(this.parent);
    }
}
