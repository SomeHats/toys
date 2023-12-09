import { Result } from "@/lib/Result";
import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema, SchemaParseError } from "@/lib/schema";
import { identity } from "@/lib/utils";
import {
    BaseRecord,
    IdOf,
    RecordId,
    SerializedStore,
    Store,
    StoreSchema,
    createRecordType,
} from "@tldraw/store";

function idSchema<Id extends RecordId<any>>(
    typeName: Id["__type__"]["typeName"],
) {
    const re = new RegExp(`^${typeName}\\:([a-zA-Z0-9_-]+)$`);
    const validate = (input: string) => {
        if (re.test(input)) {
            return Result.ok(input as Id);
        } else {
            return Result.error(
                new SchemaParseError(
                    `Expected ${typeName}:*, got ${input}`,
                    [],
                ),
            );
        }
    };
    return Schema.string.transform<Id>(validate, validate, identity);
}

export interface LimeDoc extends BaseRecord<"doc", RecordId<LimeDoc>> {
    readonly slideIds: readonly SlideId[];
}
export const LimeDocSchema = Schema.object<LimeDoc>({
    typeName: Schema.value("doc"),
    id: idSchema<LimeDocId>("doc"),
    slideIds: Schema.arrayOf(idSchema<SlideId>("slide")),
});
export type LimeDocId = IdOf<LimeDoc>;
export const LimeDoc = createRecordType("doc", {
    scope: "document",
    validator: LimeDocSchema.asValidator(),
});
export const LIME_DOC_ID = LimeDoc.createId("doc");

export interface Slide extends BaseRecord<"slide", RecordId<Slide>> {
    rawPoints: readonly Vector2[];
}
export const SlideSchema = Schema.object<Slide>({
    typeName: Schema.value("slide"),
    id: idSchema<SlideId>("slide"),
    rawPoints: Schema.arrayOf(Vector2.schema),
});
export type SlideId = IdOf<Slide>;
export const Slide = createRecordType("slide", {
    scope: "document",
    validator: SlideSchema.asValidator(),
}).withDefaultProperties(() => ({
    rawPoints: [],
}));

export interface Session extends BaseRecord<"session", RecordId<Session>> {
    slideId: SlideId;
    tweenBezierControl: number;
    speed: number;
}
export const SessionSchema = Schema.object<Session>({
    typeName: Schema.value("session"),
    id: idSchema<SessionId>("session"),
    slideId: idSchema<SlideId>("slide"),
    tweenBezierControl: Schema.number,
    speed: Schema.number,
});
export type SessionId = IdOf<Session>;
export const Session = createRecordType("session", {
    scope: "session",
    validator: SessionSchema.asValidator(),
}).withDefaultProperties(() => ({
    tweenBezierControl: 0.4,
    speed: 650,
}));
export const SESSION_ID = Session.createId("session");

export type LimeRecord = LimeDoc | Slide | Session;
export const LimeRecordSchema = Schema.union("typeName", {
    doc: LimeDocSchema,
    slide: SlideSchema,
    session: SessionSchema,
});

export const LimeSerializedStoreSchema = Schema.objectMap(
    Schema.string,
    LimeRecordSchema,
) as Schema<LimeSerializedStore>;
export type LimeSerializedStore = SerializedStore<LimeRecord>;

export const limeSchema = StoreSchema.create<LimeRecord>({
    doc: LimeDoc,
    slide: Slide,
    session: Session,
});

export class LimeStore extends Store<LimeRecord> {
    constructor(initialData?: LimeSerializedStore) {
        super({ schema: limeSchema, props: {}, initialData });
    }

    insert(record: LimeRecord) {
        assert(!this.get(record.id));
        this.put([record]);
    }
}
