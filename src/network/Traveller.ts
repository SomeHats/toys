import { assert } from "../lib/assert";
import SceneObject from "../lib/scene/SceneObject";
import Circle from "../lib/geom/Circle";
import Vector2 from "../lib/geom/Vector2";
import { outBack, inBack } from "../lib/easings";
import { sample, constrain, mapRange, random } from "../lib/utils";
import TravellerFinder from "./TravellerFinder";
import { NetworkNode } from "./networkNodes/NetworkNode";
import Intersection from "./networkNodes/Intersection";
import Road from "./Road";
import Pal from "../pals/Pal";

// const TRAVELLER_COLOR = BLUE.fade(0.4);
// const TRAVELLER_RADIUS = 14;
const MIN_TRAVELLER_COMFORTABLE_RADIUS = 60;
const MAX_TRAVELLER_COMFORTABLE_RADIUS = 60;
const MIN_TRAVELLER_SAFE_RADIUS = 30;
const MAX_TRAVELLER_SAFE_RADIUS = 30;
const NEARBY_RADIUS = 200;

const INITIAL_SPEED = 5;
const MAX_SPEED = 80;
const ACCELERATION = 200;
const DECELERATION = -200;
const ROAD_END_OVERSHOOT = 0;

const PATIENCE = 1500;
const FORCE_ACCELERATE_DURATION = 100;

const ENTER_DURATION = 400;
const EXIT_DURATION = 400;

const enterEase = outBack(3);
const exitEase = inBack(3);

enum StopReason {
  STOPPED_FOR_DESTINATION = "STOPPED_FOR_DESTINATION",
  STOPPED_FOR_TRAFFIC_IN_FRONT = "STOPPED_FOR_TRAFFIC_IN_FRONT",
  STOPPED_FOR_TRAFFIC_NEARBY = "STOPPED_FOR_TRAFFIC_NEARBY"
}

export default class Traveller extends SceneObject {
  static MAX_SPEED = MAX_SPEED;
  static StopReason = StopReason;

  comfortableRadius = random(
    MIN_TRAVELLER_COMFORTABLE_RADIUS,
    MAX_TRAVELLER_COMFORTABLE_RADIUS
  );
  safeRadius = random(MIN_TRAVELLER_SAFE_RADIUS, MAX_TRAVELLER_SAFE_RADIUS);
  _currentRoad: Road | null = null;
  _destination: NetworkNode | null = null;
  _positionOnCurrentRoad: number = 0;
  _speed: number = INITIAL_SPEED;
  _age: number = 0;
  _exitStartedAt: number | null = null;
  _stoppedTime: number = 0;
  _forceAccelerateTimer: number = 0;
  _stopReason: StopReason | null = null;
  _stoppedFor: Traveller[] = [];
  _pal: Pal | null = null;

  get currentRoad(): Road | null {
    return this._currentRoad;
  }

  get position(): Vector2 {
    assert(this._currentRoad, "currentRoad must be defined");
    return this._currentRoad.getPointAtPosition(this._positionOnCurrentRoad);
  }

  // get predictedPositionInDirectionOfTravel(): Vector2 {
  //   assert(this._currentRoad, 'currentRoad must be defined');
  //   return this._getPredictedPointForPosition(
  //     this._currentRoad,
  //     this._positionOnCurrentRoad + 1,
  //   );
  // }

  get predictedStopPoint(): Vector2 {
    const currentRoad = this._currentRoad;
    assert(currentRoad, "currentRoad must be defined");
    const stopPosition = this._getPredictedStopPositionIfDecelerating();
    return this._getPredictedPointForPosition(currentRoad, stopPosition);
  }

  get predictedStopArea(): Circle {
    const center = this.predictedStopPoint;
    return new Circle(center.x, center.y, this.safeRadius);
  }

  get potentialNextPredictedStopPoint(): Vector2 {
    const currentRoad = this._currentRoad;
    assert(currentRoad, "currentRoad must be defined");
    const stopPosition = this._getPredictedStopPositionIfDecelerating();
    return this._getPredictedPointForPosition(currentRoad, stopPosition + 1);
  }

  get positionOnCurrentRoad(): number {
    return this._positionOnCurrentRoad;
  }

  get distanceToEndOfCurrentRoad(): number {
    assert(this._currentRoad, "traveller is not on a road");
    return this._currentRoad.length - this._positionOnCurrentRoad;
  }

  get destination(): NetworkNode | null {
    return this._destination;
  }

  get speed(): number {
    return this._speed;
  }

  get isStopped(): boolean {
    return this.speed === 0;
  }

  get stoppedTime(): number {
    return this._stoppedTime;
  }

  get stopReason(): StopReason | null {
    return this._stopReason;
  }

  isStoppedFor(other: Traveller): boolean {
    return this._stoppedFor.includes(other);
  }

  onAddedToRoad(road: Road) {
    this._currentRoad = road;
    this._positionOnCurrentRoad = 0;
    if (!this._destination) {
      this._pickDestination();
    }
  }

  onRemovedFromRoad() {
    this.getScene()
      .getSystem(TravellerFinder)
      .removeTraveller(this);
    this._currentRoad = null;
  }

  onRemovedFromScene() {
    this.removeFromCurrentRoad();
  }

  removeFromCurrentRoad() {
    if (this._currentRoad) this._currentRoad.removeTraveller(this);
  }

  update(dtMilliseconds: number) {
    this._age += dtMilliseconds;
    this._stopReason = null;
    this._stoppedFor = [];

    const currentRoad = this._currentRoad;
    assert(currentRoad, "current road must be defined");

    this._move(dtMilliseconds, currentRoad);

    this._getPal().updateWithPosition(
      this.position,
      currentRoad.getAngleAtPosition(this._positionOnCurrentRoad),
      dtMilliseconds / 1000
    );
    // if (window.debugDraw) this._debugDraw();

    this._checkAtEndOfRoad(currentRoad);
    this._checkExit();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentRoad = this._currentRoad;
    assert(currentRoad, "current road must be defined");

    this._getPal().draw(ctx);

    // const position = this.position;
    // const scale =
    //   this._getEnterTransitionScale() * this._getExitTransitionScale();

    // ctx.beginPath();
    // ctx.fillStyle = TRAVELLER_COLOR.toString();
    // ShapeHelpers.circle(ctx, position.x, position.y, TRAVELLER_RADIUS * scale);
    // ctx.fill();
  }

  getSortOrder(): number {
    return this.position.y;
  }

  get _isExiting(): boolean {
    return this._exitStartedAt !== null;
  }

  _getPal(): Pal {
    if (!this._pal) {
      this._pal = new Pal(this.position.x, this.position.y);
    }

    return this._pal;
  }

  // _debugDraw() {
  //   const currentRoad = this._currentRoad;
  //   if (!currentRoad) return;

  //   const predictedStopPoint = this.predictedStopPoint;
  //   new Circle(
  //     this.position.x,
  //     this.position.y,
  //     this.comfortableRadius
  //   ).debugDraw("rgba(0, 255, 0, 0.4)");
  //   new Circle(this.position.x, this.position.y, this.safeRadius).debugDraw(
  //     this._forceAccelerateTimer ? "cyan" : "red"
  //   );
  //   predictedStopPoint.debugDraw("lime");
  //   this.predictedStopArea.debugDraw("rgba(255, 0, 255, 0.5)");

  //   const ctx: CanvasRenderingContext2D = window.debugContext;
  //   ctx.fillText(
  //     `${this.id} ${Math.round(this._stoppedTime)}`,
  //     this.position.x,
  //     this.position.y
  //   );
  // }

  _getEnterTransitionScale() {
    return enterEase(
      constrain(0, 1, mapRange(0, ENTER_DURATION, 0, 1, this._age))
    );
  }

  _getExitTransitionScale() {
    if (this._exitStartedAt === null) return 1;
    return (
      1 -
      exitEase(
        constrain(
          0,
          1,
          mapRange(
            this._exitStartedAt,
            this._exitStartedAt + EXIT_DURATION,
            0,
            1,
            this._age
          )
        )
      )
    );
  }

  _getPredictedStopPositionIfDecelerating(): number {
    const timeToStop = -this._speed / DECELERATION;
    return (
      this._positionOnCurrentRoad +
      this._speed * timeToStop +
      0.5 * DECELERATION * timeToStop * timeToStop
    );
  }

  _getPredictedPointForPosition(currentRoad: Road, position: number): Vector2 {
    if (position <= currentRoad.length) {
      return currentRoad.getPointAtPosition(position);
    }

    const overshoot = position - currentRoad.length;
    const overshootAngle = currentRoad.getAngleAtPosition(currentRoad.length);
    return Vector2.fromPolar(overshootAngle, overshoot).add(currentRoad.end);
  }

  _pickDestination() {
    if (!this._currentRoad) return;
    const potentialDestinations = this._currentRoad
      .getAllReachableNodes()
      .filter(node => node.isDestination);
    const destination = sample(potentialDestinations);
    this._destination = destination;
  }

  _move(dtMilliseconds: number, currentRoad: Road) {
    const dtSeconds = dtMilliseconds / 1000;

    this._forceAccelerateTimer = constrain(
      0,
      FORCE_ACCELERATE_DURATION,
      this._forceAccelerateTimer - dtMilliseconds
    );

    if (
      this._forceAccelerateTimer <= 0 &&
      this._shouldDecelerate(currentRoad)
    ) {
      this._accelerate(DECELERATION, dtSeconds, currentRoad);
    } else {
      this._accelerate(ACCELERATION, dtSeconds, currentRoad);
    }

    if (this._speed === 0) {
      this._stoppedTime += dtMilliseconds;
    } else {
      this._stoppedTime = 0;
    }
  }

  _shouldDecelerate(currentRoad: Road): boolean {
    const predictedStopPosition = this._getPredictedStopPositionIfDecelerating();
    if (
      currentRoad.to === this._destination &&
      currentRoad.length + ROAD_END_OVERSHOOT < predictedStopPosition
    ) {
      this._stopReason = StopReason.STOPPED_FOR_DESTINATION;
      return true;
    }

    const nextTravellerOnRoad = currentRoad.getTravellerAfterPosition(
      this._positionOnCurrentRoad
    );

    const safeStopAheadPosition =
      predictedStopPosition + this.comfortableRadius;

    if (
      nextTravellerOnRoad &&
      nextTravellerOnRoad.positionOnCurrentRoad < safeStopAheadPosition
    ) {
      this._stopReason = StopReason.STOPPED_FOR_TRAFFIC_IN_FRONT;
      this._stoppedFor.push(nextTravellerOnRoad);
      return true;
    }

    if (currentRoad.to instanceof Intersection) {
      const intersection = currentRoad.to;
      const outgoingTraveller = intersection.getClosestOutgoingTraveller();
      if (outgoingTraveller) {
        const outgoingTravellerPosition =
          currentRoad.length + outgoingTraveller.positionOnCurrentRoad;

        if (outgoingTravellerPosition < safeStopAheadPosition) {
          this._stopReason = StopReason.STOPPED_FOR_TRAFFIC_IN_FRONT;
          this._stoppedFor.push(outgoingTraveller);
          return true;
        }
      }

      const incomingTraveller = intersection.getClosestIncomingTraveller();
      if (incomingTraveller && incomingTraveller !== this) {
        const incomingTravellerPosition =
          currentRoad.length - incomingTraveller.distanceToEndOfCurrentRoad;
        if (incomingTravellerPosition < safeStopAheadPosition) {
          this._stopReason = StopReason.STOPPED_FOR_TRAFFIC_IN_FRONT;
          this._stoppedFor.push(incomingTraveller);
          return true;
        }
      }
    }

    if (this._shouldDecelerateForNearbyTravellers(currentRoad)) {
      this._stopReason = StopReason.STOPPED_FOR_TRAFFIC_NEARBY;
      return true;
    }

    // const currentPoint = this.position;
    // const currentSafeCircle = new Circle(
    //   currentPoint.x,
    //   currentPoint.y,
    //   this.safeRadius,
    // );
    // if (
    //   this._shouldDecelerateForTravellersInCircle(
    //     currentRoad,
    //     currentSafeCircle,
    //   )
    // ) {
    //   return true;
    // }

    // const predictedStopPoint = this._getPredictedStopPointIfDecelerating(
    //   currentRoad,
    // );
    // const predictedSafeCircle = new Circle(
    //   predictedStopPoint.x,
    //   predictedStopPoint.y,
    //   this.safeRadius,
    // );
    // if (
    //   this._shouldDecelerateForTravellersInCircle(
    //     currentRoad,
    //     predictedSafeCircle,
    //   )
    // ) {
    //   return true;
    // }

    return false;
  }

  _shouldDecelerateForNearbyTravellers(currentRoad: Road): boolean {
    const travellerFinder = this.getScene().getSystem(TravellerFinder);
    const stopArea = this.predictedStopArea;
    const stopPoint = stopArea.center;
    const nextStopPoint = this.potentialNextPredictedStopPoint;
    const searchArea = stopArea.withRadius(NEARBY_RADIUS);
    const nearbyTravellers = travellerFinder.findTravellersInCircle(searchArea);

    for (const other of nearbyTravellers) {
      // cannot crash into self
      if (other === this) continue;

      // if we both started breaking now, we would be a safe distance so we're fine
      const otherStopArea = other.predictedStopArea;
      const otherStopPoint = otherStopArea.center;
      if (!stopArea.intersectsCircle(otherStopArea)) continue;

      // currently we think other will stop at the center of otherStopArea.
      // otherNextStopPoint is one pixel further forward based other's current
      // heading
      const otherNextStopPoint = other.potentialNextPredictedStopPoint;

      // if we're moving away from each other, everything is fine:
      const currentStopDistance = stopPoint.distanceTo(otherStopArea.center);
      const nextStopDistance = nextStopPoint.distanceTo(otherNextStopPoint);
      if (nextStopDistance > currentStopDistance) continue;

      // who is moving in a direction that's headed more towards the other's
      // stop position? if they're moving towards me but i'm moving more
      // orthagonally relative to them, they should slow down
      const approachAmount = stopPoint.distanceTo(otherNextStopPoint);
      const otherApproachAmount = otherStopPoint.distanceTo(nextStopPoint);
      if (approachAmount < otherApproachAmount) {
        continue;
      }

      // so we know we're moving towards them faster than they're moving
      // towards us, but how much? If it's barely any and we're not already too
      // close to them, we could just keep going
      if (
        approachAmount - otherApproachAmount <
        0.15
        // approachAmount > this.safeRadius * 0.8
      ) {
        continue;
      }

      // if there's a clash... just randomly tie-break
      if (approachAmount === otherApproachAmount) {
        return Math.random() < 0.5;
      }

      // if we've been waiting around for fuckin ever just slam that fuckin
      // pedal to the floor like ugh (in reality just nudge forward a little)
      // (unless the other one is stopped to cus otherwise we'll just crash)
      if (this._stoppedTime > PATIENCE && !other.isStopped) {
        this._forceAcceleration();
        return false;
      }

      // attempt to break deadlocks. i guess this is the equivalent of 'other'
      // waving at the current traveller to continue
      if (other.isStoppedFor(this)) continue;

      this._stoppedFor.push(other);
    }

    if (this._stoppedFor.length) return true;

    return false;
  }

  // _shouldDecelerateForTravellersInCircle(currentRoad: Road, circle: Circle) {
  //   const travellerFinder = this.getScene().getSystem(TravellerFinder);
  //   const overlappingTravellers = travellerFinder.findTravellersInCircle(
  //     circle,
  //   );

  //   const currentPosition = this.position;
  //   const nextPosition = this.predictedPositionInDirectionOfTravel;

  //   const clashingTravellers = overlappingTravellers.filter(other => {
  //     if (other === this) return false;
  //     if (other.currentRoad === currentRoad) return false;

  // const currentDistance = currentPosition.distanceTo(other.position);
  // const nextDistance = nextPosition.distanceTo(other.position);

  // const isGettingCloser = nextDistance < currentDistance;
  // if (!isGettingCloser) return false;

  // const otherNextPosition = other.predictedPositionInDirectionOfTravel;
  // const otherNextDistance = currentPosition.distanceTo(otherNextPosition);
  // const thisMoveDelta = nextDistance - currentDistance;
  // const otherMoveDelta = otherNextDistance - currentDistance;
  // if (thisMoveDelta < otherMoveDelta) return true;

  // if (this.isStopped && !other.isStopped) return true;

  // if (this.isStopped && other.isStopped) {
  //   if (this.stoppedTime === other.stoppedTime && this.id < other.id)
  //     return false;
  //   if (this.stoppedTime < other.stoppedTime) return false;
  // }

  //     return true;
  //   });

  //   return clashingTravellers.length > 0;
  // }

  _forceAcceleration() {
    this._forceAccelerateTimer = FORCE_ACCELERATE_DURATION;
  }

  _accelerate(acceleration: number, dtSeconds: number, currentRoad: Road) {
    const lastSpeed = this._speed;
    this._speed = constrain(
      0,
      MAX_SPEED,
      this._speed + acceleration * dtSeconds
    );
    const avgSpeed = (lastSpeed + this._speed) / 2;
    this._positionOnCurrentRoad = constrain(
      0,
      currentRoad.length,
      this._positionOnCurrentRoad + avgSpeed * dtSeconds
    );
  }

  _checkAtEndOfRoad(currentRoad: Road) {
    if (this._positionOnCurrentRoad === currentRoad.length) {
      if (this._isExiting) return;
      this._onReachEndOfCurrentRoad(currentRoad);
    }
  }

  _checkExit() {
    if (this._isExiting) {
      assert(this._exitStartedAt);
      if (this._age >= this._exitStartedAt + EXIT_DURATION) {
        this._onExit();
      }
    }
  }

  _onReachEndOfCurrentRoad(currentRoad: Road) {
    const nextNode = currentRoad.to;
    const destination = this._destination;
    if (nextNode.canConsumeTraveller) {
      nextNode.consumeTraveller(this);
      if (nextNode === destination) {
        this._onReachDestination();
      }
    }
  }

  _onReachDestination() {
    this._exit();
  }

  _onExit() {
    this.getScene().removeChild(this);
  }

  _exit() {
    this._exitStartedAt = this._age;
  }
}
