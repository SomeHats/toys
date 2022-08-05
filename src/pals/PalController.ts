import Component from "../lib/scene/Component";
import { constrain, normalizeAngle } from "../lib/utils";
import Vector2 from "../lib/geom/Vector2";
import Entity from "../lib/scene/Entity";

const MAX_SPEED = 80;
const ACCELERATION = 200;
const DECELERATION = 200;

export class PalControlData extends Component {
    speed: number = 0;
    position: Vector2;
    heading: number = 0;
    headingVelocity: number = 0;

    constructor(entity: Entity, position: Vector2) {
        super(entity);
        this.position = position;
    }

    getVelocity(): Vector2 {
        return this.getHeadingVec().scale(this.speed);
    }

    private getHeadingVec(): Vector2 {
        return Vector2.fromPolar(this.heading, 1);
    }
}

export class PalTargetController extends Component {
    private data: PalControlData;
    private target: Vector2;

    constructor(entity: Entity, position: Vector2) {
        super(entity);
        this.target = position;
        this.data = entity.addComponent(PalControlData, position);
    }

    setTarget(newTarget: Vector2) {
        this.target = newTarget;
    }

    update(dtMilliseconds: number) {
        const dtSeconds = dtMilliseconds / 1000;
        const angleToTarget = this.data.position.angleTo(this.target);

        const distance = this.target.distanceTo(this.data.position);
        if (distance > 15) {
            this.accelerate(ACCELERATION, dtSeconds);
        } else {
            this.accelerate(-DECELERATION, dtSeconds);
        }

        if (distance > 10) {
            const angleDelta = normalizeAngle(angleToTarget - this.data.heading);
            const lastHeading = this.data.heading;
            this.data.heading += angleDelta / 10;
            this.data.headingVelocity = normalizeAngle(this.data.heading - lastHeading) / dtSeconds;
        } else {
            this.data.headingVelocity = 0;
        }
    }

    private accelerate(amt: number, dtSeconds: number) {
        const lastSpeed = this.data.speed;
        this.data.speed = constrain(0, MAX_SPEED, this.data.speed + amt * dtSeconds);
        const avgSpeed = (lastSpeed + this.data.speed) / 2;
        this.data.position = this.data.position.add(
            Vector2.fromPolar(this.data.heading, avgSpeed * dtSeconds),
        );
    }
}

export class PalAbsoluteController extends Component {
    private data: PalControlData;

    constructor(entity: Entity, position: Vector2) {
        super(entity);
        this.data = entity.addComponent(PalControlData, position);
    }

    setPosition(position: Vector2, heading: number, dtSeconds: number) {
        const lastPosition = this.data.position;
        const lastHeading = this.data.heading;

        this.data.heading = heading;
        this.data.headingVelocity = normalizeAngle(this.data.heading - lastHeading) / dtSeconds;
        this.data.speed = lastPosition.distanceTo(position) / dtSeconds;
        this.data.position = position;
    }
}
