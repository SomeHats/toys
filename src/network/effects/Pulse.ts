import Color from "color";
import SceneObject from "../../lib/scene/SceneObject";
import * as ShapeHelpers from "../../lib/canvasShapeHelpers";
import Circle from "../../lib/geom/Circle";
import { linear, Easing } from "../../lib/easings";
import { lerp } from "../../lib/utils";

type PulseOptions = {
    x: number;
    y: number;
    startRadius: number;
    endRadius: number;
    duration: number;
    color: Color;
    easeRadius?: Easing;
    easeOpacity?: Easing;
    removeOnComplete?: boolean;
};

export default class Pulse extends SceneObject {
    _circle: Circle;
    _startRadius: number;
    _endRadius: number;
    _duration: number;
    _color: Color;
    _progress: number;
    _easeRadius: Easing;
    _easeOpacity: Easing;
    _removeOnComplete: boolean;

    constructor({
        x,
        y,
        startRadius,
        endRadius,
        duration,
        color,
        easeRadius = linear,
        easeOpacity = linear,
        removeOnComplete = false,
    }: PulseOptions) {
        super();
        this._circle = Circle.create(x, y, startRadius);
        this._startRadius = startRadius;
        this._endRadius = endRadius;
        this._duration = duration;
        this._color = color;
        this._progress = 0;
        this._easeRadius = easeRadius;
        this._easeOpacity = easeOpacity;
        this._removeOnComplete = removeOnComplete;
    }

    override update(deltaTime: number) {
        const deltaProgress = deltaTime / this._duration;
        this._progress = Math.min(1, this._progress + deltaProgress);
        this._circle = this._circle.withRadius(
            lerp(this._startRadius, this._endRadius, this._easeRadius(this._progress)),
        );

        if (this._progress === 1 && this._removeOnComplete) {
            this.getScene().removeChild(this);
        }
    }

    override draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const opacity = this._easeOpacity(this._progress);
        ctx.fillStyle = this._color.fade(opacity).toString();
        ShapeHelpers.circle(ctx, this._circle.center.x, this._circle.center.y, this._circle.radius);
        ctx.fill();
    }
}
