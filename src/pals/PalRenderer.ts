import Component from "../lib/scene/Component";
import { PalControlData } from "./PalController";
import Entity from "../lib/scene/Entity";
import PalGeom from "./PalGeom";
import * as ShapeHelpers from "../lib/canvasShapeHelpers";
import { normalizeAngle, constrain } from "../lib/utils";
import Circle from "../lib/geom/Circle";
import { PalConfig } from "./PalConfig";
import PalLegGeom from "./PalLegGeom";
import Vector2 from "../lib/geom/Vector2";

const Y_SCALE = 0.3;
const HALF_PI = Math.PI / 2;

export default class PalRenderer extends Component {
    private data: PalControlData;
    private geom: PalGeom;

    constructor(entity: Entity, private config: PalConfig) {
        super(entity);
        this.data = entity.getComponent(PalControlData);
        this.geom = entity.getComponent(PalGeom);
    }

    override draw(ctx: CanvasRenderingContext2D) {
        const heading = normalizeAngle(this.data.heading);

        ctx.setLineDash([]);
        ctx.beginPath();

        const bod = this.geom.getBod();
        ctx.ellipse(
            this.data.position.x,
            this.data.position.y,
            bod.radius * 0.8,
            bod.radius * 0.8 * 0.3,
            0,
            0,
            2 * Math.PI,
        );
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fill();

        this.geom.legs
            .filter((l) => normalizeAngle(l.angleOffset + heading) < 0)
            .forEach((leg) => this.drawLeg(ctx, leg));
        this.geom.legs
            .filter((l) => normalizeAngle(l.angleOffset + heading) >= 0)
            .forEach((leg) => this.drawLeg(ctx, leg));
        this.drawBod(ctx, bod);
    }

    private drawLeg(ctx: CanvasRenderingContext2D, leg: PalLegGeom) {
        ctx.beginPath();

        const angle = this.data.heading + leg.angleOffset;

        const colorDarkenAmount = constrain(
            0,
            1,
            Math.abs(normalizeAngle(-HALF_PI - angle) / HALF_PI),
        );
        const legColor = this.config.color.darken(
            0.2 * (1 - colorDarkenAmount * colorDarkenAmount),
        );

        const hip = this.projectZ(leg.getHipXY(), leg.getHipZ(), leg.getHipOrigin());
        const knee = this.projectZ(leg.getKneeXY(), leg.getKneeZ(), leg.getKneeOrigin());
        const foot = this.projectZ(leg.getFootXY(), leg.getFootZ(), leg.getFootOrigin());

        ctx.moveTo(hip.x, hip.y);
        ctx.quadraticCurveTo(knee.x, knee.y, foot.x, foot.y);
        ctx.lineCap = "round";
        ctx.strokeStyle = legColor.toString();
        ctx.lineWidth = this.config.legWidth;
        ctx.stroke();
    }

    private drawBod(ctx: CanvasRenderingContext2D, bod: Circle) {
        ctx.save();
        ctx.beginPath();
        ShapeHelpers.circle(ctx, bod.center.x, bod.center.y, this.config.radius);
        ctx.fillStyle = this.config.color.toString();
        ctx.fill();
        ctx.clip();

        const faceX = (normalizeAngle(HALF_PI - this.data.heading) / HALF_PI) * this.config.radius;

        // EYES
        ctx.beginPath();
        ShapeHelpers.circle(
            ctx,
            faceX + bod.center.x + this.config.eyeX,
            bod.center.y - this.config.eyeY,
            this.config.eyeRadius,
        );
        ShapeHelpers.circle(
            ctx,
            faceX + bod.center.x - this.config.eyeX,
            bod.center.y - this.config.eyeY,
            this.config.eyeRadius,
        );
        ctx.fillStyle = this.config.color.darken(0.5).toString();
        ctx.fill();

        // MOUTH
        ctx.beginPath();
        ctx.moveTo(
            faceX + bod.center.x - this.config.mouthWidth,
            bod.center.y - this.config.mouthY,
        );
        ctx.quadraticCurveTo(
            faceX + bod.center.x,
            bod.center.y - this.config.mouthY + this.config.mouthSmile,
            faceX + bod.center.x + this.config.mouthWidth,
            bod.center.y - this.config.mouthY,
        );
        ctx.lineWidth = this.config.mouthThickness;
        ctx.strokeStyle = this.config.color.darken(0.5).toString();
        ctx.stroke();

        // BUTT
        ctx.beginPath();
        this.makeButtLine(ctx, bod, faceX + this.config.radius * 2);
        this.makeButtLine(ctx, bod, faceX - this.config.radius * 2);
        ctx.lineWidth = this.config.buttThickness;
        ctx.strokeStyle = this.config.color.darken(0.3).toString();
        ctx.stroke();

        ctx.restore();
    }

    private makeButtLine(ctx: CanvasRenderingContext2D, bod: Circle, buttX: number) {
        ctx.moveTo(buttX * 1.6 + bod.center.x, bod.center.y + this.config.buttTop);
        ctx.quadraticCurveTo(
            buttX * 1.7 + bod.center.x,
            bod.center.y + (this.config.buttTop + this.config.buttBottom) * 0.65,
            buttX + bod.center.x,
            bod.center.y + this.config.buttBottom,
        );
    }

    private projectZ(xy: Vector2, z: number, origin: Vector2): Vector2 {
        return new Vector2(xy.x, origin.y - z + (xy.y - origin.y) * Y_SCALE);
    }
}
