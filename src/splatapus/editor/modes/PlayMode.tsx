import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { PointerEventContext, PointerEventType } from "@/splatapus/editor/EventContext";
import { Mode, ModeType } from "@/splatapus/editor/modes/Mode";
import { LiveValue } from "@/lib/live";
import { debugStateToString } from "@/lib/debugPropsToString";
import { ReactNode } from "react";

export class PlayMode implements Mode<ModeType.Play> {
    readonly type = ModeType.Play;
    readonly previewPosition = new LiveValue<null | Vector2>(null, "PlayMode.previewPosition");

    isIdleLive(): boolean {
        return true;
    }
    toDebugStringLive(): string {
        return debugStateToString("play", { _: this.previewPosition.live()?.toString(2) ?? null });
    }
    onPointerEvent({ event, eventType, splatapus }: PointerEventContext<PointerEventType>): void {
        switch (eventType) {
            case "move":
            case "down":
                if (event.isPrimary) {
                    this.previewPosition.update(splatapus.viewport.eventSceneCoords(event));
                }
                return;
            case "cancel":
            case "up":
                return;
            default:
                exhaustiveSwitchError(eventType);
        }
    }
    getPreviewPositionLive(): Vector2 | null {
        return this.previewPosition.live();
    }
    renderOverlay(): ReactNode {
        return null;
    }
}
