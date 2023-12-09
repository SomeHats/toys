import { Vector2 } from "@/lib/geom/Vector2";
import { Wire, WiresApp } from "@/wires/wiresModel2";
import { atom } from "@tldraw/state";

type ChildOf<S extends AnyState> =
    S extends State<any, any, infer C> ? C : never;

type AnyState = State<string, any, any>;
abstract class State<
    Name extends string,
    Parent extends AnyState | null,
    Child extends AnyState = never,
> {
    abstract readonly name: Name;
    private readonly _child = atom<Child | null>("State.child", null);

    constructor(
        readonly parent: Parent,
        readonly app: WiresApp,
    ) {}

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

export class RootNode extends State<"root", null, IdleNode | DraggingHandle> {
    override name = "root" as const;

    constructor(app: WiresApp) {
        super(null, app);
        this.enter(IdleNode);
    }

    override clear(): void {
        this.enter(IdleNode);
    }
}

export class IdleNode extends ChildState<"idle", RootNode> {
    override name = "idle" as const;

    override onPointerDown(event: React.PointerEvent) {
        const wire = this.app.createWire(Vector2.fromEvent(event));
        this.transitionTo(DraggingHandle, "end", wire);
    }
}

export class DraggingHandle extends ChildState<"DraggingHandle", RootNode> {
    override name = "DraggingHandle" as const;

    constructor(
        parent: RootNode,
        readonly handle: "start" | "end",
        readonly wire: Wire,
    ) {
        super(parent);
    }

    override onPointerMove(event: React.PointerEvent) {
        this.wire.end = Vector2.fromEvent(event);
    }

    override onPointerUp(event: React.PointerEvent) {
        this.exit();
    }
}
