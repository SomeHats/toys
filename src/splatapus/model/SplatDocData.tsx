import { OneToOneIndex, Table } from "@/splatapus/model/Table";
import {
    SplatKeypoint,
    SplatDocId,
    SplatShapeVersion,
    SplatKeypointId,
    SplatShapeVersionId,
} from "@/splatapus/model/SplatDoc";
import { NormalizedShapeVersionState } from "@/splatapus/model/normalizedShape";

export class SplatDocData {
    constructor(
        readonly id: SplatDocId,
        readonly keyPoints: Table<SplatKeypoint>,
        // readonly shapes: Table<SplatShape>,
        readonly shapeVersions: Table<SplatShapeVersion>,
        readonly keyPointIdByShapeVersion: OneToOneIndex<SplatShapeVersionId, SplatKeypointId>,
        readonly normalizedShapeVersions: Table<NormalizedShapeVersionState>,
    ) {}

    with(changes: {
        id?: SplatDocId;
        keyPoints?: Table<SplatKeypoint>;
        // shapes?: Table<SplatShape>;
        shapeVersions?: Table<SplatShapeVersion>;
        keyPointIdByShapeVersion?: OneToOneIndex<SplatShapeVersionId, SplatKeypointId>;
        normalizedCenterPointsByShapeVersion?: Table<NormalizedShapeVersionState>;
    }): SplatDocData {
        return new SplatDocData(
            changes.id ?? this.id,
            changes.keyPoints ?? this.keyPoints,
            // changes.shapes ?? this.shapes,
            changes.shapeVersions ?? this.shapeVersions,
            changes.keyPointIdByShapeVersion ?? this.keyPointIdByShapeVersion,
            changes.normalizedCenterPointsByShapeVersion ?? this.normalizedShapeVersions,
        );
    }
}
