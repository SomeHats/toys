import { canvas, width, height } from "@/resources/canvas";
import createTriangleGrid, { Triangle } from "@/lib/createTriangleGrid";
import QuadTree from "@/lib/QuadTree";
import AABB from "@/lib/geom/AABB";
import Vector2 from "@/lib/geom/Vector2";
import Circle from "@/lib/geom/Circle";

const TILE_SIZE = 30;

const triangles = createTriangleGrid(TILE_SIZE, width, height);
const triangleQuadTree = new QuadTree<Triangle>(
    new AABB(
        new Vector2(-TILE_SIZE, -TILE_SIZE),
        new Vector2(width + TILE_SIZE, height + TILE_SIZE),
    ),
    (triangle) => triangle.center,
);
for (const triangle of triangles.values()) {
    triangleQuadTree.insert(triangle);
}

const items = triangleQuadTree.findItemsInRect(
    new AABB(new Vector2(100, 100), new Vector2(200, 200)),
    // Circle.create(width * 0.75, height * 0.35, TILE_SIZE * 8),
);

console.log(items);

for (const wood of items) {
    // canvas.polygon(wood.points, {} });
    canvas.debugPolygon(wood.points);
}

// for (const triangle of triangles.values()) {
//   console.log(triangle);
// }
