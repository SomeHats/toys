import * as React from 'react';
import useResizeObserver from 'use-resize-observer';
import { assert } from '../assert';
import { DebugDraw } from '../DebugDraw';

type DrawFn = (canvas: DebugDraw) => void;

export function DebugCanvas({
  draw,
  width,
  height,
  style = {},
}: {
  draw: DrawFn;
  width: number;
  height: number;
  style?: React.CSSProperties;
}) {
  const pxWidth = width * window.devicePixelRatio;
  const pxHeight = height * window.devicePixelRatio;
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    assert(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    assert(ctx);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const debugDraw = new DebugDraw(ctx);
    debugDraw.clear();
    draw(debugDraw);
    ctx.resetTransform();
  });

  return (
    <canvas
      width={pxWidth}
      height={pxHeight}
      ref={canvasRef}
      style={{ ...style, width, height }}
    />
  );
}

export function OverlayDebugCanvas({ draw }: { draw: DrawFn }) {
  const { ref, width, height } = useResizeObserver();

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {width && height ? (
        <DebugCanvas draw={draw} width={width} height={height} />
      ) : null}
    </div>
  );
}
