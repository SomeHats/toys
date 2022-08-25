import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { SplatShapeVersion } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    StrokeCenterPoint,
} from "@/splatapus/perfectFreehand";
import { createTool, EventContext } from "@/splatapus/tools/lib";
import { PointerEvent } from "react";

export type DrawToolState =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "drawing";
          readonly points: ReadonlyArray<Vector2>;
      };

export class DrawTool extends createTool<"draw", DrawToolState>("draw") {
    static toolName: "draw" = "draw";

    isIdle(): boolean {
        return this.state.type === "idle";
    }
    getSelected() {
        return this;
    }
    canvasClassName(): string {
        return "";
    }
    onKeyDown() {
        return this;
    }
    onKeyUp() {
        return this;
    }
    onPointerDown({ event, viewport }: EventContext<PointerEvent>) {
        switch (this.state.type) {
            case "idle":
                return new DrawTool({
                    type: "drawing",
                    points: [viewport.screenToScene(Vector2.fromEvent(event))],
                });
            case "drawing":
                return this;
            default:
                exhaustiveSwitchError(this.state);
        }
    }
    onPointerMove({ event, viewport }: EventContext<PointerEvent<Element>>) {
        const state = this.state;
        switch (state.type) {
            case "idle":
                return this;
            case "drawing":
                return new DrawTool({
                    type: "drawing",
                    points: [...state.points, viewport.screenToScene(Vector2.fromEvent(event))],
                });
            default:
                exhaustiveSwitchError(state);
        }
    }
    onPointerUp({ updateDocument, location }: EventContext<PointerEvent<Element>>) {
        const state = this.state;
        switch (state.type) {
            case "idle":
                return this;
            case "drawing":
                updateDocument((document) => {
                    return document.replaceShapeVersionPoints(
                        document.getShapeVersionForKeyPoint(location.keyPointId).id,
                        state.points,
                    );
                });
                return new DrawTool({ type: "idle" });
            default:
                exhaustiveSwitchError(state);
        }
    }
    override getPointsForShapeVersion(
        document: SplatDocModel,
        shapeVersion: SplatShapeVersion,
    ): ReadonlyArray<StrokeCenterPoint> {
        switch (this.state.type) {
            case "idle":
                return super.getPointsForShapeVersion(document, shapeVersion);
            case "drawing":
                // render currently drawing line:
                return normalizeCenterPointIntervalsQuadratic(
                    getStrokeCenterPoints(
                        getStrokePoints(this.state.points, perfectFreehandOpts),
                        perfectFreehandOpts,
                    ),
                    perfectFreehandOpts.size,
                );
            default:
                exhaustiveSwitchError(this.state);
        }
    }
    debugProperties(): Record<string, string> {
        switch (this.state.type) {
            case "idle":
                return { _: "idle" };
            case "drawing":
                return { _: "drawing", points: String(this.state.points.length) };
            default:
                exhaustiveSwitchError(this.state);
        }
    }
}
