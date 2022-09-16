import { Interaction } from "@/splatapus/Interaction";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { PreviewPosition } from "@/splatapus/PreviewPosition";
import { StrokeRenderer } from "@/splatapus/renderer/StrokeRenderer";

export function DocumentRenderer({
    document,
    previewPosition,
    interaction,
}: {
    document: SplatDocModel;
    previewPosition: PreviewPosition;
    interaction: Interaction;
}) {
    return (
        <>
            {Array.from(document.shapes, (shape) => (
                <StrokeRenderer
                    key={shape.id}
                    document={document}
                    interaction={interaction}
                    shapeId={shape.id}
                    previewPosition={previewPosition}
                />
            ))}
        </>
    );
}
