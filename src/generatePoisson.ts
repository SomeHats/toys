import Vector2 from "./Vector2";
import { rand } from "./utils";
import RandomQueue from "./RandomQueue";
import { Grid2 } from "./Grid2";
import { AABB } from "./AABB";

export function generatePoisson(
  bounds: AABB,
  minimumDistance: number,
  pointCount: number
): Array<Vector2> {
  const boundsAtZero = new AABB(Vector2.ZERO, bounds.size);
  const cellSize = minimumDistance / Math.SQRT2;

  const grid = new Grid2<Vector2>(
    bounds.size
      .cloneMutable()
      .div(cellSize)
      .ceil()
  );
  const processList = new RandomQueue<Vector2>();
  const samplePoints = [];

  const firstPoint = new Vector2(rand(bounds.size.x), rand(bounds.size.y));
  processList.add(firstPoint);
  samplePoints.push(firstPoint.cloneMutable().add(bounds.origin));

  while (processList.size) {
    const point = processList.pop();

    for (let i = 0; i < pointCount; i++) {
      const newPoint = generateRandomPointAround(point, minimumDistance);

      if (
        boundsAtZero.contains(newPoint) &&
        !isInNeighbourhood(grid, newPoint, minimumDistance, cellSize)
      ) {
        processList.add(newPoint);
        samplePoints.push(newPoint.cloneMutable().add(bounds.origin));
        grid.set(grid.vectorToGridCoords(newPoint, cellSize), newPoint);
      }
    }
  }

  return samplePoints;
}

function generateRandomPointAround(
  point: Vector2,
  minimumDistance: number
): Vector2 {
  const radius = rand(minimumDistance, 2 * minimumDistance);
  const angle = rand(Math.PI * 2);
  return Vector2.fromPolar(angle, radius).add(point);
}

function isInNeighbourhood(
  grid: Grid2<Vector2>,
  point: Vector2,
  minimumDistance: number,
  cellSize: number
): boolean {
  const gridPoint = grid.vectorToGridCoords(point, cellSize);

  const cellsAroundPoint = grid.squareAroundCell(gridPoint, 5);
  for (const cell of cellsAroundPoint) {
    const pointInCell = grid.get(cell);
    if (pointInCell && pointInCell.distanceTo(point) < minimumDistance) {
      return true;
    }
  }

  return false;
}
