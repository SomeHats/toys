import { Vector2 } from "@/lib/geom/Vector2";
import { reactive } from "@/lib/signia";
import { HistoryEntryId } from "@/splatapus3/model/History";
import { Splat } from "@/splatapus3/model/Splat";
import { ShapeVersionId } from "@/splatapus3/model/schema";
import { PointerEvent } from "react";

export abstract class StateNode<Parent extends { readonly splat: Splat }> {
    abstract name: string;
    child?: { toDebugString(): string };
    readonly splat: Splat;

    constructor(readonly parent: Parent) {
        this.splat = parent.splat;
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
    onPointerCancel?(event: PointerEvent): void;
}

export class RootInteraction {
    constructor(readonly splat: Splat) {}
    @reactive accessor child: Idle | Draw = new Idle(this);

    toDebugString() {
        return `root.${this.child.toDebugString()}`;
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
    onPointerCancel = (event: PointerEvent) => {
        this.child.onPointerCancel?.(event);
    };
}

export class Idle extends StateNode<RootInteraction> {
    override name = "idle";

    override onPointerDown(event: PointerEvent) {
        const { activeKeyPoint, firstShape } = this.splat;
        const existingShapeVersion = this.splat.getShapeVersion(
            firstShape.id,
            activeKeyPoint.id,
        );

        const mark = this.splat.history.mark();
        this.splat.update({
            ...existingShapeVersion,
            rawPoints: [Vector2.fromEvent(event)],
        });

        this.parent.child = new Draw(
            this.parent,
            existingShapeVersion.id,
            mark,
        );
    }
}
export class Draw extends StateNode<RootInteraction> {
    override name = "draw";

    constructor(
        parent: RootInteraction,
        readonly shapeVersionId: ShapeVersionId,
        readonly mark: HistoryEntryId,
    ) {
        super(parent);
    }

    override onPointerMove(event: PointerEvent<Element>): void {
        console.log("onPointerMove", Vector2.fromEvent(event).toString());
        this.splat.updateById(this.shapeVersionId, (prev) => ({
            ...prev,
            rawPoints: [...prev.rawPoints, Vector2.fromEvent(event)],
        }));
    }

    override onPointerUp(event: PointerEvent<Element>): void {
        this.parent.child = new Idle(this.parent);
    }

    override onPointerCancel(event: PointerEvent<Element>): void {
        this.splat.history.bailToMark(this.mark);
    }
}
