// @flow
import SceneObject from "@/lib/scene/SceneObject";
import Circle from "@/lib/geom/Circle";
import Vector2 from "@/lib/geom/Vector2";
import * as ShapeHelpers from "@/lib/canvasShapeHelpers";
import { outSin } from "@/lib/easings";
import { mapRange, constrain, flatten, uniq } from "@/lib/utils";
import Pulse from "@/network/effects/Pulse";
import { TEAL } from "@/network/colors";
import ConnectionSet from "@/network/ConnectionSet";
import ConnectionDirection from "@/network/ConnectionDirection";
import Traveller from "@/network/Traveller";
import Road from "@/network/Road";
import { NetworkNode } from "@/network/networkNodes/NetworkNode";

const DEFAULT_COOLDOWN = 500;

const RADIUS = 20;
const VISUAL_CONNECTION_RADIUS = 30;
const CLOCK_RADIUS = RADIUS * 0.7;
const PULSE_RADIUS = 35;

const PULSE_DURATION = 500;
const CLOCK_FADE_DURATION = 150;

const MAIN_COLOR = TEAL.lighten(0.1);
const CLOCK_COLOR = TEAL.darken(0.1);
const PULSE_COLOR = TEAL.lighten(0.2).fade(0.1);

export default class Producer extends SceneObject implements NetworkNode {
    isDestination = false;
    canConsumeTraveller = false;
    _circle: Circle;
    _visualConnectionCircle: Circle;
    _cooldown: number;
    _timer: number;
    _connectionSet: ConnectionSet = new ConnectionSet();

    constructor(x: number, y: number, cooldown: number = DEFAULT_COOLDOWN) {
        super();
        this._circle = Circle.create(x, y, RADIUS);
        this._visualConnectionCircle = Circle.create(x, y, VISUAL_CONNECTION_RADIUS);
        this._cooldown = cooldown;
        this._timer = cooldown;
    }

    get position(): Vector2 {
        return this._circle.center;
    }

    get incomingConnections(): Road[] {
        return this._connectionSet.incoming;
    }

    get outgoingConnections(): Road[] {
        return this._connectionSet.outgoing;
    }

    getAllReachableNodes(visited: Set<NetworkNode> = new Set()) {
        visited.add(this);
        return uniq(
            flatten(this._connectionSet.outgoing.map((road) => road.getAllReachableNodes(visited))),
        );
    }

    getVisualConnectionPointAtAngle(radians: number): Vector2 {
        return this._visualConnectionCircle.pointOnCircumference(radians);
    }

    consumeTraveller() {
        throw new Error("producer cannot consume traveller");
    }

    connectTo(node: Road, direction: ConnectionDirection) {
        this._connectionSet.add(node, direction);
    }

    override update(delta: number) {
        this._timer = constrain(0, this._cooldown, this._timer + delta);
        if (this._timer >= this._cooldown) {
            this._onTimerEnd();
        }
    }

    override draw(ctx: CanvasRenderingContext2D) {
        const progress = this._timer / this._cooldown;

        const colorMixAmount = constrain(0, 1, mapRange(0, CLOCK_FADE_DURATION, 1, 0, this._timer));
        const bgColor = MAIN_COLOR.mix(CLOCK_COLOR, colorMixAmount);

        ctx.beginPath();
        ctx.fillStyle = bgColor.toString();
        ShapeHelpers.circle(ctx, this._circle.center.x, this._circle.center.y, this._circle.radius);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = CLOCK_COLOR.toString();
        ctx.moveTo(this._circle.center.x, this._circle.center.y);
        ctx.arc(
            this._circle.center.x,
            this._circle.center.y,
            this._circle.radius,
            -Math.PI / 2,
            progress * 2 * Math.PI - Math.PI / 2,
            false,
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = MAIN_COLOR.toString();
        ShapeHelpers.circle(ctx, this._circle.center.x, this._circle.center.y, CLOCK_RADIUS);
        ctx.fill();
    }

    _resetTimer() {
        this._timer = 0;
    }

    _onTimerEnd() {
        const didEmitTraveller = this._attemptEmitTraveller();
        if (didEmitTraveller) {
            this._pulse();
            this._resetTimer();
        }
    }

    _pulse() {
        this.getScene().addChildBefore(
            this,
            new Pulse({
                x: this._circle.center.x,
                y: this._circle.center.y,
                startRadius: RADIUS,
                endRadius: PULSE_RADIUS,
                duration: PULSE_DURATION,
                color: PULSE_COLOR,
                easeRadius: outSin,
                removeOnComplete: true,
            }),
        );
    }

    _attemptEmitTraveller(): boolean {
        const road = this._connectionSet.sampleOutgoing();
        if (!(road instanceof Road)) return false;

        if (road.canAddTravellerAtStart()) {
            const traveller = new Traveller();
            road.addTravellerAtStart(traveller);
            this.getScene().addChild(traveller);
            return true;
        } else {
            return false;
        }
    }
}
