import * as React from 'react';
import {
  SignalManager,
  Signal,
  ControlledSignal,
} from '../lib/signals/Signals';
import { times, varyAbsolute, shuffle, uniq, sample } from '../lib/utils';
import { assert } from '../lib/assert';
import { DebugDraw } from '../lib/DebugCanvas';
import Vector2 from '../lib/geom/Vector2';
import PianoKeyboard from './PianoKeyboard';
import startSignalsApp from '../lib/signals/startSignalsApp';
import { CanvasSignals } from '../lib/signals/SignalsCanvas';
import useSignal from '../lib/signals/useSignal';

const WIDTH = 1300;
const HEIGHT = 1300;
const LOWEST_NOTE_TO_RENDER = 33;
const HIGHEST_NOTE_TO_RENDER = 72;

const DEBUGGER_ENABLED = process.env.NODE_ENV !== 'production ';

const THICKNESS = 46;
const INNER_THICKNESS = THICKNESS - 12;

const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

const noteNumberByKeyCode: { [keyCode: string]: number | undefined } = {
  // O3:
  KeyA: 33,
  KeyS: 34,
  KeyD: 35,
  KeyF: 36,
  KeyG: 37,
  KeyH: 38,
  KeyJ: 39,
  KeyK: 40,
  KeyL: 41,
  Semicolon: 42,
  Quote: 43,
  Backslash: 44,
  // O4:
  KeyQ: 45,
  KeyW: 46,
  KeyE: 47,
  KeyR: 48,
  KeyT: 49,
  KeyY: 50,
  KeyU: 51,
  KeyI: 52,
  KeyO: 53,
  KeyP: 54,
  BracketLeft: 55,
  BracketRight: 56,
  // O5:
  Digit1: 57,
  Digit2: 58,
  Digit3: 59,
  Digit4: 60,
  Digit5: 61,
  Digit6: 62,
  Digit7: 63,
  Digit8: 64,
  Digit9: 65,
  Digit0: 66,
  Minus: 67,
  Equal: 68,
};

type TentaclePoint = {
  start: [Signal, Signal];
  end: [Signal, Signal];
  leftInner: [Signal, Signal];
  rightInner: [Signal, Signal];
  leftOuter: [Signal, Signal];
  rightOuter: [Signal, Signal];
};

type Tentacle = {
  isActive: ControlledSignal;
  activeTargetX: ControlledSignal;
  activeTargetY: ControlledSignal;
  points: Array<TentaclePoint>;
};

function signalsToVector(signals: [Signal, Signal]): Vector2 {
  return new Vector2(signals[0].read(), signals[1].read());
}

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
  const activeFriction = s.input('spring.activeFriction', 35, [1, 40]);
  const activeTension = s.input('spring.activeTension', 1000, [1, 1000]);
  const idleFriction = s.input('spring.idleFriction', 25, [1, 40]);
  const idleTension = s.input('spring.idleTension', 180, [1, 1000]);

  const octopusXRoot = CENTER_X;
  const octopusYRoot = 250;
  const octopusXTarget = s.controlled(octopusXRoot);
  const octopusYTarget = s.controlled(octopusYRoot);
  const octopusX = s.spring({ target: octopusXTarget });
  const octopusY = s.spring({ target: octopusYTarget });

  const octopusHeadX = octopusX; // s.spring({ target: octopusX });
  const octopusHeadY = s.subtract(octopusY, 70); // s.spring({ target: s.subtract(octopusY, 70) });

  const tentacles = times(tentacleCount, (t) => {
    const isActive = s.controlled(0);
    const activeTargetX = s.controlled(0);
    const activeTargetY = s.controlled(0);

    const startX = s.computed(
      () => octopusX.read() + (t - (tentacleCount - 1) / 2) * 65,
    );
    const startY = s.computed(
      () =>
        octopusY.read() + Math.sin((t / (tentacleCount - 1)) * Math.PI) * 120,
    );

    let lastEndX: Signal = startX;
    let lastEndY: Signal = startY;
    let idleLastAngle: Signal = s.controlled(
      Math.PI / 2 - (t - tentacleCount / 2) / (tentacleCount * 0.9),
    );

    const activeDX = s.subtract(activeTargetX, startX);
    const activeDY = s.subtract(activeTargetY, startY);
    const activeAngle = s.computed(() =>
      Math.atan2(activeDY.read(), activeDX.read()),
    );

    const activeWaveFreq = s.sin({
      min: varyAbsolute(-1, 0.75),
      max: varyAbsolute(1, 0.75),
      frequency: varyAbsolute(0.5, 0.4),
      offset: Math.random(),
    });
    const countBase = varyAbsolute(2, 1.5) * Math.sign(varyAbsolute(0, 1));
    const activeWaveCount = s.sin({
      min: countBase - 2,
      max: countBase + 2,
      frequency: varyAbsolute(0.5, 0.4),
      offset: Math.random(),
    });

    const points = times(
      segmentCount,
      (i): TentaclePoint => {
        const idxFromEnd = segmentCount - (i + 1);
        const springControl = s.adsr({
          target: isActive,
          attack: 0.05 * idxFromEnd,
          release: 2,
        });
        const activeLerp = s.adsr({
          target: isActive,
          attack: 0.05 * idxFromEnd,
        });
        const friction = s.lerp(idleFriction, activeFriction, springControl);
        const tension = s.lerp(idleTension, activeTension, springControl);

        const idleAngleWave = s.sin({
          min: -0.3,
          max: 0.3,
          frequency: 0.2 * 1.1 ** (i / 2),
          offset: Math.random(),
        });
        const idleEndAngle = s.add(idleAngleWave, idleLastAngle);
        const idleLength = 24 * 0.95 ** (i / 2);
        const idleEndX = s.add(
          lastEndX,
          s.computed(() => Math.cos(idleEndAngle.read()) * idleLength),
        );
        const idleEndY = s.add(
          lastEndY,
          s.computed(() => Math.sin(idleEndAngle.read()) * idleLength),
        );

        const activeProportion = (i + 1) / segmentCount;

        const activeWaveMagnitude = Math.sin(activeProportion * Math.PI) * 20;
        const activeWave = s.sin({
          min: -activeWaveMagnitude,
          max: activeWaveMagnitude,
          offset: s.computed(() => (i / segmentCount) * activeWaveCount.read()),
          frequency: activeWaveFreq,
        });

        const activeEndX = s.computed(
          () =>
            startX.read() +
            activeDX.read() * activeProportion +
            Math.sin(-activeAngle.read()) * activeWave.read(),
        );
        const activeEndY = s.computed(
          () =>
            startY.read() +
            activeDY.read() * activeProportion +
            Math.cos(activeAngle.read()) * activeWave.read(),
        );

        const endX = s
          .spring({
            target: s.lerp(idleEndX, activeEndX, activeLerp),
            friction: friction,
            tension: tension,
          })
          .debug(i === segmentCount - 1 ? `tentacle.endX` : null);
        const endY = s.spring({
          target: s.lerp(idleEndY, activeEndY, activeLerp),
          friction: friction,
          tension: tension,
        });

        const dx = s.subtract(endX, lastEndX);
        const dy = s.subtract(endY, lastEndY);
        const segmentLength = s.computed(() =>
          Math.sqrt(dx.read() * dx.read() + dy.read() * dy.read()),
        );

        const tentaclePoint: TentaclePoint = {
          start: [lastEndX, lastEndY],
          end: [endX, endY],
          leftInner: [
            s.computed(
              () =>
                endX.read() -
                (dy.read() / segmentLength.read()) *
                  (INNER_THICKNESS / 2 - i + 1),
            ),
            s.computed(
              () =>
                endY.read() +
                (dx.read() / segmentLength.read()) *
                  (INNER_THICKNESS / 2 - i + 1),
            ),
          ],
          rightInner: [
            s.computed(
              () =>
                endX.read() +
                (dy.read() / segmentLength.read()) *
                  (INNER_THICKNESS / 2 - i + 1),
            ),
            s.computed(
              () =>
                endY.read() -
                (dx.read() / segmentLength.read()) *
                  (INNER_THICKNESS / 2 - i + 1),
            ),
          ],
          leftOuter: [
            s.computed(
              () =>
                endX.read() -
                (dy.read() / segmentLength.read()) * (THICKNESS / 2 - i + 1),
            ),
            s.computed(
              () =>
                endY.read() +
                (dx.read() / segmentLength.read()) * (THICKNESS / 2 - i + 1),
            ),
          ],
          rightOuter: [
            s.computed(
              () =>
                endX.read() +
                (dy.read() / segmentLength.read()) * (THICKNESS / 2 - i + 1),
            ),
            s.computed(
              () =>
                endY.read() -
                (dx.read() / segmentLength.read()) * (THICKNESS / 2 - i + 1),
            ),
          ],
        };

        lastEndX = endX;
        lastEndY = endY;
        idleLastAngle = idleEndAngle;

        return tentaclePoint;
      },
    );

    return {
      points,
      isActive,
      activeTargetX,
      activeTargetY,
    };
  });

  const notesByTentacle = new Map<Tentacle, number>();
  const onNoteDown = (note: number, x: number, y: number) => {
    const tentacle =
      sample(tentacles.filter((t) => !notesByTentacle.has(t))) ??
      sample(tentacles);
    notesByTentacle.set(tentacle, note);
    tentacle.isActive.set(1);
    tentacle.activeTargetX.set(x);
    tentacle.activeTargetY.set(y);
  };
  const onNoteUp = (note: number) => {
    for (const [tentacle, activeNote] of notesByTentacle.entries()) {
      if (activeNote === note) {
        notesByTentacle.delete(tentacle);
        tentacle.isActive.set(0);
      }
    }
  };

  const avgTentacleEndX = s.computed(() => {
    let total = 0;
    for (let i = 0; i < tentacleCount; i++) {
      total += tentacles[i].points[segmentCount - 1].end[0].read();
    }
    return total / tentacleCount;
  });
  const avgTentacleEndY = s.computed(() => {
    let total = 0;
    for (let i = 0; i < tentacleCount; i++) {
      total += tentacles[i].points[segmentCount - 1].end[1].read();
    }
    return total / tentacleCount;
  });

  const zOrderedTentacles = shuffle(tentacles);
  return {
    update: () => {
      const avgEndDelta = new Vector2(
        avgTentacleEndX.read() - octopusXRoot,
        avgTentacleEndY.read() - 400 - octopusYRoot,
      );
      const octopusCenterAdjust = avgEndDelta.withMagnitude(
        avgEndDelta.magnitude ** 0.9,
      );
      octopusXTarget.set(octopusXRoot + octopusCenterAdjust.x);
      octopusYTarget.set(octopusYRoot + octopusCenterAdjust.y);
    },
    draw: () => {
      const octopusHead = new Vector2(octopusHeadX.read(), octopusHeadY.read());

      ctx.resetTransform();
      ctx.scale(devicePixelRatio.read(), devicePixelRatio.read());
      ctx.fillStyle = '#7F95D1';
      ctx.clearRect(0, 0, width.read(), height.read());

      ctx.translate(canvasTranslateX.read(), canvasTranslateY.read());
      ctx.scale(canvasScale.read(), canvasScale.read());

      draw.ellipse(octopusHead, 250, 200, {
        stroke: '#FF709D',
        strokeWidth: 12,
      });

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(
        tentacles[0].points[0].start[0].read(),
        tentacles[0].points[0].start[1].read(),
      );
      for (let i = 1; i < tentacles.length; i++) {
        const prevTentacle = tentacles[i - 1];
        const nextTentacle = tentacles[i];
        ctx.lineTo(
          prevTentacle.points[3].rightOuter[0].read(),
          prevTentacle.points[3].rightOuter[1].read(),
        );
        ctx.bezierCurveTo(
          prevTentacle.points[1].rightOuter[0].read(),
          prevTentacle.points[1].rightOuter[1].read(),
          nextTentacle.points[1].leftOuter[0].read(),
          nextTentacle.points[1].leftOuter[1].read(),
          nextTentacle.points[3].leftOuter[0].read(),
          nextTentacle.points[3].leftOuter[1].read(),
        );
      }
      ctx.lineTo(
        tentacles[tentacles.length - 1].points[0].start[0].read(),
        tentacles[tentacles.length - 1].points[0].start[1].read(),
      );
      ctx.fillStyle = '#FF709D';
      ctx.fill();

      for (let i = 0; i < zOrderedTentacles.length; i++) {
        drawTentacle(ctx, zOrderedTentacles[i], '#FF709D', THICKNESS, 0);
        drawTentacle(ctx, zOrderedTentacles[i], '#FF4782', INNER_THICKNESS, 3);
      }

      draw.ellipse(octopusHead, 250, 200, {
        fill: '#FF4782',
      });

      ctx.beginPath();
      ctx.moveTo(
        tentacles[0].points[0].start[0].read(),
        tentacles[0].points[0].start[1].read(),
      );
      for (let i = 1; i < tentacles.length; i++) {
        const prevTentacle = tentacles[i - 1];
        const nextTentacle = tentacles[i];
        ctx.lineTo(
          prevTentacle.points[1].rightInner[0].read(),
          prevTentacle.points[1].rightInner[1].read(),
        );
        ctx.bezierCurveTo(
          prevTentacle.points[0].rightInner[0].read(),
          prevTentacle.points[0].rightInner[1].read(),
          nextTentacle.points[0].leftInner[0].read(),
          nextTentacle.points[0].leftInner[1].read(),
          nextTentacle.points[1].leftInner[0].read(),
          nextTentacle.points[1].leftInner[1].read(),
        );
      }
      ctx.lineTo(
        tentacles[tentacles.length - 1].points[0].start[0].read(),
        tentacles[tentacles.length - 1].points[0].start[1].read(),
      );
      ctx.fillStyle = '#FF4782';
      ctx.fill();

      draw.debugPointX(
        new Vector2(avgTentacleEndX.read(), avgTentacleEndY.read()),
        { label: 'avg end' },
      );
    },
    children: (
      <OctopusUi
        canvasScaleSignal={canvasScale}
        canvasTranslateXSignal={canvasTranslateX}
        canvasTranslateYSignal={canvasTranslateY}
        onNoteDown={onNoteDown}
        onNoteUp={onNoteUp}
      />
    ),
  };
}

function drawTentacle(
  ctx: CanvasRenderingContext2D,
  tentacle: Tentacle,
  color: string,
  thickness: number,
  skipCount: number,
) {
  ctx.strokeStyle = color;
  for (let i = 0; i < tentacle.points.length - skipCount; i++) {
    const { start, end } = tentacle.points[i];
    ctx.beginPath();
    ctx.moveTo(start[0].read(), start[1].read());
    ctx.lineTo(end[0].read(), end[1].read());
    ctx.lineWidth = thickness - i;
    ctx.stroke();
  }
}

function OctopusUi({
  canvasScaleSignal,
  canvasTranslateXSignal,
  canvasTranslateYSignal,
  onNoteDown,
  onNoteUp,
}: {
  canvasScaleSignal: Signal;
  canvasTranslateXSignal: Signal;
  canvasTranslateYSignal: Signal;
  onNoteDown: (note: number, x: number, y: number) => void;
  onNoteUp: (note: number) => void;
}) {
  const noteRefs = React.useRef(new Map<number, HTMLDivElement>());

  const canvasScale = useSignal(canvasScaleSignal);
  const canvasTranslateX = useSignal(canvasTranslateXSignal);
  const canvasTranslateY = useSignal(canvasTranslateYSignal);

  const [notesDown, setNotesDown] = React.useState<Array<number>>([]);
  console.log(notesDown);

  const setRefForKey = React.useCallback(
    (ref: HTMLDivElement | null, note: number) => {
      if (ref) {
        noteRefs.current.set(note, ref);
      } else {
        noteRefs.current.delete(note);
      }
    },
    [],
  );

  const handleNoteDown = React.useCallback((note: number) => {
    setNotesDown((prev) => {
      if (prev.includes(note)) {
        return prev;
      }
      const keyEl = noteRefs.current.get(note);
      if (keyEl) {
        const bbox = keyEl.getBoundingClientRect();
        onNoteDown(
          note,
          screenToScene(
            bbox.x + bbox.width / 2,
            canvasTranslateXSignal.read(),
            canvasScaleSignal.read(),
          ),
          screenToScene(
            bbox.y + bbox.height * 0.8,
            canvasTranslateYSignal.read(),
            canvasScaleSignal.read(),
          ),
        );
      }
      return uniq([...prev, note]);
    });
  }, []);

  const handleNoteUp = React.useCallback((note: number) => {
    setNotesDown((prev) => {
      if (!prev.includes(note)) {
        return prev;
      }
      onNoteUp(note);
      return prev.filter((n) => n !== note);
    });
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const note = noteNumberByKeyCode[e.code];
      if (note !== undefined) {
        handleNoteDown(note);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const note = noteNumberByKeyCode[e.code];
      if (note !== undefined) {
        handleNoteUp(note);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <>
      <div
        style={{ background: '#7F95D1' }}
        className="absolute top-0 left-0 w-full h-full"
      />
      <PianoKeyboard
        lowestNote={LOWEST_NOTE_TO_RENDER}
        highestNote={HIGHEST_NOTE_TO_RENDER}
        scale={canvasScale}
        top={sceneToScreen(1100, canvasTranslateY, canvasScale)}
        left={sceneToScreen(CENTER_X, canvasTranslateX, canvasScale)}
        notesDown={notesDown}
        setRefForKey={setRefForKey}
      />
    </>
  );
}

startSignalsApp(octopusScene, DEBUGGER_ENABLED);
