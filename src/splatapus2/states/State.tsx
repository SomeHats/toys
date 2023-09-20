import { HistoryEntryId, Splat } from "@/splatapus2/app/Splat";
import { IncrementalArrayOfDiffType } from "@/splatapus2/store/Incremental";
import { ShapeVersionId } from "@/splatapus2/store/Records";
import { atom } from "@tldraw/state";

type ChildOf<S extends AnyState> = S extends State<any, any, infer C> ? C : never;

type AnyState = State<string, any, any>;
abstract class State<
    Name extends string,
    Parent extends AnyState | null,
    Child extends AnyState = never,
> {
    abstract readonly name: Name;
    private readonly _child = atom<Child | null>("State.child", null);

    constructor(readonly parent: Parent, readonly splat: Splat) {}

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
        super(parent, parent.splat);
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

export class RootNode extends State<"root", null, IdleNode | DrawNode> {
    override name = "root" as const;

    constructor(splat: Splat) {
        super(null, splat);
        this.enter(IdleNode);
    }

    override clear(): void {
        this.enter(IdleNode);
    }
}

export class IdleNode extends ChildState<"idle", RootNode> {
    override name = "idle" as const;

    override onPointerDown(event: React.PointerEvent) {
        const shapeVersion = this.splat.shapeVersions.signal.value.first();
        if (shapeVersion) {
            this.transitionTo(DrawNode, shapeVersion.id);
        }
    }
}

export class DrawNode extends ChildState<"draw", RootNode> {
    override name = "draw" as const;
    private readonly mark: HistoryEntryId;

    constructor(parent: RootNode, readonly shapeVersionId: ShapeVersionId) {
        super(parent);

        this.mark = this.splat.mark("draw");

        this.splat.shapeVersions.update(shapeVersionId, {
            rawPoints: {
                type: IncrementalArrayOfDiffType.Replace,
                value: [this.splat.inputs.pointer],
            },
        });
    }

    override onPointerMove() {
        this.splat.shapeVersions.update(this.shapeVersionId, {
            rawPoints: {
                type: IncrementalArrayOfDiffType.Splice,
                index: this.splat.shapeVersions.get(this.shapeVersionId).rawPoints.length,
                insert: [this.splat.inputs.pointer],
                deleteCount: 0,
            },
        });
    }

    override onPointerUp() {
        this.onPointerMove();
        this.exit();
    }

    override onPointerCancel() {
        this.splat.bail(this.mark);
        this.exit();
    }
}
