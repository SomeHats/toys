// import { number } from 'prop-types';
import * as React from "react";
// import ReactDOM from 'react-dom';
// import { DebugDraw } from '../lib/DebugDraw';
// import { C } from './C';
// import { TriCoord } from './TriCoord';
// import AABB from '../lib/geom/AABB';
// import { SpriteStack } from './SpriteStack';
// import { assets } from './assets/assets';
// import { Sprite } from './Sprite';
// import Vector2 from '../lib/geom/Vector2';
// import { random } from '../lib/utils';

// class Game {
//   static WIDTH = 800;
//   static HEIGHT = 600;
//   static TRI_SCALE = 40;

//   private size = { width: 1, height: 1, scale: 1 };
//   private elapsedTime = 0;
//   private lastTickTimestamp: number | null = null;
//   private c: C;
//   private d: DebugDraw;

//   private b = new BeeSprite(Vector2.ZERO);

//   constructor(readonly canvas: HTMLCanvasElement) {
//     const ctx = canvas.getContext('2d')!;
//     this.c = new C(ctx);
//     this.d = new DebugDraw(ctx);
//     this.start();
//   }

//   start() {
//     (async () => {
//       await assets.loadAll();
//       this.requestTick();
//     })();
//   }

//   setSize(newSize: { width: number; height: number; scale: number }) {
//     this.size = newSize;
//   }

//   requestTick() {
//     window.requestAnimationFrame((time) => {
//       if (this.lastTickTimestamp) {
//         const dt = time - this.lastTickTimestamp;
//         this.elapsedTime += dt;

//         this.update();
//         this.draw();
//       }
//       this.lastTickTimestamp = time;
//       this.requestTick();
//     });
//   }

//   update() {
//     this.b.update();
//   }

//   draw() {
//     const { c } = this;
//     c.do(() => {
//       c.scale(this.size.scale);
//       c.ctx.clearRect(0, 0, this.size.width, this.size.height);
//       c.ctx.fillRect(0, 0, 10, 10);

//       c.do(() => {
//         c.ctx.translate(this.size.width / 2, this.size.height / 2);
//         c.scale(
//           Math.min(
//             this.size.width / Game.WIDTH,
//             this.size.height / Game.HEIGHT,
//           ),
//         );

//         this.drawWorld();
//       });
//       this.drawUi();
//     });
//   }

//   drawWorld() {
//     // TriCoord.intersectingAABB(
//     //   AABB.fromLeftTopRightBottom(-380, -280, 380, 280),
//     //   Game.TRI_SCALE,
//     // ).forEach((tri) => {
//     //   this.d.debugPointX(tri.center(Game.TRI_SCALE), {
//     //     color: tri.pointsUp() ? 'lime' : 'red',
//     //   });
//     //   if (tri.pointsUp()) {
//     //     this.d.debugPolygon(tri.vertices(Game.TRI_SCALE), { color: 'magenta' });
//     //   }
//     // });

//     // assets
//     //   .get('beeFlyingSpriteStack')
//     //   .draw(this.c, this.elapsedTime / 500, this.elapsedTime);
//     this.b.draw(this.c, this.elapsedTime);
//   }

//   drawUi() {}
// }

// class BeeSprite {
//   heading = 0;
//   timeOffset = random(1000);

//   constructor(public position: Vector2) {}

//   update() {
//     const beeSpeed = 2;
//     this.heading += 0.02;
//     this.position = this.position.add(
//       Vector2.fromPolar(this.heading, beeSpeed),
//     );
//   }

//   draw(c: C, elapsedTime: number) {
//     c.do(() => {
//       c.translate(this.position);
//       assets.get('smallShadow').draw(c, { opacity: 0.3 });
//       assets
//         .get('beeFlyingSpriteStack')
//         .draw(c, this.heading, elapsedTime + this.timeOffset);
//     });
//   }
// }

// function App() {
//   const [size, setSize] = React.useState<{
//     width: number;
//     height: number;
//     scale: number;
//   } | null>(null);
//   React.useEffect(() => {
//     const measure = () => {
//       setSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//         scale: window.devicePixelRatio,
//       });
//     };

//     measure();
//     window.addEventListener('resize', measure);
//     return () => {
//       window.removeEventListener('reset', measure);
//     };
//   }, []);

//   const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
//   const game = React.useMemo(() => {
//     if (!canvas) {
//       return null;
//     }
//     return new Game(canvas);
//   }, [canvas]);

//   React.useEffect(() => {
//     if (game && size) {
//       game.setSize(size);
//     }
//   }, [game, size]);

//   return (
//     size && (
//       <canvas
//         ref={setCanvas}
//         width={size.width * size.scale}
//         height={size.height * size.scale}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: size.width,
//           height: size.height,
//         }}
//       />
//     )
//   );
// }

// ReactDOM.render(<App />, document.getElementById('root')!);
