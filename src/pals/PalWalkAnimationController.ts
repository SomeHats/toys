import { PalAnimationController, PalGeomUpdate } from './PalGeom';
import { PalControlData } from './PalController';
import PalLegGeom, { PalLegGeomUpdate } from './PalLegGeom';
import Vector2 from '../lib/geom/Vector2';
import { PalConfig } from './PalConfig';
import { constrain, mapRange } from '../lib/utils';
import { assert } from '../lib/assert';

type LegState = {
  lastFootOnFloorXY: Vector2;
  lastFootOnFloorPalPosition: Vector2;
  stepProgress: number;
  restTimer: number;
  currentStepMaxLift: number;
};

function isStepping({ stepProgress }: LegState): boolean {
  return stepProgress > 0;
}

function isResting({ restTimer }: LegState): boolean {
  return restTimer > 0;
}

export default class PalWalkAnimationController
  implements PalAnimationController {
  private legStates = new Map<PalLegGeom, LegState>();

  constructor(private config: PalConfig) {}

  update(
    dtMilliseconds: number,
    pal: PalControlData,
    legs: Array<PalLegGeom>,
  ): PalGeomUpdate {
    const dtSeconds = dtMilliseconds / 1000;

    for (const leg of legs) {
      this.updateLegState(dtSeconds, pal, legs, leg);
    }
    const legUpdates = legs.map(leg => this.getLegUpdate(pal, leg));

    const totalLift = legUpdates.reduce(
      (sum, update) => sum + update.liftAmount,
      0,
    );
    const avgLift = totalLift / legs.length;

    return {
      bobAmount: avgLift,
      legs: legUpdates,
    };
  }

  private canLiftLeg(
    pal: PalControlData,
    legs: Array<PalLegGeom>,
    leg: PalLegGeom,
  ): boolean {
    assert(legs.includes(leg), 'whos leg even is this');
    const enoughLegsOnFloor =
      legs.filter(l => l !== leg && !isStepping(this.getLegState(pal, leg)))
        .length > Math.floor(Math.log(legs.length));

    const anyStepsJustStarted = legs.some(leg => {
      const state = this.getLegState(pal, leg);
      return (
        state.stepProgress > 0 && state.stepProgress < 1 / (legs.length / 2)
      );
    });

    return enoughLegsOnFloor && !anyStepsJustStarted;
  }

  private updateLegState(
    dtSeconds: number,
    pal: PalControlData,
    legs: Array<PalLegGeom>,
    leg: PalLegGeom,
  ) {
    const state = this.getLegState(pal, leg);

    state.restTimer = constrain(
      0,
      this.config.stepRestDuration,
      state.restTimer - dtSeconds,
    );
    if (isResting(state)) return;

    if (isStepping(state)) {
      state.stepProgress = constrain(
        0,
        1,
        state.stepProgress + dtSeconds / this.config.stepDuration,
      );

      if (state.stepProgress === 1) {
        state.lastFootOnFloorXY = this.getFootXY(pal, leg, state);
        state.lastFootOnFloorPalPosition = pal.position;
        state.stepProgress = 0;
        state.restTimer = this.config.stepDuration;
      }
    } else {
      const footLeanDistance = leg
        .getFootXY()
        .distanceTo(leg.getIdealFootRestingXY());
      if (
        footLeanDistance > this.config.stepThreshold &&
        this.canLiftLeg(pal, legs, leg)
      ) {
        state.currentStepMaxLift = constrain(
          0,
          1,
          mapRange(
            this.config.stepThreshold,
            this.config.fullStepDistance,
            0.1,
            1,
            footLeanDistance,
          ),
        );
        state.stepProgress = constrain(
          0,
          1,
          state.stepProgress + dtSeconds / this.config.stepDuration,
        );
      }
    }
  }

  private getInitialLegState(pal: PalControlData, leg: PalLegGeom): LegState {
    return {
      lastFootOnFloorXY: leg.getIdealFootRestingXY(),
      lastFootOnFloorPalPosition: pal.position,
      stepProgress: 0,
      restTimer: 0,
      currentStepMaxLift: 1,
    };
  }

  private getLegState(pal: PalControlData, leg: PalLegGeom): LegState {
    const state = this.legStates.get(leg);
    if (state) {
      return state;
    }

    const initialState = this.getInitialLegState(pal, leg);
    this.legStates.set(leg, initialState);
    return initialState;
  }

  private getLegUpdate(pal: PalControlData, leg: PalLegGeom): PalLegGeomUpdate {
    const state = this.getLegState(pal, leg);
    return {
      footXY: this.getFootXY(pal, leg, state),
      footProjectionOrigin: this.getFootOrigin(pal, leg, state),
      liftAmount: this.getLegLiftAmount(state),
    };
  }

  private getFootXY(
    pal: PalControlData,
    leg: PalLegGeom,
    state: LegState,
  ): Vector2 {
    if (isStepping(state)) {
      const start = state.lastFootOnFloorXY;
      const target = this.getPredictedIdealFootXYAtEndOfOfStep(pal, leg, state);
      return start.lerp(target, state.stepProgress);
    }

    return state.lastFootOnFloorXY;
  }

  private getFootOrigin(
    pal: PalControlData,
    leg: PalLegGeom,
    state: LegState,
  ): Vector2 {
    if (isStepping(state)) {
      return state.lastFootOnFloorPalPosition.lerp(
        pal.position,
        state.stepProgress,
      );
    }

    return state.lastFootOnFloorPalPosition;
  }

  private getPredictedIdealFootXYAtEndOfOfStep(
    pal: PalControlData,
    leg: PalLegGeom,
    state: LegState,
  ): Vector2 {
    const timeRemaining = (1.4 - state.stepProgress) * this.config.stepDuration;

    const predictedPosition = pal
      .getVelocity()
      .scale(timeRemaining)
      .add(pal.position);

    const predictedHeading = pal.heading + pal.headingVelocity * timeRemaining;

    return Vector2.fromPolar(
      predictedHeading + leg.angleOffset,
      leg.floorRadius,
    ).add(predictedPosition);
  }

  private getLegLiftAmount({
    stepProgress,
    currentStepMaxLift,
  }: LegState): number {
    return Math.sin(stepProgress * Math.PI) * currentStepMaxLift;
  }
}
