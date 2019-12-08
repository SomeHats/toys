import Vector2, { ReadonlyVector2 } from "./Vector2";

export class AABB {
  constructor(
    public readonly origin: ReadonlyVector2,
    public readonly size: ReadonlyVector2
  ) {}

  contains({ x, y }: ReadonlyVector2): boolean {
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
