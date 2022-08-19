import Vector2 from "@/lib/geom/Vector2";
import { ReadonlyRecord } from "@/lib/utils";
import { IdGenerator } from "@/splatapus/model/Ids";
import { TableData } from "@/splatapus/model/Table";

export const SplatDocId = new IdGenerator("doc");
export type SplatDocId = typeof SplatDocId["Id"];
export type SplatDoc = {
    readonly id: SplatDocId;
    readonly keyframes: TableData<SplatKeypoint>;
    readonly shapes: TableData<SplatShape>;
};

export const SplatKeypointId = new IdGenerator("key");
export type SplatKeypointId = typeof SplatKeypointId["Id"];
export type SplatKeypoint = {
    readonly id: SplatKeypointId;
    readonly position: Vector2;
};

export const SplatShapeId = new IdGenerator("shp");
export type SplatShapeId = typeof SplatShapeId["Id"];
export type SplatShape = {
    readonly id: SplatShapeId;
    readonly versionsByKeypointId: ReadonlyRecord<SplatKeypointId, SplatShapeVersionId>;
};

export const SplatShapeVersion = new IdGenerator("shv");
export type SplatShapeVersionId = typeof SplatShapeVersion["Id"];
export type SplatShapeVersion = {
    readonly id: SplatShapeVersionId;
    readonly rawPoints: ReadonlyArray<Vector2>;
};
