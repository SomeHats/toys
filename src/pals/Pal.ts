import { assert } from '../lib/assert';
import Color from 'color';
import SceneObject from '../lib/scene/SceneObject';
import Vector2 from '../lib/geom/Vector2';
import Circle from '../lib/geom/Circle';
import * as ShapeHelpers from '../lib/canvasShapeHelpers';
import {
  lerp,
  constrain,
  normalizeAngle,
  varyRelative,
  varyAbsolute,
  random,
  randomInt,
  flatten,
  times,
  shuffle,
} from '../lib/utils';
import { BLUE } from './colors';
import PalLeg from './PalLeg';

// const RADIUS = 14;
// const BOD_HEIGHT = 25;
// const BOD_BOB = 15;

// const EYE_Y = 6;
// const EYE_X = 5;
// const EYE_RADIUS = 2;
// const MOUTH_THICKNESS = 2;
// const MOUTH_Y = 2;
// const MOUTH_WIDTH = 8;
// const MOUNT_SMILE = 4;
// const BUTT_TOP = 6;
// const BUTT_BOTTOM = 12;
// const BUTT_THICKNESS = 1.4;

// const BOD_COLOR = BLUE.lighten(0.2);
// const FACE_COLOR = BLUE.darken(0.3);
// const BUTT_COLOR = BLUE.darken(0.1);

const MAX_SPEED = 80;
const ACCELERATION = 200;
const DECELERATION = 200;

const HALF_PI = Math.PI / 2;

export type PalConfig = {
  radius: number;
  bodHeight: number;
  bodBob: number;
  eyeY: number;
  eyeX: number;
  eyeRadius: number;
  mouthThickness: number;
  mouthY: number;
  mouthWidth: number;
  mouthSmile: number;
  buttTop: number;
  buttBottom: number;
  buttThickness: number;
  color: Color;
  hipHeight: number;
  kneeScale: number;
  legMaxLift: number;
  kneeMaxOut: number;
  stepDuration: number;
  stepRestDuration: number;
  stepThreshold: number;
  fullStepDistance: number;
  legWidth: number;
  legPairs: number;
};

// eslint-disable-next-line no-unused-vars
const classicPalConfig: PalConfig = {
  radius: 14,
  bodHeight: 25,
  bodBob: 15,
  eyeY: 6,
  eyeX: 5,
  eyeRadius: 2,
  mouthThickness: 2,
  mouthY: 2,
  mouthWidth: 8,
  mouthSmile: 4,
  buttTop: 6,
  buttBottom: 12,
  buttThickness: 1.4,
  color: BLUE.lighten(0.2),
  hipHeight: 10,
  kneeScale: 1.3,
  legMaxLift: 0.3,
  kneeMaxOut: 14,
  stepDuration: 0.2,
  stepRestDuration: 0.2,
  stepThreshold: 0.2,
  fullStepDistance: 20,
  legWidth: 4,
  legPairs: 1,
};

const generateRandomPalConfig = (): PalConfig => {
  const radius = varyRelative(14, 0.2);
  const hipHeight = varyRelative(radius * 0.7, 0.3);
  const bodHeight = varyRelative(radius * 2, 0.3);
  const legLength = bodHeight - (radius - hipHeight); // typical: 24

  return {
    radius,
    bodHeight,
    bodBob: varyRelative(radius, 0.2),
    eyeY: varyRelative(radius * 0.5, 0.2),
    eyeX: varyRelative(radius * 0.4, 0.3),
    eyeRadius: varyRelative(radius * 0.15, 0.4),
    mouthThickness: varyRelative(radius * 0.15, 0.4),
    mouthY: varyAbsolute(0, radius * 0.2),
    mouthWidth: varyRelative(radius * 0.5, 0.3),
    mouthSmile: varyRelative(radius * 0.3, 0.3),
    buttTop: varyRelative(radius * 0.4, 0.2),
    buttBottom: varyRelative(radius * 0.85, 0.15),
    buttThickness: varyRelative(radius * 0.1, 0.5),
    color: BLUE.lighten(random(-0.2, 0.2))
      .saturate(random(-0.2, 0.2))
      .rotate(random(-10, 10)),
    hipHeight,
    kneeScale: varyAbsolute(1.3, 0.3),
    legMaxLift: random(0.2, 0.5),
    kneeMaxOut: varyRelative(legLength * 0.6, 0.4),
    stepDuration: varyRelative(legLength * 0.01, 0.4),
    stepRestDuration: varyRelative(legLength * 0.0083, 0.4),
    stepThreshold: varyRelative(legLength * 0.01, 0.4),
    fullStepDistance: varyRelative(legLength * 0.7, 0.4),
    legWidth: varyRelative(radius * 0.3, 0.4),
    legPairs: randomInt(1, 4),
  };
};

export default class Pal extends SceneObject {
  private target: Vector2;
  private _heading: number = 0;
  private speed: number = 0;
  private _headingVelocity: number = 0;
  private _position: Vector2;
  private config: PalConfig;

  private legs: PalLeg[];

  constructor(
    x: number,
    y: number,
    config: PalConfig = generateRandomPalConfig(),
  ) {
    super();
    this._position = new Vector2(x, y);
    this.config = config;
    this.target = new Vector2(x, y);
    this._heading = Math.PI / 2;

    this.legs = shuffle(
      flatten(
        times(config.legPairs, n => {
          const progress = (n + 1) / (config.legPairs + 1);
          return [
            new PalLeg(this, config, lerp(HALF_PI - 1, HALF_PI + 1, progress)),
            new PalLeg(
              this,
              config,
              lerp(-HALF_PI + 1, -HALF_PI - 1, progress),
            ),
          ];
        }),
      ),
    );
  }

  getBod(): Circle {
    const avgLift = this.legs
      ? this.legs.reduce((sum, leg) => sum + leg.liftAmount, 0) /
        this.legs.length
      : 0;
    const bob = this.config.bodBob * avgLift;

    return new Circle(
      this._position.x,
      this._position.y - this.config.bodHeight - bob,
      this.config.radius,
    );
  }

  get position(): Vector2 {
    return this._position;
  }

  get heading(): number {
    return this._heading;
  }

  _getHeadingVec(): Vector2 {
    return Vector2.fromPolar(this._heading, 1);
  }

  getVelocity(): Vector2 {
    return this._getHeadingVec().scale(this.speed);
  }

  get headingVelocity(): number {
    return this._headingVelocity;
  }

  setTarget(vec: Vector2) {
    this.target = vec;
  }

  canLiftLeg(leg: PalLeg): boolean {
    assert(this.legs.includes(leg), 'whos leg even is this');
    const enoughLegsOnFloor =
      this.legs.filter(l => l !== leg && !l.isStepping).length >
      Math.floor(Math.log(this.legs.length));

    const anyStepsJustStarted = this.legs.some(
      leg =>
        leg.stepProgress > 0 && leg.stepProgress < 1 / (this.legs.length / 1.5),
    );

    return enoughLegsOnFloor && !anyStepsJustStarted;
  }

  update(dtMilliseconds: number) {
    const dtSeconds = dtMilliseconds / 1000;
    const angleToTarget = this._position.angleTo(this.target);

    const distance = this.target.distanceTo(this._position);
    if (distance > 15) {
      this._accelerate(ACCELERATION, dtSeconds);
    } else {
      this._accelerate(-DECELERATION, dtSeconds);
    }
    if (distance > 10) {
      const angleDelta = normalizeAngle(angleToTarget - this._heading);
      const lastHeading = this._heading;
      this._heading += angleDelta / 10;
      this._headingVelocity =
        normalizeAngle(this._heading - lastHeading) / dtSeconds;
    }
    this.legs.forEach(leg => leg.update(dtSeconds));
  }

  updateWithPosition(position: Vector2, heading: number, dtSeconds: number) {
    const lastPosition = this._position;
    const lastHeading = this._heading;

    this._heading = heading;
    this._headingVelocity =
      normalizeAngle(this._heading - lastHeading) / dtSeconds;
    this.speed = lastPosition.distanceTo(position) / dtSeconds;
    this._position = position;
    this.legs.forEach(leg => leg.update(dtSeconds));
  }

  _accelerate(amt: number, dtSeconds: number) {
    const lastSpeed = this.speed;
    this.speed = constrain(0, MAX_SPEED, this.speed + amt * dtSeconds);
    const avgSpeed = (lastSpeed + this.speed) / 2;
    this._position = this._position.add(
      Vector2.fromPolar(this._heading, avgSpeed * dtSeconds),
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const heading = normalizeAngle(this._heading);

    ctx.setLineDash([]);
    ctx.beginPath();

    const bod = this.getBod();
    ctx.ellipse(
      this._position.x,
      this._position.y,
      bod.radius * 0.8,
      bod.radius * 0.8 * 0.3,
      0,
      0,
      2 * Math.PI,
    );
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    this.legs
      .filter(l => normalizeAngle(l._angleOffset + heading) < 0)
      .forEach(leg => leg.draw(ctx));
    this.legs
      .filter(l => normalizeAngle(l._angleOffset + heading) >= 0)
      .forEach(leg => leg.draw(ctx));
    this._drawBod(ctx);
  }

  _drawBod(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    const bod = this.getBod();
    ShapeHelpers.circle(ctx, bod.center.x, bod.center.y, this.config.radius);
    ctx.fillStyle = this.config.color.toString();
    ctx.fill();
    ctx.clip();

    const faceX =
      (normalizeAngle(HALF_PI - this._heading) / HALF_PI) * this.config.radius;

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
    this._makeButtLine(ctx, bod, faceX + this.config.radius * 2);
    this._makeButtLine(ctx, bod, faceX - this.config.radius * 2);
    ctx.lineWidth = this.config.buttThickness;
    ctx.strokeStyle = this.config.color.darken(0.3).toString();
    ctx.stroke();

    ctx.restore();
  }

  _makeButtLine(ctx: CanvasRenderingContext2D, bod: Circle, buttX: number) {
    ctx.moveTo(buttX * 1.6 + bod.center.x, bod.center.y + this.config.buttTop);
    ctx.quadraticCurveTo(
      buttX * 1.7 + bod.center.x,
      bod.center.y + (this.config.buttTop + this.config.buttBottom) * 0.65,
      buttX + bod.center.x,
      bod.center.y + this.config.buttBottom,
    );
  }
}
