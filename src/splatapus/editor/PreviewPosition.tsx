import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";

export type PreviewPosition =
    | {
          readonly type: "keyPointId";
          readonly keyPointId: SplatKeyPointId;
      }
    | {
          readonly type: "interpolated";
          readonly scenePosition: Vector2;
      };

export const PreviewPosition = {
    interpolated: (scenePosition: Vector2): PreviewPosition => ({
        type: "interpolated",
        scenePosition,
    }),
    keyPointId: (keyPointId: SplatKeyPointId): PreviewPosition => ({
        type: "keyPointId",
        keyPointId,
    }),
    toDebugString: (position: PreviewPosition): string => {
        switch (position.type) {
            case "interpolated":
                return debugStateToString(position.type, {
                    _: position.scenePosition.toString(2),
                });
            case "keyPointId":
                return debugStateToString(position.type, {
                    _: position.keyPointId,
                });
            default:
                exhaustiveSwitchError(position);
        }
    },
};
