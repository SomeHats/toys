import { assert } from "@/lib/assert";
import { stringFromError } from "@/lib/utils";
import { parseSplatDoc } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { Button } from "@/splatapus/ui/Button";
import { OpOptions } from "@/splatapus/UndoStack";
import { CtxAction } from "@/splatapus/useEditorState";

export function ExportButton({ document }: { document: SplatDocModel }) {
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

export function ImportButton({
    updateDocument,
}: {
    updateDocument: (update: CtxAction<SplatDocModel>, options: OpOptions) => void;
}) {
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
