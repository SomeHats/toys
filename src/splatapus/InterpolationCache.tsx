import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { AutoInterpolator, Interpolator } from "@/splatapus/Interpolator";
import {
    SplatKeyPoint,
    SplatShape,
    SplatShapeId,
    SplatShapeVersion,
} from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { StrokeCenterPoint } from "@/splatapus/perfectFreehand";
import { PreviewPosition } from "@/splatapus/PreviewPosition";

type CachedValues = {
    keyPoints: ReadonlySet<SplatKeyPoint>;
    versions: ReadonlySet<SplatShapeVersion>;
    interpolators: ReadonlyArray<{
        x: Interpolator;
        y: Interpolator;
        r: Interpolator;
    }>;
};

class InterpolationCache {
    private cache = new Map<SplatShape, CachedValues>();

    getCenterPointsAtPosition(
        document: SplatDocModel,
        shapeId: SplatShapeId,
        position: PreviewPosition,
    ): ReadonlyArray<StrokeCenterPoint> {
        switch (position.type) {
            case "keyPointId": {
                const shapeVersion = document.getShapeVersion(position.keyPointId, shapeId);
                if (!shapeVersion) {
                    const keyPoint = document.keyPoints.get(position.keyPointId);
                    return this.getCenterPointsAtInterpolatedPosition(
                        document,
                        shapeId,
                        keyPoint.position,
                    );
                }
                return document.getNormalizedCenterPointsForShapeVersion(shapeVersion.id);
            }
            case "interpolated":
                return this.getCenterPointsAtInterpolatedPosition(
                    document,
                    shapeId,
                    position.scenePosition,
                );
            default:
                exhaustiveSwitchError(position);
        }
    }
    getCenterPointsAtInterpolatedPosition(
        document: SplatDocModel,
        shapeId: SplatShapeId,
        position: Vector2,
    ): StrokeCenterPoint[] {
        const shape = document.shapes.get(shapeId);
        const shapeVersions = new Set(document.iterateShapeVersionsForShape(shapeId));
        if (!shapeVersions.size) {
            return [];
        }

        const keyPoints = new Set<SplatKeyPoint>();
        for (const shapeVersion of shapeVersions) {
            keyPoints.add(document.keyPoints.get(shapeVersion.keyPointId));
        }

        const cacheEntry = this.getCacheEntry(shape, shapeVersions, keyPoints);
        let interpolators;
        if (cacheEntry) {
            interpolators = cacheEntry.interpolators;
        } else {
            interpolators = this.calculateInterpolators(document, shapeVersions);
            this.cache.set(shape, {
                versions: shapeVersions,
                keyPoints,
                interpolators,
            });
        }

        return interpolators.map(({ x, y, r }) => ({
            center: new Vector2(x.interpolate(position), y.interpolate(position)),
            radius: r.interpolate(position),
        }));
    }

    private calculateInterpolators(document: SplatDocModel, shapeVersions: Set<SplatShapeVersion>) {
        console.time("calculatInterpolators");
        const allNormalizedPoints = Array.from(shapeVersions, (version) => ({
            normalizedCenterPoints: document.getNormalizedCenterPointsForShapeVersion(version.id),
            version,
            keyPoint: document.keyPoints.get(version.keyPointId),
        }));

        const centers = allNormalizedPoints.map(({ keyPoint }) => keyPoint.position);

        const minLength = Math.min(
            ...allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints.length,
            ),
        );
        const interpolators = [];
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
            interpolators.push({
                x: new AutoInterpolator(centers, xs),
                y: new AutoInterpolator(centers, ys),
                r: new AutoInterpolator(centers, rs),
            });
        }
        console.timeEnd("calculatInterpolators");
        return interpolators;
    }

    private getCacheEntry(
        shape: SplatShape,
        shapeVersions: ReadonlySet<SplatShapeVersion>,
        keyPoints: ReadonlySet<SplatKeyPoint>,
    ): CachedValues | null {
        const cacheEntry = this.cache.get(shape);
        if (!cacheEntry) {
            return null;
        }
        if (shapeVersions.size !== cacheEntry.versions.size) {
            return null;
        }
        if (keyPoints.size !== cacheEntry.keyPoints.size) {
            return null;
        }
        for (const version of shapeVersions) {
            if (!cacheEntry.versions.has(version)) {
                return null;
            }
        }
        for (const keyPoint of keyPoints) {
            if (!cacheEntry.keyPoints.has(keyPoint)) {
                return null;
            }
        }
        return cacheEntry;
    }
}

export const interpolationCache = new InterpolationCache();
