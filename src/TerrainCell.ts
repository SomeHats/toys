import { ReadonlyVector2 } from "./Vector2";
import { DelaunayCell } from "./Delaunay";
import Terrain from "./Terrain";
import { fromEntries, compact } from "./utils";

export class TerrainCell {
  public readonly position: ReadonlyVector2;
  public readonly neighbourCellIds: ReadonlyArray<number>;
  public readonly neighbourCellIdsByEdgeIndex: ReadonlyArray<number | null>;
  public readonly edgeIndexByNeighbourCellId: {
    [cellId: number]: number | undefined;
  };
  public readonly polygon: ReadonlyArray<ReadonlyVector2>;

  constructor(
    public readonly id: number,
    cell: DelaunayCell,
    private readonly terrain: Terrain
  ) {
    this.polygon = cell.map(edge => edge.leadingPoint);

    this.position = ReadonlyVector2.average(this.polygon);

    this.neighbourCellIdsByEdgeIndex = cell
      .map(edge => edge.neighbourCellId)
      .map(id => (terrain.isActiveByCellId[id] ? id : null));

    this.neighbourCellIds = compact(this.neighbourCellIdsByEdgeIndex);

    this.edgeIndexByNeighbourCellId = fromEntries(
      compact(
        this.neighbourCellIdsByEdgeIndex.map((cellId, edgeIndex) =>
          cellId !== null ? [cellId, edgeIndex] : null
        )
      )
    );
  }

  *iterateEdgesStartingFromIndex(startIndex: number): IterableIterator<number> {
    for (let i = 0; i < this.polygon.length; i++) {
      yield (startIndex + i) % this.polygon.length;
    }
  }
}
