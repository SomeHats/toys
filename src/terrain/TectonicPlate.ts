import { random, mapRange, wait, lerp } from "../lib/utils";
import Terrain from "./Terrain";
import { interpolateRgbBasis } from "d3-interpolate";
import Vector2 from "../lib/geom/Vector2";
import { TerrainCell } from "./TerrainCell";
import { makeFractalNoise2d } from "./fractalNoise";
import * as config from "./config";
import { canvas } from "./canvas";

function findPlateEdges(
    currentPlateId: number,
    terrain: Terrain,
    cellIds: ReadonlyArray<number>,
    plateIdByCellId: ReadonlyArray<number>,
): { edgeCellIds: Set<number>; polygon: Array<Vector2> } {
    const isNeighbourCellIdInOtherPlate = (neighbourCellId: number | null) =>
        neighbourCellId === null || plateIdByCellId[neighbourCellId] !== currentPlateId;

    const startingEdgeCellId = cellIds.find((cellId) =>
        terrain.cellsById[cellId].neighbourCellIdsByEdgeIndex.some(isNeighbourCellIdInOtherPlate),
    );
    if (startingEdgeCellId == null) {
        throw new Error(`startingEdgeCellId must exist`);
    }

    const edgeCellIds = new Set<number>();
    const polygonSet = new Set<Vector2>();

    const startingEdgeCell = terrain.cellsById[startingEdgeCellId];
    const startingEdgeCellStartingEdgeIndex =
        startingEdgeCell.neighbourCellIdsByEdgeIndex.findIndex(isNeighbourCellIdInOtherPlate);
    if (startingEdgeCellStartingEdgeIndex === -1) {
        throw new Error("startingEdgeCellStartingEdgeIndex must exist");
    }

    let currentCell = startingEdgeCell;
    let currentEdgeIndexInCell = startingEdgeCellStartingEdgeIndex;
    let lastPolygonPoint: Vector2 | null = null;
    let i = 0;
    while (i < 50000) {
        i++;

        edgeCellIds.add(currentCell.id);
        const currentCellAtStartOfEdgeIteration = currentCell;
        for (const edgeIndex of currentCell.iterateEdgesStartingFromIndex(currentEdgeIndexInCell)) {
            const neighbourCellId = currentCell.neighbourCellIdsByEdgeIndex[edgeIndex];

            if (isNeighbourCellIdInOtherPlate(neighbourCellId)) {
                lastPolygonPoint = currentCell.polygon[edgeIndex];
                if (polygonSet.has(lastPolygonPoint)) {
                    return { polygon: Array.from(polygonSet), edgeCellIds };
                }
                polygonSet.add(lastPolygonPoint);
            } else {
                if (neighbourCellId === null) {
                    throw new Error("neighbourCellId must exist");
                }
                if (lastPolygonPoint === null) {
                    throw new Error("lastPolygonPoint must exist");
                }
                const nextCell = terrain.cellsById[neighbourCellId];
                const nextCellStartEdgeIndex = nextCell.polygon.findIndex((point) =>
                    lastPolygonPoint!.equals(point),
                );
                if (nextCellStartEdgeIndex === -1) {
                    throw new Error("currentEdgeIndexInCell must exist");
                }

                currentCell = nextCell;
                currentEdgeIndexInCell = nextCellStartEdgeIndex + 1;

                break;
            }
        }

        if (currentCellAtStartOfEdgeIteration === currentCell) {
            throw new Error(`currentCell must change during edge iteration`);
        }
    }

    throw new Error("loop never completed");
}

export class TectonicPlate {
    // public readonly color = randomColor();
    // public readonly baseHeight = rand(-0.7, 0.5);
    public readonly edgeCellIds: ReadonlySet<number>;
    public readonly polygon: ReadonlyArray<Vector2>;
    public readonly cellIds: ReadonlySet<number>;
    public readonly drift: Vector2 = Vector2.fromPolar(
        random(-Math.PI, Math.PI),
        random(config.MIN_TECTONIC_DRIFT, config.MAX_TECTONIC_DRIFT),
    );

    constructor(
        public readonly id: number,
        private readonly terrain: Terrain,
        public readonly baseHeight: number,
        cellIds: ReadonlyArray<number>,
        plateIdByCellId: ReadonlyArray<number>,
    ) {
        this.cellIds = new Set(cellIds);
        console.time("plate.findPlateEdges");
        const plateEdges = findPlateEdges(id, terrain, cellIds, plateIdByCellId);
        this.edgeCellIds = plateEdges.edgeCellIds;
        this.polygon = plateEdges.polygon;
        console.timeEnd("plate.findPlateEdges");
    }

    private getCell(cellId: number): TerrainCell {
        if (!this.cellIds.has(cellId)) {
            throw new Error(`Cell not in plate: ${cellId}`);
        }
        return this.terrain.cellsById[cellId];
    }

    calculateDriftHeightOffsets() {
        for (const edgeCellId of this.edgeCellIds) {
            const cell = this.getCell(edgeCellId);
            const neighbourDrifts = cell.neighbourCellIds
                .filter((neighbourId) => this.terrain.plateIdByCellId[neighbourId] !== this.id)
                .map(
                    (neighbourId) =>
                        this.terrain.platesById[this.terrain.plateIdByCellId[neighbourId]].drift,
                );

            if (!neighbourDrifts.length) continue;

            const averageNeighbourDrift = Vector2.average(neighbourDrifts);
            const driftDotProduct = averageNeighbourDrift.dot(this.drift);
            canvas.debugPointX(cell.position, {
                label: String(driftDotProduct.toFixed(1)),
            });
        }
    }
}
