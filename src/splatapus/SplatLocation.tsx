import Vector2 from "@/lib/geom/Vector2";
import { composeParsers, createShapeParser, parseNumber, ParserType } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { SplatKeypointId } from "@/splatapus/model/SplatDoc";
import { parseViewportState, ViewportState } from "@/splatapus/Viewport";

export const parseSplatLocationState = createShapeParser({
    keyPointId: SplatKeypointId.parse,
    viewport: parseViewportState,
});
export type SplatLocationState = ParserType<typeof parseSplatLocationState>;

export class SplatLocation {
    static parse = composeParsers(parseSplatLocationState, (state) =>
        Result.ok(new SplatLocation(state)),
    );

    readonly keyPointId: SplatKeypointId;
    readonly viewportState: ViewportState;

    constructor({
        keyPointId,
        viewport = { pan: Vector2.ZERO, zoom: 1 },
    }: {
        keyPointId: SplatKeypointId;
        viewport?: ViewportState;
    }) {
        this.keyPointId = keyPointId;
        this.viewportState = viewport;
    }

    serialize(): SplatLocationState {
        return { keyPointId: this.keyPointId, viewport: this.viewportState };
    }

    with(changes: Partial<SplatLocationState>): SplatLocation {
        return new SplatLocation({
            keyPointId: changes.keyPointId ?? this.keyPointId,
            viewport: changes.viewport ?? this.viewportState,
        });
    }
}
