import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { LiveValue } from "@/lib/live";
import {
    PointerEventContext,
    PointerEventType,
    SplatapusGestureDetector,
} from "@/splatapus/editor/EventContext";
import { ModeType, Mode } from "@/splatapus/editor/modes/Mode";
import { ReactNode } from "react";

export class DrawMode implements Mode<ModeType.Draw> {
    readonly type = ModeType.Draw;
    readonly previewPoints = new LiveValue<ReadonlyArray<Vector2>>([], "DrawMode.previewPoints");
    private readonly gesture = new SplatapusGestureDetector({
        onDragStart: (event, { viewport, location, document }) => {
            event.preventDefault();
            this.previewPoints.update([viewport.eventSceneCoords(event)]);
            return {
                couldBeTap: false,
                pointerCapture: true,
                onMove: (event) =>
                    this.previewPoints.update((prev) => [
                        ...prev,
                        viewport.eventSceneCoords(event),
                    ]),
                onEnd: (event) => {
                    const points = this.previewPoints.getOnce();
                    this.previewPoints.update([]);
                    document.update((document) =>
                        document.replacePointsForVersion(
                            location.keyPointId.getOnce(),
                            location.shapeId.getOnce(),
                            points,
                        ),
                    );
                },
                onCancel: () => {
                    this.previewPoints.update([]);
                },
            };
        },
    });
    isIdleLive(): boolean {
        return !this.gesture.isDragging.live();
    }
    toDebugStringLive(): string {
        return debugStateToString(
            "draw",
            this.isIdleLive()
                ? { _: "idle" }
                : { _: "drawing", points: this.previewPoints.live().length },
        );
    }
    onPointerEvent(ctx: PointerEventContext<PointerEventType>): void {
        this.gesture.onPointerEvent(ctx);
    }
    getPreviewPositionLive(): Vector2 | null {
        return null;
    }
    renderOverlay(): ReactNode {
        return null;
    }
}
