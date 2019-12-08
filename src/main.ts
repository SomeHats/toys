import { assert } from "./assert";
import { generatePoisson } from "./generatePoisson";
import { AABB } from "./AABB";
import Vector2, { ReadonlyVector2 } from "./Vector2";
import { Delaunay } from "./Delaunay";
import { rand } from "./utils";
import Terrain from "./Terrain";
import { width, height, canvas } from "./canvas";

const POINT_SPACING = 20;
const TARGET_CELLS_PER_PLATE = 300;

const spaceVec = new Vector2(POINT_SPACING, POINT_SPACING);
const sizeVec = new Vector2(width, height);
const baseBounds = new AABB(Vector2.ZERO, sizeVec);
const expandedBounds = new AABB(
  spaceVec.cloneMutable().negate(),
  sizeVec
    .cloneMutable()
    .add(spaceVec)
    .add(spaceVec)
);
const contractedBounds = new AABB(
  spaceVec,
  sizeVec
    .cloneMutable()
    .sub(spaceVec)
    .sub(spaceVec)
);
const activeBounds = baseBounds;

console.time("generatePoisson");
const points = generatePoisson(expandedBounds, POINT_SPACING, 15);
console.timeEnd("generatePoisson");

const delaunay = new Delaunay(points);
console.log(delaunay);
const terrain = new Terrain(delaunay, activeBounds, TARGET_CELLS_PER_PLATE);
Object.assign(window, { delaunay, terrain });

function drawDebugTriangles(color = "yellow") {
  canvas.beginPath();
  delaunay.forEachTriangleEdge((pointIdA, pointIdB) => {
    canvas.moveTo(terrain.cellsById[pointIdA].position);
    canvas.lineTo(terrain.cellsById[pointIdB].position);
  });
  canvas.debugStroke(color);
}

function drawDebugPolygons(color = "cyan") {
  canvas.beginPath();
  delaunay.forEachPolygonEdge((p1, p2) => {
    canvas.moveTo(p1);
    canvas.lineTo(p2);
  });
  canvas.debugStroke(color);
}

function drawDebugPoints(color = "magenta") {
  for (const cellId of terrain.allCellIds) {
    canvas.debugPointX(terrain.cellsById[cellId].position, {
      label: String(cellId),
      color: terrain.isActiveByCellId[cellId] ? "lime" : "red"
    });
  }
}

function drawDebug() {
  drawDebugPolygons();
  drawDebugTriangles();
  drawDebugPoints();
}

function drawPolygons() {
  console.time("draw polygons");
  for (const pointId of terrain.allCellIds) {
    const { polygon } = terrain.cellsById[pointId];
    canvas.debugPolygon(polygon, { color: "cyan" });
  }
  console.timeEnd("draw polygons");
}

function drawPlates() {
  for (const plate of terrain.plates) {
    canvas.polygon(plate.polygon, {
      fill: plate.color,
      stroke: "red",
      strokeWidth: 1
    });
  }
}

// drawDebug();
drawPolygons();
drawPlates();

// window.addEventListener("mousemove", e => {
//   ctx.clearRect(0, 0, width, height);

//   const mousePosition = new Vector2(e.clientX, e.clientY);
//   const cell = terrain.getCellAtPosition(mousePosition);

//   drawPolygons();
//   // drawDebug();
//   drawPlates();

//   if (cell) {
//     canvas.debugPointO(cell.position, {
//       color: "magenta",
//       label: `Cell ${cell.id}`
//     });

//     // const neighbours = cell.neighbourCellIds.map(id => terrain.cellsById[id]);
//     // for (const neighbour of neighbours) {
//     //   canvas.debugArrow(cell.position, neighbour.position, {
//     //     color: "magenta",
//     //     label: `Neighbour: ${neighbour.id}`
//     //   });
//     // }

//     for (const edgeIndex of cell.iterateEdgesStartingFromIndex(0)) {
//       canvas.debugPointX(cell.polygon[edgeIndex], { label: `E ${edgeIndex}` });
//     }
//   }
// });
