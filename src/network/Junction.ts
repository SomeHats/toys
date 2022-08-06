// @flow
import { compact } from "@/lib/utils";
import SceneObject from "@/lib/scene/SceneObject";
import Scene from "@/lib/scene/Scene";
import Vector2 from "@/lib/geom/Vector2";
import Circle from "@/lib/geom/Circle";
import Path from "@/lib/geom/Path";
import Road from "@/network/Road";
import Intersection from "@/network/networkNodes/Intersection";
import ConnectionDirection from "@/network/ConnectionDirection";

export default class Junction extends SceneObject {
    _circle: Circle;
    _intersectionsByAngle: { [angleString: string]: Intersection } = {};
    _incomingIntersections: Set<Intersection> = new Set();
    _outgoingIntersections: Set<Intersection> = new Set();
    _roads: Road[] = [];

    constructor(x: number, y: number, radius: number) {
        super();
        this._circle = Circle.create(x, y, radius);
    }

    get position(): Vector2 {
        return this._circle.center;
    }

    override onAddedToScene(scene: Scene) {
        super.onAddedToScene(scene);
        this._roads.forEach((road) => scene.addChild(road));
    }

    getVisualConnectionPointAtAngle(radians: number): Vector2 {
        return this._circle.pointOnCircumference(radians);
    }

    connectToRoadAtAngle(road: Road, angle: number, direction: ConnectionDirection): Intersection {
        const intersection = this._intersectionAtAngle(angle);
        intersection.connectTo(road, direction);

        const isIncoming =
            direction === ConnectionDirection.IN || this._incomingIntersections.has(intersection);

        const isOutgoing =
            direction === ConnectionDirection.OUT || this._outgoingIntersections.has(intersection);

        if (isIncoming) this._incomingIntersections.add(intersection);
        if (isOutgoing) this._outgoingIntersections.add(intersection);

        this._intersections.forEach((other) => {
            if (other === intersection) return;

            if (isIncoming && this._outgoingIntersections.has(other)) {
                const path = new Path(
                    Path.segmentAcrossCircle(
                        this._circle,
                        this._circle.center.sub(intersection.position).angle,
                        other.position.sub(this._circle.center).angle,
                    ),
                );

                this._addRoad(new Road(intersection, other, { path }));
            }

            if (isOutgoing && this._incomingIntersections.has(other)) {
                const path = new Path(
                    Path.segmentAcrossCircle(
                        this._circle,
                        this._circle.center.sub(other.position).angle,
                        intersection.position.sub(this._circle.center).angle,
                    ),
                );
                this._addRoad(new Road(other, intersection, { path }));
            }
        });

        return intersection;
    }

    _intersectionAtAngle(angle: number): Intersection {
        const angleStr = angle.toString();
        if (this._intersectionsByAngle[angleStr]) {
            return this._intersectionsByAngle[angleStr];
        }

        const intersection = this._createIntersectionAtAngle(angle);
        this._intersectionsByAngle[angleStr] = intersection;
        return intersection;
    }

    _createIntersectionAtAngle(angle: number): Intersection {
        const position = this.getVisualConnectionPointAtAngle(angle);
        return new Intersection(position.x, position.y);
    }

    get _intersections(): Intersection[] {
        return compact(
            Object.keys(this._intersectionsByAngle).map(
                (angle) => this._intersectionsByAngle[angle],
            ),
        );
    }

    _addRoad(road: Road) {
        this._roads.push(road);
        if (this.hasScene()) {
            this.getScene().addChild(road);
        }
    }
}
