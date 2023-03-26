import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { memo } from "@/wires/Model";
import { Wire, WiresApp } from "@/wires/WiresApp";
import { atom } from "signia";

type ChildOf<S extends AnyState> = S extends State<any, any, infer C> ? C : never;

type Hovered =
    | { type: "none" }
    | {
          type: "handle";
          wire: Wire;
          handle: "start" | "end";
      }
    | {
          type: "middleSection";
          wire: Wire;
      };

type AnyState = State<string, any, any>;
abstract class State<
    Name extends string,
    Parent extends AnyState | null,
    Child extends AnyState = never,
> {
    abstract readonly name: Name;
    private readonly _child = atom<Child | null>("State.child", null);

    constructor(readonly parent: Parent, readonly app: WiresApp) {}

    clear() {
        this._child.set(null);
    }

    enter<C extends Child, Args extends any[]>(
        childCtor: new (parent: this, ...args: Args) => C,
        ...args: Args
    ): C {
        const child = new childCtor(this, ...args);
        this._child.set(child);
        return child;
    }

    get state(): Child | null {
        return this._child.value;
    }

    get path(): string {
        if (this.state) {
            return `${this.name}.${this.state.path}`;
        }
        return this.name;
    }

    onPointerDown(event: React.PointerEvent) {
        this.state?.onPointerDown(event);
    }

    onPointerMove(event: React.PointerEvent) {
        this.state?.onPointerMove(event);
    }

    onPointerUp(event: React.PointerEvent) {
        this.state?.onPointerUp(event);
    }

    onPointerCancel(event: React.PointerEvent) {
        this.state?.onPointerCancel(event);
    }

    get hovered(): Hovered {
        return this.state?.hovered ?? { type: "none" };
    }
}

abstract class ChildState<
    Name extends string,
    Parent extends AnyState,
    Child extends AnyState = never,
> extends State<Name, Parent, Child> {
    constructor(parent: Parent) {
        super(parent, parent.app);
    }
    transitionTo<C extends ChildOf<Parent>, Args extends any[]>(
        childCtor: new (parent: Parent, ...args: Args) => C,
        ...args: Args
    ): C {
        return this.parent.enter(childCtor, ...args);
    }

    exit() {
        this.parent.clear();
    }
}

const hoverRadius = 10;

export class RootNode extends State<"<root>", null, IdleNode | DraggingHandle> {
    override name = "<root>" as const;

    constructor(app: WiresApp) {
        super(null, app);
        this.enter(IdleNode);
    }

    override clear(): void {
        this.enter(IdleNode);
    }
}

export class IdleNode extends ChildState<"Idle", RootNode> {
    override name = "Idle" as const;

    override onPointerDown(event: React.PointerEvent) {
        const hovered = this.parent.hovered;
        switch (hovered.type) {
            case "none": {
                const wire = this.app.createWire(Vector2.fromEvent(event));
                this.transitionTo(DraggingHandle, "end", wire);
                return;
            }
            case "handle": {
                this.transitionTo(DraggingHandle, hovered.handle, hovered.wire);
                return;
            }
            case "middleSection": {
                return;
            }
            default:
                exhaustiveSwitchError(hovered, "type");
        }
    }

    @memo override get hovered() {
        let nearestHandleDistance = Infinity;
        let nearestHandle: Hovered = { type: "none" };

        for (const wire of this.app.wires) {
            for (const handle of ["start", "end"] as const) {
                const distance = wire[handle].distanceTo(this.app.inputs.pointer);
                if (distance < hoverRadius && distance < nearestHandleDistance) {
                    nearestHandleDistance = distance;
                    nearestHandle = {
                        type: "handle",
                        wire,
                        handle,
                    };
                }
            }
            const middleSection = wire.lineInfo.middleSection;
            const distanceToMiddleSection = this.app.inputs.pointer.distanceToLineSegment(
                middleSection[0],
                middleSection[1],
            );
            if (distanceToMiddleSection < hoverRadius) {
                nearestHandleDistance = distanceToMiddleSection;
                nearestHandle = {
                    type: "middleSection",
                    wire,
                };
            }
        }

        return nearestHandle;
    }
}

export class DraggingHandle extends ChildState<"DraggingHandle", RootNode> {
    override name = "DraggingHandle" as const;
    readonly offset: Vector2;

    constructor(parent: RootNode, readonly handle: "start" | "end", readonly wire: Wire) {
        super(parent);
        this.offset = wire[handle].sub(this.app.inputs.pointer);
    }

    override onPointerMove(event: React.PointerEvent) {
        this.wire[this.handle] = Vector2.fromEvent(event).add(this.offset);
    }

    override onPointerUp(event: React.PointerEvent) {
        this.exit();
    }

    @memo override get hovered(): Hovered {
        return { type: "handle", wire: this.wire, handle: this.handle };
    }
}
