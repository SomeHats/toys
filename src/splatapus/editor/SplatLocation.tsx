import { LiveMemoWritable, LiveWritable } from "@/lib/live";
import { Schema, SchemaType } from "@/lib/schema";
import { applyUpdateWithin } from "@/lib/utils";
import { ViewportState } from "@/splatapus/editor/Viewport";
import { ModeType, modeTypeSchema } from "@/splatapus/editor/modes/Mode";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";

const splatLocationSchema = Schema.object({
    keyPointId: SplatKeyPointId.schema,
    shapeId: SplatShapeId.schema,
    viewport: ViewportState.schema,
    mode: modeTypeSchema,
});
export type SplatLocationState = SchemaType<typeof splatLocationSchema>;

export const SplatLocationState = {
    initialize: (keyPointId: SplatKeyPointId, shapeId: SplatShapeId): SplatLocationState => ({
        keyPointId,
        shapeId,
        mode: ModeType.Draw,
        viewport: ViewportState.initialize(),
    }),
    schema: splatLocationSchema,
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
