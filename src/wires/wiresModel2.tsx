import { Result } from "@/lib/Result";
import { Line2 } from "@/lib/geom/Line2";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema } from "@/lib/schema";
import { degreesToRadians, radiansToDegrees } from "@/lib/utils";
import { IdGenerator } from "@/splatapus/model/Ids";
import { Model } from "@/wires/Model";
import { Inputs } from "@/wires/inputs";
import { RootNode } from "@/wires/states";

const angleStep = degreesToRadians(60);

export const WireId = new IdGenerator("wire");
export type WireId = typeof WireId.Id;
export class Wire extends Model({
    id: WireId.schema,
    start: Vector2.schema,
    end: Vector2.schema,
}) {
    static schema = super.modelSchema.transform(
        (props) => Result.ok(new Wire(props)),
        Schema.cannotValidate("Wire"),
        (wire) => wire.serialized,
    );

    get startAngle() {
        const angle = this.start.angleTo(this.end);
        // round angle to nearest angleStep:
        return Math.round(angle / angleStep) * angleStep;
        // if (this.start.x > this.end.x) {
        //     return Math.PI;
        // }
        // return 0;
    }

    get segments(): Vector2[] {
        const centerPoint = this.start.lerp(this.end, 0.5);
        const angleToCenter = this.start.angleTo(centerPoint) - this.startAngle;
        console.log({
            angle: radiansToDegrees(this.start.angleTo(this.end)),
            angleToCenter: radiansToDegrees(angleToCenter),
            startAngle: radiansToDegrees(this.startAngle),
        });

        const initialLine = Line2.fromAngleAndPoint(
            this.startAngle,
            this.start,
        );
        const middleLine1 = Line2.fromAngleAndPoint(
            this.startAngle + degreesToRadians(60),
            centerPoint,
        );
        const middleLine2 = Line2.fromAngleAndPoint(
            this.startAngle - degreesToRadians(60),
            centerPoint,
        );
        const middleLine1Start =
            middleLine1.pointAtIntersectionWith(initialLine);
        const middleLine2Start =
            middleLine2.pointAtIntersectionWith(initialLine);
        const middleLine =
            (
                this.start.distanceTo(middleLine1Start) <
                this.start.distanceTo(middleLine2Start)
            ) ?
                middleLine1
            :   middleLine2;

        const lastLine = Line2.fromAngleAndPoint(this.startAngle, this.end);

        return [
            this.start,
            initialLine.pointAtIntersectionWith(middleLine),
            middleLine.pointAtIntersectionWith(lastLine),
            this.end,
        ];
    }
}

export class WiresApp extends Model({
    wires: Schema.arrayOf(Wire.schema),
}) {
    static schema = super.modelSchema.transform(
        (props) => Result.ok(new WiresApp(props)),
        Schema.cannotValidate("WiresApp"),
        (app) => app.serialized,
    );

    static createEmpty() {
        return new WiresApp({ wires: [] });
    }

    inputs = new Inputs();
    state = new RootNode(this);

    reset() {
        this.wires = [];
    }

    createWire(start: Vector2) {
        const wire = new Wire({ id: WireId.generate(), start, end: start });
        this.wires = [...this.wires, wire];
        return wire;
    }

    removeWire(wire: Wire) {
        this.wires = this.wires.filter((w) => w !== wire);
    }

    events = {
        onPointerDown: (e: React.PointerEvent) => {
            this.inputs.events.onPointerDown(e);
            this.state.onPointerDown(e);
        },
        onPointerMove: (e: React.PointerEvent) => {
            this.inputs.events.onPointerMove(e);
            this.state.onPointerMove(e);
        },
        onPointerUp: (e: React.PointerEvent) => {
            this.inputs.events.onPointerUp(e);
            this.state.onPointerUp(e);
        },
        onPointerCancel: (e: React.PointerEvent) => {
            this.state.onPointerCancel(e);
        },
    };
}
