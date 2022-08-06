import Vector2 from "@/lib/geom/Vector2";
import { TerrainCell } from "@/terrain/TerrainCell";

export class TerrainCellEdge {
    constructor(
        public readonly pointA: Vector2,
        public readonly pointB: Vector2,
        public readonly cellA: TerrainCell,
        public readonly cellB: TerrainCell,
    ) {}
}
