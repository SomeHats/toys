import Scene from "../lib/scene/Scene";
import { assert } from "../lib/assert";
import Vector2 from "../lib/geom/Vector2";
import Entity from "../lib/scene/Entity";
import { PalTargetController } from "./PalController";
import PalGeom from "./PalGeom";
import PalRenderer from "./PalRenderer";
import PalWalkAnimationController from "./PalWalkAnimationController";
import { generateRandomPalConfig } from "./PalConfig";

const root = document.getElementById("root");
assert(root);

const scene = new Scene(800, 600, window.devicePixelRatio);
scene.appendTo(root);

// const pal = new Pal(100, 50);
const pal = new Entity();
pal.addComponent(PalTargetController, new Vector2(100, 50));
const config = generateRandomPalConfig();
const geom = pal.addComponent(PalGeom, config);
geom.setAnimationController(new PalWalkAnimationController(config));
pal.addComponent(PalRenderer, config);
scene.addChild(pal);

root.addEventListener("mousemove", (e) => {
    const x = e.clientX - scene.canvas.offsetLeft;
    const y = e.clientY - scene.canvas.offsetTop;
    pal.getComponent(PalTargetController).setTarget(new Vector2(x - 50, y));
});

scene.start();

// const scenario5 = () => {
//   const pal = new Pal(100, 50);
//   scene.addChild(pal);

//   const root = document.getElementById('root');
//   invariant(root, '#root must be present');

//   root.addEventListener('mousemove', e => {
//     pal.setTarget(e.offsetX / scene.scaleFactor, e.offsetY / scene.scaleFactor);
//   });
// };

// const go = () => {
//   if (window.scene) return;
//   scene = new Scene(800, 600, window.devicePixelRatio);
//   window.scene = scene;
//   const root = document.getElementById('root');
//   invariant(root, '#root must be present');
//   scene.appendTo(root);

//   scene.addSystem(new DebugOverlay());
//   scene.addSystem(new TravellerFinder());

//   scenario3();

//   scene.start();
// };
