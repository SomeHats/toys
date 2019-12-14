import { normalizeAngle } from "./utils";

export class ReadonlyVector2 {
  static readonly ZERO = new ReadonlyVector2(0, 0);

  static fromPolar(angle: number, radius: number) {
    return new ReadonlyVector2(
      radius * Math.cos(angle),
      radius * Math.sin(angle)
    );
  }

  static average(points: ReadonlyArray<ReadonlyVector2>): ReadonlyVector2 {
    return Vector2.average(points).cloneReadonly();
  }

  constructor(public readonly x: number, public readonly y: number) {}

  get magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.magnitudeSquared);
  }

  get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  cloneMutable(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  cloneReadonly(): ReadonlyVector2 {
    return new ReadonlyVector2(this.x, this.y);
  }

  isInPolygon(polygon: ReadonlyArray<ReadonlyVector2>): boolean {
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

  equals(other: ReadonlyVector2) {
    return this === other || (this.x === other.x && this.y === other.y);
  }

  distanceTo({ x, y }: ReadonlyVector2): number {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  angleBetween(other: ReadonlyVector2): number {
    return normalizeAngle(
      Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x)
    );
  }

  dot(other: ReadonlyVector2): number {
    return this.x * other.x + this.y * other.y;
  }
}

export default class Vector2 extends ReadonlyVector2 {
  static fromPolar(angle: number, radius: number) {
    return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
  }

  static average(points: ReadonlyArray<ReadonlyVector2>): Vector2 {
    let sum = ReadonlyVector2.ZERO.cloneMutable();
    for (const point of points) {
      sum.add(point);
    }
    sum.div(points.length);
    return sum;
  }

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  div(scale: number): this {
    this.x = this.x / scale;
    this.y = this.y / scale;
    return this;
  }

  scale(scale: number): this {
    this.x = this.x * scale;
    this.y = this.y * scale;
    return this;
  }

  negate(): this {
    this.scale(-1);
    return this;
  }

  add({ x, y }: ReadonlyVector2): this {
    this.x += x;
    this.y += y;
    return this;
  }

  sub({ x, y }: ReadonlyVector2): this {
    this.x -= x;
    this.y -= y;
    return this;
  }

  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  setMagnitude(newMagnitude: number): this {
    this.scale(newMagnitude / this.magnitude);
    return this;
  }

  setAngle(newAngle: number): this {
    const magnitude = this.magnitude;
    this.x = magnitude * Math.cos(newAngle);
    this.y = magnitude * Math.sin(newAngle);
    return this;
  }

  rotate(byAngle: number): this {
    return this.setAngle(this.angle + byAngle);
  }
}
