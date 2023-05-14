import {
    SplatDocId,
    SplatKeyPoint,
    SplatKeyPointId,
    SplatShape,
    SplatShapeId,
    SplatShapeVersion,
    SplatShapeVersionId,
} from "@/splatapus/model/SplatDoc";
import { Index, Table, UniqueIndex } from "@/splatapus/model/Table";
import { NormalizedShapeVersionState } from "@/splatapus/model/normalizedShape";

type ShapeVersionLookupIndex = UniqueIndex<
    SplatShapeVersion,
    SplatShapeVersionId,
    [SplatShapeId, SplatKeyPointId]
>;
type ShapeVersionIdsByShapeIndex = Index<SplatShapeVersion, SplatShapeVersionId, SplatShapeId>;
type ShapeVersionIdsByKeyPointIndex = Index<
    SplatShapeVersion,
    SplatShapeVersionId,
    SplatKeyPointId
>;

export type SplatDocData = {
    readonly id: SplatDocId;
    readonly keyPoints: Table<SplatKeyPoint>;
    readonly shapes: Table<SplatShape>;
    readonly shapeVersions: Table<SplatShapeVersion>;
    readonly shapeVersionLookup: ShapeVersionLookupIndex;
    readonly shapeVersionIdsByShape: ShapeVersionIdsByShapeIndex;
    readonly shapeVersionIdsByKeyPoint: ShapeVersionIdsByKeyPointIndex;
    readonly normalizedShapeVersions: Table<NormalizedShapeVersionState>;
};
