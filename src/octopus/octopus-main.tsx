import * as React from 'react';
import { SignalManager, Signal } from '../lib/signals/Signals';
import { times, varyAbsolute } from '../lib/utils';
import { assert } from '../lib/assert';
import { DebugDraw } from '../lib/DebugCanvas';
import Vector2 from '../lib/geom/Vector2';
import PianoKeyboard from './PianoKeyboard';
import startSignalsApp from '../lib/signals/startSignalsApp';
import { CanvasSignals } from '../lib/signals/SignalsCanvas';
import useSignal from '../lib/signals/useSignal';

const WIDTH = 1000;
const HEIGHT = 1000;
const LOWEST_NOTE_TO_RENDER = 36; // C3
const HIGHEST_NOTE_TO_RENDER = 96; // C7

const DEBUGGER_ENABLED = process.env.NODE_ENV !== 'production ';

function screenToScene(
  coordinate: number,
  translate: number,
  scale: number,
): number {
  return (coordinate - translate) / scale;
}

function sceneToScreen(
  coordinate: number,
  translate: number,
  scale: number,
): number {
  return coordinate * scale + translate;
}

function octopusScene(
  s: SignalManager,
  canvas: HTMLCanvasElement,
  {
    mouseX: rawMouseX,
    mouseY: rawMouseY,
    mouseDown,
    width,
    height,
    devicePixelRatio,
  }: CanvasSignals,
) {
  const ctx = canvas.getContext('2d');
  assert(ctx);
  const draw = new DebugDraw(ctx);

  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  const canvasScale = s.computed(() =>
    Math.min(width.read() / WIDTH, height.read() / HEIGHT),
  );
  const canvasTranslateX = s.computed(
    () => (width.read() - canvasScale.read() * WIDTH) / 2,
  );
  const canvasTranslateY = s.computed(
    () => (height.read() - canvasScale.read() * HEIGHT) / 2,
  );
  const mouseX = s.computed(() =>
    screenToScene(
      rawMouseX.read(),
      canvasTranslateX.read(),
      canvasScale.read(),
    ),
  );
  const mouseY = s.computed(() =>
    screenToScene(
      rawMouseY.read(),
      canvasTranslateY.read(),
      canvasScale.read(),
    ),
  );

  const tentacleCount = 8;
  const segmentCount = 30;
  const startAngle = s.input('startAngle', Math.PI / 2, [0, Math.PI]);
  const activeFriction = s.input('spring.activeFriction', 15.5, [1, 40]);
  const activeTension = s.input('spring.activeTension', 200, [1, 1000]);
  const idleFriction = s.input('spring.idleFriction', 15.5, [1, 40]);
  const idleTension = s.input('spring.idleTension', 200, [1, 1000]);

  const tentacles = times(tentacleCount, (t) => {
    const isTrackingMouse = s.switch(null, mouseDown, t === 3 ? 1 : 0, 0);

    const friction = s.switch(
      null,
      isTrackingMouse,
      activeFriction,
      idleFriction,
    );
    const tension = s.switch(null, isTrackingMouse, activeTension, idleTension);

    const startX = centerX + (t - tentacleCount / 2) * 60;
    const startY = 80 + Math.sin((t / (tentacleCount - 1)) * Math.PI) * 100;

    let idleLastX: Signal = s.controlled(startX);
    let idleLastY: Signal = s.controlled(startY);
    let idleLastAngle: Signal = startAngle; // s.controlled(null, Math.PI / 2);
    const points = [[idleLastX, idleLastY]];

    const activeTargetX = mouseX;
    const activeTargetY = mouseY;
    const activeDX = s.subtract(null, activeTargetX, startX);
    const activeDY = s.subtract(null, activeTargetY, startY);
    const activeAngle = s.computed(() =>
      Math.atan2(activeDY.read(), activeDX.read()),
    );

    const activeWaveFreq = s.sin(null, {
      min: varyAbsolute(-1, 0.75),
      max: varyAbsolute(1, 0.75),
      frequency: varyAbsolute(0.5, 0.4),
      offset: Math.random(),
    });
    const countBase = varyAbsolute(2, 1.5) * Math.sign(varyAbsolute(0, 1));
    const activeWaveCount = s.sin(null, {
      min: countBase - 2,
      max: countBase + 2,
      frequency: varyAbsolute(0.5, 0.4),
      offset: Math.random(),
    });

    times(segmentCount, (i) => {
      const idleAngleWave = s.sin(null, {
        min: -0.3,
        max: 0.3,
        frequency: 0.2 * 1.1 ** (i / 2),
        offset: Math.random(),
      });
      const idleEndAngle = s.add(null, idleAngleWave, idleLastAngle);
      const idleLength = 24 * 0.95 ** (i / 2);
      const idleEndX = s.add(
        null,
        idleLastX,
        s.computed(() => Math.cos(idleEndAngle.read()) * idleLength),
      );
      const idleEndY = s.add(
        null,
        idleLastY,
        s.computed(() => Math.sin(idleEndAngle.read()) * idleLength),
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

      const activeWaveMagnitude = Math.sin(activeProportion * Math.PI) * 20;
      const activeWave = s.sin(null, {
        min: -activeWaveMagnitude,
        max: activeWaveMagnitude,
        offset: s.computed(() => (i / segmentCount) * activeWaveCount.read()),
        frequency: activeWaveFreq,
      });

      const activeEndX = s.computed(
        null,
        () =>
          startX +
          activeDX.read() * activeProportion +
          Math.sin(-activeAngle.read()) * activeWave.read(),
      );
      const activeEndY = s.computed(
        null,
        () =>
          startY +
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

  return {
    draw: () => {
      ctx.resetTransform();
      ctx.scale(devicePixelRatio.read(), devicePixelRatio.read());
      ctx.clearRect(0, 0, width.read(), height.read());

      ctx.translate(canvasTranslateX.read(), canvasTranslateY.read());
      ctx.scale(canvasScale.read(), canvasScale.read());

      for (const points of tentacles) {
        draw.polyLine(
          points.map(([x, y]) => new Vector2(x.read(), y.read())),
          { stroke: 'white', strokeWidth: 2, strokeCap: 'round' },
        );
      }
    },
    children: (
      <OctopusUi
        canvasScaleSignal={canvasScale}
        canvasTranslateXSignal={canvasTranslateX}
        canvasTranslateYSignal={canvasTranslateY}
      />
    ),
  };
}

function OctopusUi({
  canvasScaleSignal,
  canvasTranslateXSignal,
  canvasTranslateYSignal,
}: {
  canvasScaleSignal: Signal;
  canvasTranslateXSignal: Signal;
  canvasTranslateYSignal: Signal;
}) {
  const canvasScale = useSignal(canvasScaleSignal);
  const canvasTranslateX = useSignal(canvasTranslateXSignal);
  const canvasTranslateY = useSignal(canvasTranslateYSignal);

  return (
    <PianoKeyboard
      lowestNote={LOWEST_NOTE_TO_RENDER}
      highestNote={HIGHEST_NOTE_TO_RENDER}
      scale={canvasScale}
      top={sceneToScreen(850, canvasTranslateY, canvasScale)}
      left={sceneToScreen(500, canvasTranslateX, canvasScale)}
    />
  );
}

startSignalsApp(octopusScene, DEBUGGER_ENABLED);
