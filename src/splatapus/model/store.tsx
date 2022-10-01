import { createShapeParser, ParserType } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { debounce, getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { parseSplatDoc, SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { AUTOSAVE_DEBOUNCE_TIME_MS } from "@/splatapus/constants";
import { SplatLocation, parseSerializedSplatLocation } from "@/splatapus/editor/SplatLocation";
import { Vector2 } from "@/lib/geom/Vector2";

export const parseSerializedSplatapusState = createShapeParser({
    document: parseSplatDoc,
    location: parseSerializedSplatLocation,
});
export type SerializedSplatapusState = ParserType<typeof parseSerializedSplatapusState>;

export type SplatapusState = {
    document: SplatDocModel;
    location: SplatLocation;
};

export function serializeSplatapusState(state: SplatapusState): SerializedSplatapusState {
    return {
        document: state.document.serialize(),
        location: SplatLocation.serialize(state.location),
    };
}

export function deserializeSplatapusState(state: SerializedSplatapusState): SplatapusState {
    return {
        document: SplatDocModel.deserialize(state.document),
        location: SplatLocation.deserialize(state.location),
    };
}

export function loadSaved(key: string): Result<SplatapusState, string> {
    const item = getLocalStorageItem(`splatapus.${key}`);
    if (!item) {
        return Result.error("No saved data found");
    }
    return parseSerializedSplatapusState(getLocalStorageItem(`splatapus.${key}`))
        .mapErr((err) => err.toString())
        .map((state) => deserializeSplatapusState(state));
}

export function writeSaved(key: string, state: SplatapusState) {
    // @ts-expect-error this is fine
    window.splatSerializedDoc = state;
    setLocalStorageItem(`splatapus.${key}`, serializeSplatapusState(state));
}

export const writeSavedDebounced = debounce(AUTOSAVE_DEBOUNCE_TIME_MS, writeSaved);

export function getDefaultLocationForDocument(document: SplatDocModel, screenSize: Vector2) {
    const keyPointId = [...document.keyPoints][0].id;
    const shapeId = [...document.shapes][0].id;
    return SplatLocation.initialize(keyPointId, shapeId);
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
