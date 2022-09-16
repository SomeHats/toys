import Vector2 from "@/lib/geom/Vector2";
import { composeParsers, createShapeParser, ParserType } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { parseToolType, ToolType } from "@/splatapus/tools/ToolType";
import { parseViewportState, ViewportState } from "@/splatapus/Viewport";

export const parseSplatLocationState = createShapeParser({
    keyPointId: SplatKeyPointId.parse,
    shapeId: SplatShapeId.parse,
    viewport: parseViewportState,
    tool: parseToolType,
});
export type SplatLocationState = ParserType<typeof parseSplatLocationState>;

export class SplatLocation {
    static parse = composeParsers(parseSplatLocationState, (state) =>
        Result.ok(new SplatLocation(state)),
    );

    readonly keyPointId: SplatKeyPointId;
    readonly shapeId: SplatShapeId;
    readonly viewportState: ViewportState;
    readonly tool: ToolType;

    constructor({
        keyPointId,
        shapeId,
        viewport = { pan: Vector2.ZERO, zoom: 1 },
        tool = ToolType.Draw,
    }: {
        keyPointId: SplatKeyPointId;
        shapeId: SplatShapeId;
        viewport?: ViewportState;
        tool?: ToolType;
    }) {
        this.keyPointId = keyPointId;
        this.shapeId = shapeId;
        this.viewportState = viewport;
        this.tool = tool;
    }

    serialize(): SplatLocationState {
        return {
            keyPointId: this.keyPointId,
            shapeId: this.shapeId,
            viewport: this.viewportState,
            tool: this.tool,
        };
    }

    with(changes: Partial<SplatLocationState>): SplatLocation {
        return new SplatLocation({
            keyPointId: changes.keyPointId ?? this.keyPointId,
            shapeId: changes.shapeId ?? this.shapeId,
            viewport: changes.viewport ?? this.viewportState,
            tool: changes.tool ?? this.tool,
        });
    }
}
