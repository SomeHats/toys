import { Delaunay } from "./Delaunay";
import { TerrainCell } from "./TerrainCell";
import Vector2, { ReadonlyVector2 } from "./Vector2";
import { times, sample, removeFromArray } from "./utils";
import RandomQueue from "./RandomQueue";
import { AABB } from "./AABB";
import { TectonicPlate } from "./TectonicPlate";

function assignPlates(plateCount: number, terrain: Terrain) {
  const remainingCellIds = new Set(terrain.activeCellIds);
  const queue = new RandomQueue(terrain.activeCellIds);
  const plateIdByCellId: Array<number> = new Array(
    terrain.activeCellIds.length
  );
  let i = 0;

  const plates = times(plateCount, id => {
    const initialCellId = queue.pop();
    remainingCellIds.delete(initialCellId);
    plateIdByCellId[initialCellId] = id;
    return {
      activeCellIds: new RandomQueue([initialCellId]),
      allCellIds: new Set([initialCellId]),
      id
    };
  });

  const activePlates = plates.slice();

  while (remainingCellIds.size > 0) {
    let plate = sample(activePlates);
    if (!plate) {
      break;
    }

    // i++;
    // if (i > 100) {
    //   debugger;
    // }

    while (plate.activeCellIds.size) {
      const activeCellId = plate.activeCellIds.pop();
      const remainingNeighbourIds = terrain.cellsById[
        activeCellId
      ].neighbourCellIds.filter(neighbourId =>
        remainingCellIds.has(neighbourId)
      );

      if (remainingNeighbourIds.length) {
        const newCellId = sample(remainingNeighbourIds);
        remainingCellIds.delete(newCellId);
        plate.activeCellIds.add(newCellId);
        plate.allCellIds.add(newCellId);
        plateIdByCellId[newCellId] = plate.id;
        if (remainingNeighbourIds.length > 1) {
          plate.activeCellIds.add(activeCellId);
        }
        break;
      }
    }

    if (!plate.activeCellIds.size) {
      removeFromArray(activePlates, plate);
    }
  }

  return {
    plateIdByCellId,
    plates: plates.map(
      ({ id, allCellIds }) =>
        new TectonicPlate(id, terrain, Array.from(allCellIds), plateIdByCellId)
    )
  };
}

export default class Terrain {
  public readonly isActiveByCellId: Array<boolean>;
  public readonly activeCellIds: Array<number>;
  public readonly allCellIds: Array<number>;
  public readonly cellsById: Array<TerrainCell>;
  public readonly plateIdByCellId: Array<number>;
  public readonly plates: Array<TectonicPlate>;

  constructor(
    delaunay: Delaunay,
    activeBounds: AABB,
    targetCellsPerPlate: number
  ) {
    this.allCellIds = delaunay.points.map((p, i) => i);
    this.isActiveByCellId = delaunay.points.map(point =>
      activeBounds.contains(point)
    );
    this.activeCellIds = this.allCellIds.filter(
      id => this.isActiveByCellId[id]
    );

    this.cellsById = delaunay.cellsByPointId.map(
      (cell, cellId) => new TerrainCell(cellId, cell, this)
    );

    console.time("assignPlates");
    const { plateIdByCellId, plates } = assignPlates(
      Math.ceil(this.activeCellIds.length / targetCellsPerPlate),
      this
    );
    console.timeEnd("assignPlates");
    this.plateIdByCellId = plateIdByCellId;
    this.plates = plates;
  }

  getCellAtPosition(position: Vector2): TerrainCell | null {
    const cellId = this.activeCellIds.find(cellId =>
      position.isInPolygon(this.cellsById[cellId].polygon)
    );
    return cellId == null ? null : this.cellsById[cellId];
  }
}
