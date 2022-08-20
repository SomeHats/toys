import Vector2 from "@/lib/geom/Vector2";
import {
    createArrayParser,
    createDictParser,
    createShapeParser,
    ParserType,
} from "@/lib/objectParser";
import { IdGenerator } from "@/splatapus/model/Ids";

export const SplatKeypointId = new IdGenerator("key");
export type SplatKeypointId = typeof SplatKeypointId["Id"];
export const parseSplatKeypoint = createShapeParser({
    id: SplatKeypointId.parse,
    position: Vector2.parse,
});
export type SplatKeypoint = ParserType<typeof parseSplatKeypoint>;

// export const SplatShapeId = new IdGenerator("shp");
// export type SplatShapeId = typeof SplatShapeId["Id"];
// export type SplatShape = {
//     readonly id: SplatShapeId;
//     readonly versionsByKeypointId: ReadonlyRecord<SplatKeypointId, SplatShapeVersionId>;
// };

export const SplatShapeVersionId = new IdGenerator("shv");
export type SplatShapeVersionId = typeof SplatShapeVersionId["Id"];
export const parseSplatShapeVersion = createShapeParser({
    id: SplatShapeVersionId.parse,
    keyPointId: SplatKeypointId.parse,
    rawPoints: createArrayParser(Vector2.parse),
});
export type SplatShapeVersion = ParserType<typeof parseSplatShapeVersion>;

export const SplatDocId = new IdGenerator("doc");
export type SplatDocId = typeof SplatDocId["Id"];
export const parseSplatDoc = createShapeParser({
    id: SplatDocId.parse,
    keyPoints: createDictParser(SplatKeypointId.parse, parseSplatKeypoint),
    shapeVersions: createDictParser(SplatShapeVersionId.parse, parseSplatShapeVersion),
});
export type SplatDoc = ParserType<typeof parseSplatDoc>;

export function createSplatDoc(): SplatDoc {
    return {
        id: SplatDocId.generate(),
        keyPoints: {},
        // shapes: {},
        shapeVersions: {},
    };
}
