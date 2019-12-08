import Vector2, { ReadonlyVector2 } from "./Vector2";

const DEFAULT_DEBUG_COLOR = "magenta";
const LABEL_OFFSET = new ReadonlyVector2(5, 0);
const DEBUG_POINT_SIZE = 3;
const HAIRLINE = 0.5;
const DEBUG_ARROW_ANGLE = Math.PI * 0.75;
const DEBUG_ARROW_SIZE = 5;

type StrokeOptions = {
  strokeWidth?: number;
  stroke?: string;
};

type FillOptions = {
  fill?: string;
};

type DebugOptions = {
  color?: string;
  label?: string;
};

type StrokeAndFillOptions = StrokeOptions & FillOptions;

export class DebugDraw {
  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  public beginPath() {
    this.ctx.beginPath();
  }

  public moveTo({ x, y }: ReadonlyVector2) {
    this.ctx.moveTo(x, y);
  }

  public lineTo({ x, y }: ReadonlyVector2) {
    this.ctx.lineTo(x, y);
  }

  public applyStrokeOptions({
    strokeWidth = 1,
    stroke = undefined
  }: StrokeOptions) {
    if (stroke) {
      this.ctx.lineWidth = strokeWidth;
      this.ctx.strokeStyle = stroke;
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
    color: string = DEFAULT_DEBUG_COLOR
  ): StrokeOptions {
    return { stroke: color, strokeWidth: HAIRLINE };
  }

  public debugStroke(color: string = DEFAULT_DEBUG_COLOR) {
    this.stroke(this.getDebugStrokeOptions(color));
  }

  public fillText(
    text: string,
    position: ReadonlyVector2,
    options: FillOptions = {}
  ) {
    this.applyFillOptions(options);
    this.ctx.fillText(text, position.x, position.y);
  }

  public circle(
    center: ReadonlyVector2,
    radius: number,
    options: StrokeAndFillOptions
  ) {
    this.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.strokeAndFill(options);
  }

  public debugLabel(
    label: string | undefined,
    position: ReadonlyVector2,
    color: string
  ) {
    if (label) {
      this.applyFillOptions({ fill: color });
      this.fillText(label, position.cloneMutable().add(LABEL_OFFSET));
    }
  }

  public debugPointX(
    position: ReadonlyVector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {}
  ) {
    this.debugLabel(label, position, color);

    this.beginPath();
    this.ctx.moveTo(
      position.x - DEBUG_POINT_SIZE,
      position.y - DEBUG_POINT_SIZE
    );
    this.ctx.lineTo(
      position.x + DEBUG_POINT_SIZE,
      position.y + DEBUG_POINT_SIZE
    );
    this.ctx.moveTo(
      position.x + DEBUG_POINT_SIZE,
      position.y - DEBUG_POINT_SIZE
    );
    this.ctx.lineTo(
      position.x - DEBUG_POINT_SIZE,
      position.y + DEBUG_POINT_SIZE
    );
    this.stroke({ strokeWidth: HAIRLINE, stroke: color });
  }

  public debugPointO(
    position: ReadonlyVector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {}
  ) {
    this.debugLabel(label, position, color);

    this.circle(position, DEBUG_POINT_SIZE, {
      strokeWidth: HAIRLINE,
      stroke: color
    });
  }

  public debugArrow(
    start: ReadonlyVector2,
    end: ReadonlyVector2,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {}
  ) {
    this.debugLabel(label, Vector2.average([start, end]), color);

    this.ctx.beginPath();
    this.moveTo(start);
    this.lineTo(end);

    const vector = end.cloneMutable().sub(start);
    const arrowLeftPoint = vector
      .cloneMutable()
      .rotate(-DEBUG_ARROW_ANGLE)
      .setMagnitude(DEBUG_ARROW_SIZE)
      .add(end);
    const arrowRightPoint = vector
      .cloneMutable()
      .rotate(+DEBUG_ARROW_ANGLE)
      .setMagnitude(DEBUG_ARROW_SIZE)
      .add(end);

    this.moveTo(arrowLeftPoint);
    this.lineTo(end);
    this.lineTo(arrowRightPoint);
    this.stroke({ strokeWidth: HAIRLINE, stroke: color });
  }

  public polygon(
    polygon: ReadonlyArray<ReadonlyVector2>,
    options: StrokeAndFillOptions = {}
  ) {
    this.beginPath();
    this.moveTo(polygon[polygon.length - 1]);
    for (const point of polygon) {
      this.lineTo(point);
    }
    this.strokeAndFill(options);
  }

  public debugPolygon(
    polygon: ReadonlyArray<ReadonlyVector2>,
    { color = DEFAULT_DEBUG_COLOR, label = undefined }: DebugOptions = {}
  ) {
    this.debugLabel(label, polygon[0], color);
    this.polygon(polygon, this.getDebugStrokeOptions(color));
  }
}
