import {
    composeParsers,
    createShapeParser,
    parseNumber,
    ParserError,
    ParserType,
} from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { debounce, getLocalStorageItem, setLocalStorageItem, wait } from "@/lib/utils";
import { parseSplatDoc, SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { AUTOSAVE_DEBOUNCE_TIME_MS } from "@/splatapus/constants";
import { SplatLocation } from "@/splatapus/SplatLocation";

const parseSplatapusState = createShapeParser({
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

export function writeSaved(key: string, { doc, location }: SplatapusState) {
    setLocalStorageItem(`splatapus.${key}`, {
        doc: doc.serialize(),
        location: location.serialize(),
    });
}

export const writeSavedDebounced = debounce(AUTOSAVE_DEBOUNCE_TIME_MS, writeSaved);

export function makeEmptySaveState(): SplatapusState {
    const keyPointId = SplatKeypointId.generate();
    return {
        doc: SplatDocModel.create().addKeyPoint(keyPointId),
        location: new SplatLocation({ keyPointId }),
    };
}
