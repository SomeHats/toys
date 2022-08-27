import { SplatDocData } from "@/splatapus/model/SplatDocData";
import {
    createSplatDoc,
    SplatDoc,
    SplatKeypoint,
    SplatKeypointId,
    SplatShapeVersion,
    SplatShapeVersionId,
} from "@/splatapus/model/SplatDoc";
import { OneToOneIndex, Table } from "@/splatapus/model/Table";
import { calculateNormalizedShapePointsFromVersions } from "@/splatapus/model/normalizedShape";
import Vector2 from "@/lib/geom/Vector2";
import { deepEqual, UpdateAction } from "@/lib/utils";
import { fail } from "@/lib/assert";
import { diffJson, diffLines } from "diff";

export class SplatDocModel {
    static create(): SplatDocModel {
        return SplatDocModel.deserialize(createSplatDoc());
    }

    static deserialize(data: SplatDoc, version = 0): SplatDocModel {
        const shapeVersions = new Table<SplatShapeVersion>(data.shapeVersions);
        return new SplatDocModel(
            new SplatDocData(
                data.id,
                new Table(data.keyPoints),
                // new Table(data.shapes),
                shapeVersions,
                OneToOneIndex.build("keyPointId", shapeVersions),
                calculateNormalizedShapePointsFromVersions(Array.from(shapeVersions)).versions,
            ),
            version,
            false,
        );
    }

    private constructor(
        readonly data: SplatDocData,
        readonly version = 0,
        shouldRunDebugChecks = true,
    ) {
        if (!shouldRunDebugChecks) {
            return;
        }

        const serialized = this.serialize();
        const deserialized = SplatDocModel.deserialize(serialized, this.version);
        if (!deepEqual(this, deserialized)) {
            const actual = JSON.stringify(this, null, 2);
            const expected = JSON.stringify(deserialized, null, 2);
            const changes = diffLines(actual, expected);
            console.log(changes);
            fail(
                `Mismatch after update:\nActual:\n${JSON.stringify(
                    this,
                    null,
                    2,
                )}\n\nExpected:\n${JSON.stringify(deserialized, null, 2)}`,
            );
        }
    }

    private with(...params: Parameters<SplatDocData["with"]>): SplatDocModel {
        return new SplatDocModel(this.data.with(...params), this.version + 1);
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

    getShapeVersionForKeyPoint(keyPointId: SplatKeypointId): SplatShapeVersion {
        return this.shapeVersions.get(this.data.keyPointIdByShapeVersion.lookupInverse(keyPointId));
    }

    addKeyPoint(keyPointId: SplatKeypointId): SplatDocModel {
        console.log("doc.addKeyPoint", keyPointId);
        const shapeVersionId = SplatShapeVersionId.generate();
        const keyPoints = this.keyPoints.insert({
            id: keyPointId,
            position: Vector2.UNIT,
        });
        const shapeVersions = this.shapeVersions.insert({
            id: shapeVersionId,
            keyPointId,
            rawPoints: [],
        });

        return this.with({
            keyPoints,
            shapeVersions,
            keyPointIdByShapeVersion: this.data.keyPointIdByShapeVersion.add(
                shapeVersionId,
                keyPointId,
            ),
            normalizedCenterPointsByShapeVersion: calculateNormalizedShapePointsFromVersions(
                Array.from(shapeVersions),
            ).versions,
        });
    }

    updateKeypoint(
        keyPointId: SplatKeypointId,
        update: UpdateAction<SplatKeypoint>,
    ): SplatDocModel {
        return this.with({
            keyPoints: this.keyPoints.update(keyPointId, update),
        });
    }

    replaceShapeVersionPoints(
        shapeVersionId: SplatShapeVersionId,
        rawPoints: ReadonlyArray<Vector2>,
    ): SplatDocModel {
        console.log("doc.replaceShapeVersionPoints", shapeVersionId);
        const shapeVersions = this.shapeVersions.insert({
            ...this.shapeVersions.get(shapeVersionId),
            rawPoints,
        });
        return this.with({
            shapeVersions,
            normalizedCenterPointsByShapeVersion: calculateNormalizedShapePointsFromVersions(
                Array.from(shapeVersions),
            ).versions,
        });
    }
}
