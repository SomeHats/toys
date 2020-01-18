import { normalizeAngle, lerp } from '../utils';

export default class Vector2 {
  static readonly ZERO = new Vector2(0, 0);

  static fromPolar(angle: number, radius: number) {
    return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
  }

  static average(points: ReadonlyArray<Vector2>): Vector2 {
    const sum = points.reduce((memo, p) => memo.add(p), Vector2.ZERO);
    return sum.div(points.length);
  }

  constructor(public readonly x: number, public readonly y: number) {}

  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  get magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.magnitudeSquared);
  }

  get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  isInPolygon(polygon: ReadonlyArray<Vector2>): boolean {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    const { x, y } = this;

    let isInside = false;
    for (
      let currentIdx = 0, previousIdx = polygon.length - 1;
      currentIdx < polygon.length;
      previousIdx = currentIdx++
    ) {
      const { x: currentX, y: currentY } = polygon[currentIdx];
      const { x: previousX, y: previousY } = polygon[previousIdx];
      const doesIntersect =
        currentY > y != previousY > y &&
        x <
          ((previousX - currentX) * (y - currentY)) / (previousY - currentY) +
            currentX;

      if (doesIntersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  equals(other: Vector2) {
    return this === other || (this.x === other.x && this.y === other.y);
  }

  distanceTo({ x, y }: Vector2): number {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  angleTo(other: Vector2): number {
    return other.sub(this).angle;
  }

  angleBetween(other: Vector2): number {
    return normalizeAngle(
      Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x),
    );
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  div(scale: number): Vector2 {
    return new Vector2(this.x / scale, this.y / scale);
  }

  scale(scale: number): Vector2 {
    return new Vector2(this.x * scale, this.y * scale);
  }

  negate(): Vector2 {
    return this.scale(-1);
  }

  add({ x, y }: Vector2): Vector2 {
    return new Vector2(this.x + x, this.y + y);
  }

  sub({ x, y }: Vector2): Vector2 {
    return new Vector2(this.x - x, this.y - y);
  }

  floor(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  ceil(): Vector2 {
    return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
  }

  round(): Vector2 {
    return new Vector2(Math.round(this.x), Math.round(this.y));
  }

  withMagnitude(newMagnitude: number): Vector2 {
    return Vector2.fromPolar(this.angle, newMagnitude);
  }

  withAngle(newAngle: number): Vector2 {
    return Vector2.fromPolar(newAngle, this.magnitude);
  }

  rotate(byAngle: number): Vector2 {
    return this.withAngle(this.angle + byAngle);
  }

  lerp(other: Vector2, n: number): Vector2 {
    return new Vector2(lerp(this.x, other.x, n), lerp(this.y, other.y, n));
  }
}
