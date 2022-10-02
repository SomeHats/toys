import { assert } from "@/lib/assert";
import { stringFromError } from "@/lib/utils";
import { catExample } from "@/splatapus/catExample";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import {
    getDefaultLocationForDocument,
    makeEmptySaveState,
    parseSerializedSplatapusState,
    serializeSplatapusState,
} from "@/splatapus/model/store";
import { Button } from "@/splatapus/ui/Button";
import { Vector2 } from "@/lib/geom/Vector2";
import { Splatapus } from "@/splatapus/editor/useEditor";

export function ImportExportButtons({ splatapus }: { splatapus: Splatapus }) {
    return (
        <>
            <ImportButton splatapus={splatapus} />
            <ExportButton splatapus={splatapus} />
            <CatExampleButton splatapus={splatapus} />
            <ResetButton splatapus={splatapus} />
        </>
    );
}

function ExportButton({ splatapus }: { splatapus: Splatapus }) {
    return (
        <Button
            onClick={() => {
                const data = encodeURIComponent(
                    JSON.stringify(
                        serializeSplatapusState({
                            document: splatapus.document.getOnce(),
                            location: splatapus.location.getOnce(),
                        }),
                    ),
                );
                const el = window.document.createElement("a");
                el.setAttribute("href", `data:text/json;charset=utf-8,${data}`);
                el.setAttribute("download", "splatapus.json");
                el.click();
            }}
        >
            export
        </Button>
    );
}

function ImportButton({ splatapus }: { splatapus: Splatapus }) {
    return (
        <Button
            onClick={() => {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = ".json";
                fileInput.addEventListener("change", (e) => {
                    const file = fileInput.files?.item(0);
                    if (!file) {
                        return;
                    }

                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        const result = reader.result;
                        if (!result) {
                            alert("could not read file :(");
                            return;
                        }
                        assert(typeof result === "string");
                        try {
                            const parseResult = parseSerializedSplatapusState(JSON.parse(result));
                            if (parseResult.isError()) {
                                alert(`cannot read splat doc: ${parseResult.error.message}`);
                                return;
                            }
                            const serialized = parseResult.value;
                            splatapus.document.update(
                                () => SplatDocModel.deserialize(serialized.document),
                                {
                                    lockstepLocation: (location) =>
                                        SplatLocation.deserialize(serialized.location),
                                },
                            );
                        } catch (err) {
                            alert(`could not parse json: ${stringFromError(err)}`);
                        }
                    });
                    reader.readAsText(file);
                });
                fileInput.click();
            }}
        >
            import
        </Button>
    );
}

function ResetButton({ splatapus }: { splatapus: Splatapus }) {
    return (
        <Button
            onClick={() => {
                const { document, location } = makeEmptySaveState(Vector2.UNIT);
                splatapus.document.update(() => document, { lockstepLocation: location });
            }}
        >
            reset
        </Button>
    );
}

function CatExampleButton({ splatapus }: { splatapus: Splatapus }) {
    if (!catExample.isOk()) {
        return null;
    }
    return (
        <Button
            onClick={() => {
                const rawDoc = catExample.unwrap();
                const document = SplatDocModel.deserialize(rawDoc);
                splatapus.document.update(() => document, {
                    lockstepLocation: getDefaultLocationForDocument(document, Vector2.UNIT),
                });
            }}
        >
            example
        </Button>
    );
}
