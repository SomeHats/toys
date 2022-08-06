import * as T from "three";
import { frame, mapRange } from "@/lib/utils";
import Terrain from "@/terrain/Terrain";
import { POINT_SPACING, SIZE } from "@/terrain/config";
import { Delaunay } from "@/terrain/Delaunay";
import { canvasEl } from "@/terrain/canvas";
import Vector2 from "@/lib/geom/Vector2";

function create3dRenderer(terrain: Terrain, delaunay: Delaunay) {
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    const renderer = new T.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    // Object.assign(renderer.domElement.style, {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    // });

    const geometry = new T.BufferGeometry();

    const vertexIndexByCellId = {} as Record<number, number>;
    const seaLevelAdjust = 0 - terrain.cellsById[0].getSeaLevel();
    const adjustZ = (z: number) => {
        z += seaLevelAdjust;
        return z ** 1.3 * 30;
    };
    const allPoints: Array<T.Vector3> = [];
    const addTriangle = (a: T.Vector3, b: T.Vector3, c: T.Vector3, color: string) => {
        a.setX(SIZE / 2 - a.x);
        a.setY(-(SIZE / 2 - a.y));
        a.setZ(adjustZ(a.z));
        b.setX(SIZE / 2 - b.x);
        b.setY(-(SIZE / 2 - b.y));
        b.setZ(adjustZ(b.z));
        c.setX(SIZE / 2 - c.x);
        c.setY(-(SIZE / 2 - c.y));
        c.setZ(adjustZ(c.z));
        // TODO: fixme
        // const vBase = geometry.vertices.length;
        // geometry.vertices.push(a, b, c);
        // const face = new T.Face3(vBase, vBase + 1, vBase + 2);
        // face.color = new T.Color(color);
        // geometry.faces.push(face);
    };
    console.time("addTriangles");
    for (const cellId of terrain.activeCellIds) {
        const cell = terrain.cellsById[cellId];
        for (const edgeIndex of cell.iterateEdgesStartingFromIndex(0)) {
            const nextEdgeIndex = (edgeIndex + 1) % cell.polygon.length;
            const nextNextEdgeIndex = (nextEdgeIndex + 1) % cell.polygon.length;
            const neighbourId1 = cell.neighbourCellIdsByEdgeIndex[edgeIndex];
            const neighbourId2 = cell.neighbourCellIdsByEdgeIndex[nextEdgeIndex];
            const neighbourId3 = cell.neighbourCellIdsByEdgeIndex[nextNextEdgeIndex];
            if (neighbourId1 !== null && neighbourId2 !== null && neighbourId3 !== null) {
                const neighbour1 = terrain.cellsById[neighbourId1];
                const neighbour2 = terrain.cellsById[neighbourId2];
                const neighbour3 = terrain.cellsById[neighbourId3];

                const cellHeight = cell.get3dHeight();
                const neighbour1Height = neighbour1.get3dHeight();
                const neighbour2Height = neighbour2.get3dHeight();
                const neighbour3Height = neighbour3.get3dHeight();

                addTriangle(
                    new T.Vector3(cell.position.x, cell.position.y, cell.get3dHeight()),
                    new T.Vector3(
                        cell.polygon[nextEdgeIndex].x,
                        cell.polygon[nextEdgeIndex].y,
                        (cellHeight + neighbour2Height + neighbour3Height) / 3,
                    ),
                    new T.Vector3(
                        cell.polygon[edgeIndex].x,
                        cell.polygon[edgeIndex].y,
                        (cellHeight + neighbour1Height + neighbour2Height) / 3,
                    ),
                    cell.getColor(),
                );
            }
        }

        // vertexIndexByCellId[cellId] = geometry.vertices.length;
        // const height = mapRange(-1, 1, 0, 1, cell.get3dHeight());
        // geometry.vertices.push(
        //   new T.Vector3(
        //     SIZE / 2 - cell.position.x,
        //     -(SIZE / 2 - cell.position.y),
        //     // 0
        //     height * height * 50
        //   )
        // );
    }
    console.timeEnd("addTriangles");

    // const triangles = delaunay.delaunator.triangles;
    // for (let tId = 0; tId < triangles.length; tId += 3) {
    //   const cellId1 = triangles[tId];
    //   const cellId2 = triangles[tId + 1];
    //   const cellId3 = triangles[tId + 2];

    //   if (
    //     terrain.isActiveByCellId[cellId1] &&
    //     terrain.isActiveByCellId[cellId2] &&
    //     terrain.isActiveByCellId[cellId3]
    //   ) {
    //     const face = new T.Face3(
    //       vertexIndexByCellId[cellId1],
    //       vertexIndexByCellId[cellId2],
    //       vertexIndexByCellId[cellId3]
    //     );
    //     // face.color = new T.Color(Math.floor(Math.random() * 0xffffff));
    //     face.vertexColors = [
    //       new T.Color(terrain.cellsById[cellId1].getColor()),
    //       new T.Color(terrain.cellsById[cellId2].getColor()),
    //       new T.Color(terrain.cellsById[cellId3].getColor())
    //     ];
    //     geometry.faces.push(face);
    //   }
    // }

    console.time("normals");
    geometry.computeVertexNormals();
    console.timeEnd("normals");

    // const material = new T.MeshNormalMaterial();
    // const material = new T.MeshBasicMaterial({
    //   vertexColors: T.VertexColors
    // });
    // material.map = new T.CanvasTexture(canvasEl);
    const material = new T.MeshPhongMaterial({
        shininess: 0,
        // TODO: fixme
        // vertexColors: T.FaceColors,
    });
    material.flatShading = true;
    const cube = new T.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new T.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new T.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.x = 0.5;
    scene.add(directionalLight);

    camera.position.z = new Vector2(SIZE, SIZE).magnitude * 0.4;
    // camera.position.z = 700;
    // camera.position.x = window.innerWidth / 2;
    // camera.position.y = -window.innerHeight / 2;
    cube.rotation.x = -0.8;
    cube.position.y = 300;

    const startRenderLoopAsync = async () => {
        while (true) {
            // cube.rotation.x += 0.01;
            cube.rotation.z += 0.002;
            // cube.rotat;
            renderer.render(scene, camera);
            await frame();
        }
    };

    startRenderLoopAsync();

    document.addEventListener("mousemove", (e) => {
        cube.rotation.x = mapRange(0, window.innerHeight, -0.4, -1.5, e.clientY);
    });
}

export default create3dRenderer;
