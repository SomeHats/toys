import { Vector2 } from "@/lib/geom/Vector2";
import {
    createArrayParser,
    createDictParser,
    createNullableParser,
    createShapeParser,
    ParserType,
} from "@/lib/objectParser";
import { IdGenerator } from "@/splatapus/model/Ids";

export const SplatKeyPointId = new IdGenerator("key");
export type SplatKeyPointId = typeof SplatKeyPointId["Id"];
export const parseSplatKeyPoint = createShapeParser({
    id: SplatKeyPointId.parse,
    position: createNullableParser(Vector2.parse),
});
export type SplatKeyPoint = ParserType<typeof parseSplatKeyPoint>;

export const SplatShapeId = new IdGenerator("shp");
export type SplatShapeId = typeof SplatShapeId["Id"];
export const parseSplatShape = createShapeParser({
    id: SplatShapeId.parse,
});
export type SplatShape = ParserType<typeof parseSplatShape>;

export const SplatShapeVersionId = new IdGenerator("shv");
export type SplatShapeVersionId = typeof SplatShapeVersionId["Id"];
export const parseSplatShapeVersion = createShapeParser({
    id: SplatShapeVersionId.parse,
    keyPointId: SplatKeyPointId.parse,
    shapeId: SplatShapeId.parse,
    rawPoints: createArrayParser(Vector2.parse),
});
export type SplatShapeVersion = ParserType<typeof parseSplatShapeVersion>;

export const SplatDocId = new IdGenerator("doc");
export type SplatDocId = typeof SplatDocId["Id"];
export const parseSplatDoc = createShapeParser({
    id: SplatDocId.parse,
    keyPoints: createDictParser(SplatKeyPointId.parse, parseSplatKeyPoint),
    shapes: createDictParser(SplatShapeId.parse, parseSplatShape),
    shapeVersions: createDictParser(SplatShapeVersionId.parse, parseSplatShapeVersion),
});
export type SplatDoc = ParserType<typeof parseSplatDoc>;

export function createSplatDoc(): SplatDoc {
    return {
        id: SplatDocId.generate(),
        keyPoints: {},
        shapes: {},
        shapeVersions: {},
    };
}
