import { canvas, width, height } from "./canvas";
import Vector2 from "../lib/geom/Vector2";
import {
    compact,
    getId,
    sample,
    shuffle,
    times,
    randomInt,
    frameLoop,
    uniq,
    random,
} from "../lib/utils";
import createTriangleGrid, { Triangle } from "../lib/createTriangleGrid";
import { assert } from "../lib/assert";
import { SNAKES, BG } from "./colors";
import { schemePaired } from "d3-scale-chromatic";

const TILE_SIZE = 50;
const ARC_LENGTH = (Math.PI * TILE_SIZE) / 6;

const trianglesById = createTriangleGrid(TILE_SIZE, width, height);

// for (const triangle of trianglesById.values()) {
//   canvas.debugPolygon(triangle.points, { color: 'lime' });
// }

type Palatte = {
    palette: Array<string>;
    current(): string;
    next(): string;
    reset(idx?: number): void;
};
const makeColorPalette = (): Palatte => {
    const palette = times(randomInt(2, 6), () => sample(SNAKES).string());
    if (uniq(palette).length === 1) return makeColorPalette();

    let i = 0;
    return {
        palette,
        current: () => {
            return palette[i % palette.length];
        },
        next: () => {
            i++;
            return palette[i % palette.length];
        },
        reset: (idx = 0) => {
            i = idx;
        },
    };
};

function getSharedPoints(a: Triangle, b: Triangle) {
    const neighbour = a.neighbours.find((n) => n.triangle === b);
    assert(neighbour, "must be a neighbour");
    return neighbour.sharedPoints;
}

const occupied = new Set<Triangle>();
type Snake = {
    triangles: Array<Triangle>;
    palette: ReturnType<typeof makeColorPalette>;
    speed: number;
    base: number;
    offset: number;
    length: number;
    isDead: boolean;
};

const makeSnake = () => {
    const triangles: Array<Triangle> = [];
    const palette = makeColorPalette();
    let neighbours = [...trianglesById.values()];
    for (let i = 0; i < 2; i++) {
        const availableNeighbours = neighbours.filter((neighbour) => !occupied.has(neighbour));
        if (!availableNeighbours.length) break;
        const triangle = sample(availableNeighbours);
        triangles.push(triangle);
        occupied.add(triangle);
        neighbours = triangle.neighbours.map((n) => n.triangle);
    }

    // if (triangles.length < 2) continue;
    return {
        triangles,
        palette,
        speed: random(0.06, 0.12),
        offset: 0,
        base: 0,
        length: triangles.length,
        isDead: false,
    };
};
const snakes: Snake[] = [];

for (let si = 0; si < 10; si++) {
    snakes.push(makeSnake());
}

frameLoop(() => {
    canvas.clear(BG.string());

    for (const snake of snakes) {
        snake.offset += snake.speed;
        if (snake.offset > 1) {
            snake.offset--;
            snake.base++;

            if (!snake.isDead) {
                const headTriangle = snake.triangles[0];
                const availableNeighbours = headTriangle.neighbours.filter(
                    (neighbour) => !occupied.has(neighbour.triangle),
                );
                if (availableNeighbours.length) {
                    const triangle = sample(availableNeighbours).triangle;
                    occupied.add(triangle);
                    snake.triangles.unshift(triangle);
                    snake.base--;
                    snake.length++;
                } else {
                    snake.isDead = true;
                    snakes.push(makeSnake());
                }
            }

            const lastTriangle = snake.triangles[snake.triangles.length - snake.base];
            if (lastTriangle) {
                occupied.delete(lastTriangle);
                snake.length--;
            }
        }

        const { triangles, palette } = snake;
        palette.reset(snake.base);
        for (let i = 0; i < snake.length; i++) {
            const triangle = triangles[i];
            const last: Triangle | undefined = triangles[i - 1];
            const next: Triangle | undefined = triangles[i + 1];
            const currentColor = palette.current();
            const nextColor = palette.next();

            canvas.beginPath();
            if (!last) {
                continue;
                // assert(next);
                // const neck = Vector2.average(getSharedPoints(triangle, next));
                // const head = triangle.center
                //   .sub(neck)
                //   .withMagnitude(ARC_LENGTH)
                //   .add(neck);
                // canvas.moveTo(head);
                // canvas.lineTo(neck);
            } else if (!next) {
                assert(last);
                canvas.moveTo(Vector2.average(getSharedPoints(triangle, last)));
                canvas.lineTo(triangle.center);
            } else {
                canvas.moveTo(Vector2.average(getSharedPoints(triangle, last)));
                canvas.arcTo(triangle.center, next.center, TILE_SIZE / 2 - 0.5);
            }
            if (!(i === 1 && !snake.isDead)) {
                canvas.stroke({
                    strokeWidth: TILE_SIZE / 2,
                    stroke: currentColor,
                    strokeCap: "round",
                    strokeDash: [ARC_LENGTH, ARC_LENGTH],
                    strokeDashOffset: snake.offset * ARC_LENGTH,
                });
            }
            if (!(i === snake.length - 1 && snake.isDead)) {
                canvas.stroke({
                    strokeWidth: TILE_SIZE / 2,
                    stroke: nextColor,
                    strokeCap: "round",
                    strokeDash: [ARC_LENGTH, ARC_LENGTH],
                    strokeDashOffset: snake.offset * ARC_LENGTH - ARC_LENGTH,
                });
            }
        }
    }
});
