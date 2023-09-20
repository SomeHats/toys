import { assert, assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { memo } from "@/lib/signia";
import { Expand, UpdateAction, applyUpdate } from "@/lib/utils";
import { Viewport } from "@/splatapus3/Viewport";
import { RootInteraction } from "@/splatapus3/interaction/Root";
import { SplatHistory } from "@/splatapus3/model/History";
import {
    KeyPoint,
    KeyPointId,
    LOCATION_ID,
    Location,
    Shape,
    ShapeId,
    ShapeVersion,
    SplatRecord,
    Store,
} from "@/splatapus3/model/schema";
import { IdOf } from "@tldraw/store";

export class Splat {
    readonly history = new SplatHistory(this);
    readonly interaction = new RootInteraction(this);
    readonly viewport = new Viewport(this);

    constructor(readonly store: Store) {
        this.ensureStoreIsUsable();
    }

    ensureStoreIsUsable() {
        const { allKeyPointIds, allShapeIds } = this;
        let firstKeyPointId;
        let firstShapeId;

        if (allKeyPointIds.length) {
            firstKeyPointId = allKeyPointIds[0];
        } else {
            firstKeyPointId = KeyPoint.createId();
            this.insert(
                KeyPoint.create({
                    id: firstKeyPointId,
                    position: Vector2.ZERO,
                }),
            );
        }

        if (allShapeIds.length) {
            firstShapeId = allShapeIds[0];
        } else {
            firstShapeId = Shape.createId();
            this.insert(Shape.create({ id: firstShapeId }));
        }

        const shapeVersion = this.getShapeVersionIfExists(firstShapeId, firstKeyPointId);
        if (!shapeVersion) {
            this.insert(
                ShapeVersion.create({
                    keyPointId: firstKeyPointId,
                    shapeId: firstShapeId,
                    rawPoints: [],
                }),
            );
        }

        if (!this.get(LOCATION_ID)) {
            this.insert(
                Location.create({
                    id: LOCATION_ID,
                    position: Vector2.ZERO,
                    zoom: 1,
                    activeKeyPointId: firstKeyPointId,
                }),
            );
        }
    }

    get location() {
        return assertExists(this.store.get(LOCATION_ID));
    }
    updateLocation(location: Expand<Partial<Omit<Location, "typeName" | "id">>>) {
        this.store.put([{ ...this.location, ...location }]);
    }

    get<Id extends IdOf<SplatRecord>>(recordId: Id) {
        return this.store.get(recordId);
    }
    update(
        record: {
            [Rec in SplatRecord as string]: Expand<Partial<Rec> & { id: IdOf<Rec> }>;
        }[string],
    ) {
        const existing = assertExists(this.store.get(record.id));
        this.store.put([{ ...existing, ...record } as SplatRecord]);
    }
    updateById<Id extends IdOf<SplatRecord>>(
        id: Id,
        update: UpdateAction<Extract<SplatRecord, { id: Id }>>,
    ) {
        const existing = assertExists(this.get(id));
        this.store.put([applyUpdate(existing, update as any)]);
    }
    insert(record: SplatRecord) {
        assert(!this.get(record.id));
        this.store.put([record]);
    }

    @memo private get allKeyPointIdsQuery() {
        return this.store.query.ids("keyPoint");
    }
    @memo get allKeyPointIds() {
        return Array.from(this.allKeyPointIdsQuery.value).sort();
    }
    @memo get activeKeyPoint() {
        return (
            this.get(this.location.activeKeyPointId) ??
            assertExists(this.get(assertExists(this.allKeyPointIds[0])))
        );
    }

    @memo private get allShapeIdsQuery() {
        return this.store.query.ids("shape");
    }
    @memo get allShapeIds() {
        return Array.from(this.allShapeIdsQuery.value).sort();
    }
    @memo get firstShape() {
        return assertExists(this.get(assertExists(this.allShapeIds[0])));
    }

    getShapeVersionIfExists(shapeId: ShapeId, keyPointId: KeyPointId) {
        const shapeVersion = this.store.query.record("shapeVersion", () => ({
            shapeId: { eq: shapeId },
            keyPointId: { eq: keyPointId },
        }));
        return shapeVersion.value;
    }
    getShapeVersion(shapeId: ShapeId, keyPointId: KeyPointId) {
        return assertExists(this.getShapeVersionIfExists(shapeId, keyPointId));
    }
}
