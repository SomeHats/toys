// @flow
import Path from './geom/Path';
import StraightPathSegment from './geom/StraightPathSegment';
import CirclePathSegment from './geom/CirclePathSegment';

export function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
}

export function path(ctx: CanvasRenderingContext2D, path: Path) {
  if (path.segments.length) {
    ctx.moveTo(path.segments[0].getStart().x, path.segments[0].getStart().y);
  }

  for (const segment of path.segments) {
    if (segment instanceof StraightPathSegment) {
      ctx.lineTo(segment.getEnd().x, segment.getEnd().y);
    } else if (segment instanceof CirclePathSegment) {
      ctx.arc(
        segment.circle.center.x,
        segment.circle.center.y,
        segment.circle.radius,
        segment.startAngle,
        segment.endAngle,
        segment.isAnticlockwise,
      );
    } else {
      throw new Error(`Unknown path segment type: ${segment.toString()}`);
    }
  }
}
