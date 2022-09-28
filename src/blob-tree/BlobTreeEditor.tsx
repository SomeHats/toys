import { DebugDraw } from "@/lib/DebugDraw";
import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { BlobTree, BlobTreeNode } from "@/blob-tree/BlobTree";
import { traceBlobTree } from "@/blob-tree/traceBlobTree";

type EditorState =
    | {
          type: "idle";
      }
    | {
          type: "createNode";
          node: BlobTreeNode;
      }
    | {
          type: "selectedIdle";
          node: BlobTreeNode;
      }
    | {
          type: "moveNode";
          node: BlobTreeNode;
          offset: Vector2;
      }
    | {
          type: "resizeNode";
          node: BlobTreeNode;
          offset: number;
      };

type HoverMode = "center" | "edge";
const HOVER_EDGE_SIZE = 6;

export class BlobTreeEditor {
    private mousePosition = Vector2.ZERO;
    private state: EditorState = { type: "idle" };

    constructor(private readonly canvas: DebugDraw, public readonly blobTree: BlobTree) {}

    private getSelectedNode() {
        switch (this.state.type) {
            case "idle":
                return null;
            case "createNode":
            case "selectedIdle":
            case "moveNode":
            case "resizeNode":
                return this.state.node;
            default:
                exhaustiveSwitchError(this.state);
        }
    }
    private getHover(): null | { node: BlobTreeNode; mode: HoverMode } {
        let nearestNode = null;
        let nearestDistance = Infinity;
        for (const node of this.blobTree.iterateNodes()) {
            const distance = node.position.distanceTo(this.mousePosition);
            if (distance > node.radius + HOVER_EDGE_SIZE) {
                continue;
            }
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestNode = node;
            }
        }

        if (!nearestNode) {
            return null;
        }

        const hoverEdgeSize = Math.min(nearestNode.radius * 0.1, HOVER_EDGE_SIZE);
        return {
            node: nearestNode,
            mode: nearestDistance < nearestNode.radius - hoverEdgeSize ? "center" : "edge",
        };
    }

    onMouseMove(position: Vector2) {
        this.mousePosition = position;
    }

    onMouseDown(position: Vector2) {
        switch (this.state.type) {
            case "idle":
            case "selectedIdle": {
                const hover = this.getHover();
                if (hover) {
                    switch (hover.mode) {
                        case "center":
                            this.state = {
                                type: "moveNode",
                                node: hover.node,
                                offset: hover.node.position.sub(this.mousePosition),
                            };
                            return;
                        case "edge":
                            this.state = {
                                type: "resizeNode",
                                node: hover.node,
                                offset:
                                    hover.node.radius -
                                    hover.node.position.distanceTo(this.mousePosition),
                            };
                            return;
                        default:
                            exhaustiveSwitchError(hover.mode);
                    }
                }
                this.state = {
                    type: "createNode",
                    node:
                        this.state.type === "idle"
                            ? this.blobTree.createNewRoot(position, 1)
                            : this.blobTree.createNewChild(this.state.node, position, 1),
                };
                return;
            }
            case "createNode":
            case "moveNode":
            case "resizeNode":
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onMouseUp(position: Vector2) {
        switch (this.state.type) {
            case "idle":
            case "selectedIdle":
                return;
            case "createNode":
            case "moveNode":
            case "resizeNode":
                this.state = { type: "selectedIdle", node: this.state.node };
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    onKeyDown(key: string) {
        console.log(key);
        if (key === " ") {
            traceBlobTree(this.blobTree, this.canvas, console);
        }
    }

    tick() {
        switch (this.state.type) {
            case "idle":
                return;
            case "createNode":
                this.state.node.radius = this.state.node.position.distanceTo(this.mousePosition);
                return;
            case "moveNode":
                this.state.node.position = this.mousePosition.add(this.state.offset);
                return;
            case "resizeNode":
                this.state.node.radius =
                    this.mousePosition.distanceTo(this.state.node.position) + this.state.offset;
                return;
            case "selectedIdle":
                return;
            default:
                exhaustiveSwitchError(this.state);
        }
    }

    draw() {
        this.canvas.clear();

        // const selectedNode = this.getSelectedNode();
        const hover = this.getHover();

        this.canvas.beginPath();
        traceBlobTree(this.blobTree, this.canvas);
        // this.canvas.stroke({
        //   stroke: 'rgba(255, 255, 255, 0.6)',
        //   strokeWidth: 10,
        // });

        for (const node of this.blobTree.iterateNodes()) {
            const style =
                node === this.getSelectedNode()
                    ? { stroke: "lime", strokeWidth: 2 }
                    : node === hover?.node
                    ? { stroke: "lime", strokeWidth: 1 }
                    : { stroke: "magenta", strokeWidth: 1 };
            this.canvas.circle(node.position, node.radius, style);

            for (const child of this.blobTree.iterateChildNodes(node)) {
                this.canvas.polyLine([node.position, child.position], {
                    stroke: "cyan",
                    strokeWidth: 1,
                });
            }
        }
    }
}
