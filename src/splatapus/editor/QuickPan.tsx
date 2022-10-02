import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { matchesKey, matchesKeyDown } from "@/lib/hooks/useKeyPress";
import { LiveValue } from "@/lib/live";
import { noop } from "@/lib/utils";
import {
    KeyboardEventContext,
    PointerEventContext,
    SplatapusGestureDetector,
} from "@/splatapus/editor/EventContext";

export class QuickPan {
    readonly isKeyDown = new LiveValue(false);

    private gesture = new SplatapusGestureDetector({
        onDragStart: (event, splatapus) => {
            const initialPan = splatapus.viewport.pan.getOnce();
            let previousScreenPoint = Vector2.fromEvent(event);

            return {
                couldBeTap: false,
                onMove: (event) => {
                    const screenPoint = Vector2.fromEvent(event);
                    const delta = previousScreenPoint.sub(screenPoint);
                    splatapus.viewport.pan.update((pan) => pan.add(delta));
                    previousScreenPoint = screenPoint;
                },
                onEnd: noop,
                onCancel: () => {
                    splatapus.viewport.pan.update(initialPan);
                },
            };
        },
    });
    readonly isDragging = this.gesture.isDragging;

    onKeyDown({ event }: KeyboardEventContext): boolean {
        if (matchesKeyDown(event, " ")) {
            this.isKeyDown.update(true);
            return true;
        }
        return false;
    }
    onKeyUp({ event }: KeyboardEventContext): boolean {
        if (this.isKeyDown.getOnce() && matchesKey(event, " ")) {
            this.isKeyDown.update(false);
            this.gesture.end();
            return true;
        }
        return false;
    }

    getCanvasClassNameLive() {
        if (!this.isKeyDown.live()) {
            return null;
        } else if (this.isDragging.live()) {
            return "cursor-grabbing";
        }
        return "cursor-grab";
    }

    onPointerEvent(ctx: PointerEventContext) {
        this.gesture.onPointerEvent(ctx);
    }

    toDebugStringLive() {
        if (this.isKeyDown.live()) {
            return debugStateToString("quickPan", { dragging: this.isDragging.live() });
        }
        return null;
    }
}
