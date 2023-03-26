// @flow
import { Vector2 } from "@/lib/geom/Vector2";
import AABB from "@/lib/geom/AABB";
import { Line2 } from "@/lib/geom/Line2";

export default class Circle {
    static create(x: number, y: number, radius: number): Circle {
        return new Circle(new Vector2(x, y), radius);
    }
    constructor(readonly center: Vector2, readonly radius: number) {}

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
        return Circle.create(this.center.x, this.center.y, radius);
    }

    outerTangentsWith(other: Circle): [Line2, Line2] | undefined {
        const distance = this.center.distanceTo(other.center);
        if (distance <= Math.abs(this.radius - other.radius)) {
            // The circles are coinciding. There are no valid tangents.
            return undefined;
        }

        const angle = this.center.angleTo(other.center);
        const normalAngle = Math.acos((this.radius - other.radius) / distance);

        return [
            new Line2(
                this.pointOnCircumference(angle - normalAngle),
                other.pointOnCircumference(angle - normalAngle),
            ),
            new Line2(
                this.pointOnCircumference(angle + normalAngle),
                other.pointOnCircumference(angle + normalAngle),
            ),
        ];
    }
}
