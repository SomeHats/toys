import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { random } from "@/lib/utils";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { Viewport } from "@/splatapus/editor/Viewport";
import { runOnce } from "@/lib/live";

export function findPositionForNewKeyPoint(document: SplatDocModel, viewport: Viewport) {
    const bounds = runOnce(() => viewport.visibleSceneBoundsLive());
    const idealBounds = AABB.fromLeftTopRightBottom(
        bounds.left + bounds.width / 10,
        bounds.top + bounds.height / 10,
        bounds.right - bounds.width / 10,
        bounds.bottom - bounds.height / 10,
    );
    const otherPoints = Array.from(document.keyPoints, (keyPoint) => keyPoint.position);
    const minDimension = Math.min(bounds.width, bounds.height);
    const threshold = (minDimension / 10) ** 2;

    let candidate = idealBounds.getCenter();
    for (let i = 0; i < 500; i++) {
        if (
            otherPoints.every(
                (otherPoint) => !otherPoint || otherPoint.distanceToSq(candidate) > threshold,
            )
        ) {
            return candidate;
        }
        candidate = new Vector2(
            random(idealBounds.left, idealBounds.right),
            random(idealBounds.top, idealBounds.bottom),
        );
    }
    return candidate;
}
