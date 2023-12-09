import { Vector2 } from "@/lib/geom/Vector2";
import { SchemaType } from "@/lib/schema";
import { IdGenerator } from "@/splatapus/model/Ids";
import {
    IncrementalDiff,
    IncrementalValue,
    incrementalArrayOf,
    incrementalAtom,
    incrementalObject,
    incrementalStatic,
    incrementalTable,
} from "@/splatapus2/store/Incremental";

export const KeyPointId = new IdGenerator("key");
export type KeyPointId = (typeof KeyPointId)["Id"];
export const KeyPoint = incrementalObject({
    id: incrementalStatic(KeyPointId.schema),
    position: incrementalAtom(Vector2.schema.nullable()),
});
export type KeyPoint = SchemaType<typeof KeyPoint.valueSchema>;

export const KeyPointTable = incrementalTable(KeyPointId.schema, KeyPoint);
export type KeyPointTable = SchemaType<typeof KeyPointTable.valueSchema>;

export const ShapeId = new IdGenerator("shp");
export type ShapeId = (typeof ShapeId)["Id"];
export const Shape = incrementalObject({
    id: incrementalStatic(ShapeId.schema),
});
export type Shape = SchemaType<typeof Shape.valueSchema>;

export const ShapeTable = incrementalTable(ShapeId.schema, Shape);
export type ShapeTable = SchemaType<typeof ShapeTable.valueSchema>;

export const ShapeVersionId = new IdGenerator("shv");
export type ShapeVersionId = (typeof ShapeVersionId)["Id"];
export const ShapeVersion = incrementalObject({
    id: incrementalStatic(ShapeVersionId.schema),
    keyPointId: incrementalAtom(KeyPointId.schema),
    shapeId: incrementalAtom(ShapeId.schema),
    rawPoints: incrementalArrayOf(Vector2.schema),
});
export type ShapeVersion = SchemaType<typeof ShapeVersion.valueSchema>;

export const ShapeVersionTable = incrementalTable(
    ShapeVersionId.schema,
    ShapeVersion,
);
export type ShapeVersionTable = SchemaType<
    typeof ShapeVersionTable.valueSchema
>;

export const Doc = incrementalObject({
    keyPoints: KeyPointTable,
    shapes: ShapeTable,
    shapeVersions: ShapeVersionTable,
});
export type Doc = IncrementalValue<typeof Doc>;
export type DocDiff = IncrementalDiff<typeof Doc>;
