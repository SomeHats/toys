import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { stringFromError } from "@/lib/utils";
import { Splatapus } from "@/splatapus/editor/useEditor";
import catExample from "@/splatapus/examples/cat.json";
import { makeEmptySaveState, splatapusStateSchema } from "@/splatapus/model/store";
import { Button } from "@/splatapus/ui/Button";

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
                        splatapusStateSchema.serialize({
                            document: splatapus.document.getOnce(),
                            location: splatapus.location.state.getOnce(),
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
                            const parseResult = splatapusStateSchema.parse(JSON.parse(result));
                            if (!parseResult.ok) {
                                alert(`cannot read splat doc: ${parseResult.error.message}`);
                                return;
                            }
                            const serialized = parseResult.value;
                            splatapus.document.update(() => serialized.document, {
                                lockstepLocation: (location) => serialized.location,
                            });
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
    return (
        <Button
            onClick={() => {
                const state = splatapusStateSchema.parse(catExample).unwrap();
                splatapus.document.update(() => state.document, {
                    lockstepLocation: state.location,
                });
            }}
        >
            example
        </Button>
    );
}
