import Vector2 from "@/lib/geom/Vector2";
import { times } from "@/lib/utils";

export class Grid2<T> {
    public size: Vector2;
    private rows: Array<Array<T | undefined>>;

    constructor(size: Vector2) {
        this.size = size.floor();
        this.rows = times(this.size.y, () => times(this.size.y, () => undefined));
    }

    areCoordsInBounds(coords: Vector2): boolean {
        return 0 <= coords.x && coords.x < this.size.x && 0 <= coords.y && coords.y < this.size.y;
    }

    vectorToGridCoords(vector: Vector2, cellSize: number): Vector2 {
        return vector.div(cellSize).floor();
    }

    get({ x, y }: Vector2): T | undefined {
        return this.rows[y][x];
    }

    set({ x, y }: Vector2, item: T | undefined) {
        this.rows[y][x] = item;
    }

    squareAroundCell(cell: Vector2, size: number): Array<Vector2> {
        const result = [];

        const squareOrigin = cell.sub(new Vector2(size, size).div(2)).round();

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const point = new Vector2(x, y).add(squareOrigin);
                if (this.areCoordsInBounds(point)) {
                    result.push(point);
                }
            }
        }

        return result;
    }
}
