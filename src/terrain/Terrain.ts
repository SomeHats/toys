import { Delaunay } from "@/terrain/Delaunay";
import { TerrainCell } from "@/terrain/TerrainCell";
import Vector2 from "@/lib/geom/Vector2";
import { times, sample, removeFromArray, mapRange, shuffle } from "@/lib/utils";
import RandomQueue from "@/lib/RandomQueue";
import AABB from "@/lib/geom/AABB";
import { TectonicPlate } from "@/terrain/TectonicPlate";
import * as config from "@/terrain/config";
import { makeFractalNoise2d, mapNoise2d } from "@/terrain/fractalNoise";
import { quadtree, Quadtree } from "d3-quadtree";

function assignPlates(plateCount: number, terrain: Terrain) {
    const remainingCellIds = new Set(terrain.activeCellIds);
    const queue = new RandomQueue(terrain.activeCellIds);
    const plateIdByCellId: Array<number> = new Array(terrain.activeCellIds.length);

    const plates = times(plateCount, (id) => {
        const initialCellId = queue.pop();
        remainingCellIds.delete(initialCellId);
        plateIdByCellId[initialCellId] = id;
        return {
            activeCellIds: new RandomQueue([initialCellId]),
            allCellIds: new Set([initialCellId]),
            id,
        };
    });

    const activePlates = plates.slice();

    while (remainingCellIds.size > 0) {
        const plate = sample(activePlates);
        if (!plate) {
            break;
        }

        // i++;
        // if (i > 100) {
        //   debugger;
        // }

        while (plate.activeCellIds.size) {
            const activeCellId = plate.activeCellIds.pop();
            const neighbourIds = terrain.cellsById[activeCellId].neighbourCellIds;
            const remainingNeighbourIds = neighbourIds.filter((neighbourId) =>
                remainingCellIds.has(neighbourId),
            );

            if (remainingNeighbourIds.length) {
                const newCellId = sample(neighbourIds);
                if (remainingCellIds.has(newCellId)) {
                    remainingCellIds.delete(newCellId);
                    plate.activeCellIds.add(newCellId);
                    plate.allCellIds.add(newCellId);
                    plateIdByCellId[newCellId] = plate.id;
                }
                plate.activeCellIds.add(activeCellId);
                break;
            }
        }

        if (!plate.activeCellIds.size) {
            removeFromArray(activePlates, plate);
        }
    }

    const baseHeights = shuffle(
        plates.map((p, idx) =>
            mapRange(
                0,
                Math.max(1, plates.length - 1),
                config.MIN_PLATE_BASE_HEIGHT,
                config.MAX_PLATE_BASE_HEIGHT,
                idx,
            ),
        ),
    );
    return {
        plateIdByCellId,
        platesById: plates.map(
            ({ id, allCellIds }, idx) =>
                new TectonicPlate(
                    id,
                    terrain,
                    baseHeights[idx],
                    Array.from(allCellIds),
                    plateIdByCellId,
                ),
        ),
    };
}

export default class Terrain {
    public readonly isActiveByCellId: Array<boolean>;
    public readonly activeCellIds: Array<number>;
    public readonly allCellIds: Array<number>;
    public readonly cellsById: Array<TerrainCell>;
    public readonly plateIdByCellId: Array<number>;
    public readonly platesById: Array<TectonicPlate>;
    public readonly cellsQuadTree: Quadtree<TerrainCell>;

    constructor(delaunay: Delaunay, activeBounds: AABB) {
        this.allCellIds = delaunay.points.map((p, i) => i);
        this.isActiveByCellId = delaunay.points.map((point) => activeBounds.contains(point));
        this.activeCellIds = this.allCellIds.filter((id) => this.isActiveByCellId[id]);

        const heightNoise = mapNoise2d(
            config.CELL_NOISE_SCALE,
            -config.CELL_HEIGHT_NOISE_AMT,
            config.CELL_HEIGHT_NOISE_AMT,
            makeFractalNoise2d(5),
        );
        const tectonicDriftNoise = mapNoise2d(
            config.DRIFT_NOISE_SCALE,
            1 - config.DRIFT_NOISE_AMT,
            1,
            makeFractalNoise2d(5),
        );
        this.cellsById = delaunay.cellsByPointId.map(
            (cell, cellId) => new TerrainCell(cellId, cell, this, heightNoise, tectonicDriftNoise),
        );
        this.cellsQuadTree = quadtree(
            this.cellsById,
            (cell) => cell.position.x,
            (cell) => cell.position.y,
        );

        console.time("assignPlates");
        const { plateIdByCellId, platesById } = assignPlates(
            Math.ceil(this.activeCellIds.length / config.TARGET_CELLS_PER_PLATE),
            this,
        );
        console.timeEnd("assignPlates");
        this.plateIdByCellId = plateIdByCellId;
        this.platesById = platesById;
    }

    getCellAtPosition(position: Vector2): TerrainCell | null {
        const cellId = this.activeCellIds.find((cellId) =>
            position.isInPolygon(this.cellsById[cellId].polygon),
        );
        return cellId == null ? null : this.cellsById[cellId];
    }

    smoothCellsBasedOnPlateHeight() {
        const noise = mapNoise2d(
            config.CELL_SMOOTH_NOISE_SCALE,
            config.CELL_SMOOTH_MIN_RADIUS,
            config.CELL_SMOOTH_MAX_RADIUS,
            makeFractalNoise2d(4),
        );
        for (const cellId of this.activeCellIds) {
            const cell = this.cellsById[cellId];
            const nearbyCellRadius = noise(cell.position.x, cell.position.y);
            const nearbyCells = cell.findConnectedCellsInRadius(nearbyCellRadius);

            const sumPlateHeight = nearbyCells.reduce(
                (sum, nearbyCell) => sum + nearbyCell.getPlate().baseHeight,
                0,
            );
            const averagePlateHeight = sumPlateHeight / nearbyCells.length;

            const plateHeightAdjustment = averagePlateHeight - cell.getPlate().baseHeight;

            cell.adjustHeight(plateHeightAdjustment);
        }
    }

    calculateDriftHeightOffsets() {
        for (const plate of this.platesById) {
            plate.calculateDriftHeightOffsets();
        }
    }

    propagateTectonicDrift() {
        for (const cellId of this.activeCellIds) {
            this.cellsById[cellId].propagateTectonicDrift();
        }
    }
}
