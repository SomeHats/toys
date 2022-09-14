import { SplatShapeVersion, SplatShapeVersionId } from "@/splatapus/model/SplatDoc";
import {
    getStrokeCenterPoints,
    getStrokePoints,
    StrokeCenterPoint,
} from "@/splatapus/perfectFreehand";
import { perfectFreehandOpts } from "@/splatapus/constants";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/normalizeCenterPointIntervals";
import { Table } from "@/splatapus/model/Table";

export type NormalizedShapeVersionState = {
    readonly id: SplatShapeVersionId;
    readonly length: number;
    readonly normalizedCenterPoints: ReadonlyArray<StrokeCenterPoint>;
};
export type NormalizedShapeState = {
    versions: Table<NormalizedShapeVersionState>;
};

export function calculateNormalizedShapePointsFromVersions(
    _shapeVersions: Iterable<SplatShapeVersion>,
): NormalizedShapeState {
    const shapeVersions = Array.from(_shapeVersions);
    if (shapeVersions.length === 0) return { versions: new Table({}) };

    const pointsWithStrokes = [];
    let longestLength = 0;
    for (const shapeVersion of shapeVersions) {
        const strokePoints = getStrokePoints(shapeVersion.rawPoints);
        const length = strokePoints[strokePoints.length - 1]?.runningLength ?? 0;
        pointsWithStrokes.push({ id: shapeVersion.id, strokePoints, length });
        if (length > longestLength) {
            longestLength = length;
        }
    }

    const targetPoints = Math.floor(longestLength / perfectFreehandOpts.size);

    return {
        versions: Table.fromArray<NormalizedShapeVersionState>(
            pointsWithStrokes.map(({ strokePoints, length, id }) => ({
                id,
                length,
                normalizedCenterPoints: normalizeCenterPointIntervalsQuadratic(
                    getStrokeCenterPoints(strokePoints, perfectFreehandOpts),
                    length / targetPoints,
                ),
            })),
        ),
    };
}
