import Vector2 from "@/lib/geom/Vector2";
import { exhaustiveSwitchError } from "@/lib/utils";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";

export type PreviewPosition =
    | {
          readonly type: "keyPointId";
          readonly keyPointId: SplatKeypointId;
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
    keyPointId: (keyPointId: SplatKeypointId): PreviewPosition => ({
        type: "keyPointId",
        keyPointId,
    }),
    toDebugString: (position: PreviewPosition): string => {
        switch (position.type) {
            case "interpolated":
                return `interpolated(${position.scenePosition.toString(2)})`;
            case "keyPointId":
                return `keyPointId(${position.keyPointId})`;
            default:
                exhaustiveSwitchError(position);
        }
    },
};
