import Scene from "../lib/scene/Scene";
import { assert } from "../lib/assert";
import { Plane } from "three";
import Pal from "./Pal";
import Vector2 from "../lib/geom/Vector2";

const root = document.getElementById("root");
assert(root);

const scene = new Scene(800, 600, window.devicePixelRatio);
scene.appendTo(root);

const pal = new Pal(100, 50);
scene.addChild(pal);

root.addEventListener("mousemove", e => {
  const x = e.clientX - scene.canvas.offsetLeft;
  const y = e.clientY - scene.canvas.offsetTop;
  pal.setTarget(new Vector2(x, y));
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
