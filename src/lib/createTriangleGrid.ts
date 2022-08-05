import Vector2 from "../lib/geom/Vector2";
import { getId, compact, intersection } from "../lib/utils";
import Intersection from "../network/networkNodes/Intersection";

type TriangleGeom = [Vector2, Vector2, Vector2];
type IntermediateTriangle = {
    id: string;
    points: TriangleGeom;
};

export type TriangleNeighbour = {
    triangle: Triangle;
    sharedPoints: [Vector2, Vector2];
};
export type Triangle = {
    id: string;
    center: Vector2;
    points: TriangleGeom;
    neighbours: TriangleNeighbour[];
    ix: number;
    iy: number;
};

export default function createTriangleGrid(
    tileSize: number,
    width: number,
    height: number,
): Map<string, Triangle> {
    const tileHeight = (tileSize * Math.sqrt(3)) / 2;
    const points: Vector2[][] = [];
    const trianglePoints: IntermediateTriangle[][] = [];
    for (let iy = 0; iy * tileHeight < height + tileHeight; iy++) {
        const pointRow: Vector2[] = [];
        points.push(pointRow);
        const triangleRow: IntermediateTriangle[] = [];
        trianglePoints.push(triangleRow);
        for (let ix = 0; ix * tileSize < width + tileSize; ix++) {
            const xOffset = iy % 2 === 0 ? -tileSize / 2 : 0;
            const point = new Vector2(ix * tileSize + xOffset, iy * tileHeight);
            pointRow.push(point);

            if (iy !== 0 && ix !== 0) {
                if (iy % 2 === 0) {
                    const triangle1: IntermediateTriangle = {
                        id: getId("triangle"),
                        points: [point, points[iy][ix - 1], points[iy - 1][ix - 1]],
                    };
                    const triangle2: IntermediateTriangle = {
                        id: getId("triangle"),
                        points: [point, points[iy - 1][ix - 1], points[iy - 1][ix]],
                    };
                    triangleRow.push(triangle1, triangle2);
                } else if (points[iy - 1][ix + 1]) {
                    const triangle1: IntermediateTriangle = {
                        id: getId("triangle"),
                        points: [point, points[iy][ix - 1], points[iy - 1][ix]],
                    };
                    const triangle2: IntermediateTriangle = {
                        id: getId("triangle"),
                        points: [point, points[iy - 1][ix + 1], points[iy - 1][ix]],
                    };
                    triangleRow.push(triangle1, triangle2);
                }
            }
        }
    }

    const trianglesById = new Map<string, Triangle>();
    for (let iy = 0; iy < trianglePoints.length; iy++) {
        for (let ix = 0; ix < trianglePoints[iy].length; ix++) {
            const triangle = trianglePoints[iy][ix];
            const center = Vector2.average(triangle.points);

            const neighbours = compact(
                ix % 2 === 0
                    ? iy % 2 === 0
                        ? [
                              // 2,2
                              trianglePoints[iy]?.[ix - 1],
                              trianglePoints[iy]?.[ix + 1],
                              trianglePoints[iy + 1]?.[ix - 1],
                          ]
                        : [
                              // 2,3
                              trianglePoints[iy]?.[ix - 1],
                              trianglePoints[iy]?.[ix + 1],
                              trianglePoints[iy + 1]?.[ix + 1],
                          ]
                    : iy % 2 === 0
                    ? [
                          // 3,2
                          trianglePoints[iy]?.[ix - 1],
                          trianglePoints[iy]?.[ix + 1],
                          trianglePoints[iy - 1]?.[ix - 1],
                      ]
                    : [
                          //3,3
                          trianglePoints[iy]?.[ix - 1],
                          trianglePoints[iy]?.[ix + 1],
                          trianglePoints[iy - 1]?.[ix + 1],
                      ],
            );

            const fullTriangle = triangle as Triangle;
            fullTriangle.center = center;
            fullTriangle.neighbours = neighbours.map((neighbourTriangle) => ({
                triangle: neighbourTriangle,
                sharedPoints: intersection(triangle.points, neighbourTriangle.points),
            })) as TriangleNeighbour[];
            fullTriangle.ix = ix;
            fullTriangle.iy = iy;

            trianglesById.set(fullTriangle.id, fullTriangle);
        }
    }

    return trianglesById;
}
