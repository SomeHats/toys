import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { AutoInterpolator, Interpolator } from "@/splatapus/Interpolator";
import { SplatKeypoint, SplatShapeVersion } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { StrokeCenterPoint } from "@/splatapus/perfectFreehand";
import { PreviewPosition } from "@/splatapus/PreviewPosition";
import { Tps } from "@/splatapus/ThinPlateSpline";

class InterpolationCache {
    private cachedVersions: ReadonlySet<SplatShapeVersion> = new Set();
    private cachedKeyPoints: ReadonlySet<SplatKeypoint> = new Set();
    private tpsForEachPoint: null | ReadonlyArray<{
        x: Interpolator;
        y: Interpolator;
        r: Interpolator;
    }> = null;

    getCenterPointsAtPosition(
        document: SplatDocModel,
        position: PreviewPosition,
    ): ReadonlyArray<StrokeCenterPoint> {
        switch (position.type) {
            case "keyPointId": {
                const shapeVersion = document.getShapeVersionForKeyPoint(position.keyPointId);
                return document.data.normalizedShapeVersions.get(shapeVersion.id)
                    .normalizedCenterPoints;
            }
            case "interpolated":
                return this.getCenterPointsAtInterpolatedPosition(document, position.scenePosition);
            default:
                exhaustiveSwitchError(position);
        }
    }
    getCenterPointsAtInterpolatedPosition(
        document: SplatDocModel,
        position: Vector2,
    ): StrokeCenterPoint[] {
        const shapeVersions = new Set(document.shapeVersions);
        const keyPoints = new Set(document.keyPoints);

        if (!this.matchesCache(shapeVersions, keyPoints) || !this.tpsForEachPoint) {
            this.tpsForEachPoint = this.calculateTpsForEachPoint(document, shapeVersions);
            this.cachedVersions = shapeVersions;
        }

        const tpsForEachPoint = this.tpsForEachPoint;

        return tpsForEachPoint.map(({ x, y, r }) => ({
            center: new Vector2(x.interpolate(position), y.interpolate(position)),
            radius: r.interpolate(position),
        }));
    }

    private calculateTpsForEachPoint(
        document: SplatDocModel,
        shapeVersions: Set<SplatShapeVersion>,
    ) {
        console.time("calculateTpsForEachPoint");
        const allNormalizedPoints = Array.from(shapeVersions, (version) => ({
            normalizedCenterPoints: document.data.normalizedShapeVersions.get(version.id)
                .normalizedCenterPoints,
            version,
            keyPoint: document.keyPoints.get(version.keyPointId),
        }));

        const centers = allNormalizedPoints.map(({ keyPoint }) => keyPoint.position);

        const minLength = Math.min(
            ...allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints.length,
            ),
        );
        const tpsForEachPoint = [];
        for (let i = 0; i < minLength; i++) {
            const xs = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints[i].center.x,
            );
            const ys = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints[i].center.y,
            );
            const rs = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints[i].radius,
            );
            tpsForEachPoint.push({
                x: new AutoInterpolator(centers, xs),
                y: new AutoInterpolator(centers, ys),
                r: new AutoInterpolator(centers, rs),
            });
        }
        console.timeEnd("calculateTpsForEachPoint");
        return tpsForEachPoint;
    }

    private matchesCache(
        shapeVersions: Set<SplatShapeVersion>,
        keyPoints: Set<SplatKeypoint>,
    ): boolean {
        if (shapeVersions.size !== this.cachedVersions.size) {
            return false;
        }
        if (keyPoints.size !== this.cachedKeyPoints.size) {
            return false;
        }
        for (const version of shapeVersions) {
            if (!this.cachedVersions.has(version)) {
                return false;
            }
        }
        for (const keyPoint of keyPoints) {
            if (!this.cachedKeyPoints.has(keyPoint)) {
                return false;
            }
        }
        return true;
    }
}

export const interpolationCache = new InterpolationCache();
