import { Vector2, Vector2Model } from "@/lib/geom/Vector2";
import {
    BaseRecord,
    RecordId,
    Store,
    StoreSchema,
    createRecordType,
} from "@tldraw/store";

export type CameraId = RecordId<Camera>;
export interface Camera extends BaseRecord<"camera", CameraId> {
    readonly center: Vector2Model;
    readonly zoom: number;
}
export const Camera = createRecordType<Camera>("camera", {
    scope: "session",
}).withDefaultProperties(() => ({ center: Vector2.ZERO.toJson(), zoom: 1 }));
export const CAMERA_ID = Camera.createId("camera");

export type StrokeId = RecordId<Stroke>;
export interface Stroke extends BaseRecord<"stroke", StrokeId> {
    readonly points: Vector2Model[];
}
export const Stroke = createRecordType<Stroke>("stroke", {
    scope: "document",
}).withDefaultProperties(() => ({ points: [] }));

export type GLRecord = Camera | Stroke;

export const schema = StoreSchema.create<GLRecord, undefined>({
    camera: Camera,
    stroke: Stroke,
});

export class GesturelandStore extends Store<GLRecord, undefined> {
    constructor() {
        super({
            schema,
            props: undefined,
        });
    }

    put1(record: GLRecord) {
        return this.put([record]);
    }

    delete(id: GLRecord["id"]) {
        return this.remove([id]);
    }
}
