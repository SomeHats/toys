import { assert } from "../lib/assert";
import Circle from "../lib/geom/Circle";
import Vector2 from "../lib/geom/Vector2";
import { IdGenerator } from "../lib/IdGenerator";

export class BlobTreeNode {
    private static readonly ids = new IdGenerator("BlobTreeNode");

    static create(position: Vector2, radius: number): BlobTreeNode {
        return new BlobTreeNode(BlobTreeNode.ids.next(), position, radius);
    }

    constructor(readonly id: string, public position: Vector2, public radius: number) {}

    toCircle(): Circle {
        return new Circle(this.position, this.radius);
    }
}

export class BlobTree {
    private nodesById = new Map<string, BlobTreeNode>();
    private childrenById = new Map<string, Array<string>>();
    private parentById = new Map<string, string>();

    constructor() {}

    getNodeByIdIfExists(id: string): BlobTreeNode | undefined {
        return this.nodesById.get(id);
    }
    getNodeById(id: string): BlobTreeNode {
        const node = this.getNodeByIdIfExists(id);
        assert(node);
        return node;
    }

    getNodeParentIfExists(node: BlobTreeNode): BlobTreeNode | undefined {
        const parentId = this.parentById.get(node.id);
        if (!parentId) {
            return undefined;
        }
        return this.getNodeById(parentId);
    }

    private getMutableChildIds(node: BlobTreeNode) {
        let childIds = this.childrenById.get(node.id);
        if (!childIds) {
            childIds = [];
            this.childrenById.set(node.id, childIds);
        }
        return childIds;
    }

    createNewRoot(position: Vector2, radius: number): BlobTreeNode {
        const node = BlobTreeNode.create(position, radius);
        this.nodesById.set(node.id, node);
        return node;
    }
    createNewChild(parent: BlobTreeNode, position: Vector2, radius: number): BlobTreeNode {
        const node = BlobTreeNode.create(position, radius);
        this.nodesById.set(node.id, node);
        this.parentById.set(node.id, parent.id);
        this.getMutableChildIds(parent).push(node.id);
        return node;
    }

    *iterateNodes() {
        for (const node of this.nodesById.values()) {
            yield node;
        }
    }
    *iterateChildNodes(parent: BlobTreeNode) {
        for (const childId of this.childrenById.get(parent.id) ?? []) {
            yield this.getNodeById(childId);
        }
    }
    *iterateRootNodes() {
        for (const node of this.nodesById.values()) {
            if (!this.getNodeParentIfExists(node)) {
                yield node;
            }
        }
    }
}
