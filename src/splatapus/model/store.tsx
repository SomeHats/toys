import { Result } from "@/lib/Result";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema, SchemaType } from "@/lib/schema";
import { getLocalStorageItemUnchecked, setLocalStorageItemUnchecked } from "@/lib/storage";
import { debounce } from "@/lib/utils";
import { AUTOSAVE_DEBOUNCE_TIME_MS } from "@/splatapus/constants";
import { SplatLocationState } from "@/splatapus/editor/SplatLocation";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";

export const splatapusStateSchema = Schema.object({
    document: SplatDocModel.schema,
    location: SplatLocationState.schema,
});

export type SplatapusState = SchemaType<typeof splatapusStateSchema>;

export function loadSaved(key: string): Result<SplatapusState, string> {
    const item = getLocalStorageItemUnchecked(`splatapus.${key}`);
    if (!item) {
        return Result.error("No saved data found");
    }
    return splatapusStateSchema.parse(item).mapErr((err) => err.toString());
}

export function writeSaved(key: string, state: SplatapusState) {
    // @ts-expect-error this is fine
    window.splatSerializedDoc = state;
    setLocalStorageItemUnchecked(`splatapus.${key}`, splatapusStateSchema.serialize(state));
}

export const writeSavedDebounced = debounce(AUTOSAVE_DEBOUNCE_TIME_MS, writeSaved);

export function getDefaultLocationForDocument(document: SplatDocModel, screenSize: Vector2) {
    const keyPointId = [...document.keyPoints][0].id;
    const shapeId = [...document.shapes][0].id;
    return SplatLocationState.initialize(keyPointId, shapeId);
}
export function makeEmptySaveState(screenSize: Vector2): SplatapusState {
    const keyPointId = SplatKeyPointId.generate();
    const shapeId = SplatShapeId.generate();
    const document = SplatDocModel.create()
        .addKeyPoint(keyPointId, Vector2.ZERO)
        .addShape(shapeId)
        .replacePointsForVersion(keyPointId, shapeId, []);
    return {
        document,
        location: getDefaultLocationForDocument(document, screenSize),
    };
}
