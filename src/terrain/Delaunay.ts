import { Vector2 } from "@/lib/geom/Vector2";
import Delaunator from "delaunator";

function nextHalfedge(edgeId: number) {
    return edgeId % 3 === 2 ? edgeId - 2 : edgeId + 1;
}

function getTriangleCenters(
    { triangles }: Delaunator<Vector2>,
    points: Array<Vector2>,
): Array<Vector2> {
    const result = [];
    for (let t = 0; t < triangles.length; t += 3) {
        const p1 = points[triangles[t]];
        const p2 = points[triangles[t + 1]];
        const p3 = points[triangles[t + 2]];

        const avgX = (p1.x + p2.x + p3.x) / 3;
        const avgY = (p1.y + p2.y + p3.y) / 3;

        result.push(new Vector2(avgX, avgY));
    }
    return result;
}

export type DelaunayCellEdge = {
    neighbourCellId: number;
    leadingPoint: Vector2;
};
export type DelaunayCell = Array<DelaunayCellEdge>;

function getCellsByPointId(
    { triangles, halfedges }: Delaunator<Vector2>,
    triangleCenters: Array<Vector2>,
): Array<DelaunayCell> {
    const cellsByPointId: Array<DelaunayCell> = [];
    const visitedPointIds = new Set();
    for (let edgeId = 0; edgeId < triangles.length; edgeId++) {
        const pointId = triangles[nextHalfedge(edgeId)];
        if (!visitedPointIds.has(pointId)) {
            visitedPointIds.add(pointId);

            cellsByPointId[pointId] = [];

            let incomingEdgeId = edgeId;
            do {
                cellsByPointId[pointId].push({
                    neighbourCellId: triangles[incomingEdgeId],
                    leadingPoint:
                        triangleCenters[Math.floor(incomingEdgeId / 3)],
                });
                const outgoing = nextHalfedge(incomingEdgeId);
                incomingEdgeId = halfedges[outgoing];
            } while (incomingEdgeId !== -1 && incomingEdgeId !== edgeId);
        }
    }
    return cellsByPointId;
}

export class Delaunay {
    // delaunator.triangles[halfEdgeIdx] => pointIdx
    // delaunator.halfedges[halfEdgeIdx] => oppositeHalfEdgeIdx
    // triangleId = Math.floor(halfEdgeId / 3)
    // [halfEdge1, halfEdge2, halfEdge3] = [triangleId * 3, triangleId * 3 + 1, triangleId * 3 + 2]
    public readonly delaunator: Delaunator<Vector2>;
    public readonly triangleCenters: Array<Vector2>;
    public readonly cellsByPointId: Array<DelaunayCell>;

    constructor(public readonly points: Array<Vector2>) {
        console.time("delauney.delaunator");
        this.delaunator = Delaunator.from(
            points,
            (p) => p.x,
            (p) => p.y,
        );
        console.timeEnd("delauney.delaunator");
        console.time("delauney.getTriangleCenters");
        this.triangleCenters = getTriangleCenters(this.delaunator, points);
        console.timeEnd("delauney.getTriangleCenters");
        console.time("delauney.getCellsByPointId");
        this.cellsByPointId = getCellsByPointId(
            this.delaunator,
            this.triangleCenters,
        );
        console.timeEnd("delauney.getCellsByPointId");
    }

    forEachTriangleEdge(cb: (pointIdA: number, pointIdB: number) => void) {
        for (let e = 0; e < this.delaunator.triangles.length; e++) {
            if (e > this.delaunator.halfedges[e]) {
                const pointIdA = this.delaunator.triangles[e];
                const pointIdB = this.delaunator.triangles[nextHalfedge(e)];
                cb(pointIdA, pointIdB);
            }
        }
    }

    forEachPolygonEdge(cb: (p1: Vector2, p2: Vector2) => void) {
        for (
            let halfEdgeId = 0;
            halfEdgeId < this.delaunator.triangles.length;
            halfEdgeId++
        ) {
            const otherHalfEdgeId = this.delaunator.halfedges[halfEdgeId];
            if (halfEdgeId > otherHalfEdgeId && otherHalfEdgeId !== -1) {
                const p1 = this.triangleCenters[Math.floor(halfEdgeId / 3)];
                const p2 =
                    this.triangleCenters[Math.floor(otherHalfEdgeId / 3)];
                cb(p1, p2);
            }
        }
    }

    isPointIdInHull(pointId: number): boolean {
        let incoming = pointId;
        do {
            const outgoing = nextHalfedge(incoming);
            incoming = this.delaunator.halfedges[outgoing];
            if (incoming === -1) {
                return true;
            }
        } while (incoming !== pointId);

        return false;
    }
}
