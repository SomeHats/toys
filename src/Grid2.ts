import Vector2, { ReadonlyVector2 } from "./Vector2";
import { times } from "./utils";

export class Grid2<T> {
  public size: ReadonlyVector2;
  private rows: Array<Array<T | undefined>>;

  constructor(size: Vector2) {
    this.size = size
      .cloneMutable()
      .floor()
      .cloneReadonly();
    this.rows = times(this.size.y, () => times(this.size.y, () => undefined));
  }

  areCoordsInBounds(coords: Vector2): boolean {
    return (
      0 <= coords.x &&
      coords.x < this.size.x &&
      0 <= coords.y &&
      coords.y < this.size.y
    );
  }

  vectorToGridCoords(vector: ReadonlyVector2, cellSize: number): Vector2 {
    return vector
      .cloneMutable()
      .div(cellSize)
      .floor();
  }

  get({ x, y }: ReadonlyVector2): T | undefined {
    return this.rows[y][x];
  }

  set({ x, y }: ReadonlyVector2, item: T | undefined) {
    this.rows[y][x] = item;
  }

  squareAroundCell(cell: ReadonlyVector2, size: number): Array<Vector2> {
    const result = [];

    const squareOrigin = cell
      .cloneMutable()
      .sub(new Vector2(size, size).div(2))
      .round();

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
