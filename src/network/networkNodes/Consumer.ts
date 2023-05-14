// @flow
import { assert } from "@/lib/assert";
import * as ShapeHelpers from "@/lib/canvasShapeHelpers";
import { inBack, linear, reverse } from "@/lib/easings";
import Circle from "@/lib/geom/Circle";
import { Vector2 } from "@/lib/geom/Vector2";
import SceneObject from "@/lib/scene/SceneObject";
import { constrain, mapRange } from "@/lib/utils";
import ConnectionDirection from "@/network/ConnectionDirection";
import ConnectionSet from "@/network/ConnectionSet";
import Road from "@/network/Road";
import { RED } from "@/network/colors";
import Pulse from "@/network/effects/Pulse";
import { NetworkNode } from "@/network/networkNodes/NetworkNode";

const DEFAULT_COOLDOWN = 1000;

const RADIUS = 20;
const VISUAL_CONNECTION_RADIUS = 30;
const PULSE_RADIUS = 25;

const CLOCK_FADE_DURATION = 150;
const PULSE_DURATION = 500;

const MAIN_COLOR = RED.lighten(0.2).desaturate(0.5);
const CLOCK_COLOR = RED.darken(0.2);
const PULSE_COLOR = RED.lighten(0.2).fade(0.4);

export default class Consumer extends SceneObject implements NetworkNode {
    isDestination = true;
    _circle: Circle;
    _visualConnectionCircle: Circle;
    _cooldown: number;
    _timer = 0;
    _connectionSet: ConnectionSet = new ConnectionSet();

    constructor(x: number, y: number, cooldown: number = DEFAULT_COOLDOWN) {
        super();
        this._circle = Circle.create(x, y, RADIUS);
        this._visualConnectionCircle = Circle.create(x, y, VISUAL_CONNECTION_RADIUS);
        this._cooldown = cooldown;
    }

    get position(): Vector2 {
        return this._circle.center;
    }

    get canConsumeTraveller(): boolean {
        return this._timer >= this._cooldown;
    }

    get incomingConnections(): Road[] {
        return this._connectionSet.incoming;
    }

    get outgoingConnections(): Road[] {
        return this._connectionSet.outgoing;
    }

    getVisualConnectionPointAtAngle(radians: number): Vector2 {
        return this._visualConnectionCircle.pointOnCircumference(radians);
    }

    getAllReachableNodes(visited: Set<NetworkNode> = new Set()): NetworkNode[] {
        visited.add(this);
        return [this];
    }

    connectTo(node: Road, direction: ConnectionDirection) {
        this._connectionSet.add(node, direction);
    }

    consumeTraveller() {
        assert(this.canConsumeTraveller, "must be ready to consumer traveller");
        this._resetTimer();
        this._pulse();
    }

    override update(delta: number) {
        this._timer = constrain(0, this._cooldown, this._timer + delta);
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
        ShapeHelpers.circle(
            ctx,
            this._circle.center.x,
            this._circle.center.y,
            this._circle.radius * progress,
        );
        ctx.fill();
    }

    _resetTimer() {
        this._timer = 0;
    }

    _pulse() {
        this.getScene().addChildBefore(
            this,
            new Pulse({
                x: this._circle.center.x,
                y: this._circle.center.y,
                endRadius: RADIUS,
                startRadius: PULSE_RADIUS,
                duration: PULSE_DURATION,
                color: PULSE_COLOR,
                easeRadius: inBack(4),
                easeOpacity: reverse(linear),
                removeOnComplete: true,
            }),
        );
    }
}
