import Vector2 from "./Vector2";

export default class AABB {
  constructor(public readonly origin: Vector2, public readonly size: Vector2) {
    Object.freeze(this);
  }

  contains({ x, y }: Vector2): boolean {
    return (
      this.left <= x && x <= this.right && this.top <= y && y <= this.bottom
    );
  }

  get left(): number {
    return this.origin.x;
  }

  get right(): number {
    return this.origin.x + this.size.x;
  }

  get top(): number {
    return this.origin.y;
  }

  get bottom(): number {
    return this.origin.y + this.size.y;
  }
}
