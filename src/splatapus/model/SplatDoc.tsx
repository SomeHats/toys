import { Vector2 } from "@/lib/geom/Vector2";
import { Schema, SchemaType } from "@/lib/schema";
import { IdGenerator } from "@/splatapus/model/Ids";

export const SplatKeyPointId = new IdGenerator("key");
export type SplatKeyPointId = typeof SplatKeyPointId["Id"];
export const splatKeyPointSchema = Schema.object({
    id: SplatKeyPointId.schema,
    position: Vector2.schema.nullable(),
});
export type SplatKeyPoint = SchemaType<typeof splatKeyPointSchema>;

export const SplatShapeId = new IdGenerator("shp");
export type SplatShapeId = typeof SplatShapeId["Id"];
export const splatShapeSchema = Schema.object({
    id: SplatShapeId.schema,
});
export type SplatShape = SchemaType<typeof splatShapeSchema>;

export const SplatShapeVersionId = new IdGenerator("shv");
export type SplatShapeVersionId = typeof SplatShapeVersionId["Id"];
export const splatShapeVersionSchema = Schema.object({
    id: SplatShapeVersionId.schema,
    keyPointId: SplatKeyPointId.schema,
    shapeId: SplatShapeId.schema,
    rawPoints: Schema.arrayOf(Vector2.schema),
});
export type SplatShapeVersion = SchemaType<typeof splatShapeVersionSchema>;

export const SplatDocId = new IdGenerator("doc");
export type SplatDocId = typeof SplatDocId["Id"];
export const splatDocSchema = Schema.object({
    id: SplatDocId.schema,
    keyPoints: Schema.objectMap(SplatKeyPointId.schema, splatKeyPointSchema),
    shapes: Schema.objectMap(SplatShapeId.schema, splatShapeSchema),
    shapeVersions: Schema.objectMap(SplatShapeVersionId.schema, splatShapeVersionSchema),
});
export type SplatDoc = SchemaType<typeof splatDocSchema>;

export function createSplatDoc(): SplatDoc {
    return {
        id: SplatDocId.generate(),
        keyPoints: {},
        shapes: {},
        shapeVersions: {},
    };
}
