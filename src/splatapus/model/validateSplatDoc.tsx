import { Result } from "@/lib/Result";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";

export function validateSplatDoc(model: SplatDocModel): Result<SplatDocModel, string> {
    for (const shapeVersion of model.shapeVersions) {
        if (!model.keyPoints.getIfExists(shapeVersion.keyPointId)) {
            return Result.error(
                `Shape version ${shapeVersion.id} references unknown keypoint ${shapeVersion.keyPointId}`,
            );
        }
    }

    return Result.ok(model);
}
