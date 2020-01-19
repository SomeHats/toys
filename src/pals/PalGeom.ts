import Component from '../lib/scene/Component';
import Entity from '../lib/scene/Entity';
import Circle from '../lib/geom/Circle';
import { PalControlData } from './PalController';
import { shuffle, flatten, times, lerp } from '../lib/utils';
import { PalConfig } from './PalConfig';
import PalLegGeom, { PalLegGeomUpdate } from './PalLegGeom';
import { assert } from '../lib/assert';

const HALF_PI = Math.PI / 2;

export type PalGeomUpdate = {
  bobAmount: number;
  legs: Array<PalLegGeomUpdate>;
};

export interface PalAnimationController {
  update(
    dtMilliseconds: number,
    controlData: PalControlData,
    legs: Array<PalLegGeom>,
  ): PalGeomUpdate;
}

export default class PalGeom extends Component {
  private controlData: PalControlData;
  legs: Array<PalLegGeom>;
  private animationController: PalAnimationController | null = null;
  private bobAmount: number = 0;

  constructor(entity: Entity, private config: PalConfig) {
    super(entity);
    this.controlData = entity.getComponent(PalControlData);
    this.legs = shuffle(
      flatten(
        times(config.legPairs, n => {
          const progress = (n + 1) / (config.legPairs + 1);
          return [
            new PalLegGeom(
              this.controlData,
              this,
              config,
              lerp(HALF_PI - 1, HALF_PI + 1, progress),
            ),
            new PalLegGeom(
              this.controlData,
              this,
              config,
              lerp(-HALF_PI + 1, -HALF_PI - 1, progress),
            ),
          ];
        }),
      ),
    );
  }

  setAnimationController(animationController: PalAnimationController) {
    this.animationController = animationController;
  }

  update(dtMilliseconds: number) {
    if (this.animationController) {
      const update = this.animationController.update(
        dtMilliseconds,
        this.controlData,
        this.legs,
      );
      this.bobAmount = update.bobAmount;

      assert(update.legs.length === this.legs.length);
      this.legs.forEach((leg, i) => leg.update(update.legs[i]));
    }
  }

  getBod(): Circle {
    const bob = this.config.bodBob * this.bobAmount;

    return new Circle(
      this.controlData.position.x,
      this.controlData.position.y - this.config.bodHeight - bob,
      this.config.radius,
    );
  }
}
