import { fail } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { Result } from "@/lib/Result";
import { deepEqual, identity, UpdateAction } from "@/lib/utils";
import { calculateNormalizedShapePointsFromVersions } from "@/splatapus/model/normalizedShape";
import {
    createSplatDoc,
    SplatDoc,
    splatDocSchema,
    SplatKeyPoint,
    SplatKeyPointId,
    SplatShape,
    SplatShapeId,
    SplatShapeVersion,
    SplatShapeVersionId,
} from "@/splatapus/model/SplatDoc";
import { SplatDocData } from "@/splatapus/model/SplatDocData";
import { Index, Table, UniqueIndex } from "@/splatapus/model/Table";
import { diffJson } from "diff";

export class SplatDocModel {
    static create(): SplatDocModel {
        return SplatDocModel.deserialize(createSplatDoc());
    }

    static schema = splatDocSchema.transform(
        (doc) => Result.ok(SplatDocModel.deserialize(doc)),
        (doc) => doc.serialize(),
    );

    static deserialize(data: SplatDoc, version = 0): SplatDocModel {
        const shapeVersions = new Table<SplatShapeVersion>(data.shapeVersions);
        return new SplatDocModel(
            {
                id: data.id,
                keyPoints: new Table(data.keyPoints),
                shapes: new Table(data.shapes),
                shapeVersions: shapeVersions,
                shapeVersionLookup: UniqueIndex.build(
                    shapeVersions,
                    (version) => `${version.shapeId}/${version.keyPointId}`,
                    (version) => version.id,
                    ([shapeId, keyPointId]) => `${shapeId}/${keyPointId}`,
                ),
                shapeVersionIdsByShape: Index.build(
                    shapeVersions,
                    (version) => version.shapeId,
                    (version) => version.id,
                    identity,
                ),
                shapeVersionIdsByKeyPoint: Index.build(
                    shapeVersions,
                    (version) => version.keyPointId,
                    (version) => version.id,
                    identity,
                ),
                normalizedShapeVersions: calculateNormalizedShapePointsFromVersions(
                    Array.from(shapeVersions),
                ).versions,
            },
            version,
            false,
        );
    }

    private constructor(
        private readonly data: SplatDocData,
        readonly version = 0,
        shouldRunDebugChecks = true,
    ) {
        if (!shouldRunDebugChecks) {
            return;
        }

        const serialized = this.serialize();
        const deserialized = SplatDocModel.deserialize(serialized, this.version);
        if (!deepEqual(this, deserialized)) {
            console.log({ actual: this, expected: deserialized });
            const actual = JSON.stringify(this, null, 2);
            const expected = JSON.stringify(deserialized, null, 2);
            for (const change of diffJson(actual, expected)) {
                console.log("CHANGE", change);
            }
            fail(
                `Mismatch after update:\nActual:\n${JSON.stringify(
                    this,
                    null,
                    2,
                )}\n\nExpected:\n${JSON.stringify(deserialized, null, 2)}`,
            );
        }
    }

    private with(data: Partial<SplatDocData>): SplatDocModel {
        return new SplatDocModel({ ...this.data, ...data }, this.version + 1);
    }

    serialize(): SplatDoc {
        return {
            id: this.data.id,
            keyPoints: this.data.keyPoints.data,
            shapes: this.data.shapes.data,
            shapeVersions: this.data.shapeVersions.data,
        };
    }

    get shapes(): Table<SplatShape> {
        return this.data.shapes;
    }

    get keyPoints(): Table<SplatKeyPoint> {
        return this.data.keyPoints;
    }

    get shapeVersions(): Table<SplatShapeVersion> {
        return this.data.shapeVersions;
    }

    getShapeVersion(keyPointId: SplatKeyPointId, shapeId: SplatShapeId): SplatShapeVersion | null {
        const shapeVersionId = this.data.shapeVersionLookup.lookup([shapeId, keyPointId]);
        if (!shapeVersionId) {
            return null;
        }
        return this.shapeVersions.get(shapeVersionId);
    }

    getNormalizedCenterPointsForShapeVersion(shapeVersionId: SplatShapeVersionId) {
        return this.data.normalizedShapeVersions.get(shapeVersionId);
    }

    *iterateShapeVersionsForShape(shapeId: SplatShapeId) {
        for (const shapeVersionId of this.data.shapeVersionIdsByShape.lookup(shapeId)) {
            yield this.shapeVersions.get(shapeVersionId);
        }
    }

    addShape(shapeId: SplatShapeId): SplatDocModel {
        console.log("doc.addShape", shapeId);

        const shapes = this.shapes.insert({
            id: shapeId,
        });

        return this.with({ shapes });
    }

    addKeyPoint(keyPointId: SplatKeyPointId, position: Vector2 | null): SplatDocModel {
        console.log("doc.addKeyPoint", keyPointId);

        const keyPoints = this.keyPoints.insert({
            id: keyPointId,
            position,
        });

        return this.with({ keyPoints });
    }

    updateKeyPoint(
        keyPointId: SplatKeyPointId,
        update: UpdateAction<SplatKeyPoint>,
    ): SplatDocModel {
        return this.with({
            keyPoints: this.keyPoints.update(keyPointId, update),
        });
    }

    replacePointsForVersion(
        keyPointId: SplatKeyPointId,
        shapeId: SplatShapeId,
        rawPoints: ReadonlyArray<Vector2>,
    ): SplatDocModel {
        const existingVersion = this.getShapeVersion(keyPointId, shapeId);
        if (existingVersion) {
            const shapeVersions = this.shapeVersions.insert({
                ...existingVersion,
                rawPoints,
            });
            return this.with({
                shapeVersions,
                normalizedShapeVersions:
                    calculateNormalizedShapePointsFromVersions(shapeVersions).versions,
            });
        }
        const shapeVersion: SplatShapeVersion = {
            id: SplatShapeVersionId.generate(),
            keyPointId,
            shapeId,
            rawPoints,
        };
        const shapeVersions = this.shapeVersions.insert(shapeVersion);
        return this.with({
            shapeVersions,
            normalizedShapeVersions:
                calculateNormalizedShapePointsFromVersions(shapeVersions).versions,
            shapeVersionLookup: this.data.shapeVersionLookup.insert(shapeVersion),
            shapeVersionIdsByShape: this.data.shapeVersionIdsByShape.insert(shapeVersion),
            shapeVersionIdsByKeyPoint: this.data.shapeVersionIdsByKeyPoint.insert(shapeVersion),
        });
    }
}
