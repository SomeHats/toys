import { composeParsers, createShapeParser, ParserType } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { debounce, getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { parseSplatDoc, SplatDoc, SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { AUTOSAVE_DEBOUNCE_TIME_MS } from "@/splatapus/constants";
import { SplatLocation, SplatLocationState } from "@/splatapus/SplatLocation";
import Vector2 from "@/lib/geom/Vector2";

export const parseSplatapusState = createShapeParser({
    doc: composeParsers(parseSplatDoc, (doc) => {
        return Result.ok(SplatDocModel.deserialize(doc));
    }),
    location: SplatLocation.parse,
});
export type SplatapusState = ParserType<typeof parseSplatapusState>;

export function loadSaved(key: string): Result<SplatapusState, string> {
    const item = getLocalStorageItem(`splatapus.${key}`);
    if (!item) {
        return Result.error("No saved data found");
    }
    return parseSplatapusState(getLocalStorageItem(`splatapus.${key}`)).mapErr((err) =>
        err.toString(),
    );
}

export type SerializedSplatState = {
    readonly doc: SplatDoc;
    readonly location: SplatLocationState;
};

export function writeSaved(key: string, { doc, location }: SplatapusState) {
    const serialized = {
        doc: doc.serialize(),
        location: location.serialize(),
    };
    // @ts-expect-error this is fine
    window.splatSerializedDoc = serialized;
    setLocalStorageItem(`splatapus.${key}`, serialized);
}

export const writeSavedDebounced = debounce(AUTOSAVE_DEBOUNCE_TIME_MS, writeSaved);

export function makeEmptySaveState(): SplatapusState {
    const keyPointId = SplatKeyPointId.generate();
    const shapeId = SplatShapeId.generate();
    return {
        doc: SplatDocModel.create()
            .addKeyPoint(keyPointId, Vector2.ZERO)
            .addShape(shapeId)
            .replacePointsForVersion(keyPointId, shapeId, []),
        location: new SplatLocation({ keyPointId, shapeId }),
    };
}
