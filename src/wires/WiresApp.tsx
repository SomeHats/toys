import { Result } from "@/lib/Result";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema } from "@/lib/schema";
import { degreesToRadians, radiansToDegrees } from "@/lib/utils";
import { IdGenerator } from "@/splatapus/model/Ids";
import { Model, memo } from "@/wires/Model";
import { Line2 } from "@/lib/geom/Line2";
import { Inputs } from "@/wires/inputs";
import { RootNode } from "@/wires/states";
import { transact } from "signia";
import { Path } from "@/lib/geom/Path";
import StraightPathSegment from "@/lib/geom/StraightPathSegment";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import Circle from "@/lib/geom/Circle";
import CirclePathSegment from "@/lib/geom/CirclePathSegment";

const angleStep = degreesToRadians(60);
const CORNER_CIRCLE_RADIUS = 8;

export const WireId = new IdGenerator("wire");
export type WireId = typeof WireId.Id;
export class Wire extends Model({
    id: WireId.schema,
    start: Vector2.schema,
    end: Vector2.schema,
}) {
    static schema = super.modelSchema.transform(
        (props) => Result.ok(new Wire(props)),
        (wire) => wire.serialized,
    );

    @memo get startAngle() {
        const angle = this.start.angleTo(this.end);
        // round angle to nearest angleStep:
        return Math.round(angle / angleStep) * angleStep;
        // if (this.start.x > this.end.x) {
        //     return Math.PI;
        // }
        // return 0;
    }

    @memo get lineInfo(): { middleSection: [Vector2, Vector2]; radius: number; path: string } {
        const centerPoint = this.start.lerp(this.end, 0.5);
        const angleToCenter = this.start.angleTo(centerPoint) - this.startAngle;
        console.log({
            angle: radiansToDegrees(this.start.angleTo(this.end)),
            angleToCenter: radiansToDegrees(angleToCenter),
            startAngle: radiansToDegrees(this.startAngle),
        });

        const initialLine = Line2.fromAngleAndPoint(this.startAngle, this.start);
        const middleLine1 = Line2.fromAngleAndPoint(
            this.startAngle + degreesToRadians(60),
            centerPoint,
        );
        const middleLine2 = Line2.fromAngleAndPoint(
            this.startAngle - degreesToRadians(60),
            centerPoint,
        );
        const middleLine1Start = middleLine1.pointAtIntersectionWith(initialLine);
        const middleLine2Start = middleLine2.pointAtIntersectionWith(initialLine);
        const middleLine =
            this.start.distanceTo(middleLine1Start) < this.start.distanceTo(middleLine2Start)
                ? middleLine1
                : middleLine2;

        const lastLine = Line2.fromAngleAndPoint(this.startAngle, this.end);

        const middleSegmentStart = initialLine.pointAtIntersectionWith(middleLine);
        const middleSegmentEnd = middleLine.pointAtIntersectionWith(lastLine);

        const radius = Math.min(
            middleSegmentStart.distanceTo(this.start),
            middleSegmentEnd.distanceTo(this.end),
            (middleSegmentStart.distanceTo(middleSegmentEnd) - 1) / 2,
            CORNER_CIRCLE_RADIUS,
        );

        const path = new SvgPathBuilder();
        path.moveTo(this.start);

        const middleStartArc = Path.segmentAcrossCircle(
            new Circle(middleSegmentStart, radius),
            this.start.angleTo(middleSegmentStart),
            middleSegmentStart.angleTo(middleSegmentEnd),
        );
        if (middleStartArc instanceof CirclePathSegment) {
            path.lineTo(middleStartArc.getStart());
            path.arcTo(
                middleStartArc.circle.radius,
                middleStartArc.circle.radius,
                0,
                0,
                middleStartArc.isAnticlockwise ? 0 : 1,
                middleStartArc.getEnd(),
            );
        } else {
            path.lineTo(middleStartArc.getEnd());
        }

        const middleEndArc = Path.segmentAcrossCircle(
            new Circle(middleSegmentEnd, radius),
            middleSegmentStart.angleTo(middleSegmentEnd),
            middleSegmentEnd.angleTo(this.end),
        );
        if (middleEndArc instanceof CirclePathSegment) {
            path.lineTo(middleEndArc.getStart());
            path.arcTo(
                middleEndArc.circle.radius,
                middleEndArc.circle.radius,
                0,
                0,
                middleEndArc.isAnticlockwise ? 0 : 1,
                middleEndArc.getEnd(),
            );
        } else {
            path.lineTo(middleEndArc.getEnd());
        }
        path.lineTo(this.end);

        return {
            middleSection: [middleStartArc.getEnd(), middleEndArc.getStart()],
            radius,
            path: path.toString(),
        };
    }
}

export class WiresApp extends Model({
    wires: Schema.arrayOf(Wire.schema),
}) {
    static schema = super.modelSchema.transform(
        (props) => Result.ok(new WiresApp(props)),
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
            transact(() => {
                this.inputs.events.onPointerDown(e);
                this.state.onPointerDown(e);
            });
        },
        onPointerMove: (e: React.PointerEvent) => {
            transact(() => {
                this.inputs.events.onPointerMove(e);
                this.state.onPointerMove(e);
            });
        },
        onPointerUp: (e: React.PointerEvent) => {
            transact(() => {
                this.inputs.events.onPointerUp(e);
                this.state.onPointerUp(e);
            });
        },
        onPointerCancel: (e: React.PointerEvent) => {
            transact(() => {
                this.state.onPointerCancel(e);
            });
        },
    };
}
