import * as React from 'react';
import SignalsInspector from './SignalsInspector';
import { frameLoop } from '../utils';
import DragCover from '../DragCover';
import ResizeObserver from 'resize-observer-polyfill';
import { assert } from '../assert';
import { Signal, SignalManager } from './Signals';
import { ListenToMidiInputFn } from '../midi';

const INSPECTOR_WIDTH = 300;

export type CanvasSignals = {
  width: Signal;
  height: Signal;
  devicePixelRatio: Signal;
  mouseX: Signal;
  mouseY: Signal;
  mouseDown: Signal;
};

export type SignalsCanvasScene = (
  signalManager: SignalManager,
  canvas: HTMLCanvasElement,
  signals: CanvasSignals,
) => {
  update?: () => void;
  draw: () => void;
  children: React.ReactNode | null;
};

function SignalsCanvas({
  debuggerEnabled,
  signalManager,
  listenToMidi,
  scene,
}: {
  debuggerEnabled: boolean;
  signalManager: SignalManager;
  listenToMidi: ListenToMidiInputFn;
  scene: SignalsCanvasScene;
}) {
  const [children, setChildren] = React.useState<null | React.ReactNode>(null);
  const containerRef = React.useRef<null | HTMLDivElement>(null);
  const canvasRef = React.useRef<null | HTMLCanvasElement>(null);
  const [size, setSize] = React.useState({
    width: 100,
    height: 100,
    devicePixelRatio: 1,
  });

  React.useEffect(() => {
    let isCancelled = false;
    assert(canvasRef.current && containerRef.current);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    setSize({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      devicePixelRatio: window.devicePixelRatio,
    });

    const signals = {
      width: signalManager.controlled(canvas.clientWidth).debug('canvas.width'),
      height: signalManager
        .controlled(canvas.clientHeight)
        .debug('canvas.height'),
      devicePixelRatio: signalManager
        .controlled(window.devicePixelRatio)
        .debug('canvas.devicePixelRatio'),
      mouseX: signalManager.controlled(0).debug('canvas.mouseX'),
      mouseY: signalManager.controlled(0).debug('canvas.mouseY'),
      mouseDown: signalManager.controlled(0).debug('canvas.mouseDown'),
    };

    const observer = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const devicePixelRatio = window.devicePixelRatio;

      signals.width.set(width);
      signals.height.set(height);
      signals.devicePixelRatio.set(devicePixelRatio);

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

    container.addEventListener('mousedown', () => {
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
    const loop = scene(signalManager, canvas, signals);
    console.log(
      'get frame loop',
      Date.now() - start,
      signalManager.debugSignalsByName.size,
    );

    let lastTime = 0;
    frameLoop((time, cancel) => {
      if (isCancelled) {
        cancel();
      } else {
        const dt = time - lastTime;
        lastTime = time;
        signalManager.update(dt / 1000);
        if (loop.update) loop.update();
        loop.draw();
      }
    });

    setChildren(loop.children);

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [scene, signalManager]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: debuggerEnabled ? INSPECTOR_WIDTH : 0,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            pointerEvents: 'none',
          }}
          width={size.width * size.devicePixelRatio}
          height={size.height * size.devicePixelRatio}
        />
        {children}
      </div>
      {debuggerEnabled && (
        <SignalsInspector
          signalManager={signalManager}
          listenToMidi={listenToMidi}
          width={INSPECTOR_WIDTH}
        />
      )}
    </div>
  );
}

export default React.memo(SignalsCanvas);
