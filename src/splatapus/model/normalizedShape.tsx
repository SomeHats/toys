import { perfectFreehandOpts } from "@/splatapus/constants";
import { SplatShapeVersion, SplatShapeVersionId } from "@/splatapus/model/SplatDoc";
import { Table } from "@/splatapus/model/Table";
import { normalizeCenterPointIntervalsQuadratic } from "@/splatapus/model/normalizeCenterPointIntervals";
import {
    StrokeCenterPoint,
    getStrokeCenterPoints,
    getStrokePoints,
} from "@/splatapus/model/perfectFreehand";

export type NormalizedShapeVersionState = {
    readonly id: SplatShapeVersionId;
    readonly length: number;
    readonly smoothedCenterPoints: ReadonlyArray<StrokeCenterPoint>;
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
            pointsWithStrokes.map(({ strokePoints, length, id }) => {
                const smoothedCenterPoints = getStrokeCenterPoints(
                    strokePoints,
                    perfectFreehandOpts,
                );
                return {
                    id,
                    length,
                    smoothedCenterPoints,
                    normalizedCenterPoints: normalizeCenterPointIntervalsQuadratic(
                        smoothedCenterPoints,
                        length / targetPoints,
                    ),
                };
            }),
        ),
    };
}
