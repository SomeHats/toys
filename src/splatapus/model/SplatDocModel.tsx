import { SplatDocData } from "@/splatapus/model/SplatDocData";
import {
    createSplatDoc,
    SplatDoc,
    SplatKeypoint,
    SplatShapeVersion,
} from "@/splatapus/model/SplatDoc";
import { OneToOneIndex, Table } from "@/splatapus/model/Table";
import { deepEqual as assertDeepEqual } from "assert";

export class SplatDocModel {
    static create(): SplatDocModel {
        return SplatDocModel.deserialize(createSplatDoc());
    }

    static deserialize(data: SplatDoc): SplatDocModel {
        const shapeVersions = new Table<SplatShapeVersion>(data.shapeVersions);
        return new SplatDocModel(
            new SplatDocData(
                data.id,
                new Table(data.keyPoints),
                // new Table(data.shapes),
                shapeVersions,
                OneToOneIndex.build("keyPointId", shapeVersions),
            ),
            false,
        );
    }

    private constructor(readonly data: SplatDocData, shouldRunDebugChecks = true) {
        if (!shouldRunDebugChecks) {
            return;
        }

        const serialized = this.serialize();
        const deserialized = SplatDocModel.deserialize(serialized);
        assertDeepEqual(this, deserialized);
    }

    serialize(): SplatDoc {
        return {
            id: this.data.id,
            keyPoints: this.data.keyPoints.data,
            // shapes: this.data.shapes.data,
            shapeVersions: this.data.shapeVersions.data,
        };
    }

    get keyPoints(): Table<SplatKeypoint> {
        return this.data.keyPoints;
    }

    get shapeVersions(): Table<SplatShapeVersion> {
        return this.data.shapeVersions;
    }
}
