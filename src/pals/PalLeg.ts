// @flow
// import Ellipse from '../lib/geom/Ellipse';
import Vector2 from '../lib/geom/Vector2';
import { normalizeAngle, constrain, lerp, mapRange } from '../lib/utils';
import Pal, { PalConfig } from './Pal';

// const HIP_HEIGHT = 10;
const Y_SCALE = 0.3;
// const LEG_WIDTH = 4;
// // const LEG_LENGTH = 12;
// // const KNEE_POSITION = 0.5;
// const KNEE_SCALE = 1.3;
// const LEG_MAX_LIFT = 0.3;
// const KNEE_MAX_OUT = 14;
// const STEP_DURATION = 0.2;
// const REST_DURATION = 0.2;
// const STEP_THRESHOLD = 0.2;
// const FULL_STEP_DIST = 20;
// const MIN_STEP_LIFT = 0.1;
// const BASE_COLOR = BLUE.lighten(0.2);
// const DARK_COLOR = BLUE;

const HALF_PI = Math.PI / 2;

const getLegRadius = ({ radius, hipHeight, legWidth }: PalConfig) =>
  Math.sqrt(radius * radius - (radius - hipHeight) * (radius - hipHeight)) -
  legWidth;

export default class PalLeg {
  _pal: Pal;
  _config: PalConfig;
  _angleOffset: number;
  _hipRadius: number;
  _kneeRadius: number;
  _floorRadius: number;
  _lastFootOnFloorXY: Vector2;
  _lastFootOnFloorPalPosition: Vector2;
  _stepProgress: number = 0;
  _restTimer: number = 0;
  _currentStepMaxLift: number = 1;

  constructor(pal: Pal, config: PalConfig, angleOffset: number) {
    this._pal = pal;
    this._config = config;
    this._angleOffset = angleOffset;
    this._hipRadius = getLegRadius(config);
    this._kneeRadius = getLegRadius(config) * config.kneeScale;
    this._floorRadius = getLegRadius(config);

    this._lastFootOnFloorXY = this._getIdealFootRestingXY();
    this._lastFootOnFloorPalPosition = this._pal.position;
  }

  get angle(): number {
    return this._pal.heading + this._angleOffset;
  }

  get isStepping(): boolean {
    return this._stepProgress > 0;
  }

  get isResting(): boolean {
    return this._restTimer > 0;
  }

  get liftAmount(): number {
    return Math.sin(this._stepProgress * Math.PI) * this._currentStepMaxLift;
  }

  get stepProgress(): number {
    return this._stepProgress;
  }

  update(dtSeconds: number) {
    this._restTimer = constrain(
      0,
      this._config.stepRestDuration,
      this._restTimer - dtSeconds,
    );
    if (this.isResting) return;

    if (this.isStepping) {
      this._stepProgress = constrain(
        0,
        1,
        this._stepProgress + dtSeconds / this._config.stepDuration,
      );

      if (this._stepProgress === 1) {
        this._lastFootOnFloorXY = this._getCurrentFootXY();
        this._lastFootOnFloorPalPosition = this._pal.position;
        this._stepProgress = 0;
        this._restTimer = this._config.stepDuration;
      }
    } else {
      const footLeanDistance = this._getCurrentFootXY().distanceTo(
        this._getIdealFootRestingXY(),
      );
      if (
        footLeanDistance > this._config.stepThreshold &&
        this._pal.canLiftLeg(this)
      ) {
        this._currentStepMaxLift = constrain(
          0,
          1,
          mapRange(
            this._config.stepThreshold,
            this._config.fullStepDistance,
            0.1,
            1,
            footLeanDistance,
          ),
        );
        this._stepProgress = constrain(
          0,
          1,
          this._stepProgress + dtSeconds / this._config.stepDuration,
        );
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    // hip.debugDraw('lime');
    // knee.debugDraw('cyan');
    // foot.debugDraw('red');

    const colorDarkenAmount = constrain(
      0,
      1,
      Math.abs(normalizeAngle(-HALF_PI - this.angle) / HALF_PI),
    );
    const legColor = this._config.color.darken(
      0.2 * (1 - colorDarkenAmount * colorDarkenAmount),
    );

    const hip = this._projectZ(
      this._getCurrentHipXY(),
      this._getCurrentHipZ(),
      this._getCurrentHipOrigin(),
    );
    const knee = this._projectZ(
      this._getCurrentKneeXY(),
      this._getCurrentKneeZ(),
      this._getCurrentKneeOrigin(),
    );
    const foot = this._projectZ(
      this._getCurrentFootXY(),
      this._getCurrentFootZ(),
      this._getCurrentFootOrigin(),
    );

    ctx.moveTo(hip.x, hip.y);
    ctx.quadraticCurveTo(knee.x, knee.y, foot.x, foot.y);
    ctx.lineCap = 'round';
    ctx.strokeStyle = legColor.toString();
    ctx.lineWidth = this._config.legWidth;
    ctx.stroke();
  }

  _debugDraw() {
    // this._hipEllipse.move(this._pal.bod.center).debugDraw('lime');
    // this._floorEllipse.move(this._pal.bod.center).debugDraw('cyan');
    // this._kneeEllipse.move(this._pal.bod.center).debugDraw('red');
    // this._floorEllipse.center.add(this._pal.bod.center).debugDraw('magenta');
    // this._floorEllipse
    //   .move(this._pal.bod.center)
    //   .pointOnCircumference(this._pal.heading)
    //   .debugDraw('magenta');
  }

  _projectZ(
    xy: Vector2,
    z: number,
    origin: Vector2 = this._pal.position,
  ): Vector2 {
    return new Vector2(xy.x, origin.y - z + (xy.y - origin.y) * Y_SCALE);
  }

  _getIdealFootRestingXY(): Vector2 {
    return Vector2.fromPolar(
      this._pal.heading + this._angleOffset,
      this._floorRadius,
    ).add(this._pal.position);
  }

  _getPredictedIdealFootXYAtEndOfOfStep(): Vector2 {
    const timeRemaining =
      (1.4 - this._stepProgress) * this._config.stepDuration;

    const predictedPosition = this._pal
      .getVelocity()
      .scale(timeRemaining)
      .add(this._pal.position);

    const predictedHeading =
      this._pal.heading + this._pal.headingVelocity * timeRemaining;

    return Vector2.fromPolar(
      predictedHeading + this._angleOffset,
      this._floorRadius,
    ).add(predictedPosition);
  }

  // _getFootLiftVector(): Vector2 {
  //   return new Vector2(0, LEG_LENGTH * LEG_MAX_LIFT * this._liftAmt * -1);
  // }

  _getCurrentFootXY(): Vector2 {
    // console.log('isStepping', this.isStepping);
    if (this.isStepping) {
      const start = this._lastFootOnFloorXY;
      const target = this._getPredictedIdealFootXYAtEndOfOfStep();
      return start.lerp(target, this._stepProgress);
    }

    return this._lastFootOnFloorXY;
  }

  _getCurrentFootZ(): number {
    return lerp(
      0,
      this._getCurrentHipZ() * this._config.legMaxLift,
      this.liftAmount,
    );
  }

  _getCurrentFootOrigin(): Vector2 {
    if (this.isStepping) {
      return this._lastFootOnFloorPalPosition.lerp(
        this._pal.position,
        this._stepProgress,
      );
    }

    return this._lastFootOnFloorPalPosition;
  }

  _getCurrentKneeXY(): Vector2 {
    return this._pal.position
      .add(
        Vector2.fromPolar(
          this._pal.heading + this._angleOffset,
          this._kneeRadius,
        ),
      )
      .add(
        Vector2.fromPolar(
          this._pal.heading,
          this.liftAmount * this._config.kneeMaxOut,
        ),
      );
  }

  _getCurrentKneeZ(): number {
    return (this._getCurrentFootZ() + this._getCurrentHipZ()) / 2;
  }

  _getCurrentKneeOrigin(): Vector2 {
    return this._getCurrentHipOrigin().lerp(this._getCurrentFootOrigin(), 0.5);
  }

  _getCurrentHipXY(): Vector2 {
    return this._pal.position.add(
      Vector2.fromPolar(this._pal.heading + this._angleOffset, this._hipRadius),
    );
    // return this._hipEllipse
    //   .pointOnCircumference(this.angle)
    //   .add(this._pal.bod.center);
  }

  _getCurrentHipZ(): number {
    const bod = this._pal.getBod();
    return (
      this._pal.position.y -
      bod.center.y -
      (bod.radius - this._config.hipHeight)
    );
  }

  _getCurrentHipOrigin(): Vector2 {
    return this._pal.position;
  }
}
