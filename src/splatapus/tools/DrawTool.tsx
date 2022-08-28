import { assert } from "@/lib/assert";
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
import { createTool, EventContext, ToolDragGesture } from "@/splatapus/tools/AbstractTool";
import { ToolName } from "@/splatapus/tools/ToolName";
import { PointerEvent } from "react";

export type DrawToolState =
    | {
          readonly type: "idle";
      }
    | {
          readonly type: "drawing";
          readonly points: ReadonlyArray<Vector2>;
      };

export class DrawTool extends createTool<ToolName.Draw, DrawToolState>(ToolName.Draw) {
    static toolName = ToolName.Draw;

    isIdle(): boolean {
        return this.state.type === "idle";
    }
    getSelected() {
        return this;
    }
    override onDragStart({
        viewport,
        event,
    }: EventContext<PointerEvent<Element>>): ToolDragGesture<DrawToolState> {
        return {
            state: {
                type: "drawing",
                points: [viewport.screenToScene(Vector2.fromEvent(event))],
            },
            gesture: {
                couldBeTap: false,
                onMove(state, { event, viewport }) {
                    console.log("draw.onMove", state);
                    assert(state.type === "drawing");
                    return {
                        type: "drawing",
                        points: [...state.points, viewport.screenToScene(Vector2.fromEvent(event))],
                    };
                },
                onEnd(state, { updateDocument, location }) {
                    console.log("draw.onEnd", state);
                    assert(state.type === "drawing");
                    updateDocument((document) => {
                        return document.replaceShapeVersionPoints(
                            document.getShapeVersionForKeyPoint(location.keyPointId).id,
                            state.points,
                        );
                    });
                    return { type: "idle" };
                },
                onCancel(state) {
                    console.log("draw.onCancel", state);
                    return { type: "idle" };
                },
            },
        };
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
