import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { SignalManager, Signal } from './Signals';
import { frameLoop, times, varyAbsolute } from '../lib/utils';
import SignalsInspector from './SignalsInspector';
import { assert } from '../lib/assert';
import { getListenToMidiInput, ListenToMidiInputFn } from '../lib/midi';
import { DebugDraw } from '../lib/DebugCanvas';
import Vector2 from '../lib/geom/Vector2';
import DragCover from '../lib/DragCover';

function SignalCanvas({
  signalManager,
  inspectorWidth,
  listenToMidi,
  getFrameLoop,
}: {
  signalManager: SignalManager;
  inspectorWidth: number;
  listenToMidi: ListenToMidiInputFn;
  getFrameLoop: (
    canvas: HTMLCanvasElement,
    signals: {
      width: Signal;
      height: Signal;
      devicePixelRatio: Signal;
      mouseX: Signal;
      mouseY: Signal;
      mouseDown: Signal;
    },
  ) => () => void;
}) {
  const canvasRef = React.useRef<null | HTMLCanvasElement>(null);
  const [size, setSize] = React.useState({
    width: 100,
    height: 100,
    devicePixelRatio: 1,
  });

  React.useEffect(() => {
    let isCancelled = false;
    assert(canvasRef.current);
    const canvas = canvasRef.current;
    setSize({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      devicePixelRatio: window.devicePixelRatio,
    });

    const signals = {
      width: signalManager.controlled('canvas.width', canvas.clientWidth),
      height: signalManager.controlled('canvas.height', canvas.clientHeight),
      devicePixelRatio: signalManager.controlled(
        'canvas.devicePixelRatio',
        window.devicePixelRatio,
      ),
      mouseX: signalManager.controlled('canvas.mouseX', 0),
      mouseY: signalManager.controlled('canvas.mouseY', 0),
      mouseDown: signalManager.controlled('canvas.mouseDown', 0),
    };

    const observer = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const devicePixelRatio = window.devicePixelRatio;

      signals.width.set(width);
      signals.height.set(height);
      signals.devicePixelRatio.set(devicePixelRatio);

      canvas;

      setSize((size) => {
        if (
          size.width !== width ||
          size.height !== height ||
          size.devicePixelRatio !== devicePixelRatio
        ) {
          return { width, height, devicePixelRatio };
        }
        return size;
      });
    });
    observer.observe(canvas);

    window.addEventListener('mousemove', (event) => {
      signals.mouseX.set(event.clientX);
      signals.mouseY.set(event.clientY);
    });

    canvas.addEventListener('mousedown', (event) => {
      signals.mouseDown.set(1);
      const dragCover = new DragCover({
        up: () => {
          signals.mouseDown.set(0);
          dragCover.remove();
        },
      });
      dragCover.attach();
    });

    const start = Date.now();
    const loopFn = getFrameLoop(canvas, signals);
    console.log(
      'get frame loop',
      Date.now() - start,
      signalManager.signalsByName.size,
    );

    let lastTime = 0;
    frameLoop((time, cancel) => {
      if (isCancelled) {
        cancel();
      } else {
        const dt = time - lastTime;
        lastTime = time;
        signalManager.update(dt / 1000);
        loopFn();
      }
    });

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [getFrameLoop, signalManager]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `calc(100% - ${inspectorWidth - 1}px)`,
          height: '100%',
        }}
        width={size.width * size.devicePixelRatio}
        height={size.height * size.devicePixelRatio}
      />
      <SignalsInspector
        signalManager={signalManager}
        listenToMidi={listenToMidi}
        width={300}
      />
    </div>
  );
}

(async () => {
  const listenToMidi = await getListenToMidiInput();

  const s = new SignalManager();
  const root = document.getElementById('root');
  assert(root);

  ReactDOM.render(
    <SignalCanvas
      signalManager={s}
      listenToMidi={listenToMidi}
      inspectorWidth={300}
      getFrameLoop={(
        canvas,
        { mouseX, mouseY, mouseDown, width, height, devicePixelRatio },
      ) => {
        canvas.style.background = 'black';
        const ctx = canvas.getContext('2d');
        assert(ctx);
        const draw = new DebugDraw(ctx);

        const tentacleCount = 8;
        const segmentCount = 60;

        const activeFriction = s.input('spring.activeFriction', 15.5, [1, 40]);
        const activeTension = s.input('spring.activeTension', 200, [1, 1000]);
        const idleFriction = s.input('spring.idleFriction', 15.5, [1, 40]);
        const idleTension = s.input('spring.idleTension', 200, [1, 1000]);

        const centerX = s.divide(null, width, 2);
        const centerY = s.divide(null, height, 2);

        const startAngle = s.input('startAngle', Math.PI / 2, [0, Math.PI]);

        const tentacles = times(tentacleCount, (t) => {
          const isTrackingMouse = s.switch(null, mouseDown, t === 3 ? 1 : 0, 0);

          const friction = s.switch(
            null,
            isTrackingMouse,
            activeFriction,
            idleFriction,
          );
          const tension = s.switch(
            null,
            isTrackingMouse,
            activeTension,
            idleTension,
          );

          const startX = s.add(null, centerX, (t - tentacleCount / 2) * 30);
          const startY = s.multiply(null, centerY, 0.2);

          let idleLastX = startX;
          let idleLastY = startY;
          let idleLastAngle: Signal = startAngle; // s.controlled(null, Math.PI / 2);
          const points = [[idleLastX, idleLastY]];

          const activeTargetX = mouseX;
          const activeTargetY = mouseY;
          const activeDX = s.subtract(null, activeTargetX, startX);
          const activeDY = s.subtract(null, activeTargetY, startY);
          const activeAngle = s.computed(null, () =>
            Math.atan2(activeDY.read(), activeDX.read()),
          );

          const activeWaveFreq = s.sin(null, {
            min: varyAbsolute(-1, 0.75),
            max: varyAbsolute(1, 0.75),
            frequency: varyAbsolute(0.5, 0.4),
            offset: Math.random(),
          });
          const countBase =
            varyAbsolute(3, 2.5) * Math.sign(varyAbsolute(0, 1));
          const activeWaveCount = s.sin(null, {
            min: countBase - 2,
            max: countBase + 2,
            frequency: varyAbsolute(0.5, 0.4),
            offset: Math.random(),
          });

          times(segmentCount, (i) => {
            const idleAngleWave = s.sin(null, {
              min: -0.2,
              max: 0.2,
              frequency: 0.2 * 1.1 ** (i / 4),
              offset: Math.random(),
            });
            const idleEndAngle = s.add(null, idleAngleWave, idleLastAngle);
            const idleLength = 8 * 0.95 ** (i / 4);
            const idleEndX = s.add(
              null,
              idleLastX,
              s.computed(
                null,
                () => Math.cos(idleEndAngle.read()) * idleLength,
              ),
            );
            const idleEndY = s.add(
              null,
              idleLastY,
              s.computed(
                null,
                () => Math.sin(idleEndAngle.read()) * idleLength,
              ),
            );

            // const idleEndX = s.switch(
            //   null,
            //   shouldDisableSpring,
            //   idleTargetX,
            //   s.spring(null, { target: idleTargetX, tension, friction }),
            // );
            // const idleEndY = s.switch(
            //   null,
            //   shouldDisableSpring,
            //   idleTargetY,
            //   s.spring(null, { target: idleTargetY, tension, friction }),
            // );

            const activeProportion = (i + 1) / segmentCount;

            const activeWaveMagnitude =
              Math.sin(activeProportion * Math.PI) * 20;
            const activeWave = s.sin(null, {
              min: -activeWaveMagnitude,
              max: activeWaveMagnitude,
              offset: s.computed(
                null,
                () => (i / segmentCount) * activeWaveCount.read(),
              ),
              frequency: activeWaveFreq,
            });

            const activeEndX = s.computed(
              null,
              () =>
                startX.read() +
                activeDX.read() * activeProportion +
                Math.sin(-activeAngle.read()) * activeWave.read(),
            );
            const activeEndY = s.computed(
              null,
              () =>
                startY.read() +
                activeDY.read() * activeProportion +
                Math.cos(activeAngle.read()) * activeWave.read(),
            );

            const endX = s.spring(
              i === segmentCount - 1 ? `tentacle.${t}.endX` : null,
              {
                target: s.switch(null, isTrackingMouse, activeEndX, idleEndX),
                friction: friction,
                tension: tension,
              },
            );
            const endY = s.spring(null, {
              target: s.switch(null, isTrackingMouse, activeEndY, idleEndY),
              friction: friction,
              tension: tension,
            });

            idleLastX = endX;
            idleLastY = endY;
            idleLastAngle = idleEndAngle;
            points.push([endX, endY]);
          });

          return points;
        });

        // const freq = s.input('sin.outerFreq', 0.5);

        // s.sin('sin.result', {
        //   min: s.sin(null, {
        //     min: 0,
        //     max: 3,
        //     frequency: freq,
        //     offset: s.sin('sin.min offset', {
        //       frequency: s.input('sin.min offset freq', 0.3, [0.1, 0.5]),
        //     }),
        //   }),
        //   max: s.sin(null, {
        //     min: 1,
        //     max: 3.5,
        //     frequency: freq,
        //     offset: s.sin('sin.max offset', {
        //       frequency: s.input('sin.max offset freq', 0.3, [0.1, 0.5]),
        //     }),
        //   }),
        //   frequency: s.input('sin.freq', 10, [1, 30]),
        // });

        // s.sin('sin2.result', {
        //   min: s.input('sin2.min', 0.25, [0, 1]),
        //   max: s.input('sin2.max', 0.75, [0, 1]),
        //   frequency: s.input('sin2.freq', 1, [-2, 2]),
        // });

        // s.spring('mouse x spring', {
        //   target: mouseX,
        //   friction: s.computed('friction', () => mouseY.read() / 50),
        // });

        return () => {
          ctx.resetTransform();
          ctx.scale(devicePixelRatio.read(), devicePixelRatio.read());
          ctx.clearRect(0, 0, width.read(), height.read());

          for (const points of tentacles) {
            draw.polyLine(
              points.map(([x, y]) => new Vector2(x.read(), y.read())),
              { stroke: 'white', strokeWidth: 2, strokeCap: 'round' },
            );
          }
        };
      }}
    />,
    root,
  );
})();
