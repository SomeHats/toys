import { Result } from "@/lib/Result";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema, SchemaParseError, SchemaType } from "@/lib/schema";
import { identity } from "@/lib/utils";
import {
    BaseRecord,
    IdOf,
    RecordId,
    SerializedStore,
    StoreSchema,
    Store as TLStore,
    createRecordType,
} from "@tldraw/store";

function idSchema<Id extends RecordId<any>>(
    typeName: Id["__type__"]["typeName"],
) {
    const re = new RegExp(`^${typeName}\\:([a-zA-Z0-9_]+)$`);
    const validate = (input: string) => {
        if (re.test(input)) {
            return Result.ok(input as Id);
        } else {
            return Result.error(
                new SchemaParseError(
                    `Expected ${typeName}.*, got ${input}`,
                    [],
                ),
            );
        }
    };
    return Schema.string.transform<Id>(validate, validate, identity);
}

export interface KeyPoint extends BaseRecord<"keyPoint", RecordId<KeyPoint>> {
    readonly position: Vector2 | null;
}
export const KeyPointSchema = Schema.object<KeyPoint>({
    typeName: Schema.value("keyPoint"),
    id: idSchema<KeyPointId>("keyPoint"),
    position: Vector2.schema.nullable(),
});
export type KeyPointId = IdOf<KeyPoint>;
export const KeyPoint = createRecordType("keyPoint", {
    scope: "document",
    validator: KeyPointSchema.asValidator(),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Shape extends BaseRecord<"shape", RecordId<Shape>> {}
export const ShapeSchema = Schema.object<Shape>({
    typeName: Schema.value("shape"),
    id: idSchema<ShapeId>("shape"),
});
export type ShapeId = IdOf<Shape>;
export const Shape = createRecordType("shape", {
    scope: "document",
    validator: ShapeSchema.asValidator(),
});

export interface ShapeVersion
    extends BaseRecord<"shapeVersion", RecordId<ShapeVersion>> {
    readonly keyPointId: KeyPointId;
    readonly shapeId: ShapeId;
    readonly rawPoints: readonly Vector2[];
}
export const ShapeVersionSchema = Schema.object<ShapeVersion>({
    typeName: Schema.value("shapeVersion"),
    id: idSchema<ShapeVersionId>("shapeVersion"),
    keyPointId: KeyPointSchema.config.id,
    shapeId: ShapeSchema.config.id,
    rawPoints: Schema.arrayOf(Vector2.schema),
});
export type ShapeVersionId = IdOf<ShapeVersion>;
export const ShapeVersion = createRecordType("shapeVersion", {
    scope: "document",
    validator: ShapeVersionSchema.asValidator(),
});

export interface Location extends BaseRecord<"location", RecordId<Location>> {
    readonly position: Vector2;
    readonly zoom: number;
    readonly activeKeyPointId: KeyPointId;
}
export const LocationSchema = Schema.object<Location>({
    typeName: Schema.value("location"),
    id: idSchema<LocationId>("location"),
    position: Vector2.schema,
    zoom: Schema.number,
    activeKeyPointId: KeyPointSchema.config.id,
});
export type LocationId = IdOf<Location>;
export const Location = createRecordType("location", {
    scope: "session",
    validator: LocationSchema.asValidator(),
});
export const LOCATION_ID = Location.createId("location");

export const SplatRecordSchema = Schema.union("typeName", {
    keyPoint: KeyPointSchema,
    shape: ShapeSchema,
    shapeVersion: ShapeVersionSchema,
    location: LocationSchema,
});
export type SplatRecord = SchemaType<typeof SplatRecordSchema>;

const schema = StoreSchema.create<SplatRecord>({
    keyPoint: KeyPoint,
    shape: Shape,
    shapeVersion: ShapeVersion,
    location: Location,
});

export const SerializedStoreSchema = Schema.objectMap(
    Schema.string,
    SplatRecordSchema,
) as Schema<SplatSerializedStore>;

export type SplatSerializedStore = SerializedStore<SplatRecord>;

export class Store extends TLStore<SplatRecord> {
    constructor(initialData?: SplatSerializedStore) {
        super({ schema, props: {}, initialData });
    }
}
