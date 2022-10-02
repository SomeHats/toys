import { createShapeParser, ParserType } from "@/lib/objectParser";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { parseModeType, ModeType } from "@/splatapus/editor/modes/Mode";
import { parseSerializedViewport, ViewportState } from "@/splatapus/editor/Viewport";
import { applyUpdateWithin } from "@/lib/utils";
import { LiveMemoWritable, LiveWritable } from "@/lib/live";

export const parseSerializedSplatLocation = createShapeParser({
    keyPointId: SplatKeyPointId.parse,
    shapeId: SplatShapeId.parse,
    viewport: parseSerializedViewport,
    mode: parseModeType,
});
export type SerializedSplatLocation = ParserType<typeof parseSerializedSplatLocation>;

export type SplatLocationState = {
    keyPointId: SplatKeyPointId;
    shapeId: SplatShapeId;
    mode: ModeType;
    viewport: ViewportState;
};

export const SplatLocationState = {
    initialize: (keyPointId: SplatKeyPointId, shapeId: SplatShapeId): SplatLocationState => ({
        keyPointId,
        shapeId,
        mode: ModeType.Draw,
        viewport: ViewportState.initialize(),
    }),
    deserialize: (serialized: SerializedSplatLocation): SplatLocationState => ({
        ...serialized,
        viewport: ViewportState.deserialize(serialized.viewport),
    }),
    serialize: (state: SplatLocationState): SerializedSplatLocation => ({
        ...state,
        viewport: ViewportState.serialize(state.viewport),
    }),
};

export class SplatLocation {
    constructor(readonly state: LiveWritable<SplatLocationState>) {}

    readonly keyPointId = new LiveMemoWritable(
        () => this.state.live().keyPointId,
        (update) => this.state.update((state) => applyUpdateWithin(state, "keyPointId", update)),
    );
    readonly shapeId = new LiveMemoWritable(
        () => this.state.live().shapeId,
        (update) => this.state.update((state) => applyUpdateWithin(state, "shapeId", update)),
    );
    readonly mode = new LiveMemoWritable(
        () => this.state.live().mode,
        (update) => this.state.update((state) => applyUpdateWithin(state, "mode", update)),
    );
    readonly viewportState = new LiveMemoWritable(
        () => this.state.live().viewport,
        (update) => this.state.update((state) => applyUpdateWithin(state, "viewport", update)),
    );
}
