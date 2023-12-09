import RandomQueue from "@/lib/RandomQueue";
import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { random } from "@/lib/utils";
import { Grid2 } from "@/terrain/Grid2";

export function generatePoisson(
    bounds: AABB,
    minimumDistance: number,
    pointCount: number,
): Vector2[] {
    const boundsAtZero = new AABB(Vector2.ZERO, bounds.size);
    const cellSize = minimumDistance / Math.SQRT2;

    const grid = new Grid2<Vector2>(bounds.size.div(cellSize).ceil());
    const processList = new RandomQueue<Vector2>();
    const samplePoints = [];

    const firstPoint = new Vector2(
        random(bounds.size.x),
        random(bounds.size.y),
    );
    processList.add(firstPoint);
    samplePoints.push(firstPoint.add(bounds.origin));

    while (processList.size) {
        const point = processList.pop();

        for (let i = 0; i < pointCount; i++) {
            const newPoint = generateRandomPointAround(point, minimumDistance);

            if (
                boundsAtZero.contains(newPoint) &&
                !isInNeighbourhood(grid, newPoint, minimumDistance, cellSize)
            ) {
                processList.add(newPoint);
                samplePoints.push(newPoint.add(bounds.origin));
                grid.set(grid.vectorToGridCoords(newPoint, cellSize), newPoint);
            }
        }
    }

    return samplePoints;
}

function generateRandomPointAround(
    point: Vector2,
    minimumDistance: number,
): Vector2 {
    const radius = random(minimumDistance, 2 * minimumDistance);
    const angle = random(Math.PI * 2);
    return Vector2.fromPolar(angle, radius).add(point);
}

function isInNeighbourhood(
    grid: Grid2<Vector2>,
    point: Vector2,
    minimumDistance: number,
    cellSize: number,
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
