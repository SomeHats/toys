import AABB from './geom/AABB';
import Line2 from './geom/Line2';
import Vector2 from './geom/Vector2';

const DEFAULT_DEBUG_COLOR = 'magenta';
const LABEL_OFFSET = new Vector2(5, 0);
const DEBUG_POINT_SIZE = 3;
const HAIRLINE = 0.5;
const DEBUG_ARROW_ANGLE = Math.PI * 0.75;
const DEBUG_ARROW_SIZE = 5;

export type StrokeOptions = {
  strokeWidth?: number;
  stroke?: string;
  strokeCap?: 'butt' | 'round' | 'square';
  strokeDash?: number[];
  strokeDashOffset?: number;
  strokeJoin?: 'bevel' | 'round' | 'miter';
};

export type FillOptions = {
  fill?: string;
};

export type DebugOptions = {
  color?: string;
  label?: string;
};

export type StrokeAndFillOptions = StrokeOptions & FillOptions;

export class DebugDraw {
  constructor(public readonly ctx: CanvasRenderingContext2D) {}

  public clear(fill?: string) {
    if (!fill) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      return;
    }

    this.applyFillOptions({ fill });
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public beginPath() {
    this.ctx.beginPath();
  }

  public moveTo({ x, y }: Vector2) {
    this.ctx.moveTo(x, y);
  }

  public lineTo({ x, y }: Vector2) {
    this.ctx.lineTo(x, y);
  }

  public arc(
    { x, y }: Vector2,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean,
  ) {
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  }

  public arcTo(p1: Vector2, p2: Vector2, radius: number) {
    this.ctx.arcTo(p1.x, p1.y, p2.x, p2.y, radius);
  }

  public quadraticCurveTo(control: Vector2, target: Vector2) {
    this.ctx.quadraticCurveTo(control.x, control.y, target.x, target.y);
  }
  public bezierCurveTo(control1: Vector2, control2: Vector2, target: Vector2) {
    this.ctx.bezierCurveTo(
      control1.x,
      control1.y,
      control2.x,
      control2.y,
      target.x,
      target.y,
    );
  }

  public applyStrokeOptions({
    strokeWidth = 1,
    stroke = undefined,
    strokeCap = 'butt',
    strokeDash = [],
    strokeDashOffset = 0,
    strokeJoin = 'round',
  }: StrokeOptions) {
    if (stroke) {
      this.ctx.lineWidth = strokeWidth;
      this.ctx.strokeStyle = stroke;
      this.ctx.lineCap = strokeCap;
      this.ctx.setLineDash(strokeDash);
      this.ctx.lineDashOffset = strokeDashOffset;
      this.ctx.lineJoin = strokeJoin;
    }
  }

  public stroke(options: StrokeOptions) {
    if (options.stroke) {
      this.applyStrokeOptions(options);
      this.ctx.stroke();
    }
  }

  public applyFillOptions({ fill = undefined }: FillOptions) {
    if (fill) {
      this.ctx.fillStyle = fill;
    }
  }

  public fill(options: FillOptions) {
    if (options.fill) {
      this.applyFillOptions(options);
      this.ctx.fill();
    }
  }

  public applyStrokeAndFillOptions(options: StrokeAndFillOptions) {
    this.applyFillOptions(options);
    this.applyStrokeOptions(options);
  }

  public strokeAndFill(options: StrokeAndFillOptions) {
    this.fill(options);
    this.stroke(options);
  }

  public getDebugStrokeOptions(
    color: string = DEFAULT_DEBUG_COLOR,
  ): StrokeOptions {
    return { stroke: color, strokeWidth: HAIRLINE };
  }

  public debugStroke(color: string = DEFAULT_DEBUG_COLOR) {
    this.stroke(this.getDebugStrokeOptions(color));
  }

  public fillText(text: string, position: Vector2, options: FillOptions = {}) {
    this.applyFillOptions(options);
    this.ctx.fillText(text, position.x, position.y);
  }

  public circle(
    center: Vector2,
    radius: number,
    options: StrokeAndFillOptions,
  ) {
    this.beginPath();
    this.arc(center, radius, 0, 2 * Math.PI);
    this.strokeAndFill(options);
  }

  public ellipse(
    center: Vector2,
    radiusX: number,
    radiusY: number,
    options: StrokeAndFillOptions,
  ) {
    this.beginPath();
    this.ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, Math.PI * 2);
    this.strokeAndFill(options);
  }

  public debugLabel(
    label: string | undefined,
    position: Vector2,
    color: string,
  ) {
    if (label) {
      this.applyFillOptions({ fill: color });
      this.fillText(label, position.add(LABEL_OFFSET));
    }
  }

  public debugPointX(
    position: Vector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, position, color);

    this.beginPath();
    this.ctx.moveTo(
      position.x - DEBUG_POINT_SIZE,
      position.y - DEBUG_POINT_SIZE,
    );
    this.ctx.lineTo(
      position.x + DEBUG_POINT_SIZE,
      position.y + DEBUG_POINT_SIZE,
    );
    this.ctx.moveTo(
      position.x + DEBUG_POINT_SIZE,
      position.y - DEBUG_POINT_SIZE,
    );
    this.ctx.lineTo(
      position.x - DEBUG_POINT_SIZE,
      position.y + DEBUG_POINT_SIZE,
    );
    this.stroke({ strokeWidth: HAIRLINE, stroke: color });
  }

  public debugPointO(
    position: Vector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, position, color);

    this.circle(position, DEBUG_POINT_SIZE, {
      strokeWidth: HAIRLINE,
      stroke: color,
    });
  }

  public debugArrow(
    start: Vector2,
    end: Vector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, Vector2.average([start, end]), color);

    this.ctx.beginPath();
    this.moveTo(start);
    this.lineTo(end);

    const vector = end.sub(start);
    const arrowLeftPoint = vector
      .rotate(-DEBUG_ARROW_ANGLE)
      .withMagnitude(DEBUG_ARROW_SIZE)
      .add(end);
    const arrowRightPoint = vector
      .rotate(+DEBUG_ARROW_ANGLE)
      .withMagnitude(DEBUG_ARROW_SIZE)
      .add(end);

    this.moveTo(arrowLeftPoint);
    this.lineTo(end);
    this.lineTo(arrowRightPoint);
    this.stroke({ strokeWidth: HAIRLINE, stroke: color });
  }

  public debugVectorAtPoint(
    vector: Vector2,
    base: Vector2,
    options?: DebugOptions,
  ) {
    this.debugArrow(base, base.add(vector), options);
  }

  public polygon(
    polygon: ReadonlyArray<Vector2>,
    options: StrokeAndFillOptions = {},
  ) {
    this.beginPath();
    this.moveTo(polygon[polygon.length - 1]);
    for (const point of polygon) {
      this.lineTo(point);
    }
    this.strokeAndFill(options);
  }

  public polyLine(points: ReadonlyArray<Vector2>, options: StrokeOptions = {}) {
    this.beginPath();
    this.moveTo(points[0]);
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i]);
    }
    this.stroke(options);
  }

  public debugPolygon(
    polygon: ReadonlyArray<Vector2>,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, polygon[0], color);
    this.polygon(polygon, this.getDebugStrokeOptions(color));
  }

  public debugPolyLine(
    polyLine: ReadonlyArray<Vector2>,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, polyLine[0], color);
    this.polyLine(polyLine, this.getDebugStrokeOptions(color));
  }
  public debugQuadraticCurve(
    from: Vector2,
    control: Vector2,
    to: Vector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, from, color);
    this.beginPath();
    this.moveTo(from);
    this.quadraticCurveTo(control, to);
    this.stroke(this.getDebugStrokeOptions(color));
  }
  public debugBezierCurve(
    from: Vector2,
    control1: Vector2,
    control2: Vector2,
    to: Vector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, from, color);
    this.beginPath();
    this.moveTo(from);
    this.bezierCurveTo(control1, control2, to);
    this.stroke(this.getDebugStrokeOptions(color));
  }
  public debugLine2(
    line: Line2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {},
  ) {
    this.debugLabel(label, line.start, color);
    this.debugArrow(line.start, line.end, { color, label });
  }

  public aabb(
    aabb: AABB,
    opts: StrokeAndFillOptions & { debug?: DebugOptions },
  ) {
    if (opts.debug) {
      this.debugLabel(
        opts.debug.label,
        aabb.origin,
        opts.debug.color || DEFAULT_DEBUG_COLOR,
      );
    }
    this.ctx.beginPath();
    this.ctx.rect(aabb.left, aabb.top, aabb.width, aabb.height);
    this.strokeAndFill(opts);
  }
}
