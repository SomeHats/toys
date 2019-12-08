import { rand, mapRange, wait } from "./utils";
import Terrain from "./Terrain";
import { interpolateSpectral } from "d3-scale-chromatic";
import { ReadonlyVector2 } from "./Vector2";

function findPlateEdges(
  currentPlateId: number,
  terrain: Terrain,
  cellIds: ReadonlyArray<number>,
  plateIdByCellId: ReadonlyArray<number>
): { edgeCellIds: Set<number>; polygon: Array<ReadonlyVector2> } {
  const isNeighbourCellIdInOtherPlate = (neighbourCellId: number | null) =>
    neighbourCellId === null ||
    plateIdByCellId[neighbourCellId] !== currentPlateId;

  const startingEdgeCellId = cellIds.find(cellId =>
    terrain.cellsById[cellId].neighbourCellIdsByEdgeIndex.some(
      isNeighbourCellIdInOtherPlate
    )
  );
  if (startingEdgeCellId == null) {
    throw new Error(`startingEdgeCellId must exist`);
  }

  const edgeCellIds = new Set<number>();
  const polygonSet = new Set<ReadonlyVector2>();

  const startingEdgeCell = terrain.cellsById[startingEdgeCellId];
  const startingEdgeCellStartingEdgeIndex = startingEdgeCell.neighbourCellIdsByEdgeIndex.findIndex(
    isNeighbourCellIdInOtherPlate
  );
  if (startingEdgeCellStartingEdgeIndex === -1) {
    throw new Error("startingEdgeCellStartingEdgeIndex must exist");
  }

  let currentCell = startingEdgeCell;
  let currentEdgeIndexInCell = startingEdgeCellStartingEdgeIndex;
  let lastPolygonPoint: ReadonlyVector2 | null = null;
  let i = 0;
  while (i < 1000) {
    i++;

    edgeCellIds.add(currentCell.id);
    const currentCellAtStartOfEdgeIteration = currentCell;
    for (const edgeIndex of currentCell.iterateEdgesStartingFromIndex(
      currentEdgeIndexInCell
    )) {
      const neighbourCellId =
        currentCell.neighbourCellIdsByEdgeIndex[edgeIndex];

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
        const nextCellStartEdgeIndex = nextCell.polygon.findIndex(point =>
          lastPolygonPoint!.equals(point)
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
  public readonly baseHeight = rand(-0.5, 0.5);
  public readonly edgeCellIds: ReadonlySet<number>;
  public readonly polygon: ReadonlyArray<ReadonlyVector2>;

  constructor(
    public readonly id: number,
    private readonly terrain: Terrain,
    public readonly cellIds: ReadonlyArray<number>,
    plateIdByCellId: ReadonlyArray<number>
  ) {
    console.time("plate.findPlateEdges");
    const plateEdges = findPlateEdges(id, terrain, cellIds, plateIdByCellId);
    this.edgeCellIds = plateEdges.edgeCellIds;
    this.polygon = plateEdges.polygon;
    console.timeEnd("plate.findPlateEdges");
  }

  get color(): string {
    return interpolateSpectral(mapRange(-1, 1, 0, 1, this.baseHeight));
  }
}
