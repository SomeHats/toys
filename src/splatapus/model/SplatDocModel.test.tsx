import Vector2 from "@/lib/geom/Vector2";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { test } from "vitest";

test("create doc model", () => {
    const keyPointId = SplatKeyPointId.generate();
    const shapeId = SplatShapeId.generate();
    SplatDocModel.create()
        .addKeyPoint(keyPointId, Vector2.ZERO)
        .addShape(shapeId)
        .replacePointsForVersion(keyPointId, shapeId, []);
});
