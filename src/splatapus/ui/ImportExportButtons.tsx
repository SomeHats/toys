import { assert } from "@/lib/assert";
import { stringFromError } from "@/lib/utils";
import { catExample } from "@/splatapus/catExample";
import { parseSplatDoc } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import { getDefaultLocationForDocument, makeEmptySaveState } from "@/splatapus/model/store";
import { Button } from "@/splatapus/ui/Button";
import { UpdateDocument } from "@/splatapus/editor/useEditorState";

export function ImportExportButtons({
    document,
    updateDocument,
}: {
    document: SplatDocModel;
    updateDocument: UpdateDocument;
}) {
    return (
        <>
            <ImportButton updateDocument={updateDocument} />
            <ExportButton document={document} />
            <CatExampleButton updateDocument={updateDocument} />
            <ResetButton updateDocument={updateDocument} />
        </>
    );
}

function ExportButton({ document }: { document: SplatDocModel }) {
    return (
        <Button
            onClick={() => {
                const data = encodeURIComponent(JSON.stringify(document.serialize()));
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

function ImportButton({ updateDocument }: { updateDocument: UpdateDocument }) {
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
                            const parseResult = parseSplatDoc(JSON.parse(result));
                            if (parseResult.isError()) {
                                alert(`cannot read splat doc: ${parseResult.error.message}`);
                                return;
                            }
                            const document = SplatDocModel.deserialize(parseResult.value);
                            updateDocument(() => document, {
                                lockstepLocation: new SplatLocation({
                                    keyPointId: Array.from(document.keyPoints)[0].id,
                                    shapeId: Array.from(document.shapes)[0].id,
                                }),
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

function ResetButton({ updateDocument }: { updateDocument: UpdateDocument }) {
    return (
        <Button
            onClick={() => {
                const { doc, location } = makeEmptySaveState();
                updateDocument(() => doc, { lockstepLocation: location });
            }}
        >
            reset
        </Button>
    );
}

function CatExampleButton({ updateDocument }: { updateDocument: UpdateDocument }) {
    if (!catExample.isOk()) {
        return null;
    }
    return (
        <Button
            onClick={() => {
                const rawDoc = catExample.unwrap();
                const document = SplatDocModel.deserialize(rawDoc);
                updateDocument(() => document, {
                    lockstepLocation: getDefaultLocationForDocument(document),
                });
            }}
        >
            example
        </Button>
    );
}
