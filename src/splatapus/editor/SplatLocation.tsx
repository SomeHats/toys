import { createShapeParser, ParserType } from "@/lib/objectParser";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { parseModeType, ModeType } from "@/splatapus/editor/modes/ModeType";
import { parseSerializedViewport, ViewportState } from "@/splatapus/editor/Viewport";
import { applyUpdateWithin, UpdateAction } from "@/lib/utils";

export const parseSerializedSplatLocation = createShapeParser({
    keyPointId: SplatKeyPointId.parse,
    shapeId: SplatShapeId.parse,
    viewport: parseSerializedViewport,
    mode: parseModeType,
});
export type SerializedSplatLocation = ParserType<typeof parseSerializedSplatLocation>;

export type SplatLocation = {
    keyPointId: SplatKeyPointId;
    shapeId: SplatShapeId;
    mode: ModeType;
    viewport: ViewportState;
};

export const SplatLocation = {
    initialize: (keyPointId: SplatKeyPointId, shapeId: SplatShapeId): SplatLocation => ({
        keyPointId,
        shapeId,
        mode: ModeType.Draw,
        viewport: ViewportState.initialize(),
    }),
    deserialize: (serialized: SerializedSplatLocation): SplatLocation => ({
        ...serialized,
        viewport: ViewportState.deserialize(serialized.viewport),
    }),
    serialize: (state: SplatLocation): SerializedSplatLocation => ({
        ...state,
        viewport: ViewportState.serialize(state.viewport),
    }),
    updateViewport: (state: SplatLocation, update: UpdateAction<ViewportState>) =>
        applyUpdateWithin(state, "viewport", update),
};

// export class SplatLocation {
//     readonly keyPointId: LiveValue<SplatKeyPointId>;
//     readonly shapeId: LiveValue<SplatShapeId>;
//     readonly tool: LiveValue<ToolType>;
//     readonly viewport: LiveValue<ViewportState>;

//     static default(keyPointId: SplatKeyPointId, shapeId: SplatShapeId): SplatLocation {
//         return new SplatLocation(keyPointId, shapeId, ToolType.Draw, ViewportState.initialize());
//     }

//     static deserialize({ keyPointId, shapeId, tool, viewport }: SerializedSplatLocation) {
//         return new SplatLocation(keyPointId, shapeId, tool, ViewportState.deserialize(viewport));
//     }

//     private constructor(
//         keyPointId: SplatKeyPointId,
//         shapeId: SplatShapeId,
//         tool: ToolType,
//         viewport: ViewportState,
//     ) {
//         this.keyPointId = new LiveValue(keyPointId);
//         this.shapeId = new LiveValue(shapeId);
//         this.tool = new LiveValue(tool);
//         this.viewport = new LiveValue(viewport);
//     }

//     serializeLive(): SerializedSplatLocation {
//         return {
//             keyPointId: this.keyPointId.live(),
//             shapeId: this.shapeId.live(),
//             tool: this.tool.live(),
//             viewport: ViewportState.serialize(this.viewport.live()),
//         };
//     }
// }
