// @flow
import * as ShapeHelpers from "@/lib/canvasShapeHelpers";
import { Path } from "@/lib/geom/Path";
import StraightPathSegment from "@/lib/geom/StraightPathSegment";
import { Vector2 } from "@/lib/geom/Vector2";
import SceneObject from "@/lib/scene/SceneObject";
import ConnectionDirection from "@/network/ConnectionDirection";
import Junction from "@/network/Junction";
import Traveller from "@/network/Traveller";
import { YELLOW } from "@/network/colors";
import { NetworkNode } from "@/network/networkNodes/NetworkNode";

// const ROAD_OUTER_COLOR = BLUE;
// const ROAD_INNER_COLOR = LIGHT_BG;
const ROAD_DASH_COLOR = YELLOW.darken(0.2);
// const ROAD_OUTER_WIDTH = 12;
// const ROAD_INNER_WIDTH = 13;
const ROAD_DASH_WIDTH = 3;
const ROAD_IDEAL_DASH = [5, 10];
const ROAD_IDEAL_DASH_LENGTH = ROAD_IDEAL_DASH.reduce((a, b) => a + b, 0);
const ROAD_DASH_SPEED = 0.05;

export interface RoadOptions {
    autoRound?: number;
    points?: Vector2[];
    path?: Path;
}

export default class Road extends SceneObject {
    isNode = false;
    from: NetworkNode;
    to: NetworkNode;
    _path: Path;
    _currentTravellers: Traveller[] = [];

    constructor(
        from: NetworkNode | Junction,
        to: NetworkNode | Junction,
        { points, autoRound, path }: RoadOptions = {},
    ) {
        super();

        const angleFrom =
            points ?
                from.position.angleTo(points[0])
            :   from.position.angleTo(to.position);

        const angleTo =
            points ?
                to.position.angleTo(points[points.length - 1])
            :   to.position.angleTo(from.position);

        if (path) {
            this._path = path;
        } else if (points) {
            this._path = Path.straightThroughPoints(
                from.getVisualConnectionPointAtAngle(angleFrom),
                ...points,
                to.getVisualConnectionPointAtAngle(angleTo),
            );
        } else {
            this._path = new Path().addSegment(
                new StraightPathSegment(
                    from.getVisualConnectionPointAtAngle(angleFrom),
                    to.getVisualConnectionPointAtAngle(angleTo),
                ),
            );
        }

        if (autoRound != null) {
            this._path.autoRound(autoRound);
        }

        if (from instanceof Junction) {
            this.from = from.connectToRoadAtAngle(
                this,
                angleFrom,
                ConnectionDirection.OUT,
            );
        } else {
            this.from = from;
            from.connectTo(this, ConnectionDirection.OUT);
        }

        if (to instanceof Junction) {
            this.to = to.connectToRoadAtAngle(
                this,
                angleTo,
                ConnectionDirection.IN,
            );
        } else {
            this.to = to;
            to.connectTo(this, ConnectionDirection.IN);
        }
    }

    get length(): number {
        return this._path.getLength();
    }

    get start(): Vector2 {
        return this._path.getStart();
    }

    get end(): Vector2 {
        return this._path.getEnd();
    }

    get expectedTimeFromStartToEnd(): number {
        if (this._currentTravellers.length) {
            const avgSpeed =
                this._currentTravellers.reduce(
                    (sum, traveller) => sum + traveller.speed,
                    0,
                ) / this._currentTravellers.length;
            return this.length / avgSpeed;
        }

        return this.length / (Traveller.MAX_SPEED * 0.7);
    }

    canAddTravellerAtStart(): boolean {
        const nextTraveller = this.getTravellerAfterPosition(0);
        if (!nextTraveller) return true;
        return (
            nextTraveller.positionOnCurrentRoad >
            nextTraveller.comfortableRadius
        );
    }

    addTravellerAtStart(traveller: Traveller) {
        this._currentTravellers.push(traveller);
        traveller.onAddedToRoad(this);
    }

    removeTraveller(traveller: Traveller): boolean {
        const index = this._currentTravellers.indexOf(traveller);
        if (index === -1) return false;
        this.removeTravellerAtIndex(index);
        return true;
    }

    removeTravellerAtIndex(index: number): Traveller {
        const traveller = this._currentTravellers[index];
        this._currentTravellers.splice(index, 1);
        traveller.onRemovedFromRoad();
        return traveller;
    }

    getAllReachableNodes(visited = new Set<NetworkNode>()): NetworkNode[] {
        const nodes = [] as NetworkNode[];
        if (visited.has(this.to)) return nodes;
        return [...this.to.getAllReachableNodes(visited), this.to];
    }

    getPointAtPosition(position: number): Vector2 {
        return this._path.getPointAtPosition(position);
    }

    getAngleAtPosition(position: number): number {
        return this._path.getAngleAtPosition(position);
    }

    getTravellerAfterPosition(position: number): Traveller | null {
        let bestTraveller = null;
        let bestDistance = Infinity;

        this._currentTravellers.forEach((traveller) => {
            const distance = traveller.positionOnCurrentRoad - position;
            if (distance <= 0) return;
            if (distance < bestDistance) {
                bestDistance = distance;
                bestTraveller = traveller;
            }
        });

        return bestTraveller;
    }

    getTravellerBeforePosition(position: number): Traveller | null {
        let bestTraveller = null;
        let bestDistance = Infinity;

        this._currentTravellers.forEach((traveller) => {
            const distance = position - traveller.positionOnCurrentRoad;
            if (distance <= 0) return;
            if (distance < bestDistance) {
                bestDistance = distance;
                bestTraveller = traveller;
            }
        });

        return bestTraveller;
    }

    override draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ShapeHelpers.path(ctx, this._path);

        // ctx.strokeStyle = ROAD_OUTER_COLOR.toString();
        // ctx.lineWidth = ROAD_OUTER_WIDTH;
        // ctx.stroke();

        // ctx.strokeStyle = ROAD_INNER_COLOR.toString();
        // ctx.lineWidth = ROAD_INNER_WIDTH;
        // ctx.stroke();

        const dashScale = this._getLineDashScale();
        const dashLength = ROAD_IDEAL_DASH_LENGTH * dashScale;
        ctx.setLineDash(ROAD_IDEAL_DASH.map((length) => length * dashScale));
        ctx.strokeStyle = ROAD_DASH_COLOR.toString();
        ctx.lineDashOffset = (-time * ROAD_DASH_SPEED * dashScale) % dashLength;
        ctx.lineWidth = ROAD_DASH_WIDTH;
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 1;
        ctx.stroke();
    }

    _getLineDashScale(): number {
        const wholeDashCount = Math.floor(this.length / ROAD_IDEAL_DASH_LENGTH);
        const wholeDashLength = wholeDashCount * ROAD_IDEAL_DASH_LENGTH;

        const roundDownLength = this.length - wholeDashLength;
        const roundUpLength =
            wholeDashLength + ROAD_IDEAL_DASH_LENGTH - this.length;

        const dashScale =
            roundDownLength < roundUpLength ?
                this.length / wholeDashLength
            :   this.length / (wholeDashLength + ROAD_IDEAL_DASH_LENGTH);

        return dashScale;
    }
}
