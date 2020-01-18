// @flow
import { assert } from '../assert';
import Vector2 from './Vector2';

const isSlopeVertical = (slope: number) =>
  slope === Infinity || slope === -Infinity;

export default class Line2 {
  static fromSlopeAndDisplacement(slope: number, displacement: number) {
    assert(
      !isSlopeVertical(slope),
      'cannot create vertical line from displacement',
    );

    const start = new Vector2(0, displacement);
    const end = new Vector2(1, slope + displacement);
    return new Line2(start, end);
  }

  static fromSlopeAndPoint(slope: number, point: Vector2): Line2 {
    if (isSlopeVertical(slope)) {
      return new Line2(point, new Vector2(point.x, point.y + 1));
    }

    const displacement = point.y - point.x * slope;
    return Line2.fromSlopeAndDisplacement(slope, displacement);
  }

  readonly start: Vector2;
  readonly end: Vector2;

  constructor(a: Vector2, b: Vector2) {
    this.start = a;
    this.end = b;
  }

  getDelta(): Vector2 {
    return this.end.sub(this.start);
  }

  get slope(): number {
    return (this.end.y - this.start.y) / (this.end.x - this.start.x);
  }

  get displacement(): number {
    return this.start.y - this.start.x * this.slope;
  }

  get isVertical(): boolean {
    return isSlopeVertical(this.slope);
  }

  get verticalX(): number {
    assert(this.isVertical, 'verticalX is not defined on non vertical lines');
    return this.start.x;
  }

  get perpendicularSlope(): number {
    if (this.isVertical) return 0;
    return -1 / this.slope;
  }

  isParallelTo(other: Line2): boolean {
    return (this.isVertical && other.isVertical) || this.slope === other.slope;
  }

  perpendicularLineThroughPoint(point: Vector2): Line2 {
    return Line2.fromSlopeAndPoint(this.perpendicularSlope, point);
  }

  pointAtIntersectionWith(other: Line2): Vector2 {
    assert(!this.isParallelTo(other), 'parallel lines do not intersect');

    let x;
    if (this.isVertical) {
      x = this.verticalX;
    } else if (other.isVertical) {
      x = other.verticalX;
    } else {
      x = (this.displacement - other.displacement) / (other.slope - this.slope);
    }

    const y = this.isVertical
      ? other.slope * x + other.displacement
      : this.slope * x + this.displacement;

    return new Vector2(x, y);
  }
}
