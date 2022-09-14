import Vector2 from "@/lib/geom/Vector2";
import { composeParsers, createShapeParser, ParserType } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { parseToolType, ToolType } from "@/splatapus/tools/ToolType";
import { parseViewportState, ViewportState } from "@/splatapus/Viewport";

export const parseSplatLocationState = createShapeParser({
    keyPointId: SplatKeyPointId.parse,
    viewport: parseViewportState,
    tool: parseToolType,
});
export type SplatLocationState = ParserType<typeof parseSplatLocationState>;

export class SplatLocation {
    static parse = composeParsers(parseSplatLocationState, (state) =>
        Result.ok(new SplatLocation(state)),
    );

    readonly keyPointId: SplatKeyPointId;
    readonly viewportState: ViewportState;
    readonly tool: ToolType;

    constructor({
        keyPointId,
        viewport = { pan: Vector2.ZERO, zoom: 1 },
        tool = ToolType.Draw,
    }: {
        keyPointId: SplatKeyPointId;
        viewport?: ViewportState;
        tool?: ToolType;
    }) {
        this.keyPointId = keyPointId;
        this.viewportState = viewport;
        this.tool = tool;
    }

    serialize(): SplatLocationState {
        return { keyPointId: this.keyPointId, viewport: this.viewportState, tool: this.tool };
    }

    with(changes: Partial<SplatLocationState>): SplatLocation {
        return new SplatLocation({
            keyPointId: changes.keyPointId ?? this.keyPointId,
            viewport: changes.viewport ?? this.viewportState,
            tool: changes.tool ?? this.tool,
        });
    }
}
