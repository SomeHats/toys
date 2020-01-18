// @flow
import Vector2 from './Vector2';
import AABB from './AABB';

export default class Circle {
  readonly center: Vector2;
  readonly radius: number;

  constructor(x: number, y: number, radius: number) {
    this.center = new Vector2(x, y);
    this.radius = radius;
    Object.freeze(this);
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  getBoundingBox(): AABB {
    return new AABB(
      new Vector2(this.center.x, this.center.y),
      new Vector2(this.radius * 2, this.radius * 2),
    );
  }

  // debugDraw(color: string) {
  //   const ctx: CanvasRenderingContext2D = window.debugContext;
  //   ctx.strokeStyle = color;
  //   ctx.lineWidth = 1;
  //   ctx.beginPath();
  //   ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
  //   ctx.stroke();
  // }

  pointOnCircumference(radians: number): Vector2 {
    return new Vector2(
      this.center.x + Math.cos(radians) * this.radius,
      this.center.y + Math.sin(radians) * this.radius,
    );
  }

  containsPoint(point: Vector2): boolean {
    return point.distanceTo(this.center) < this.radius;
  }

  intersectsCircle(other: Circle): boolean {
    return this.center.distanceTo(other.center) < this.radius + other.radius;
  }

  withRadius(radius: number): Circle {
    return new Circle(this.center.x, this.center.y, radius);
  }
}
