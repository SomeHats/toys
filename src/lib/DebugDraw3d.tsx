import {
    DebugDraw,
    DebugOptions,
    FillOptions,
    StrokeAndFillOptions,
    StrokeOptions,
} from "@/lib/DebugDraw";
import { Matrix4 } from "@/lib/geom/Matrix4";
import { Vector2, Vector2Ish } from "@/lib/geom/Vector2";
import { Vector3, Vector3Ish } from "@/lib/geom/Vector3";
import { log9 } from "@/lib/logger";
import { mapRange } from "@/lib/utils";

export class DebugDraw3d {
    private readonly dbg: DebugDraw;
    private projection = Matrix4.IDENTITY;
    private size = Vector2.UNIT;

    constructor(ctx: CanvasRenderingContext2D) {
        this.dbg = new DebugDraw(ctx);
    }

    reset(size: Vector2Ish, projection: Matrix4) {
        this.dbg.reset(size);
        this.size = Vector2.from(size);
        this.setProjection(projection);
    }

    private setProjection(projection: Matrix4) {
        this.projection = projection;
    }

    project(point: Vector3Ish): Vector2 {
        log9(
            "project",
            Vector3.from(point).toString(),
            this.projection
                .transformVector3(point)
                .swizzle2("x", "y")
                .toString(),
        );
        const { x, y } = this.projection.transformVector3(point);
        return new Vector2(
            mapRange(-1, 1, 0, this.size.x, x),
            mapRange(1, -1, 0, this.size.y, y),
        );
    }

    projectArray(points: ReadonlyArray<Vector3Ish>): Array<Vector2> {
        return points.map((point) => this.project(point));
    }

    clear(fill?: string) {
        this.dbg.clear(fill);
    }

    public beginPath() {
        this.dbg.beginPath();
    }

    public moveTo(point: Vector3Ish) {
        this.dbg.moveTo(this.project(point));
    }

    public lineTo(point: Vector3Ish) {
        this.dbg.lineTo(this.project(point));
    }

    public quadraticCurveTo(control: Vector3Ish, target: Vector3Ish) {
        this.dbg.quadraticCurveTo(this.project(control), this.project(target));
    }
    public bezierCurveTo(
        control1: Vector3Ish,
        control2: Vector3Ish,
        target: Vector3Ish,
    ) {
        this.dbg.bezierCurveTo(
            this.project(control1),
            this.project(control2),
            this.project(target),
        );
    }

    public applyStrokeOptions(options: StrokeOptions) {
        this.dbg.applyStrokeOptions(options);
    }

    public stroke(options: StrokeOptions) {
        this.dbg.stroke(options);
    }

    public applyFillOptions(options: FillOptions) {
        this.dbg.applyFillOptions(options);
    }

    public fill(options: FillOptions) {
        this.dbg.fill(options);
    }

    public applyStrokeAndFillOptions(options: StrokeAndFillOptions) {
        this.dbg.applyStrokeAndFillOptions(options);
    }

    public strokeAndFill(options: StrokeAndFillOptions) {
        this.dbg.strokeAndFill(options);
    }

    public getDebugStrokeOptions(color?: string): StrokeOptions {
        return this.dbg.getDebugStrokeOptions(color);
    }

    public debugStroke(color?: string) {
        this.dbg.debugStroke(color);
    }

    public fillText(text: string, position: Vector3Ish, options?: FillOptions) {
        this.dbg.fillText(text, this.project(position), options);
    }

    public debugLabel(
        label: string | undefined,
        position: Vector3,
        color: string,
    ) {
        this.dbg.debugLabel(label, this.project(position), color);
    }

    public debugPointX(position: Vector3Ish, options?: DebugOptions) {
        this.dbg.debugPointX(this.project(position), options);
    }

    public debugPointO(position: Vector3Ish, options?: DebugOptions) {
        this.dbg.debugPointO(this.project(position), options);
    }

    public debugArrow(
        start: Vector3Ish,
        end: Vector3Ish,
        options?: DebugOptions,
    ) {
        this.dbg.debugArrow(this.project(start), this.project(end), options);
    }

    public debugVectorAtPoint(
        vector: Vector3Ish,
        base: Vector3Ish,
        options?: DebugOptions,
    ) {
        const start = Vector3.from(base);
        const end = start.add(vector);
        this.debugArrow(start, end, options);
    }

    public polygon(
        polygon: ReadonlyArray<Vector3Ish>,
        options?: StrokeAndFillOptions,
    ) {
        this.dbg.polygon(this.projectArray(polygon), options);
    }

    public polyLine(points: ReadonlyArray<Vector3Ish>, options: StrokeOptions) {
        this.dbg.polyLine(this.projectArray(points), options);
    }

    public debugPolygon(
        polygon: ReadonlyArray<Vector3Ish>,
        options?: DebugOptions,
    ) {
        this.dbg.debugPolygon(this.projectArray(polygon), options);
    }

    public debugPolyLine(
        polyLine: ReadonlyArray<Vector3Ish>,
        options?: DebugOptions,
    ) {
        this.dbg.debugPolyLine(this.projectArray(polyLine), options);
    }
    public debugQuadraticCurve(
        from: Vector3Ish,
        control: Vector3Ish,
        to: Vector3Ish,
        options?: DebugOptions,
    ) {
        this.dbg.debugQuadraticCurve(
            this.project(from),
            this.project(control),
            this.project(to),
            options,
        );
    }
    public debugBezierCurve(
        from: Vector3Ish,
        control1: Vector3Ish,
        control2: Vector3Ish,
        to: Vector3Ish,
        options?: DebugOptions,
    ) {
        this.dbg.debugBezierCurve(
            this.project(from),
            this.project(control1),
            this.project(control2),
            this.project(to),
            options,
        );
    }

    public gizmo(position: Vector3Ish, size = 30) {
        this.debugVectorAtPoint(Vector3.X.scale(size), position, {
            color: "red",
            label: "x",
        });
        this.debugVectorAtPoint(Vector3.Y.scale(size), position, {
            color: "green",
            label: "y",
        });
        this.debugVectorAtPoint(Vector3.Z.scale(size), position, {
            color: "blue",
            label: "z",
        });
    }
}
