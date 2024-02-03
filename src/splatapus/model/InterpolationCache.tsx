import { Vector2 } from "@/lib/geom/Vector2";
import { compact, exhaustiveSwitchError } from "@/lib/utils";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { AutoInterpolator, Interpolator } from "@/splatapus/model/Interpolator";
import {
    SplatKeyPoint,
    SplatShape,
    SplatShapeId,
    SplatShapeVersion,
} from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { StrokeCenterPoint } from "@/splatapus/model/perfectFreehand";

interface CachedValues {
    keyPoints: ReadonlySet<SplatKeyPoint>;
    versions: ReadonlySet<SplatShapeVersion>;
    interpolators:
        | readonly {
              x: Interpolator;
              y: Interpolator;
              r: Interpolator;
          }[]
        | null;
}

class InterpolationCache {
    private cache = new Map<SplatShape, CachedValues>();

    getCenterPointsAtPosition(
        document: SplatDocModel,
        shapeId: SplatShapeId,
        position: PreviewPosition,
    ): {
        normalized: readonly StrokeCenterPoint[];
        smoothed: readonly StrokeCenterPoint[] | null;
    } | null {
        switch (position.type) {
            case "keyPointId": {
                const shapeVersion = document.getShapeVersion(
                    position.keyPointId,
                    shapeId,
                );
                if (!shapeVersion) {
                    const keyPoint = document.keyPoints.get(
                        position.keyPointId,
                    );
                    if (!keyPoint.position) {
                        return null;
                    }
                    const interpolatedPoints =
                        this.getCenterPointsAtInterpolatedPosition(
                            document,
                            shapeId,
                            keyPoint.position,
                        );
                    if (!interpolatedPoints) return null;
                    return { normalized: interpolatedPoints, smoothed: null };
                }
                return {
                    normalized:
                        document.getNormalizedCenterPointsForShapeVersion(
                            shapeVersion.id,
                        ).normalizedCenterPoints,
                    smoothed: document.getNormalizedCenterPointsForShapeVersion(
                        shapeVersion.id,
                    ).smoothedCenterPoints,
                };
            }
            case "interpolated": {
                const points = this.getCenterPointsAtInterpolatedPosition(
                    document,
                    shapeId,
                    position.scenePosition,
                );
                if (!points) return null;
                return { normalized: points, smoothed: null };
            }
            default:
                exhaustiveSwitchError(position);
        }
    }
    getCenterPointsAtInterpolatedPosition(
        document: SplatDocModel,
        shapeId: SplatShapeId,
        position: Vector2,
    ): StrokeCenterPoint[] | null {
        const shape = document.shapes.get(shapeId);
        const shapeVersions = new Set(
            document.iterateShapeVersionsForShape(shapeId),
        );
        if (!shapeVersions.size) {
            return null;
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
            interpolators = this.calculateInterpolators(
                document,
                shapeVersions,
            );
            this.cache.set(shape, {
                versions: shapeVersions,
                keyPoints,
                interpolators,
            });
        }

        return (
            interpolators?.map(({ x, y, r }) => ({
                center: new Vector2(
                    x.interpolate(position),
                    y.interpolate(position),
                ),
                radius: r.interpolate(position),
            })) ?? null
        );
    }

    private calculateInterpolators(
        document: SplatDocModel,
        shapeVersions: Set<SplatShapeVersion>,
    ) {
        console.time("calculatInterpolators");
        const allNormalizedPoints = compact(
            Array.from(shapeVersions, (version) => {
                const keyPoint = document.keyPoints.get(version.keyPointId);
                if (!keyPoint.position) {
                    return null;
                }
                return {
                    normalizedCenterPoints:
                        document.getNormalizedCenterPointsForShapeVersion(
                            version.id,
                        ).normalizedCenterPoints,
                    version,
                    keyPointPosition: keyPoint.position,
                };
            }),
        );

        if (!allNormalizedPoints.length) {
            return null;
        }

        const centers = allNormalizedPoints.map(
            ({ keyPointPosition }) => keyPointPosition,
        );

        const minLength = Math.min(
            ...allNormalizedPoints.map(
                ({ normalizedCenterPoints }) => normalizedCenterPoints.length,
            ),
        );
        console.log({ minLength, allNormalizedPoints });
        const interpolators = [];
        for (let i = 0; i < minLength; i++) {
            const xs = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) =>
                    normalizedCenterPoints[i].center.x,
            );
            const ys = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) =>
                    normalizedCenterPoints[i].center.y,
            );
            const rs = allNormalizedPoints.map(
                ({ normalizedCenterPoints }) =>
                    normalizedCenterPoints[i].radius,
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
