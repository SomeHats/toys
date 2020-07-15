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
) => { draw: () => void; children: React.ReactNode | null };

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

    window.addEventListener('mousedown', () => {
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
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: debuggerEnabled ? `calc(100% - ${INSPECTOR_WIDTH}px)` : '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none',
        }}
        width={size.width * size.devicePixelRatio}
        height={size.height * size.devicePixelRatio}
      />
      {debuggerEnabled && (
        <SignalsInspector
          signalManager={signalManager}
          listenToMidi={listenToMidi}
          width={INSPECTOR_WIDTH}
        />
      )}
      {children}
    </div>
  );
}

export default React.memo(SignalsCanvas);
