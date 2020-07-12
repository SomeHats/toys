import { assert } from '../lib/assert';
import { generatePoisson } from './generatePoisson';
import AABB from '../lib/geom/AABB';
import Vector2 from '../lib/geom/Vector2';
import { Delaunay } from './Delaunay';
import { random } from '../lib/utils';
import Terrain from './Terrain';
import { width, height, canvas, ctx } from './canvas';
import * as config from './config';
import { interpolateMagma } from 'd3-scale-chromatic';
import create3dRenderer from './create3dRenderer';

const spaceVec = new Vector2(config.POINT_SPACING, config.POINT_SPACING);
const sizeVec = new Vector2(config.SIZE, config.SIZE);
const baseBounds = new AABB(Vector2.ZERO, sizeVec);
const expandedBounds = new AABB(
  spaceVec.negate(),
  sizeVec.add(spaceVec).add(spaceVec),
);
const contractedBounds = new AABB(
  spaceVec,
  sizeVec.sub(spaceVec).sub(spaceVec),
);
const activeBounds = baseBounds;

console.time('generatePoisson');
const points = generatePoisson(expandedBounds, config.POINT_SPACING, 15);
console.timeEnd('generatePoisson');

const delaunay = new Delaunay(points);
console.log(delaunay);
const terrain = new Terrain(delaunay, activeBounds);
Object.assign(window, { delaunay, terrain });

function drawDebugTriangles(color = 'yellow') {
  canvas.beginPath();
  delaunay.forEachTriangleEdge((pointIdA, pointIdB) => {
    canvas.moveTo(terrain.cellsById[pointIdA].position);
    canvas.lineTo(terrain.cellsById[pointIdB].position);
  });
  canvas.debugStroke(color);
}

function drawDebugPolygons(color = 'cyan') {
  canvas.beginPath();
  delaunay.forEachPolygonEdge((p1, p2) => {
    canvas.moveTo(p1);
    canvas.lineTo(p2);
  });
  canvas.debugStroke(color);
}

function drawDebugPoints(color = 'magenta') {
  for (const cellId of terrain.allCellIds) {
    canvas.debugPointX(terrain.cellsById[cellId].position, {
      label: String(cellId),
      color: terrain.isActiveByCellId[cellId] ? 'lime' : 'red',
    });
  }
}

function drawDebug() {
  drawDebugPolygons();
  drawDebugTriangles();
  drawDebugPoints();
}

function drawPolygons() {
  console.time('draw polygons');
  for (const pointId of terrain.allCellIds) {
    const { polygon } = terrain.cellsById[pointId];
    canvas.debugPolygon(polygon, { color: 'cyan' });
  }
  console.timeEnd('draw polygons');
}

function drawPlates(shouldIncludeDrift = true) {
  for (const cellId of terrain.activeCellIds) {
    const cell = terrain.cellsById[cellId];
    // cell.propagateTectonicDrift();
    // canvas.polygon(cell.polygon, {
    //   fill: interpolateMagma(cell.totalDriftPressure ** (1 / 2) * 0.5)
    // });
    canvas.polygon(cell.polygon, {
      fill: cell.getColor(shouldIncludeDrift),
      stroke: cell.getColor(shouldIncludeDrift),
      strokeWidth: 1,
    });
  }
  for (const plate of terrain.platesById) {
    // canvas.polygon(plate.polygon, {
    //   stroke: "red",
    //   strokeWidth: 1
    // });
    for (const cellId of plate.edgeCellIds) {
      const cell = terrain.cellsById[cellId];

      // cell.propagateTectonicDrift();
      // canvas.debugVectorAtPoint(
      //   plate.drift.cloneMutable().scale(15),
      //   cell.position,
      //   { color: "cyan" }
      // );
    }
  }
}

console.time('terrain.smoothCellsBasedOnPlateHeight');
terrain.smoothCellsBasedOnPlateHeight();
console.timeEnd('terrain.smoothCellsBasedOnPlateHeight');

console.time('propagateTectonicDrift');
terrain.propagateTectonicDrift();
console.timeEnd('propagateTectonicDrift');

// terrain.calculateDriftHeightOffsets();

// drawDebug();
// drawPolygons();
drawPlates();

// window.addEventListener("mousemove", e => {
//   ctx.clearRect(0, 0, width, height);

//   const mousePosition = new Vector2(e.clientX, e.clientY);
//   const cell = terrain.getCellAtPosition(mousePosition);

//   // drawPolygons();
//   // drawDebug();
//   drawPlates();

//   if (cell) {
//     canvas.debugVectorAtPoint(
//       cell
//         .getPlate()
//         .drift.cloneMutable()
//         .scale(15),
//       cell.position,
//       {
//         color: "cyan"
//       }
//     );
//   }
// });

let renderStage = 0;
window.addEventListener('click', e => {
  ctx.clearRect(0, 0, config.SIZE, config.SIZE);

  // const mousePosition = new Vector2(e.clientX, e.clientY);
  // const cell = terrain.getCellAtPosition(mousePosition);

  renderStage = (renderStage + 1) % 4;
  if (renderStage === 0) {
    drawPlates();
  } else if (renderStage === 1) {
    drawPlates(false);
  } else if (renderStage === 2) {
    for (const cellId of terrain.activeCellIds) {
      const cell = terrain.cellsById[cellId];
      canvas.polygon(cell.polygon, {
        fill: interpolateMagma(cell.getHeightFromDriftPressure()),
      });
    }
  } else {
    for (const cellId of terrain.activeCellIds) {
      const cell = terrain.cellsById[cellId];
      canvas.polygon(cell.polygon, { stroke: 'cyan', strokeWidth: 0.1 });
    }

    let i = 0;
    for (const plate of terrain.platesById) {
      canvas.polygon(plate.polygon, {
        stroke: 'red',
        strokeWidth: 1,
      });
      for (const cellId of plate.edgeCellIds) {
        const cell = terrain.cellsById[cellId];

        i++;
        if (i % 3 === 0) {
          canvas.debugVectorAtPoint(plate.drift.scale(15), cell.position, {
            color: 'white',
          });
        }
      }
    }
  }

  // drawPolygons();
  // drawDebug();

  // if (cell) {
  // canvas.debugPointO(cell.position, {
  //   color: "magenta",
  //   label: `Cell ${cell.id}`
  // });
  // debugger;
  // }
  // drawPlates();
});

create3dRenderer(terrain, delaunay);
