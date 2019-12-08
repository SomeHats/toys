import { ReadonlyVector2 } from "./Vector2";
import { TerrainCell } from "./TerrainCell";

export class TerrainCellEdge {
  constructor(
    public readonly pointA: ReadonlyVector2,
    public readonly pointB: ReadonlyVector2,
    public readonly cellA: TerrainCell,
    public readonly cellB: TerrainCell
  ) {}
}
