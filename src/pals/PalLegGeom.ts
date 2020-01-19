import PalGeom from './PalGeom';
import { PalConfig } from './PalConfig';
import Vector2 from '../lib/geom/Vector2';
import { PalControlData } from './PalController';
import { lerp } from '../lib/utils';

const getLegRadius = ({ radius, hipHeight, legWidth }: PalConfig) =>
  Math.sqrt(radius * radius - (radius - hipHeight) * (radius - hipHeight)) -
  legWidth;

export type PalLegGeomUpdate = {
  footXY: Vector2;
  footProjectionOrigin: Vector2;
  liftAmount: number;
};

export default class PalLegGeom {
  hipRadius: number;
  kneeRadius: number;
  floorRadius: number;

  footXY: Vector2;
  footOrigin: Vector2;
  liftAmount: number = 0;

  constructor(
    private palData: PalControlData,
    private palGeom: PalGeom,
    private config: PalConfig,
    public angleOffset: number,
  ) {
    this.hipRadius = getLegRadius(config);
    this.kneeRadius = getLegRadius(config) * config.kneeScale;
    this.floorRadius = getLegRadius(config);

    this.footXY = this.getIdealFootRestingXY();
    this.footOrigin = this.getIdealFootRestingXY();
  }

  update(update: PalLegGeomUpdate) {
    this.footXY = update.footXY;
    this.footOrigin = update.footProjectionOrigin;
    this.liftAmount = update.liftAmount;
  }

  getIdealFootRestingXY(): Vector2 {
    return Vector2.fromPolar(
      this.palData.heading + this.angleOffset,
      this.floorRadius,
    ).add(this.palData.position);
  }

  getFootXY(): Vector2 {
    return this.footXY;
  }

  getFootZ(): number {
    return lerp(0, this.getHipZ() * this.config.legMaxLift, this.liftAmount);
  }

  getFootOrigin(): Vector2 {
    return this.footOrigin;
  }

  getKneeXY(): Vector2 {
    return this.palData.position
      .add(
        Vector2.fromPolar(
          this.palData.heading + this.angleOffset,
          this.kneeRadius,
        ),
      )
      .add(
        Vector2.fromPolar(
          this.palData.heading,
          this.liftAmount * this.config.kneeMaxOut,
        ),
      );
  }

  getKneeZ(): number {
    return (this.getFootZ() + this.getHipZ()) / 2;
  }

  getKneeOrigin(): Vector2 {
    return this.getHipOrigin().lerp(this.getFootOrigin(), 0.5);
  }

  getHipXY(): Vector2 {
    return this.palData.position.add(
      Vector2.fromPolar(
        this.palData.heading + this.angleOffset,
        this.hipRadius,
      ),
    );
    // return this._hipEllipse
    //   .pointOnCircumference(this.angle)
    //   .add(this.palData.bod.center);
  }

  getHipZ(): number {
    const bod = this.palGeom.getBod();
    return (
      this.palData.position.y -
      bod.center.y -
      (bod.radius - this.config.hipHeight)
    );
  }

  getHipOrigin(): Vector2 {
    return this.palData.position;
  }
}
