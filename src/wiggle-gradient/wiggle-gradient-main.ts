import { assert } from "@/lib/assert";
import createTriangleGrid, { Triangle } from "@/lib/createTriangleGrid";
import { sample } from "@/lib/utils";
import { canvas, height, width } from "@/wiggle-gradient/canvas";

const TILE_SIZE = 5;

const trianglesById = createTriangleGrid(TILE_SIZE, width, height);

const occupied = new Set<Triangle>();
type Snake = {
    triangles: Array<Triangle>;
};

const makeSnake = () => {
    const triangles: Array<Triangle> = [];
    let triangle = sample([...trianglesById.values()].filter((t) => !occupied.has(t)));
    // if (!triangle) return;

    // const targetLength = mapRange(
    //   Math.min(width, height) * 0.4,
    //   0,
    //   2,
    //   35,
    //   triangle.center.distanceTo(new Vector2(width / 2, height / 2)),
    // );
    const targetLength = 40;
    let neighbours = [...trianglesById.values()];
    for (let i = 0; i < targetLength; i++) {
        triangles.push(triangle);
        occupied.add(triangle);
        neighbours = triangle.neighbours.map((n) => n.triangle);

        const availableNeighbours = neighbours.filter((neighbour) => !occupied.has(neighbour));
        if (!availableNeighbours.length) break;
        triangle = sample(availableNeighbours);
    }

    // if (triangles.length < 2) continue;
    return {
        triangles,
    };
};
const snakes: Snake[] = [];

const snakeCount = (width / TILE_SIZE) * (height / TILE_SIZE) * 0.01;
console.log({ snakeCount });
for (let si = 0; si < snakeCount; si++) {
    snakes.push(makeSnake());
}

canvas.clear("black");

for (const { triangles } of snakes) {
    canvas.beginPath();
    for (let i = 0; i < triangles.length; i++) {
        const triangle = triangles[i];
        const last: Triangle | undefined = triangles[i - 1];
        const next: Triangle | undefined = triangles[i + 1];

        if (!last) {
            canvas.moveTo(triangle.center);
        } else if (!next) {
            assert(last);
            // canvas.moveTo(Vector2.average(getSharedPoints(triangle, last)));
            canvas.lineTo(triangle.center);
        } else {
            // canvas.moveTo(Vector2.average(getSharedPoints(triangle, last)));
            canvas.arcTo(triangle.center, next.center, TILE_SIZE / 2 - 0.5);
        }
    }
    canvas.stroke({
        strokeWidth: TILE_SIZE / 3 - 0.5,
        stroke: "white",
        strokeCap: "round",
    });
}
