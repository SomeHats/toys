import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";

export type PreviewPosition =
    | {
          readonly type: "keyPointId";
          readonly keyPointId: SplatKeyPointId;
          readonly selectedShapeId: SplatShapeId;
      }
    | {
          readonly type: "interpolated";
          readonly scenePosition: Vector2;
          readonly selectedShapeId: SplatShapeId;
      };

export const PreviewPosition = {
    interpolated: (scenePosition: Vector2, selectedShapeId: SplatShapeId): PreviewPosition => ({
        type: "interpolated",
        scenePosition,
        selectedShapeId,
    }),
    keyPointId: (keyPointId: SplatKeyPointId, selectedShapeId: SplatShapeId): PreviewPosition => ({
        type: "keyPointId",
        keyPointId,
        selectedShapeId,
    }),
    toDebugString: (position: PreviewPosition): string => {
        switch (position.type) {
            case "interpolated":
                return debugStateToString(position.type, {
                    _: position.scenePosition.toString(2),
                    shape: position.selectedShapeId,
                });
            case "keyPointId":
                return debugStateToString(position.type, {
                    _: position.keyPointId,
                    shape: position.selectedShapeId,
                });
            default:
                exhaustiveSwitchError(position);
        }
    },
};
