import { Vector2 } from "@/lib/geom/Vector2";

export default class AABB {
    static fromLeftTopRightBottom(
        left: number,
        top: number,
        right: number,
        bottom: number,
    ): AABB {
        return new AABB(
            new Vector2(left, top),
            new Vector2(right - left, bottom - top),
        );
    }

    static fromLeftTopWidthHeight(
        left: number,
        top: number,
        width: number,
        height: number,
    ): AABB {
        return new AABB(new Vector2(left, top), new Vector2(width, height));
    }

    constructor(
        public readonly origin: Vector2,
        public readonly size: Vector2,
    ) {
        Object.freeze(this);
    }

    contains({ x, y }: Vector2): boolean {
        return (
            this.left <= x &&
            x <= this.right &&
            this.top <= y &&
            y <= this.bottom
        );
    }

    intersects(other: AABB): boolean {
        return !(
            this.right < other.left ||
            this.left > other.right ||
            this.bottom < other.top ||
            this.top > other.bottom
        );
    }

    getCenter(): Vector2 {
        return this.origin.add(this.size.scale(0.5));
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

    get width(): number {
        return this.size.x;
    }

    get height(): number {
        return this.size.y;
    }
}
