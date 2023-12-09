import { Vector2 } from "@/lib/geom/Vector2";
import { Schema, SchemaType } from "@/lib/schema";
import { applyUpdateWithin } from "@/lib/utils";
import { IdGenerator } from "@/splatapus/model/Ids";

export const WireNodeId = new IdGenerator("node");
export type WireNodeId = (typeof WireNodeId)["Id"];
export const outWireNodeSchema = Schema.object({
    type: Schema.value("out"),
    id: WireNodeId.schema,
    position: Vector2.schema,
});
export type OutWireNode = SchemaType<typeof outWireNodeSchema>;

export const inWireNodeSchema = Schema.object({
    type: Schema.value("in"),
    id: WireNodeId.schema,
    position: Vector2.schema,
});
export type InWireNodeSchema = SchemaType<typeof inWireNodeSchema>;

export const joinWireNodeSchema = Schema.object({
    type: Schema.value("join"),
    id: WireNodeId.schema,
    position: Vector2.schema,
});
export type JoinWireNodeSchema = SchemaType<typeof inWireNodeSchema>;

export const wireNodeSchema = Schema.union("type", {
    out: outWireNodeSchema,
    in: inWireNodeSchema,
    join: joinWireNodeSchema,
});
export type WireNode = SchemaType<typeof wireNodeSchema>;

export const WireId = new IdGenerator("wire");
export type WireId = (typeof WireId)["Id"];
export const wireSchema = Schema.object({
    id: WireId.schema,
    startNodeId: WireNodeId.schema,
    endNodeId: WireNodeId.schema,
    midPoints: Schema.arrayOf(Vector2.schema),
});
export type Wire = SchemaType<typeof wireSchema>;

export const wiresModelSchema = Schema.object({
    nodes: Schema.objectMap(WireNodeId.schema, wireNodeSchema),
    wires: Schema.objectMap(WireId.schema, wireSchema),
});
export type WiresModel = SchemaType<typeof wiresModelSchema>;

export function insert<
    K extends keyof WiresModel,
    Id extends string,
    T extends { readonly id: Id },
>(model: WiresModel, key: K, item: T): WiresModel {
    return applyUpdateWithin(model, key, (table) => ({
        ...table,
        [item.id]: item,
    }));
}
